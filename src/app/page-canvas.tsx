"use client";

import { useState, useEffect } from "react";
import { Download, Share2 } from "lucide-react";

// Canvas renderer
const drawCanvas = async (text: string, isMobile: boolean) => {
  const canvas = document.createElement("canvas");
  canvas.width = 700;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // helper to load images
  const loadImg = (src: string) =>
    new Promise<HTMLImageElement>((res, rej) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => res(img);
      img.onerror = rej;
    });

  // load all assets
  const [bg, bottle, headline, logo, hashtag] = await Promise.all([
    loadImg("/images/heinz-bg.png"),
    loadImg("/images/bottle.png"),
    loadImg("/images/headline.png"),
    loadImg("/images/logo.png"),
    loadImg("/images/hashtag.png"),
  ]);

  // draw background
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // draw bottle
  ctx.drawImage(bottle, 50, -100, 600, 800);

  // draw headline
  ctx.drawImage(headline, 50, 50, 600, 100);

  // draw logo
  ctx.drawImage(logo, 0, 400, 700, 300);

  // draw curved text
  ctx.font = `${isMobile ? 28 : 36}px NotoSansThai`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  const centerX = 350;
  const centerY = 550;
  const radius = 230;
  const angleOffset = -Math.PI / 2;

  const chars = text.split("");
  const angleStep = (Math.PI * 1.0) / chars.length;

  chars.forEach((char, i) => {
    const angle = angleOffset + i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });

  // draw hashtag
  ctx.drawImage(hashtag, 200, 750, 300, 100);

  return new Promise<Blob | null>((res) =>
    canvas.toBlob((blob) => res(blob), "image/png")
  );
};

export default function Home() {
  const [text, setText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 400);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // handle download
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await drawCanvas(text, isMobile);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "heinz.png";
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  // handle share
  const handleShare = async () => {
    const blob = await drawCanvas(text, isMobile);
    if (!blob) return;
    const file = new File([blob], "heinz.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "My Heinz Logo",
        text: "Check out my Heinz logo!",
        files: [file],
      });
    } else {
      handleDownload();
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-start bg-cover bg-center p-4 sm:p-6 overflow-hidden">
      {/* DOM preview for layout */}
      <img
        src="/images/heinz-bg.png"
        alt="Background"
        className="absolute inset-0 -z-10 w-full h-full object-cover"
      />

      <div className="absolute top-[-250px] sm:top-[-360px] left-1/2 -translate-x-1/2 w-[700px] max-w-[700px] h-[100vh] z-0">
        <img src="/images/bottle.png" alt="bottle" className="w-full h-auto" />
      </div>

      <div className="w-full max-w-[800px] z-1 mt-[20%] sm:mt-0">
        <img
          src="/images/headline.png"
          alt="Headline"
          className="w-full h-auto"
        />
      </div>

      <div className="relative w-full max-w-[700px] h-[520px] logo-img z-1">
        <img
          src="/images/logo.png"
          alt="Heinz Logo"
          className="w-[700px] h-[540px] object-contain opacity-0"
        />

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
            className="absolute top-[23%] sm:top-[15%] left-1/2 -translate-x-[52%] py-[2px]
              w-[200px] max-[400px]:w-[180px] sm:w-[230px] text-center text-[24px] max-[400px]:text-[20px] font-thai font-bold
              text-black caret-black outline-none bg-transparent heinz-input z-1"
          />
        )}

        {text && (
          <p className="absolute top-[5%] w-full text-center font-thai font-bold text-black text-[28px] sm:text-[36px]">
            {text}
          </p>
        )}
      </div>

      {/* Buttons + hashtag */}
      <div className="flex flex-col items-center after-logo z-2">
        <div className="flex flex-row gap-6 flex-wrap justify-center hide-on-export">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center justify-center px-6 py-2 rounded-[20px] bg-black/60 text-white font-thai hover:bg-black/80 transition cursor-pointer"
          >
            <Download size={18} className="mr-2" />
            {isDownloading ? "Preparing…" : "Download"}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center px-6 py-2 rounded-[20px] bg-black/60 text-white font-thai hover:bg-black/80 transition cursor-pointer"
          >
            <Share2 size={18} className="mr-2" />
            Share
          </button>
        </div>

        <div className="w-full max-w-[320px] mt-4">
          <img
            src="/images/hashtag.png"
            alt="Hashtag"
            className="w-full h-auto"
          />
        </div>
      </div>
    </main>
  );
}
