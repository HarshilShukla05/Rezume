// backend/src/services/resumeCurator.ts
import axios from 'axios';

export const curateResume = async (resume: string, jd: string): Promise<string> => {
    const prompt = `
You are a professional resume writer.

Your task is to rewrite the resume provided below to better match the given job description . You should:

1. Highlight relevant skills and achievements.
2. Remove unrelated content.
3. Keep the tone professional and ATS-friendly.
4. Preserve the original structure (sections, order) but enhance clarity.

⚠️ Format the result in **markdown**, using:
- \`##\` or \`###\` for section headings
- \`-\` for bullet points
- \`**bold**\` for important info

Resume:
${resume}

Job Description:
${jd}

Tailored Resume:
`;

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'meta-llama/llama-4-scout-17b-16e-instruct', // or 'llama3-70b-8192'
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error: any) {
        console.error('Error from Groq API:', error.response?.data || error.message);
        return 'Failed to generate tailored resume.';
    }
};
