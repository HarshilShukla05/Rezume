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
        <div
            className="mt-10 mx-auto max-w-2xl w-full rounded-xl shadow-lg bg-white border border-gray-200"
        >
            <div className="p-8 space-y-6 relative z-10">
                <h2 className="text-2xl font-extrabold text-center mb-2 tracking-tight text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span role="img" aria-label="AI">🤖</span> AI-Tailored Resume
                </h2>
                <div
                    id="resume-preview"
                    className="prose max-w-none p-6 rounded-lg border border-gray-100 bg-white"
                    style={{
                        background: '#fff',
                        color: '#22223b',
                        boxShadow: '0 2px 8px 0 rgba(31,38,135,0.04)',
                        border: '1px solid #f1f5f9'
                    }}
                    dangerouslySetInnerHTML={{ __html: html as string }}
                />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    <button
                        onClick={handleDownloadPdf}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-all duration-150"
                    >
                        <span role="img" aria-label="Download">⬇️</span> Download as PDF
                    </button>
                    <button
                        onClick={onRegenerate}
                        className="px-6 py-2 border border-gray-300 text-gray-800 font-semibold rounded-md bg-white hover:bg-gray-100 transition-all duration-150"
                    >
                        <span role="img" aria-label="Regenerate">🔄</span> Regenerate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TailoredResume;
