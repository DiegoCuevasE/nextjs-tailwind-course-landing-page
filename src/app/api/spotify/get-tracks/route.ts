import { NextResponse } from 'next/server';
import axios from 'axios';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
  try {
    const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authString}`,
        },
        timeout: 5000,
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error('Error al obtener token:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    throw new Error('Failed to get access token');
  }
}

async function getAllTracksFromPlaylist(playlistId: string, accessToken: string) {
  const allTracks: any[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          limit,
          offset,
          fields: 'items(track(id,name,artists(id,name),external_urls(spotify))),total',
        },
        timeout: 10000,
      }
    );

    const items = response.data.items;
    if (!items || items.length === 0) break;

    allTracks.push(...items);

    offset += items.length;

    if (offset >= response.data.total) break;
  }

  return allTracks;
}

async function getArtistsGenres(artistIds: string[], accessToken: string) {
  const chunkSize = 50;
  const genresMap: Record<string, string[]> = {};

  for (let i = 0; i < artistIds.length; i += chunkSize) {
    const chunk = artistIds.slice(i, i + chunkSize);

    const response = await axios.get('https://api.spotify.com/v1/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        ids: chunk.join(','),
      },
    });

    for (const artist of response.data.artists) {
      genresMap[artist.id] = artist.genres || [];
    }
  }

  return genresMap;
}

export async function GET(request: Request) {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Credenciales de Spotify no configuradas');
    }

    const accessToken = await getAccessToken();

    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('id') || '72AjpTVvoFvbqWPNms7flM';

    console.log('Playlist ID:', playlistId);

    const items = await getAllTracksFromPlaylist(playlistId, accessToken);

    // Extraer todos los IDs únicos de artistas
    const artistIds = Array.from(
      new Set(
        items.flatMap((item: any) =>
          item.track?.artists?.map((a: any) => a.id)
        )
      )
    ).filter(Boolean);

    // Obtener géneros de artistas
    const genresMap = await getArtistsGenres(artistIds, accessToken);

    // Construir lista de tracks con género
    const tracks = items
      .map((item: any) => {
        const track = item.track;
        if (!track) return null;

        // Obtener géneros combinados de todos los artistas de la canción
        const trackArtistGenres = track.artists.flatMap(
          (a: any) => genresMap[a.id] || []
        );

        // Usar el primer género si hay, sino "desconocido"
        const genre = trackArtistGenres.length > 0 ? trackArtistGenres[0] : 'desconocido';

        return {
          id: track.id,
          name: track.name || 'Canción desconocida',
          artists: track.artists.map((a: any) => a.name) || ['Artista desconocido'],
          external_url: track.external_urls.spotify || '',
          genre,
        };
      })
      .filter((t) => t && t.id);

    return NextResponse.json({
      success: true,
      tracks,
      playlistId,
    });
  } catch (error: any) {
    console.error('Error completo:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Error en el servidor',
        details: {
          message: error.response?.data?.error?.message || error.message,
          type: error.response?.data?.error?.type || 'unknown_error',
        },
      },
      { status: error.response?.status || 500 }
    );
  }
}
