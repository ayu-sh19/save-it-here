export async function searchMovies(query: string) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.warn('TMDB_API_KEY is not set. Returning empty results.');
    return [];
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
