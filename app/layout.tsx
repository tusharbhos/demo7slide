import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cove AI Presentation",
  description: "Interactive Presentation using conectR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href="/assets/accounts/1/coveAi/buttons/enablex.png"
          type="image/png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="relative w-[full] h-[575px] md:h-[575px] lg:h-[665px] overflow-hidden m-2 border-2 border-black rounded-lg shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
