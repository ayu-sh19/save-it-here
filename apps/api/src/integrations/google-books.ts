export async function searchBooks(query: string) {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    console.warn('GOOGLE_BOOKS_API_KEY is not set. Returning mock results for testing.');
    return [
      {
        id: 'mock-book-1',
        title: `Mock Book: ${query}`,
        authors: ['John Doe'],
        description: 'This is a mocked book description for testing the UI without a Google Books API key.',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
        publishedDate: '2026-01-01',
        pageCount: 300,
        categories: ['Fiction']
      },
      {
        id: 'mock-book-2',
        title: 'Dune (Mock)',
        authors: ['Frank Herbert'],
        description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
        imageUrl: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?q=80&w=500&auto=format&fit=crop',
        publishedDate: '1965-08-01',
        pageCount: 412,
        categories: ['Science Fiction']
      },
      {
        id: 'mock-book-3',
        title: 'Project Hail Mary (Mock)',
        authors: ['Andy Weir'],
        description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop',
        publishedDate: '2021-05-04',
        pageCount: 496,
        categories: ['Science Fiction']
      }
    ];
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
