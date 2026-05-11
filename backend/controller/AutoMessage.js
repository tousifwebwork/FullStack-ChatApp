const Groq = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

exports.AutoMessage = async (req, res) => {

    try {

        console.log("BODY:", req.body);

        const { messages } = req.body;

        console.log("MESSAGES:", messages);

        const lastMessages = messages
            .slice(-5)
            .map(m => `${m.sender}: ${m.text}`)
            .join("\n");

        console.log(lastMessages);

        const prompt = `
Generate 3 short smart replies.

Conversation:
${lastMessages}

Return ONLY JSON array.
`;

        const completion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]

        });

        console.log(completion);

        const text = completion.choices[0].message.content;

        console.log("AI TEXT:", text);

        let suggestions = [];

        try {

            suggestions = JSON.parse(text);

        } catch {

            console.log("JSON PARSE FAILED");

            suggestions = [
                "Okay",
                "Sure",
                "Sounds good"
            ];
        }

        res.json({
            suggestions
        });

    } catch (error) {

        console.log("FULL ERROR:");

        console.log(error);

        res.status(500).json({
            error: error.message
        });
    }
};