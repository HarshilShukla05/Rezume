"use client";
import { useState } from "react";
import axios from "axios";

export default function FileUploader() {
    const [resume, setResume] = useState<File | null>(null);
    const [jd, setJD] = useState("");

    const [tailoredResume, setTailoredResume] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resume || !jd) return alert("Upload resume and enter JD!");

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jd", jd);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-resume`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log(data);

        console.log("Submitting to /upload-resume");

        try {
            const response = await axios.post("http://localhost:4000/upload-resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Response from backend:", response.data);
            const responseData = response.data as { tailoredResume: string };
            setTailoredResume(responseData.tailoredResume);
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md space-y-4 w-full max-w-lg">
            <h2 className="text-xl font-semibold">Upload Resume & Job Description</h2>
            <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
            <textarea
                rows={6}
                placeholder="Paste the job description here..."
                className="w-full border rounded p-2"
                onChange={(e) => setJD(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Submit
            </button>
            {tailoredResume && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="font-semibold">Tailored Resume:</h3>
                    <pre className="whitespace-pre-wrap">{tailoredResume}</pre>
                </div>
            )}
        </div>
    );
}
