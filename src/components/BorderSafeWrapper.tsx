"use client";

import { forwardRef } from "react";

// Export-safe filter for dom-to-image
export const borderSafeFilter = (node: HTMLElement | SVGElement) => {
  if (!(node instanceof Element)) return true;
  if (node.classList.contains("hide-on-export")) return false;

  // ✨ Remove border-like styles
  (node as HTMLElement).style.border = "none";
  (node as HTMLElement).style.outline = "none";
  (node as HTMLElement).style.boxShadow = "none";

  const style = window.getComputedStyle(node);
  return !(
    style.opacity === "0" ||
    style.display === "none" ||
    style.visibility === "hidden"
  );
};

// Reusable wrapper
const BorderSafeWrapper = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={`relative min-h-screen w-full flex flex-col items-center justify-start 
        bg-transparent border-0 outline-none overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
});

BorderSafeWrapper.displayName = "BorderSafeWrapper";

export default BorderSafeWrapper;
