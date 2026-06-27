export async function searchBooks(query: string) {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    console.warn('GOOGLE_BOOKS_API_KEY is not set. Returning empty results.');
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=10`
    );
    
    if (!response.ok) {
      throw new Error(`Google Books API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return (data.items || []).map((item: any) => {
      const vol = item.volumeInfo;
      return {
        id: item.id,
        title: vol.title,
        authors: vol.authors || [],
        description: vol.description || '',
        imageUrl: vol.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
        publishedDate: vol.publishedDate,
        pageCount: vol.pageCount,
        categories: vol.categories || [],
      };
    });
  } catch (error) {
    console.error('Failed to search Google Books:', error);
    return [];
  }
}
