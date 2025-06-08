// backend/src/services/resumeCurator.ts
import axios from 'axios';

export const curateResume = async (resume: string, jd: string): Promise<string> => {
    const prompt = `
You are an expert career coach. Given the following resume and job description, rewrite the resume to better match the job:

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
