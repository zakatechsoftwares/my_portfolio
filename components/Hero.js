export default function Hero(){
  return (
    <section className="bg-white rounded-lg p-8 shadow-sm">
      <div className="md:flex md:items-center md:gap-8">
        <div className="flex-shrink-0">
          <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60" alt="Dr. portrait" className="w-36 h-36 rounded-lg object-cover shadow-md" />
        </div>
        <div className="mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">Dr. Saka Shittu</h1>
          <p className="text-slate-600 mt-2">OBGYN • Surgical care & maternal health researcher • Healthtech engineer</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a href="#case-studies" className="px-4 py-2 bg-slate-900 text-white rounded-md">Explore case studies</a>
            <a href="mailto:hello@example.com" className="px-4 py-2 border rounded-md text-slate-800">Contact for collaborations</a>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 max-w-md">
            <div className="p-3 bg-slate-50 rounded-md">
              <div className="text-sm text-slate-500">Years practicing</div>
              <div className="text-xl font-semibold">9+</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-md">
              <div className="text-sm text-slate-500">Apps / Tools shipped</div>
              <div className="text-xl font-semibold">6</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
