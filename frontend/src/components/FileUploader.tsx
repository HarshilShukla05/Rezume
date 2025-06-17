"use client";
import React, { useState } from "react";
import TailoredResume from "./TailoredResume";
import axios from "axios";
import { RefObject } from "react";

interface FileUploaderProps {
    onResult: () => void;
    resultRef: RefObject<HTMLDivElement | null>;
    animate: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    // Add a helpful log for debugging
    console.error('NEXT_PUBLIC_API_URL is not set. Please check your .env.local file in the frontend directory.');
    throw new Error('NEXT_PUBLIC_API_URL is not set. Please check your .env.local file in the frontend directory.');
}

const FileUploader: React.FC<FileUploaderProps> = ({ onResult, animate, resultRef }) => {
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
                `${API_URL}/api/upload-resume`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const responseData = response.data as { tailoredResume: string };
            if (responseData && responseData.tailoredResume) {
                setTailoredResume(responseData.tailoredResume);
                setShowPreview(true);
                onResult(); // Notify parent to animate
            } else {
                alert("Failed to generate tailored resume. Please try again.");
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("An error occurred while generating the tailored resume.");
        } finally {
            setLoading(false);
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
        <div className="flex flex-col items-center justify-center w-full min-h-[500px] py-8">
            {/* Input Form */}
            <div
                className={`
                    transition-all duration-700 ease-in-out
                    ${animate ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
                    w-full max-w-xl
                    z-20
                `}
            >
                <div className="p-8 bg-white rounded-2xl shadow-2xl space-y-6 w-full border border-gray-200">
                    <h2 className="text-2xl font-semibold text-center">Upload Resume & Job Description</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => setResume(e.target.files?.[0] || null)}
                            className="w-full border p-2 rounded"
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
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full font-semibold shadow"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
            {/* Tailored Resume Result */}
            <div
                className={`
                    transition-all duration-700 ease-in-out
                    ${animate && showPreview
                        ? "opacity-100 scale-100 mt-8"
                        : "opacity-0 scale-95 pointer-events-none"}
                    w-full max-w-2xl z-30
                `}
            >
                {showPreview && tailoredResume && (
                    <TailoredResume content={tailoredResume} onRegenerate={handleRegenerate} />
                )}
            </div>
        </div>
    );
};

export default FileUploader;
