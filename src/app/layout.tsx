import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z Shop — Todo lo que amas, entregado rápido",
  description:
    "Compra electrónica, computadoras, hogar, audio, wearables y gaming en Z Shop. Pago seguro, envío rápido y seguimiento de pedidos. / Shop electronics, computers, home, audio, wearables and gaming at Z Shop.",
  keywords: [
    "Z Shop",
    "ecommerce",
    "online shopping",
    "electronics",
    "deals",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
