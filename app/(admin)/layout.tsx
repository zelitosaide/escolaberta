import "./admin.css";
import { Metadata } from "next";
import { inter } from "@/ui/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://escolaberta.com"),
  title: "EscolAberta | Admin",
  description: "All components you need for your project!",
  openGraph: {
    title: "EscolAberta | Admin",
    description: "All components you need for your project!",
  },
};

export default function AdminLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}