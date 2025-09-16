"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toPng, toBlob } from "html-to-image";
import { Download, Share2 } from "lucide-react";

export default function Home() {
  const [text, setText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 400); // Tailwind "sm"
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const d = isMobile
    ? "M -60,410 A 260,260 0 0,1 600,415" // mobile curve (centered)
    : "M 101,305 A 250,240 0 0,1 600,300"; // desktop curve (centered)

  const downloadImage = async () => {
    if (!logoRef.current) return;

    const svgText = logoRef.current.querySelector("text");
    const originalSize = svgText?.getAttribute("font-size");

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isMobile = isIOS || /Android/i.test(navigator.userAgent);

    setIsDownloading(true);

    try {
      await document.fonts.ready;

      if (svgText) {
        svgText.setAttribute("font-size", isMobile ? "28" : "36");
        svgText.setAttribute("font-weight", "bold");
      }

      const blob = await toBlob(logoRef.current, {
        cacheBust: true,
        imagePlaceholder: "",
        filter: (node) => {
          if (!(node instanceof Element)) return true;
          if (node.classList.contains("hide-on-export")) return false;
          const style = window.getComputedStyle(node);
          return !(style.opacity === "0" || style.display === "none" || style.visibility === "hidden");
        }
      });
      if (!blob) return;

      const url = URL.createObjectURL(blob);

      if (isIOS) {
        setTimeout(() => {
          window.open(url, "_blank");
          URL.revokeObjectURL(url);
        }, 200);
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = "heinz.png";
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      if (svgText && originalSize) {
        svgText.setAttribute("font-size", originalSize);
      }
      setIsDownloading(false);
    }
  };


  // Share image
  const shareImage = async () => {
    if (!logoRef.current) return;

    const svgText = logoRef.current.querySelector("text");
    const originalSize = svgText?.getAttribute("font-size");

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isMobile = isIOS || /Android/i.test(navigator.userAgent);

    try {
      await document.fonts.ready;

      // match downloadImage sizing
      if (svgText) {
        svgText.setAttribute("font-size", isMobile ? "28" : "36");
        svgText.setAttribute("font-weight", "bold");
      }

      const blob = await toBlob(logoRef.current, {
        cacheBust: true,
        imagePlaceholder: "",
        filter: (node) => {
          if (!(node instanceof Element)) return true;
          if (node.classList.contains("hide-on-export")) return false;
          const style = window.getComputedStyle(node);
          return !(style.opacity === "0" || style.display === "none" || style.visibility === "hidden");
        }
      });
      if (!blob) return;

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
    } finally {
      // restore original font-size
      if (svgText && originalSize) {
        svgText.setAttribute("font-size", originalSize);
      }
    }
  };


  return (
    <main
      ref={logoRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-start bg-cover bg-center p-4 sm:p-6 overflow-hidden"
      style={{ backgroundImage: "url('/images/heinz-bg.png')" }}
    >

        {/* Bottle image */}
        <div
          className="absolute top-[-200px] sm:top-[-360px] sm:bottom-[-7%] 
      left-1/2 -translate-x-[50%] 
      w-[540px] sm:w-full sm:max-w-[680px] lg:max-w-[700px] xl:max-w-[700px]
      h-[100vh] z-0"
        > 
          <Image
            src="/images/bottle.png"
            alt="bottle"
            width={680}
            height={1600}
            className="w-full h-auto"
          />
        </div>

        {/* Headline */}
        <div className="w-full max-w-[800px] z-1 mt-[20%] sm:mt-0">
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
          className={`relative w-full max-w-[700px] h-[520px] logo-img z-1`}
        >
          <img
            src="/images/logo.png"
            alt="Heinz Logo"
            className="w-[700px] h-[520px] object-contain opacity-0"
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
              absolute top-[23%] sm:top-[15%] left-1/2 -translate-x-[52%] py-[2px]
              w-[180px] sm:w-[230px] text-center sm:text-[28px] text-[20px] font-thai font-bold
              text-black caret-black outline-none bg-transparent heinz-input z-1"
            />
          )}

          {/* Curved text shows after input is submitted */}
          {text && (
            <div className="svgWrapper absolute flex justify-center top-[10%] sm:top-[3%] w-[700px] h-[520px] font-thai">
              <svg
                viewBox="0 0 700 520"
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
                  <path id="curve" d={d} fill="transparent" />
                </defs>
                <g id="mobile-shift">
                  <text className="font-thai font-bold fill-black" fontSize={isMobile ? "28" : "36"}>
                    <textPath
                      href="#curve"
                      startOffset="50%"
                      textAnchor="middle"
                    // dx={isMobile ? "-12" : "0"}
                    >
                      {text}
                    </textPath>
                  </text>

                </g>
              </svg>
            </div>
          )}
        </div>

        {/* Buttons + hashtag */}
        <div className="flex flex-col items-center after-logo z-2">
          <div className="flex flex-row gap-6 flex-wrap justify-center hide-on-export">
            <button
              onClick={downloadImage}
              disabled={isDownloading}
              className="inline-flex items-center justify-center px-6 py-2 rounded-[20px] bg-black/60 text-white font-thai hover:bg-black/80 transition cursor-pointer"
            >
              <Download size={18} className="mr-2" />
              {isDownloading ? "Preparing…" : "Download"}
            </button>
            <button
              onClick={shareImage}
              className="inline-flex items-center justify-center px-6 py-2 rounded-[20px] bg-black/60 text-white font-thai hover:bg-black/80 transition cursor-pointer"
            >
              <Share2 size={18} className="mr-2" />
              Share
            </button>
          </div>

          <div className={`w-full max-w-[320px] ${isDownloading ? "mt-[-40px]" : "mt-4"}`}>
            <Image
              src="/images/hashtag.png"
              alt="Hashtag"
              width={320}
              height={160}
              className="w-full h-auto"
            />
          </div>
        </div>
        {/* )} */}

    </main>
  );
}
