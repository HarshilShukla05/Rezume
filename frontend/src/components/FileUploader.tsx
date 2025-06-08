"use client";
import React, { useState } from "react";
import axios from "axios";
import TailoredResume from "./TailoredResume";

export default function FileUploader() {
    const [resume, setResume] = useState<File | null>(null);
    const [jd, setJD] = useState("");
    const [tailoredResume, setTailoredResume] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const generateTailoredResume = async () => {
        if (!resume || !jd) return alert("Upload resume and enter JD!");

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jd", jd);

        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload-resume`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const responseData = response.data as { tailoredResume: string };
            if (responseData && responseData.tailoredResume) {
                setTailoredResume(responseData.tailoredResume); // Update state with tailored resume
                setShowPreview(true); // Show preview
            } else {
                alert("Failed to generate tailored resume. Please try again.");
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("An error occurred while generating the tailored resume.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        generateTailoredResume();
    };

    const handleRegenerate = () => {
        generateTailoredResume();
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md space-y-4 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold">Upload Resume & Job Description</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    className="w-full border p-2"
                />

                <textarea
                    rows={6}
                    placeholder="Paste the job description here..."
                    className="w-full border rounded p-2"
                    value={jd}
                    onChange={(e) => setJD(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            {/* ✅ Use TailoredResume component to preview */}
            {showPreview && tailoredResume && (
                <TailoredResume content={tailoredResume} onRegenerate={handleRegenerate} />
            )}
        </div>
    );
}
