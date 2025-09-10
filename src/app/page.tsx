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
        scale: 1,
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
    if (logoRef.current) {
      const canvas = await html2canvas(logoRef.current, {
        width: 600,
        height: 600,
        scale: 1,
        backgroundColor: null,
      });
  
      canvas.toBlob(async (blob) => {
        if (!blob) return;
  
        const file = new File([blob], "heinz.png", { type: "image/png" });
  
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "My Heinz Logo",
              text: "Check out my Heinz logo!",
              files: [file],
            });
          } catch (err) {
            console.error("Share failed:", err);
          }
        } else {
          alert("Your device does not support sharing images. Please use Download instead.");
        }
      });
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
          height={120}
          className="w-full h-auto"
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
          unoptimized
        />
        {/* Input field visible until user presses Enter */}
        {!text && (
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setText((e.target as HTMLInputElement).value);
              }
            }}
            maxLength={12}
            placeholder="พิมพ์ชื่อที่คุณเรียก"
            className="
        absolute top-[20%] left-1/2 -translate-x-1/2 
        w-3/4 text-center font-thai text-[28px] font-bold
        text-black caret-black outline-none bg-transparent
      "
          />
        )}

        {/* Curved text shows after input is submitted */}
        {text && (
          <svg
            viewBox="0 0 600 600"
            className="absolute top-[15%] left-0 w-full h-full"
            onClick={() => setText("")}
          >
            <defs>
              {/* Adjust arc to fit Heinz logo curve */}
              <path
                id="curve"
                d="M 100,250 A 200,200 0 0,1 500,250"
                fill="transparent"
              />
            </defs>
            <text className="font-thai font-bold fill-black text-[40px]">
              <textPath href="#curve" startOffset="50%" textAnchor="middle">
                {text}
              </textPath>
            </text>
          </svg>
        )}
      </div>

      {/* Buttons + hashtag */}
      {/* {text && ( */}
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

          <div className="w-full max-w-[400px] mt-4">
            <Image
              src="/images/hashtag.png"
              alt="Hashtag"
              width={800}
              height={160}
              className="w-full h-auto"
            />
          </div>
        </div>
      {/* )} */}
    </main>
  );
}
