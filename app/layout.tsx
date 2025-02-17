import "./globals.css";

import { Press_Start_2P, VT323 } from "next/font/google";
import EscolAbertaLogo from "@/ui/escolaberta-logo";
import BlinkingCursor from "@/ui/home/blinking-cursor";
import FloatingPixels from "@/ui/floating-pixels";
import ThemeToggle from "@/ui/home/theme-toggle";
import SoundEffect from "@/ui/home/sound-effect";
import PixelatedBackground from "@/ui/pixelated-background";
import NavMenu from "@/ui/home/nav-menu";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
})

export const metadata = {
  title: "EscolAberta",
  description: "Ciência da computação, engenharia eletrônica, engenharia elétrica, Matemática, Física e Inglês!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} font-sans bg-gray-900 text-green-400 dark:bg-gray-900 dark:text-green-400`}
      >
        <PixelatedBackground />
        <div className="max-w-4xl mx-auto px-4">
          <header className="py-8 flex flex-col items-center">
            <EscolAbertaLogo />
            <h1 className="text-4xl font-bold text-center font-pixel mb-2 mt-6">EscolAberta</h1>
            <p className="text-xl text-center font-mono flex items-center">
              Escola • Aberta • para Todos <BlinkingCursor />
            </p>
            <NavMenu />
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </header>
          <main>{children}</main>
          <footer className="py-8 text-center font-mono">
            © {new Date().getFullYear()} EscolAberta. All rights reserved.
          </footer>
        </div>
        <FloatingPixels />
        <SoundEffect />
      </body>
    </html>
  )
}