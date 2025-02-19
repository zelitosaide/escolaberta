import "./shop.css";

import FloatingPixels from "@/ui/floating-pixels";
import PixelatedBackground from "@/ui/pixelated-background";
import { CartCountProvider } from "@/ui/shop/cart-count-context";
import Header from "@/ui/shop/header";
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
      <body className={`overflow-y-scroll pb-36 bg-gray-900 dark:bg-gray-900`}>
        <Sidebar />
        <PixelatedBackground />
        <div className="lg:pl-72">
          <div className="mx-auto max-w-6xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-slate-950 p-3.5 lg:p-6">
                <CartCountProvider>
                  <div className="space-y-10">
                    <Header />

                    {children}
                  </div>
                </CartCountProvider>
              </div>
            </div>
          </div>
        </div>
        <FloatingPixels />
      </body>
    </html>
  );
}