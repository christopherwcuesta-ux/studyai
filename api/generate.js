export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        error: "No notes were provided."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({
          model: "gpt-5-mini",

          input: [
            {
              role: "system",
              content:
                "You are StudyAI, an AI study assistant. Turn students' notes into clear summaries, flashcards, and practice questions."
            },
            {
              role: "user",
              content:
                `Analyze these study notes and create:

1. A simple summary
2. 10 flashcards
3. 10 practice questions with answers

Study notes:

${notes}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI request failed."
      });
    }

    return res.status(200).json({
      result: data.output_text
    });

  } catch (error) {

    return res.status(500).json({
      error: "Something went wrong."
    });

  }
}