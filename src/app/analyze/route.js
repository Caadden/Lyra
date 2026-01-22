export async function POST(req) {
  try {
    const body = await req.json();
    const lyrics = typeof body.lyrics === "string" ? body.lyrics : "";
    const artist = typeof body.artist === "string" ? body.artist : "";

    // Basic server-side validation
    if (lyrics.trim().length < 20) {
      return Response.json(
        {
          validity: {
            lyrics_ok: false,
            artist_ok: artist.trim().length > 0,
            notes: "Lyrics must be at least 20 words to analyze.",
          },
          error: "INVALID_LYRICS",
        },
        { status: 400 }
      );
    }

    // Mock response
    const mock = {
      emotions: [
        { name: "nostalgic", intensity: 0.82 },
        { name: "hopeful", intensity: 0.64 },
        { name: "longing", intensity: 0.58 },
      ],
      themes: ["growth", "distance", "time", "acceptance"],
      tone: "bittersweet and reflective",
      summary: [
        "The speaker looks back on memories with warmth and regret.",
        "There’s tension between holding on and moving forward.",
        "The lyrics frame change as painful but necessary.",
      ],
      takeaway:
        "This song captures the ache of remembering while choosing to keep going.",
      _debug: {
        received_artist: artist.trim() ? artist.trim() : null,
        lyrics_chars: lyrics.length,
      },
    };

    return Response.json(mock, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: "BAD_REQUEST", message: "Invalid JSON body." },
      { status: 400 }
    );
  }
}