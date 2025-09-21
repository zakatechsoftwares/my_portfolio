export default function Navbar(){
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-slate-800 to-cyan-500 flex items-center justify-center text-white font-semibold">SS</div>
          <div>
            <div className="font-semibold">Dr. Saka Shittu</div>
            <div className="text-sm text-slate-500">OBGYN · Software Engineer</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-slate-700">
          <a href="#case-studies" className="hover:text-slate-900">Case studies</a>
          <a href="#skills" className="hover:text-slate-900">Skills</a>
          <a href="#publications" className="hover:text-slate-900">Publications</a>
          <a href="#contact" className="px-3 py-1.5 bg-slate-900 text-white rounded-md">Contact</a>
        </nav>
      </div>
    </header>
  )
}
