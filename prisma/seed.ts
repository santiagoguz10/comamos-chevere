import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashSync(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

const TOPPINGS = [
  { name: "Queso extra", priceCents: 2000 },
  { name: "Tocineta", priceCents: 2000 },
  { name: "Cebolla caramelizada", priceCents: 1000 },
  { name: "Salsa BBQ", priceCents: 500 },
  { name: "Piña", priceCents: 1000 },
  { name: "Jalapeños", priceCents: 1000 },
  { name: "Champiñones", priceCents: 1500 },
  { name: "Aguacate", priceCents: 2000 },
  { name: "Maíz tierno", priceCents: 1000 },
  { name: "Orégano", priceCents: 500 },
];

const PIZZA_VARIANTS = [
  { name: "Personal", priceCents: 9000 },
  { name: "Mediana", priceCents: 16000 },
  { name: "Familiar", priceCents: 22000 },
  { name: "Jumbo", priceCents: 45000 },
];

const PIZZA_FLAVORS = [
  { name: "Pizza Hawaiana", description: "Trozos de piña, queso y jamón ahumado", imageUrl: "https://picsum.photos/seed/pizza-haw/480/320", toppings: ["Piña", "Queso extra", "Tocineta"] },
  { name: "Pizza Chorizo Santarrosano", description: "Trozos de chorizo santarrosano, jamón, queso y salami", imageUrl: "https://picsum.photos/seed/pizza-chosan/480/320", toppings: ["Queso extra", "Tocineta"] },
  { name: "Pizza Pollo Champiñones", description: "Salsa showy con pollo mechado, queso y champiñón", imageUrl: "https://picsum.photos/seed/pizza-pollochamp/480/320", toppings: ["Champiñones", "Queso extra"] },
  { name: "Pizza Carne Champiñones", description: "Salsa BBQ con carne de cerdo mechado, queso y champiñón", imageUrl: "https://picsum.photos/seed/pizza-carnechamp/480/320", toppings: ["Champiñones", "Salsa BBQ", "Queso extra"] },
  { name: "Pizza Colombiana", description: "Lluvia de maíz tierno, trozos de chorizo, tomate, carne de cerdo mechada y queso", imageUrl: "https://picsum.photos/seed/pizza-col/480/320", toppings: ["Maíz tierno", "Queso extra"] },
  { name: "Pizza Ranchera", description: "Lluvia de maíz tierno, tocineta, carne de res mechada, queso y salami", imageUrl: "https://picsum.photos/seed/pizza-ranch/480/320", toppings: ["Maíz tierno", "Tocineta", "Queso extra"] },
  { name: "Pizza Mexicana", description: "Lluvia de maíz tierno, carne molida, pico de gallo, queso, nachos y picante al gusto", imageUrl: "https://picsum.photos/seed/pizza-mex/480/320", toppings: ["Maíz tierno", "Jalapeños", "Queso extra"] },
  { name: "Pizza Napolitana", description: "Finas rodajas de tomate fresco, orégano, queso y salami", imageUrl: "https://picsum.photos/seed/pizza-napo/480/320", toppings: ["Orégano", "Queso extra"] },
  { name: "Pizza Vegetales", description: "Finas rodajas de tomate, queso, orégano y champiñones", imageUrl: "https://picsum.photos/seed/pizza-veg/480/320", toppings: ["Champiñones", "Orégano", "Queso extra"] },
  { name: "Pizza Pollo Miel Mostaza", description: "Salsa miel mostaza, pollo mechado, queso y tocineta", imageUrl: "https://picsum.photos/seed/pizza-pmm/480/320", toppings: ["Tocineta", "Queso extra"] },
  { name: "Pizza Popeye", description: "Espinaca en tiras, pollo mechado, queso y champiñones", imageUrl: "https://picsum.photos/seed/pizza-popeye/480/320", toppings: ["Champiñones", "Queso extra"] },
  { name: "Pizza Boloñesa", description: "Carne molida, chorizo picado, queso y salami", imageUrl: "https://picsum.photos/seed/pizza-bolo/480/320", toppings: ["Queso extra"] },
  { name: "Pizza Costillas BBQ", description: "Base en salsa BBQ con trositos de costilla ahumada y maíz", imageUrl: "https://picsum.photos/seed/pizza-costbbq/480/320", toppings: ["Maíz tierno", "Salsa BBQ", "Queso extra"] },
  { name: "Pizza de Chorizo", description: "Maíz dulce, queso y chorizo", imageUrl: "https://picsum.photos/seed/pizza-chorizo/480/320", toppings: ["Maíz tierno", "Queso extra"] },
];

const FIXED_PRODUCTS = [
  { name: "Hamburguesa Sencilla", category: "burger", description: "Pan, lechuga, tomate, salsa de la casa, carne ahumada de res, queso cheddar y papita cabello de ángel", priceCents: 7000, imageUrl: "https://picsum.photos/seed/burger-sencilla/480/320", toppings: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Aguacate"] },
  { name: "Hamburguesa Especial", category: "burger", description: "Pan, lechuga, tomate, salsa de la casa, carne ahumada de res, queso cheddar, tocineta, jamón, papita cabello de ángel, huevo de codorniz y salsas", priceCents: 9000, imageUrl: "https://picsum.photos/seed/burger-especial/480/320", toppings: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Aguacate", "Salsa BBQ"] },
  { name: "Hamburguesa Super Especial Chorizo", category: "burger", description: "Pan, lechuga, tomate, carne ahumada de res, queso cheddar, tocineta, jamón, papita cabello de ángel, chorizo santarrosano salteado, huevo de codorniz y salsas", priceCents: 11900, imageUrl: "https://picsum.photos/seed/burger-chorizo/480/320", toppings: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Aguacate", "Salsa BBQ", "Jalapeños"] },
  { name: "Hamburguesa Super Especial Criolla", category: "burger", description: "Pan, lechuga, tomate, salsa de la casa, carne ahumada de res, queso cheddar, tocineta, jamón, papita cabello de ángel, tajada de plátano maduro, huevo frito y salsas", priceCents: 11900, imageUrl: "https://picsum.photos/seed/burger-criolla/480/320", toppings: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Aguacate", "Salsa BBQ"] },
  { name: "Hamburguesa Super Pollo Mechado", category: "burger", description: "Pan, lechuga, tomate, salsa de la casa, carne ahumada de res, queso cheddar, tocineta, jamón, papita cabello de ángel, pollo mechado en salsa de maíz dulce, huevo de codorniz y salsas", priceCents: 11900, imageUrl: "https://picsum.photos/seed/burger-pollo/480/320", toppings: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Aguacate", "Maíz tierno"] },
  { name: "Hamburguesa Super Carne Mechada", category: "burger", description: "Pan, lechuga, tomate, salsa de la casa, carne ahumada de res, queso cheddar, tocineta, jamón, papita cabello de ángel, carne mechada con champiñón, huevo de codorniz y salsas", priceCents: 11900, imageUrl: "https://picsum.photos/seed/burger-carnemech/480/320", toppings: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Aguacate", "Champiñones"] },
  { name: "Hamburguesa Super Especial Hawaiana", category: "burger", description: "Pan, lechuga, tomate, salsa de la casa, carne ahumada de res, queso cheddar, tocineta, jamón, papita cabello de ángel, rodaja de piña, huevo de codorniz y salsas", priceCents: 11900, imageUrl: "https://picsum.photos/seed/burger-haw/480/320", toppings: ["Queso extra", "Tocineta", "Piña", "Aguacate"] },
  { name: "Hamburguesa Sencilla (Combo)", category: "burger", description: "Hamburguesa sencilla con papas y gaseosa por $4.000 adicionales", priceCents: 7000, imageUrl: "https://picsum.photos/seed/burger-combo/480/320", toppings: ["Queso extra", "Tocineta"] },
  { name: "Perro Sencillo", category: "hotdog", description: "Pan, salchicha americana, papita cabello de ángel, cebolla, queso, huevo de codorniz y salsas", priceCents: 6500, imageUrl: "https://picsum.photos/seed/perro-sencillo/480/320", toppings: ["Queso extra", "Cebolla caramelizada", "Jalapeños"] },
  { name: "Perro Especial", category: "hotdog", description: "Pan, salchicha americana, papita cabello de ángel, cebolla, jamón, tocineta, huevo de codorniz y salsas", priceCents: 7900, imageUrl: "https://picsum.photos/seed/perro-especial/480/320", toppings: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Aguacate"] },
  { name: "Perro Super Especial", category: "hotdog", description: "Pan, salchicha americana, papita cabello de ángel, cebolla crocante, jamón x2, tocineta x2, huevo de codorniz x3 y salsas", priceCents: 9500, imageUrl: "https://picsum.photos/seed/perro-superspecial/480/320", toppings: ["Queso extra", "Tocineta", "Cebolla caramelizada", "Aguacate", "Salsa BBQ"] },
  { name: "Chorizo Sencillo con Arepa o Pan", category: "chorizo", description: "Chorizo santarrosano con arepa o pan", priceCents: 3900, imageUrl: "https://picsum.photos/seed/chorizo-sencillo/480/320", toppings: ["Queso extra", "Cebolla caramelizada", "Salsa BBQ"] },
  { name: "Chorizo Especial", category: "chorizo", description: "Pan, salsa de la casa, maíz dulce, chorizo santarrosano, papita cabello de ángel, queso cheddar", priceCents: 7000, imageUrl: "https://picsum.photos/seed/chorizo-especial/480/320", toppings: ["Maíz tierno", "Queso extra", "Cebolla caramelizada"] },
  { name: "Chorizo Super Especial Pollo", category: "chorizo", description: "Pan, papita cabello de ángel, salsa de la casa, chorizo santarrosano, pollo mechado, maíz tierno, queso cheddar", priceCents: 9000, imageUrl: "https://picsum.photos/seed/chorizo-pollo/480/320", toppings: ["Maíz tierno", "Queso extra", "Tocineta", "Aguacate"] },
  { name: "Chorizo Super Especial Carne", category: "chorizo", description: "Pan, papita cabello de ángel, salsa de la casa, chorizo santarrosano, carne mechada, champiñón, queso cheddar", priceCents: 9000, imageUrl: "https://picsum.photos/seed/chorizo-carne/480/320", toppings: ["Champiñones", "Queso extra", "Cebolla caramelizada"] },
  { name: "Chorizo Super Especial Mexicano", category: "chorizo", description: "Pan, papita cabello de ángel, salsa de la casa, chorizo santarrosano, carne molida, pico de gallo, queso cheddar", priceCents: 9000, imageUrl: "https://picsum.photos/seed/chorizo-mexicano/480/320", toppings: ["Jalapeños", "Queso extra", "Aguacate", "S salsa BBQ".replace("S salsa","Salsa")] },
  { name: "Salchipapa", category: "papas", description: "Papa en tiras, salchicha americana, queso fundido, huevo de codorniz y salsas", priceCents: 6700, imageUrl: "https://picsum.photos/seed/salchipapa/480/320", toppings: ["Queso extra", "Salsa BBQ", "Jalapeños"] },
  { name: "Choripapa", category: "papas", description: "Papa en tiras, chorizo santarrosano, queso fundido, huevo de codorniz y salsas", priceCents: 6700, imageUrl: "https://picsum.photos/seed/choripapa/480/320", toppings: ["Queso extra", "Salsa BBQ", "Cebolla caramelizada"] },
  { name: "Salchipapa Americana", category: "papas", description: "Papa en tiras, salchicha americana, tocineta en tiras, queso fundido, huevo de codorniz y salsas", priceCents: 7900, imageUrl: "https://picsum.photos/seed/salchipapa-ame/480/320", toppings: ["Tocineta", "Queso extra", "Salsa BBQ"] },
  { name: "Salchipapa Especial", category: "papas", description: "Papa en tiras, salchicha americana, carnes mechadas, queso fundido, huevo de codorniz y salsas", priceCents: 12900, imageUrl: "https://picsum.photos/seed/salchipapa-esp/480/320", toppings: ["Queso extra", "Tocineta", "Aguacate", "Champiñones"] },
  { name: "Burrito", category: "burrito", description: "Tortilla, cama de lechuga, maíz tierno, carne mechada de res, cerdo y molida, jamón, tocineta, pico de gallo, nachos, picante y salsas", priceCents: 9900, imageUrl: "https://picsum.photos/seed/burrito/480/320", toppings: ["Queso extra", "Aguacate", "Jalapeños", "Maíz tierno"] },
  { name: "Mazorcada de la Casa", category: "mazorcada", description: "Base de maíz tierno, carne mechada de res, cerdo, jamón, tocineta, huevo de codorniz, queso y salsas", priceCents: 9900, imageUrl: "https://picsum.photos/seed/mazorcada/480/320", toppings: ["Queso extra", "Tocineta", "Maíz tierno", "Aguacate"] },
  { name: "Mazorcada Especial", category: "mazorcada", description: "Base de papa a la francesa, maíz tierno, carne mechada de res, cerdo, jamón, tocineta, huevo de codorniz, queso y salsas", priceCents: 12900, imageUrl: "https://picsum.photos/seed/mazorcada-esp/480/320", toppings: ["Queso extra", "Tocineta", "Maíz tierno", "Aguacate", "Champiñones"] },
  { name: "Empanaditas Rancheras", category: "para picar", description: "Empanaditas rancheras", priceCents: 2000, imageUrl: "https://picsum.photos/seed/empanada-ranch/480/320", toppings: ["Salsa BBQ", "Aguacate"] },
  { name: "Empanaditas Pollo Champiñones", category: "para picar", description: "Empanaditas de pollo y champiñones", priceCents: 2000, imageUrl: "https://picsum.photos/seed/empanada-pollo/480/320", toppings: ["Salsa BBQ", "Queso extra"] },
  { name: "Empanaditas Carne Desmechada", category: "para picar", description: "Empanaditas de carne desmechada", priceCents: 2000, imageUrl: "https://picsum.photos/seed/empanada-carne/480/320", toppings: ["Salsa BBQ", "Cebolla caramelizada"] },
  { name: "Empanaditas Mixtas", category: "para picar", description: "Empanaditas mixtas", priceCents: 2000, imageUrl: "https://picsum.photos/seed/empanada-mix/480/320", toppings: ["Salsa BBQ", "Queso extra", "Aguacate"] },
  { name: "Lasagna", category: "para picar", description: "Mixta, con carne y chorizo en salsa bolognesa, pollo en salsa bechamel con trozo de champiñón, tocineta y queso", priceCents: 12900, imageUrl: "https://picsum.photos/seed/lasagna/480/320", toppings: ["Queso extra"] },
  { name: "Tortillas", category: "para picar", description: "Hojaldre delgado con lechuga, preparación de carne desmechada, queso y jamón", priceCents: 6900, imageUrl: "https://picsum.photos/seed/tortillas/480/320", toppings: ["Queso extra", "Salsa BBQ"] },
  { name: "Alitas BBQ x8", category: "fines de semana", description: "Acompañadas con porción de papa y salsa BBQ o miel mostaza", priceCents: 12900, imageUrl: "https://picsum.photos/seed/alitas8/480/320", toppings: ["Salsa BBQ"] },
  { name: "Alitas BBQ x16", category: "fines de semana", description: "Acompañadas con porción de papa y salsa BBQ o miel mostaza", priceCents: 22900, imageUrl: "https://picsum.photos/seed/alitas16/480/320", toppings: ["Salsa BBQ", "Aguacate"] },
  { name: "Costillitas Ahumadas", category: "fines de semana", description: "Acompañadas con porción de papa y salsa BBQ o miel mostaza", priceCents: 12900, imageUrl: "https://picsum.photos/seed/costillitas/480/320", toppings: ["Salsa BBQ", "Maíz tierno"] },
];

async function main() {
  // Customers
  const admin = await prisma.user.upsert({
    where: { email: "admin@comamoschevere.local" },
    update: {},
    create: {
      email: "admin@comamoschevere.local",
      name: "Administrador",
      phone: "3144412507",
      passwordHash: hashSync("admin123"),
      role: "admin",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "cliente@comamoschevere.local" },
    update: { phone: "3001234567" },
    create: {
      email: "cliente@comamoschevere.local",
      name: "Cliente Demo",
      phone: "3001234567",
      passwordHash: hashSync("cliente123"),
      role: "customer",
    },
  });

  // Toppings
  const toppings: any[] = [];
  for (const t of TOPPINGS) {
    const topping = await prisma.topping.upsert({
      where: { name: t.name },
      update: { priceCents: t.priceCents },
      create: t,
    });
    toppings.push(topping);
  }
  const byName = (n: string) => toppings.find((t) => t.name === n)!;

  // Clean legacy demo data if no orders exist (safe reseed)
  const orderCount = await prisma.order.count();
  if (orderCount === 0) {
    await prisma.review.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.productTopping.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    // remove products not in menu set is covered by deleteMany
  }

  const createdProducts: any[] = [];
  for (const p of FIXED_PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { name: p.name },
      update: { description: p.description, priceCents: p.priceCents, category: p.category, imageUrl: p.imageUrl },
      create: { name: p.name, category: p.category, description: p.description, priceCents: p.priceCents, imageUrl: p.imageUrl },
    });
    createdProducts.push(product);
    for (const tn of p.toppings) {
      const topping = byName(tn);
      await prisma.productTopping.upsert({
        where: { productId_toppingId: { productId: product.id, toppingId: topping.id } },
        update: {},
        create: { productId: product.id, toppingId: topping.id },
      });
    }
  }

  for (const p of PIZZA_FLAVORS) {
    const product = await prisma.product.upsert({
      where: { name: p.name },
      update: { description: p.description, priceCents: PIZZA_VARIANTS[0].priceCents, category: "pizza", imageUrl: p.imageUrl },
      create: { name: p.name, category: "pizza", description: p.description, priceCents: PIZZA_VARIANTS[0].priceCents, imageUrl: p.imageUrl },
    });
    createdProducts.push(product);
    for (const v of PIZZA_VARIANTS) {
      await prisma.productVariant.upsert({
        where: { productId_name: { productId: product.id, name: v.name } },
        update: { priceCents: v.priceCents },
        create: { productId: product.id, name: v.name, priceCents: v.priceCents },
      });
    }
    for (const tn of p.toppings) {
      const topping = byName(tn);
      await prisma.productTopping.upsert({
        where: { productId_toppingId: { productId: product.id, toppingId: topping.id } },
        update: {},
        create: { productId: product.id, toppingId: topping.id },
      });
    }
  }

  // Reviews
  const reviewSeeds = [
    { productName: "Pizza Hawaiana", rating: 5, comment: "Me encantó la piña y el jamón." },
    { productName: "Hamburguesa Especial", rating: 5, comment: "Muy completa y deliciosa." },
    { productName: "Perro Super Especial", rating: 4, comment: "Generoso y con buen sabor." },
  ];
  for (const r of reviewSeeds) {
    const prod = createdProducts.find((pr) => pr.name === r.productName);
    if (!prod) continue;
    await prisma.review.upsert({
      where: { userId_productId: { userId: customer.id, productId: prod.id } },
      update: {},
      create: { userId: customer.id, productId: prod.id, rating: r.rating, comment: r.comment },
    });
  }

  // Product variants must be fetched for pizza products? already created
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", isOpen: true },
  });

  console.log("Seed complete. Admin:", admin.email, "Products:", createdProducts.length);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });