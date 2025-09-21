// pages/index.js
import Head from "next/head"
import Link from "next/link"

export default function Home() {
  const techSkills = [
    "React",
    "Next.js",
    "React Native / Expo",
    "TypeScript / JavaScript",
    "SQLite / Postgres",
    "Node.js",
    "Git & CI/CD",
  ]

  const obgynSkills = [
    "Major & minor obstetric surgeries",
    "Cesarean section (elective & emergency)",
    "Hysterectomy (abdominal & vaginal)",
    "Laparoscopic gynecologic surgery",
    "Postpartum & complication management",
    "Antenatal and intrapartum care",
  ]

  return (
    <>
      <Head>
        <title>Dr. Saka Shittu — OBGYN & Software Engineer</title>
        <meta
          name="description"
          content="Dr. Saka Shittu — Obstetrician & Gynaecologist and software engineer. Surgical practice and healthtech projects."
        />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-slate-800 to-cyan-500 flex items-center justify-center text-white font-semibold">SS</div>
              <div>
                <div className="font-semibold">Dr. Saka Shittu</div>
                <div className="text-sm text-slate-500">OBGYN · Software Engineer</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-4 text-slate-700">
              <Link href="/projectWithComments" className="hover:underline">Projects</Link>
              <Link href="/casesManagedWithComments" className="hover:underline">Cases</Link>
              <a href="mailto:hello@example.com" className="px-3 py-1.5 bg-slate-900 text-white rounded-md">Contact</a>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <section className="bg-white rounded-lg p-8 shadow-sm md:flex md:items-center md:gap-8">
            <div className="flex-shrink-0">
              <img
                src="/myprofilepix.png"
                onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src='https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60' }}
                alt="Dr. Saka Shittu"
                className="w-36 h-36 rounded-lg object-cover shadow-md"
              />
            </div>

            <div className="mt-4 md:mt-0 flex-1">
              <h1 className="text-3xl font-bold">Dr. Saka Shittu</h1>
              <p className="text-slate-600 mt-2">
                Consultant OBGYN with strong surgical experience, and a software engineer building pragmatic healthtech solutions.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/projectWithComments" className="px-5 py-3 bg-slate-900 text-white rounded-md shadow">
                  View projects
                </Link>

                <Link href="/casesManagedWithComments" className="px-5 py-3 border rounded-md text-slate-900">
                Cases managed
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-md">
                  <div className="text-sm text-slate-500">Tech skills</div>
                  <ul className="mt-2 space-y-1 text-slate-700">
                    {techSkills.map(s => <li key={s}>• {s}</li>)}
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-md">
                  <div className="text-sm text-slate-500">OBGYN & Surgical skills</div>
                  <ul className="mt-2 space-y-1 text-slate-700">
                    {obgynSkills.map(s => <li key={s}>• {s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Quick facts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <div className="text-sm text-slate-500">Years practicing</div>
                <div className="text-2xl font-semibold">9+</div>
              </div>
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <div className="text-sm text-slate-500">Surgeries performed</div>
                <div className="text-2xl font-semibold">1,200+</div>
              </div>
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <div className="text-sm text-slate-500">Apps / Tools shipped</div>
                <div className="text-2xl font-semibold">6</div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 border-t bg-white">
          <div className="max-w-5xl mx-auto px-6 py-6 text-slate-600">
            © {new Date().getFullYear()} Dr. Saka Shittu — OBGYN & Software Engineer
          </div>
        </footer>
      </div>
    </>
  )
}
