import ogs from 'open-graph-scraper';
import * as cheerio from 'cheerio';

const SPOOF_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function parseUrl(url: string) {
  const domain = new URL(url).hostname.replace('www.', '');
  
  let title = '';
  let description = '';
  let image: string | null = null;
  let images: string[] = [];
  let siteName = domain;
  let type = 'website';
  let finalUrl = url;

  let embedHtml = undefined;

  // Twitter/X oEmbed integration
  if (url.includes('twitter.com/') || url.includes('x.com/')) {
    try {
      // Use publish.twitter.com which doesn't require auth
      const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl);
      
      if (res.ok) {
        const data = await res.json();
        embedHtml = data.html;
        
        // Parse the caption (tweet text) from the blockquote in the html
        if (data.html) {
          const $ = cheerio.load(data.html);
          description = $('blockquote p').text() || '';
        }
        
        title = `Tweet by ${data.author_name || 'User'}`;
        siteName = 'Twitter';
        type = 'article';
        
        return {
          title,
          description,
          image: null,
          images: [],
          siteName,
          type,
          url: finalUrl,
          embedHtml
        };
      }
    } catch (err) {
      console.error('Twitter oEmbed failed:', err);
    }
  }

  // Instagram integration (generate iframe directly)
  if (url.includes('instagram.com/')) {
    let postId = 'ig';
    const match = url.match(/(?:p|reel|tv)\/([^/?#&]+)/);
    if (match && match[1]) {
      postId = match[1];
    }
    
    // We construct the official embed iframe natively
    embedHtml = `<iframe src="https://www.instagram.com/p/${postId}/embed/captioned/" width="100%" height="540" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
    
    // We provide a fallback title/description, the actual content is in the iframe
    title = `Instagram Post`;
    description = 'View this post on Instagram';
    image = null;
    images = [];
    siteName = 'Instagram';
    type = 'article';
    
    return {
      title,
      description,
      image,
      images,
      siteName,
      type,
      url: finalUrl,
      embedHtml
    };
  }



  try {
    const { result } = await ogs({
      url,
      timeout: 8000,
      fetchOptions: {
        headers: {
          'User-Agent': SPOOF_USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      }
    });

    title = title || result.ogTitle || result.twitterTitle || '';
    description = description || result.ogDescription || result.twitterDescription || '';
    
    if (!image) {
      image = result.ogImage?.[0]?.url ?? result.twitterImage?.[0]?.url ?? null;
    }
    
    if (images.length === 0 && image) {
      images = [image];
    }
    
    siteName = result.ogSiteName ?? domain;
    type = result.ogType ?? 'website';
    finalUrl = result.ogUrl ?? url;

    // Trigger fallback if title is missing, or is suspiciously generic like "Amazon.com"
    if (!title || title.toLowerCase() === 'amazon.com' || title.toLowerCase() === domain.toLowerCase()) {
       throw new Error('Generic title returned by OGS, triggering fallback');
    }
  } catch (error) {
    console.error(`OGS failed or triggered fallback for ${url}:`, error instanceof Error ? error.message : String(error));
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': SPOOF_USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(8000)
      });
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const fallbackTitle = $('title').text() || $('meta[name="title"]').attr('content') || '';
      const fallbackDesc = $('meta[name="description"]').attr('content') || '';
      const ogImg = $('meta[property="og:image"]').attr('content');
      
      // Try to find the largest product image if no og:image
      let fallbackImage = ogImg;
      if (!fallbackImage) {
        const firstImg = $('img').first().attr('src');
        if (firstImg) fallbackImage = firstImg;
      }

      if (fallbackTitle && !fallbackTitle.toLowerCase().includes('bot check')) {
         title = fallbackTitle.trim() || title;
      }
      if (fallbackDesc) {
         description = fallbackDesc.trim() || description;
      }
      if (fallbackImage && !image) {
         try {
           image = fallbackImage.startsWith('http') ? fallbackImage : new URL(fallbackImage, url).toString();
           if (images.length === 0) images = [image];
         } catch {
           if (!image) image = null;
         }
      }
    } catch (fallbackError) {
      console.error(`Fallback scraping failed for ${url}:`, fallbackError);
    }
  }

  return {
    title: title || url,
    description,
    image,
    images,
    siteName,
    type,
    url: finalUrl,
  };
}
