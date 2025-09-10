// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "How do you say Heinz?",
  description: "Type it your way and make the Heinz logo yours.",
  openGraph: {
    title: "How do you say Heinz?",
    description: "Type it your way and make the Heinz logo yours.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
