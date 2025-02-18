import "./shop.css";

import FloatingPixels from "@/ui/floating-pixels";
import PixelatedBackground from "@/ui/pixelated-background";
import Sidebar from "@/ui/shop/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://escolaberta.com"),
  title: "EscolAberta | Shop",
  description: "All components you need for your project!",
  openGraph: {
    title: "EscollAberta | Shop",
    description: "All components you need for your project!",
  },
};

export default function ShopLayout({ 
  children 
}: { 
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`overflow-y-scroll pb-36 bg-gray-900 text-green-400 dark:bg-gray-900 dark:text-green-400`}>
        <Sidebar />
        <PixelatedBackground />
        {children}
        <FloatingPixels />
      </body>
    </html>
  );
}