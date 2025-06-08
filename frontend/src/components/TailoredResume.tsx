'use client';
import React from 'react';
import { marked } from 'marked';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TailoredResumeProps {
    content: string;
    onRegenerate: () => void;
}

const TailoredResume: React.FC<TailoredResumeProps> = ({ content, onRegenerate }) => {
    const html = marked.parse(content);

    const handleDownloadPdf = async () => {
        const element = document.getElementById('resume-preview');
        if (!element) {
            console.error('Preview element not found.');
            return;
        }

        try {
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('tailored_resume.pdf');
        } catch (error) {
            console.error('Error creating PDF:', error);
        }
    };

    return (
        <div className="mt-6 bg-white border shadow-md rounded-xl p-6 space-y-4 max-w-3xl">
            <h2 className="text-xl font-semibold">AI-Tailored Resume</h2>

            <div
                id="resume-preview"
                className="prose max-w-none p-4 rounded border"
                style={{ backgroundColor: 'white', color: 'black' }}
                dangerouslySetInnerHTML={{ __html: html as string }}
            />

            <div className="flex justify-between mt-4">
                <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Download as PDF
                </button>

                <button
                    onClick={onRegenerate}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Regenerate
                </button>
            </div>
        </div>
    );
};

export default TailoredResume;
