export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { text, voiceId } = req.body;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API key is missing in Vercel' });

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || '21m00Tcm4TlvDq8ikWAM'}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      }),
    });

    if (!response.ok) throw new Error('ElevenLabs API error');

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
