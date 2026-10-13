import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashSync(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  // Use scryptSync for seed simplicity
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

async function main() {
  // Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@comamoschevere.local" },
    update: {},
    create: {
      email: "admin@comamoschevere.local",
      name: "Administrador",
      passwordHash: hashSync("admin123"),
      role: "admin",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "cliente@comamoschevere.local" },
    update: {},
    create: {
      email: "cliente@comamoschevere.local",
      name: "Cliente Demo",
      passwordHash: hashSync("cliente123"),
      role: "customer",
    },
  });

  // Toppings
  const toppingsData = [
    { name: "Queso extra", priceCents: 1500 },
    { name: "Tocineta", priceCents: 2000 },
    { name: "Cebolla caramelizada", priceCents: 1000 },
    { name: "Salsa BBQ", priceCents: 500 },
    { name: "Piña", priceCents: 1000 },
    { name: "Jalapeños", priceCents: 1000 },
    { name: "Champiñones", priceCents: 1500 },
    { name: "Aguacate", priceCents: 2000 },
  ];
  const toppings: any[] = [];
  for (const t of toppingsData) {
    const topping = await prisma.topping.upsert({
      where: { name: t.name },
      update: { priceCents: t.priceCents },
      create: t,
    });
    toppings.push(topping);
  }
  const byName = (n: string) => toppings.find((t) => t.name === n)!;

  // Products
  const products = [
    { name: "Hamburguesa clásica", category: "hamburger", description: "Carne, lechuga, tomate, queso", priceCents: 18000, imageUrl: "https://picsum.photos/seed/burger-classic/480/320", toppingNames: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Salsa BBQ", "Jalapeños"] },
    { name: "Hamburguesa doble", category: "hamburger", description: "Doble carne, doble queso", priceCents: 24000, imageUrl: "https://picsum.photos/seed/burger-double/480/320", toppingNames: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Salsa BBQ", "Jalapeños", "Aguacate"] },
    { name: "Pizza mediana", category: "pizza", description: "Masa artesanal, salsa de tomate", priceCents: 28000, imageUrl: "https://picsum.photos/seed/pizza-m/480/320", toppingNames: ["Queso extra", "Champiñones", "Cebolla caramelizada", "Jalapeños", "Piña", "Tocineta"] },
    { name: "Pizza grande", category: "pizza", description: "Para compartir", priceCents: 42000, imageUrl: "https://picsum.photos/seed/pizza-l/480/320", toppingNames: ["Queso extra", "Champiñones", "Cebolla caramelizada", "Jalapeños", "Piña", "Tocineta", "Aguacate"] },
    { name: "Choriperro", category: "choripero", description: "Chorizo, papas, salsas", priceCents: 14000, imageUrl: "https://picsum.photos/seed/choriperro/480/320", toppingNames: ["Queso extra", "Cebolla caramelizada", "Jalapeños", "Aguacate", "Salsa BBQ"] },
  ];

  const createdProducts: any[] = [];
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { name: p.name },
      update: { description: p.description, priceCents: p.priceCents, category: p.category, imageUrl: p.imageUrl },
      create: { name: p.name, category: p.category, description: p.description, priceCents: p.priceCents, imageUrl: p.imageUrl },
    });
    createdProducts.push(product);
    // link toppings
    for (const tn of p.toppingNames) {
      const topping = byName(tn);
      await prisma.productTopping.upsert({
        where: { productId_toppingId: { productId: product.id, toppingId: topping.id } },
        update: {},
        create: { productId: product.id, toppingId: topping.id },
      });
    }
  }

  if (customer) {
    const reviewsSeed = [
      { productName: "Hamburguesa clásica", rating: 5, comment: "Excelente, muy jugosa." },
      { productName: "Pizza mediana", rating: 4, comment: "Muy buena masa y toppings." },
      { productName: "Choriperro", rating: 5, comment: "El mejor choriperro de la ciudad." },
    ];
    for (const r of reviewsSeed) {
      const prod = createdProducts.find((pr) => pr.name === r.productName);
      if (!prod) continue;
      await prisma.review.upsert({
        where: { userId_productId: { userId: customer.id, productId: prod.id } },
        update: {},
        create: { userId: customer.id, productId: prod.id, rating: r.rating, comment: r.comment },
      });
    }
  }

  console.log("Seed complete. Admin:", admin.email);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });