export default function Home() {
  return (
    <section className="space-y-8">
      <div className="hero rounded-3xl p-10 md:p-14 text-white shadow-lg overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <span className="inline-block bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm">Bienvenido</span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">Comamos Chévere</h1>
          <p className="text-lg text-neutral-200">Hamburguesas, pizzas y choriperros con tus toppings favoritos. Pide a domicilio o recoge en tienda.</p>
          <div className="flex gap-3 flex-wrap pt-2">
            <a href="/menu" className="btn-primary text-base">Ver menú 🍽️</a>
            <a href="/login" className="btn-secondary text-base">Ingresar / Crear cuenta</a>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: "Hamburguesas", emoji: "🍔", desc: "Clásica o doble, con toppings a tu gusto." },
          { title: "Pizzas", emoji: "🍕", desc: "Mediana o grande, totalmente personalizables." },
          { title: "Choriperros", emoji: "🌭", desc: "Con salsas, papas y aguacate." },
        ].map((c) => (
          <div key={c.title} className="card p-6 text-center">
            <div className="text-5xl mb-2">{c.emoji}</div>
            <h2 className="font-bold text-xl">{c.title}</h2>
            <p className="text-neutral-500 text-sm mt-1">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 bg-yellow-50 border-yellow-200">
        <h3 className="font-bold text-lg mb-1">¿Cómo funciona?</h3>
        <ol className="list-decimal list-inside text-sm text-neutral-700 space-y-1">
          <li>Elige tus productos y toppings.</li>
          <li>Añádelos al carrito y envía el pedido.</li>
          <li>La tienda aprueba y te notifica.</li>
          <li>Recibe en casa o recoge en tienda.</li>
        </ol>
      </div>
    </section>
  );
}