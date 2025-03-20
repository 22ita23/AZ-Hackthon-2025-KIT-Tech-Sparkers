chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetch_questions") {
    let apiKey = "AIzaSyBrbu78i7qZDHHB04Qu_xft_XNqJX8ejmE";
    let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `# INSTRUCTION
Generate 10 multiple-choice questions from the given content. Format:
Q::Question text::Option1|Option2|Option3|Option4::CorrectAnswer

Content:
${request.content}`,
              },
            ],
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let questions = data?.candidates?.[0]?.content?.parts?.[0]?.text?.split("\n") || [
          "No questions generated!",
        ];
        chrome.storage.local.set({ gfg_questions: questions }, () => {
          sendResponse({ success: true, questions });
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        sendResponse({ success: false, error: "Failed to fetch data" });
      });

    return true;
  }
});
