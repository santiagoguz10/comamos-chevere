import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "Comamos Chévere",
  description: "Restaurante - pedidos en línea",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
            <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-brand-600">Comamos Chévere</Link>
              <div className="flex gap-4 text-sm items-center">
                <Link href="/menu">Menú</Link>
                <Link href="/cart">Carrito</Link>
                <Link href="/orders">Mis pedidos</Link>
                <Link href="/admin" className="text-brand-600">Admin</Link>
              </div>
            </nav>
          </header>
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}