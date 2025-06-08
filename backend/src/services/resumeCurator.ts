import openai from "../utils/openai";

export async function curateResume(resumeText: string, jobDescription: string): Promise<string> {
  const systemPrompt = `
You are a professional resume writer. The user will provide their resume content and a job description. Rewrite the resume to tailor it for the given job, keeping it ATS-friendly and professional. Improve wording, highlight relevant skills and experience, and remove unrelated content. Keep the resume clean and well-structured.
`;

  const userPrompt = `
Job Description:
${jobDescription}

Original Resume:
${resumeText}
`;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  return chatCompletion.choices[0].message.content || "";
}
