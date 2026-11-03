import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";

export const cabinet = localFont({
  src: [
    { path: "../public/fonts/CabinetGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/CabinetGrotesk-Extrabold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-cabinet",
  display: "swap",
  preload: true,
});

export const satoshi = localFont({
  src: [
    { path: "../public/fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
});

export const instrument = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
