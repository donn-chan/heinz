"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const [text, setText] = useState("");
  const logoRef = useRef<HTMLDivElement>(null);

  // Download image
  const downloadImage = async () => {
    if (logoRef.current) {
      const canvas = await html2canvas(logoRef.current, {
        width: 600, // force width
        height: 600, // force height
        scale: 2,
        backgroundColor: null, // keep transparency if needed
      });

      const link = document.createElement("a");
      link.download = "heinz.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  // Share image
  const shareImage = async () => {
    if (navigator.share && logoRef.current) {
      const canvas = await html2canvas(logoRef.current);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "heinz.png", { type: "image/png" });
          try {
            await navigator.share({
              title: "My Heinz Logo",
              text: "Check out my Heinz logo!",
              files: [file],
            });
          } catch (err) {
            console.error("Share failed:", err);
          }
        }
      });
    } else {
      alert("Sharing not supported. Please download instead.");
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center p-4 sm:p-6"
      style={{ backgroundImage: "url('/images/heinz-bg.png')" }}
    >
      {/* Headline */}
      <div className="w-full max-w-[600px]">
        <Image
          src="/images/headline.png"
          alt="Headline"
          width={600}
          height={240}
          className="w-full h-auto"
        />
      </div>

      {/* Input */}
      <div className="w-full max-w-sm flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type Heinz..."
          maxLength={12}
          className="flex-grow p-2 border rounded font-thai text-base sm:text-lg"
        />
      </div>

      {/* Logo with live text overlay */}
      <div
        ref={logoRef}
        className="relative w-full max-w-[600px] aspect-square"
      >
        <Image
          src="/images/logo.png"
          alt="Heinz Logo"
          // fill
          width={600}
          height={600}
          className="object-contain"
        />
        {text && (
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-center w-full px-4 font-thai font-bold text-black text-l sm:text-2xl md:text-2xl lg:text-3xl">
            {text}
          </div>
        )}
      </div>

      {/* Buttons + hashtag */}
      {text && (
        <div className="flex flex-col items-center after-logo">
          <div className="flex flex-row gap-6 flex-wrap justify-center">
            <button
              onClick={downloadImage}
              className="inline-flex items-center justify-center px-6 py-2 rounded-[10px] bg-black/60 text-white font-bold hover:bg-black/80 transition cursor-pointer"
            >
              Download
            </button>
            <button
              onClick={shareImage}
              className="inline-flex items-center justify-center px-6 py-2 rounded-[10px] bg-black/60 text-white font-bold hover:bg-black/80 transition cursor-pointer"
            >
              Share
            </button>
          </div>

          <div className="w-full max-w-[400px]">
            <Image
              src="/images/hashtag.png"
              alt="Hashtag"
              width={400}
              height={120}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </main>
  );
}
