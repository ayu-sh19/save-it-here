export async function searchMovies(query: string) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.warn('TMDB_API_KEY is not set. Returning mock results for testing.');
    return [
      {
        id: 'mock-movie-1',
        title: `Mock Movie: ${query}`,
        description: 'This is a mocked movie description for testing the UI without a TMDB API key.',
        imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop',
        releaseDate: '2026-01-01',
        mediaType: 'movie',
        rating: 8.5
      },
      {
        id: 'mock-movie-2',
        title: 'Inception (Mock)',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop',
        releaseDate: '2010-07-16',
        mediaType: 'movie',
        rating: 8.8
      },
      {
        id: 'mock-tv-1',
        title: 'The Matrix (Mock)',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=500&auto=format&fit=crop',
        releaseDate: '1999-03-31',
        mediaType: 'movie',
        rating: 8.7
      }
    ];
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter and map to a standard format for frontend
    return (data.results || [])
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item: any) => ({
        id: item.id.toString(),
        title: item.title || item.name,
        description: item.overview,
        imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        releaseDate: item.release_date || item.first_air_date,
        mediaType: item.media_type,
        rating: item.vote_average,
      }));
  } catch (error) {
    console.error('Failed to search TMDB:', error);
    return [];
  }
}
