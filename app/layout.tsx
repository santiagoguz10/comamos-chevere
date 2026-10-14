import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from "@/components/CartProvider";
import PushSubscriber from "@/components/PushSubscriber";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Comamos Chévere",
  description: "Restaurante - pedidos en línea",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();` }} />
      </head>
      <body>
        <CartProvider>
          <PushSubscriber />
          <header className="bg-black text-white sticky top-0 z-40 shadow">
            <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-xl font-black text-yellow-400 tracking-tight">
                🍔 Comamos Chévere
              </Link>
              <div className="flex gap-4 text-sm items-center">
                <Link href="/menu" className="hover:text-yellow-400 transition">Menú</Link>
                <Link href="/cart" className="hover:text-yellow-400 transition">Carrito</Link>
                <Link href="/orders" className="hover:text-yellow-400 transition">Mis pedidos</Link>
                <Link href="/admin" className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white transition">Admin</Link>
                <ThemeToggle />
              </div>
            </nav>
          </header>
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
          <footer className="bg-black text-neutral-400 text-center text-xs py-6 mt-10">
            Comamos Chévere © 2026 · Hecho con ❤️
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}