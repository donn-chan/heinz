"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Share2 } from "lucide-react";



export default function Home() {
  const [text, setText] = useState("");
  const logoRef = useRef<HTMLDivElement>(null);

  // Download image
  const downloadImage = async () => {
    if (logoRef.current) {
      const svgText = logoRef.current.querySelector("text");
      const originalSize = svgText?.getAttribute("font-size");
  
      // force font size
      svgText?.setAttribute("font-size", "40");
  
      const dataUrl = await toPng(logoRef.current, { cacheBust: true });
  
      // restore font size
      if (originalSize) svgText?.setAttribute("font-size", originalSize);
  
      const link = document.createElement("a");
      link.download = "heinz.png";
      link.href = dataUrl;
      link.click();
    }
  };

  // Share image
  const shareImage = async () => {
    if (logoRef.current) {
      try {
        const dataUrl = await toPng(logoRef.current, { cacheBust: true });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "heinz.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "My Heinz Logo",
            text: "Check out my Heinz logo!",
            files: [file],
          });
        } else {
          alert("Your device does not support sharing images. Please use Download instead.");
        }
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };


  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center p-4 sm:p-6"
      style={{ backgroundImage: "url('/images/heinz-bg.png')" }}
    >
      {/* Headline */}
      <div className="w-full max-w-[800px]">
        <Image
          src="/images/headline.png"
          alt="Headline"
          width={800}
          height={160}
          className="w-full h-auto"
        />
      </div>

      {/* Logo with live text overlay */}
      <div
        ref={logoRef}
        className="relative w-full max-w-[600px] h-[520px] logo-img"
      >
        <Image
          src="/images/logo.png"
          alt="Heinz Logo"
          // fill
          width={600}
          height={520}
          className="object-cover"
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
        absolute top-[25%] left-1/2 -translate-x-1/2 
        w-3/4 text-center font-thai text-[28px] font-bold
        text-black caret-black outline-none bg-transparent
      "
          />
        )}

        {/* Curved text shows after input is submitted */}
        {text && (
          <div className="svgWrapper absolute top-[10%] w-[600px] h-[600px] font-thai">
            <svg
              viewBox="0 0 600 520"
              className="left-0 w-full h-full z-1 font-thai"
              onClick={() => setText("")}
            >
              <style>
                {`
                  @font-face {
                    font-family: 'NotoSansThai';
                    src: url('/fonts/NotoSansThai-Regular.woff2') format('woff2');
                  }
                  text {
                    font-family: 'NotoSansThai' !important;
                  }
                `}
              </style>
              <defs>
                {/* Adjust arc to fit Heinz logo curve */}
                <path
                  id="curve"
                  d="M 100,250 A 200,200 0 0,1 500,250"
                  fill="transparent"
                />
              </defs>
              <text className="font-thai font-bold fill-black text-[40px] curve-text">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                  {text}
                </textPath>
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Buttons + hashtag */}
      <div className="flex flex-col items-center after-logo z-2">
        <div className="flex flex-row gap-6 flex-wrap justify-center">
          <button
            onClick={downloadImage}
            className="inline-flex items-center justify-center px-6 py-2 rounded-[10px] bg-black/60 text-white font-bold hover:bg-black/80 transition cursor-pointer"
          >
            <Download size={18} className="mr-2" />
            Download
          </button>
          <button
            onClick={shareImage}
            className="inline-flex items-center justify-center px-6 py-2 rounded-[10px] bg-black/60 text-white font-bold hover:bg-black/80 transition cursor-pointer"
          >
            <Share2 size={18} className="mr-2" />
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
