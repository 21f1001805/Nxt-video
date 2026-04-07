import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Providers from "./components/Providers";

export const metadata: Metadata = {
  title: "NXT Video",
  description: "NXT Video short video sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen text-slate-900">
            <Header />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
