import ogs from 'open-graph-scraper';

export async function parseUrl(url: string) {
  try {
    const { result } = await ogs({
      url,
      timeout: 8000,
      fetchOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SaveItHereBot/1.0)',
        }
      }
    });

    const domain = new URL(url).hostname.replace('www.', '');

    return {
      title: result.ogTitle ?? result.twitterTitle ?? '',
      description: result.ogDescription ?? result.twitterDescription ?? '',
      image: result.ogImage?.[0]?.url ?? result.twitterImage?.[0]?.url ?? null,
      siteName: result.ogSiteName ?? domain,
      type: result.ogType ?? 'website',
      url: result.ogUrl ?? url,
    };
  } catch (error) {
    console.error(`Failed to parse metadata for ${url}:`, error);
    // Return graceful fallback
    return {
      title: url,
      description: '',
      image: null,
      siteName: new URL(url).hostname.replace('www.', ''),
      type: 'website',
      url,
    };
  }
}
