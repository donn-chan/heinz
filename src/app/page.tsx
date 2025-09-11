"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { toPng, toBlob } from "html-to-image";
import { Download, Share2 } from "lucide-react";



export default function Home() {
  const [text, setText] = useState("");
  const logoRef = useRef<HTMLDivElement>(null);

  // Download image
  // const downloadImage = async () => {
  //   if (logoRef.current) {
  //     const svgText = logoRef.current.querySelector("text");
  //     const originalSize = svgText?.getAttribute("font-size");
      
  //     // force font size
  //     svgText?.setAttribute("font-size", "40");
  //     await document.fonts.ready;

  //     const dataUrl = await toPng(logoRef.current, { cacheBust: true });
  
  //     // restore font size
  //     if (originalSize) svgText?.setAttribute("font-size", originalSize);
  
  //     const link = document.createElement("a");
  //     link.download = "heinz.png";
  //     link.href = dataUrl;
      
  //     // If download not supported, fallback
  //     if (typeof link.download === "undefined") {
  //       window.open(dataUrl, "_blank");
  //     } else {
  //       link.click();
  //     }
  //   }
  // };

  const downloadImage = async () => {
    if (!logoRef.current) return;
  
    const svgText = logoRef.current.querySelector("text");
    const originalSize = svgText?.getAttribute("font-size");
  
    // Simple mobile detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    try {
      await document.fonts.ready;
  
      // 👇 Adjust font size depending on device
      svgText?.setAttribute("font-size", isMobile ? "28" : "36");
  
      const blob = await toBlob(logoRef.current, { cacheBust: true });
      if (!blob) return;
  
      const url = URL.createObjectURL(blob);
  
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        setTimeout(() => {
          window.open(url, "_blank");
        }, 100); // tiny delay makes Safari behave
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = "heinz.png";
        link.click();
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      if (originalSize) svgText?.setAttribute("font-size", originalSize);
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
        <img
          src="/images/logo.png"
          alt="Heinz Logo"
          className="w-[600px] h-[520px] object-contain"
          crossOrigin="anonymous"
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
              absolute top-[27%] sm:top-[20%] left-1/2 -translate-x-1/2 
              w-3/4 text-center sm:text-[36px] text-[2px] font-thai font-bold
              text-black caret-black outline-none bg-transparent
            "
          />
        )}

        {/* Curved text shows after input is submitted */}
        {text && (
          <div className="svgWrapper absolute top-[15%] sm:top-[5%] w-[600px] h-[600px]">
            <svg
              viewBox="0 0 600 520"
              className="left-0 w-full h-full z-1 font-thai"
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
              <text className="font-thai font-bold fill-black text-[28px] sm:text-[40px] curve-text">
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
