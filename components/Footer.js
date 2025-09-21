export default function Footer(){
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8 text-slate-600">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <div className="font-semibold">Dr. Saka Shittu</div>
            <div className="text-sm">OBGYN · Software Engineer</div>
          </div>

          <div className="mt-4 md:mt-0 text-sm">
            <div>Contact: <a href="mailto:hello@example.com" className="text-slate-700 hover:underline">hello@example.com</a></div>
            <div className="mt-2 text-xs text-slate-500">© {2025} Dr. Saka Shittu — Built with care.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
