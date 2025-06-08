import Image from "next/image";
import FileUploader from "@/components/FileUploader";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <FileUploader />
    </main>
  );
}

