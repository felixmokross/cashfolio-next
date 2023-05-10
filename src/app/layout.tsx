import "./tailwind.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = { title: "Cashfolio" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 antialiased">
        <div className="mx-auto min-h-screen max-w-screen-sm bg-white sm:border-x sm:border-slate-200 sm:shadow-xl">
          {children}
        </div>
      </body>
    </html>
  );
}
