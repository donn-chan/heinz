"use client";

import { useState, useEffect, useRef } from "react";
import { toBlob } from "html-to-image";
import { Download, Share2 } from "lucide-react";

export default function Home() {
  const [text, setText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false); // ✅ spinner state
  const logoRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [deviceSize, setDeviceSize] = useState<"mobile" | "tablet" | "desktop">("desktop");

  // mobile check
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 400);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // device size
  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      if (width <= 400) setDeviceSize("mobile");
      else if (width > 400 && width < 1024) setDeviceSize("tablet");
      else setDeviceSize("desktop");
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const d =
    deviceSize === "mobile"
      ? "M -60,410 A 260,260 0 0,1 600,415"
      : deviceSize === "tablet"
      ? "M 0,380 A 240,230 0 0,1 600,380"
      : "M 101,305 A 250,240 0 0,1 600,300";

  // ✅ helper: wait for fonts + images
  const ensureReady = async (container: HTMLElement) => {
    await Promise.race([
      document.fonts.ready,
      new Promise((res) => setTimeout(res, 4000)),
    ]);

    const images = Array.from(container.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          img.complete
            ? Promise.resolve(true)
            : new Promise((res, rej) => {
                img.onload = () => res(true);
                img.onerror = rej;
              })
      )
    );
  };

  const downloadImage = async () => {
    if (!logoRef.current) return;

    const svgText = logoRef.current.querySelector("text");
    const originalSize = svgText?.getAttribute("font-size");

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isMobileDevice = isIOS || /Android/i.test(navigator.userAgent);

    setIsDownloading(true);
    setIsPreparing(true);

    try {
      await ensureReady(logoRef.current);
      setIsPreparing(false);

      if (svgText) {
        svgText.setAttribute("font-size", isMobileDevice ? "28" : "36");
        svgText.setAttribute("font-weight", "bold");
      }

      const blob = await toBlob(logoRef.current, {
        cacheBust: true,
        pixelRatio: isMobileDevice ? 0.6 : 1,
        imagePlaceholder: "",
        filter: (node) => {
          if (!(node instanceof Element)) return true;
          if (node.classList.contains("hide-on-export")) return false;
          const style = window.getComputedStyle(node);
          return !(
            style.opacity === "0" ||
            style.display === "none" ||
            style.visibility === "hidden"
          );
        },
      });

      if (!blob) {
        alert("Image export not supported on this device. Please screenshot instead.");
        return;
      }

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
      setIsPreparing(false);
      if (svgText && originalSize) {
        svgText.setAttribute("font-size", originalSize);
      }
      setIsDownloading(false);
    }
  };

  const shareImage = async () => {
    if (!logoRef.current) return;

    const svgText = logoRef.current.querySelector("text");
    const originalSize = svgText?.getAttribute("font-size");

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isMobileDevice = isIOS || /Android/i.test(navigator.userAgent);

    setIsPreparing(true);

    try {
      await ensureReady(logoRef.current);
      setIsPreparing(false);

      if (svgText) {
        svgText.setAttribute("font-size", isMobileDevice ? "28" : "36");
        svgText.setAttribute("font-weight", "bold");
      }

      const blob = await toBlob(logoRef.current, {
        cacheBust: true,
        pixelRatio: isMobileDevice ? 0.6 : 1,
        imagePlaceholder: "",
        filter: (node) => {
          if (!(node instanceof Element)) return true;
          if (node.classList.contains("hide-on-export")) return false;
          const style = window.getComputedStyle(node);
          return !(
            style.opacity === "0" ||
            style.display === "none" ||
            style.visibility === "hidden"
          );
        },
      });

      if (!blob) {
        alert("Image export not supported on this device. Please screenshot instead.");
        return;
      }

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
      setIsPreparing(false);
      if (svgText && originalSize) {
        svgText.setAttribute("font-size", originalSize);
      }
    }
  };

  return (
    <main
      ref={logoRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-start bg-cover bg-center p-4 sm:p-6 overflow-hidden"
    >
      {/* BG */}
      <img
        src="/images/heinz-bg.webp"
        alt="Background"
        className="absolute inset-0 -z-10 w-full h-full object-cover"
        crossOrigin="anonymous"
      />

      {/* Bottle */}
      <div
        className="absolute top-[-250px] max-[400px]:top-[-200px] sm:top-[-360px] sm:bottom-[-7%] 
        left-1/2 -translate-x-[50%] 
        w-[620px] max-[400px]:w-[540px] sm:w-[600px] md:w-full md:max-w-[700px] lg:max-w-[700px] xl:max-w-[700px]
        h-[100vh] z-0"
      >
        <img
          src="/images/bottle.webp"
          alt="bottle"
          width={680}
          height={1600}
          crossOrigin="anonymous"
          className="w-full h-auto"
        />
      </div>

      {/* Headline */}
      <div className="w-full max-w-[800px] z-1 mt-[20%] sm:mt-0">
        <img
          src="/images/headline.webp"
          alt="Headline"
          width={800}
          height={160}
          crossOrigin="anonymous"
          className="w-full h-auto"
        />
      </div>

      {/* Logo + Input */}
      <div className="relative w-full max-w-[700px] h-[520px] logo-img z-1">
        <img
          src="/images/logo.webp"
          alt="Heinz Logo"
          className="w-[700px] h-[540px] max-[400px]:h-[520px] object-contain opacity-0"
          crossOrigin="anonymous"
        />
        {!text && (
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value;
                setText(value);

                // ✅ Show spinner for 3s, disable buttons
                setIsPreparing(true);
                setTimeout(() => setIsPreparing(false), 3000);
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
                  <textPath href="#curve" startOffset="50%" textAnchor="middle">
                    {text}
                  </textPath>
                </text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center after-logo z-2">
        <div className="flex flex-row gap-6 flex-wrap justify-center hide-on-export">
          <button
            onClick={downloadImage}
            disabled={isDownloading || isPreparing}
            className={`inline-flex items-center justify-center px-6 py-2 rounded-[20px] font-thai transition cursor-pointer ${
              isPreparing
                ? "bg-black/30 text-gray-400 cursor-not-allowed"
                : "bg-black/60 text-white hover:bg-black/80"
            }`}
          >
            <Download size={18} className="mr-2" />
            {isDownloading ? "Preparing…" : "Download"}
          </button>
          <button
            onClick={shareImage}
            disabled={isPreparing}
            className={`inline-flex items-center justify-center px-6 py-2 rounded-[20px] font-thai transition cursor-pointer ${
              isPreparing
                ? "bg-black/30 text-gray-400 cursor-not-allowed"
                : "bg-black/60 text-white hover:bg-black/80"
            }`}
          >
            <Share2 size={18} className="mr-2" />
            Share
          </button>
        </div>

        <div
          className={`w-full max-w-[320px] ${
            isDownloading ? (isMobile ? "mt-[-40px]" : "mt-4") : "mt-4"
          }`}
        >
          <img
            src="/images/hashtag.webp"
            alt="Hashtag"
            width={320}
            height={160}
            crossOrigin="anonymous"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Spinner Overlay */}
      {isPreparing && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-thai">Preparing image…</p>
        </div>
      )}
    </main>
  );
}
