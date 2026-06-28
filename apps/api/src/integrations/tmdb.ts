let tmdbGenreCache: Record<number, string> | null = null;

async function getTmdbGenres(apiKey: string) {
  if (tmdbGenreCache) return tmdbGenreCache;
  try {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    const map: Record<number, string> = {};
    for (const g of data.genres || []) {
      map[g.id] = g.name;
    }
    const tvRes = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=en-US`);
    const tvData = await tvRes.json();
    for (const g of tvData.genres || []) {
      map[g.id] = g.name; // merge tv genres
    }
    tmdbGenreCache = map;
    return map;
  } catch (e) {
    console.error('Failed to fetch TMDB genres', e);
    return {};
  }
}

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
        rating: 8.5,
        genres: 'Action, Sci-Fi'
      }
    ];
  }

  try {
    const [genresMap, response] = await Promise.all([
      getTmdbGenres(apiKey),
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`)
    ]);
    
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
        imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : null,
        releaseDate: item.release_date || item.first_air_date,
        mediaType: item.media_type,
        rating: item.vote_average,
        genres: (item.genre_ids || []).map((id: number) => genresMap[id]).filter(Boolean).join(', ')
      }));
  } catch (error) {
    console.error('Failed to search TMDB:', error);
    return [];
  }
}
