import ogs from 'open-graph-scraper';
import * as cheerio from 'cheerio';

const SPOOF_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function parseUrl(url: string) {
  const domain = new URL(url).hostname.replace('www.', '');
  
  let title = '';
  let description = '';
  let image: string | null = null;
  let siteName = domain;
  let type = 'website';
  let finalUrl = url;

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

    title = result.ogTitle ?? result.twitterTitle ?? '';
    description = result.ogDescription ?? result.twitterDescription ?? '';
    image = result.ogImage?.[0]?.url ?? result.twitterImage?.[0]?.url ?? null;
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
      if (fallbackImage) {
         try {
           image = fallbackImage.startsWith('http') ? fallbackImage : new URL(fallbackImage, url).toString();
         } catch {
           image = null;
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
    siteName,
    type,
    url: finalUrl,
  };
}
