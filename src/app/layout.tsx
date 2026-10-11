import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/commerce/CartContext";
import { AuthProvider } from "@/components/auth/AuthContext";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gifty | Thoughtful Gifts, Made Personal",
  description: "Gifts for all occasions, delivered with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-playfair bg-[#FCFAF5] text-[#183330]">
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
