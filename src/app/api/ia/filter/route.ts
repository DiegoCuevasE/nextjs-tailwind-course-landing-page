import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function dividirEnLotes(array: any[], tamaño: number) {
  const lotes = [];
  for (let i = 0; i < array.length; i += tamaño) {
    lotes.push(array.slice(i, i + tamaño));
  }
  return lotes;
}

function prepararCancionesParaIA(canciones: any[]) {
  return canciones.map((c) => ({
    name: c.name,
    artists: c.artists,
    genre: c.genre || 'desconocido',
    id: c.id,
    external_url: c.external_url,
  }));
}

async function obtenerCoincidenciasDelLote(lote: any[], query: string, total: number, loteIndex: number) {
  const prompt = `
Analiza este subconjunto de canciones y determina cuáles coinciden mejor con: "${query}".

INSTRUCCIONES:
- Busca coincidencias exactas o semánticas en nombre, artistas o género.
- No inventes resultados. Si no hay coincidencias, devuelve un array vacío.
- Devuelve máximo 5 coincidencias por lote.
- Este es el lote ${loteIndex + 1} de ${Math.ceil(total / lote.length)}.
- Ordena las coincidencias por popularidad o relevancia general.
- Si la palabra "antiguo" o "antigua" está en la consulta, sólo incluye canciones del 2021 o antes.

RESPONDE SÓLO con un JSON válido EXACTAMENTE en este formato (sin texto adicional, explicaciones ni comentarios):

{
  "match_ids": ["id1", "id2", "id3"]
}

Lista de canciones:
${JSON.stringify(
  lote.map((c) => ({
    id: c.id,
    name: c.name,
    artists: c.artists,
    genre: c.genre || "desconocido",
  })),
  null,
  2
)}
`;
  console.log('Enviando prompt a OpenAI:', prompt);


  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0]?.message?.content;
  console.log('Respuesta completa de la IA:', content); 
  if (!content) throw new Error('Respuesta vacía de OpenAI');

  try {
    const parsed = JSON.parse(content);
    const ids: string[] = parsed.match_ids || [];
    return lote.filter(c => ids.includes(c.id));
    ;
  } catch (e) {
    console.error('Error parseando respuesta IA:', content);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const { tracks, query } = await request.json();

    if (!tracks || !query) {
      return NextResponse.json(
        { error: 'tracks y query son requeridos' },
        { status: 400 }
      );
    }

    const lotes = dividirEnLotes(tracks, 100);
    let coincidenciasTotales: any[] = [];

    for (let i = 0; i < lotes.length; i++) {
      const coincidencias = await obtenerCoincidenciasDelLote(
        lotes[i],
        query,
        tracks.length,
        i
      );
      coincidenciasTotales.push(...coincidencias);
    }

    // Eliminar duplicados por ID
    const unicos = new Map();
    for (const match of coincidenciasTotales) {
      if (!unicos.has(match.id)) {
        unicos.set(match.id, match);
      }
    }

    const resultadoFinal = Array.from(unicos.values()).slice(0, 15);

    return NextResponse.json({ matches: resultadoFinal });
  } catch (error) {
    console.error('❌ Error en /api/ia/filter:', error);
    return NextResponse.json(
      {
        error: 'Error al filtrar con IA',
        type: 'IA_FILTER_ERROR',
      },
      { status: 500 }
    );
  }
}
