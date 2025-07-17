'use client';
import { useState } from 'react';

export default function MusicPlayer() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Ingresa un término de búsqueda');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTracks([]);

    try {
      // 1. Obtener todas las canciones disponibles (no solo 100)
      const tracksRes = await fetch('/api/spotify/get-tracks');
      const { tracks } = await tracksRes.json();
      console.log('Canciones obtenidas:', tracks.length);
      if (!tracks || tracks.length === 0) {
        throw new Error('No se encontraron canciones en el backend');
      }

      // 2. Enviar todas las canciones al filtro de IA
      const iaRes = await fetch('/api/ia/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tracks,
          query,
        }),
      });

      const { matches } = await iaRes.json();

      if (!matches || matches.length === 0) {
        throw new Error('No se encontraron coincidencias con la IA');
      }

      setTracks(matches.slice(0, 3)); // mostrar solo las 3 mejores coincidencias

    } catch (err: any) {
      console.error('Error en búsqueda por IA:', err);
      setError(err.message || 'Error desconocido');
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Musicólogo</h1>

      <div className="flex flex-col lg:flex-row gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Que queri aer"
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded disabled:opacity-50 w-full lg:w-auto"
        >
          {isLoading ? 'Analizando...' : 'Buscar'}
        </button>
      </div>


      {error && (
        <div className="p-3 mb-4 text-red-300 bg-red-900/30 rounded">
          {error}
        </div>
      )}

      {isLoading && !tracks.length && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-500"></div>
          <p className="mt-2 text-gray-400">A ver que canciones tengo...</p>
        </div>
      )}

      {tracks.length > 0 && (
        <div className="space-y-8">
          {tracks.map((track) => (
            <div key={track.id} className="w-full h-[500px] animate-fade-in">
              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                title={`Reproduciendo: ${track.name}`}
              />
              {track.match_reason && (
                <p className="text-gray-400 mt-2 text-sm">
                  ✨ {track.match_reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
