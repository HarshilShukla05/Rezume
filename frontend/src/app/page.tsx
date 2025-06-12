import Image from "next/image";
import FileUploader from "@/components/FileUploader";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <section className="text-center px-6 py-24 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          🎯 Land Your Dream Job with AI-Tailored Resumes
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Upload your resume and job description. Our AI will fine-tune your CV to perfection.
        </p>
        <a href="#upload" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition">
          Get Started
        </a>
      </section>

      <section id="upload" className="py-12">
        <FileUploader />
      </section>
    </main>
  );
}


