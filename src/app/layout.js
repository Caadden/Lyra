import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lyra | Premium AI Lyrics Analysis",
  description: "Analyze and understand song lyrics like never before.",
  icons: {
    icon: [
      "/lyra-favicon.ico",
      "/lyra-android-chrome-192x192.png",
      "/lyra-android-chrome-512x512.png",
    ],
    apple: "/lyra-apple-touch-icon.png",
    shortcut: "/lyra-favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
