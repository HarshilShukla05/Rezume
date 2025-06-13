"use client";
import React, { useState, useRef, RefObject } from "react";
import FileUploader from "@/components/FileUploader";

export interface FileUploaderProps {
  onResult: () => void;
  animate: boolean;
  resultRef: RefObject<HTMLDivElement>;
}

export default function Home() {
  const [showHero, setShowHero] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const uploadRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Called when resume is generated
  const handleShowResult = () => {
    setShowHero(false);
    setTimeout(() => {
      setShowResult(true);
      setTimeout(() => {
        if (resultRef.current) {
          const rect = resultRef.current.getBoundingClientRect();
          const scrollY = window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2);
          window.scrollTo({ top: scrollY, behavior: "smooth" });
        }
      }, 100);
    }, 500);
  };

  // Scroll and fade out hero when "Get Started" is clicked
  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowHero(false);
    setTimeout(() => {
      if (uploadRef.current) {
        const rect = uploadRef.current.getBoundingClientRect();
        const scrollY = window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2);
        window.scrollTo({ top: scrollY, behavior: "smooth" });
      }
    }, 400);
  };

  return (
    <main className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section
        className={`text-center px-6 py-24 max-w-3xl mx-auto transition-opacity duration-500 ${
          showHero ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight flex items-center justify-center gap-2">
          <span role="img" aria-label="target">🎯</span>
          Land Your Dream Job with AI-Tailored Resumes
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Upload your resume and job description. Our AI will fine-tune your CV to perfection.
        </p>
        <a
          href="#upload"
          onClick={handleGetStarted}
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </section>

      {/* Upload/Result Section - vertically center content */}
      <section
        id="upload"
        ref={uploadRef}
        className={`flex flex-col items-center justify-center min-h-[70vh] w-full transition-opacity duration-500 ${
          showHero && !showResult ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
        tabIndex={-1}
        style={{ paddingTop: showResult ? "24px" : "0", paddingBottom: "24px" }} // Reduce space above result
      >
        <div className="w-full flex justify-center">
          <FileUploader
            onResult={handleShowResult}
            animate={showResult}
            resultRef={resultRef}
          />
        </div>
        {/* If FileUploader does not render the result, wrap your result in a div with ref={resultRef} here */}
      </section>
    </main>
  );
}


