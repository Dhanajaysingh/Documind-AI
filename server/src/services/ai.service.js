const generateDocumentation = async (prompt) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing');
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const interaction = await ai.interactions.create({
        model,
        input: prompt,
        generation_config: {
            temperature: 0.2
        }
    });

    return interaction.output_text;
};

module.exports = {
    generateDocumentation
};
