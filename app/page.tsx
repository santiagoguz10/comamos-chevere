export default function Home() {
  return (
    <section className="space-y-6 text-center">
      <h1 className="text-4xl font-bold text-brand-600">Comamos Chévere</h1>
      <p className="text-lg text-stone-600">Hamburguesas, pizzas y choriperros con tus toppings favoritos.</p>
      <div className="flex gap-3 justify-center">
        <a href="/menu" className="btn-primary">Ver menú</a>
        <a href="/login" className="btn-secondary">Ingresar</a>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {["Hamburguesas", "Pizzas", "Choriperros"].map((c) => (
          <div key={c} className="card p-6">
            <h2 className="font-semibold text-xl">{c}</h2>
            <p className="text-stone-500 text-sm mt-1">Personaliza con toppings.</p>
          </div>
        ))}
      </div>
    </section>
  );
}