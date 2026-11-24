import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import portrait from "../public/myprofilepix.png"

const projects = "/projectWithComments"
const cases = "/casesManagedWithComments"
const github = "https://github.com/zakatechsoftwares"

const clinicalSkills = [
  "Antenatal and intrapartum care",
  "Elective and emergency Caesarean section",
  "Abdominal and vaginal hysterectomy",
  "Laparoscopic gynaecologic surgery",
  "Postpartum care and management of complications",
]

const softwareSkills = [
  "React and Next.js",
  "React Native and Expo",
  "TypeScript and JavaScript",
  "Node.js",
  "PostgreSQL and SQLite",
  "Git and CI/CD",
]

const facts = [
  ["9+", "Years in clinical practice"],
  ["1,200+", "Surgeries performed"],
  ["6", "Apps and tools shipped"],
]

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
const description = "Dr. Saka Shittu is a consultant obstetrician and gynaecologist and software engineer building health technology in Nigeria."

export default function Home() {
  return (
    <>
      <Head>
        <title>Dr. Saka Shittu | Obstetrics, Gynaecology & Health Software</title>
        <meta name="description" content={description} />
      </Head>

      <div className="min-h-screen bg-stone-50 text-slate-950">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-10 focus:bg-white focus:p-3">
          Skip to content
        </a>

        <header className="border-b border-stone-200">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
            <Link href="/" className={`flex items-center gap-3 rounded font-semibold ${focus}`}>
              <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-teal-950 text-sm text-white">SS</span>
              Dr. Saka Shittu
            </Link>
            <nav aria-label="Main navigation" className="flex flex-wrap gap-x-5 text-sm font-semibold text-slate-700">
              <a href="#work" className={`rounded py-3 hover:text-teal-800 ${focus}`}>Selected work</a>
              <a href="#expertise" className={`rounded py-3 hover:text-teal-800 ${focus}`}>Expertise</a>
              <a href={github} className={`rounded py-3 hover:text-teal-800 ${focus}`}>GitHub</a>
            </nav>
          </div>
        </header>

        <main id="main" className="mx-auto max-w-6xl px-5 sm:px-8">
          <section aria-labelledby="intro" className="grid items-center gap-9 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)] md:gap-16 md:py-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-800">Consultant OB-GYN · Software engineer</p>
              <h1 id="intro" className="mt-4 max-w-2xl font-serif text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Dr. Saka Shittu
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-700">
                I practise obstetrics and gynaecology in Nigeria and build software for clinical teams, from electronic medical records to telemedicine.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={projects} className={`rounded-xl bg-teal-900 px-5 py-3 font-semibold text-white hover:bg-teal-800 ${focus}`}>Explore software projects</Link>
                <Link href={cases} className={`rounded-xl border border-stone-300 bg-white px-5 py-3 font-semibold hover:border-teal-700 ${focus}`}>Browse clinical cases</Link>
              </div>
            </div>
            <div className="w-full max-w-xs rounded-3xl border border-stone-200 bg-stone-100 p-3 md:justify-self-end">
              <Image
                src={portrait}
                alt="Portrait of Dr. Saka Shittu"
                priority
                sizes="(max-width: 360px) calc(100vw - 64px), 300px"
                className="aspect-[4/5] w-full rounded-2xl object-cover object-top"
              />
            </div>
          </section>

          <dl className="grid grid-cols-1 gap-y-6 rounded-3xl bg-teal-950 px-7 py-8 text-white sm:grid-cols-3 sm:gap-x-6 sm:px-10">
            {facts.map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse gap-1">
                <dt className="text-sm text-teal-100">{label}</dt>
                <dd className="font-serif text-4xl">{value}</dd>
              </div>
            ))}
          </dl>

          <section id="work" className="scroll-mt-6 py-14 md:py-20" aria-labelledby="work-title">
            <h2 id="work-title" className="font-serif text-4xl tracking-tight">Selected work</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="flex flex-col items-start rounded-3xl border border-teal-200 bg-teal-50 p-6 sm:p-8">
                <h3 className="text-xl font-semibold">Healthcare software</h3>
                <p className="mt-3 mb-6 leading-relaxed text-slate-700">My projects include an EMR that connects outpatient, theatre and inpatient workflows, and MediConsult, a telemedicine project for appointment booking and remote consultations.</p>
                <Link href={projects} className={`mt-auto rounded font-semibold text-teal-900 underline underline-offset-4 ${focus}`}>View software projects</Link>
              </article>
              <article className="flex flex-col items-start rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
                <h3 className="text-xl font-semibold">Clinical case portfolio</h3>
                <p className="mt-3 mb-6 leading-relaxed text-slate-700">Explore cases from my obstetric and gynaecological practice, including surgical care.</p>
                <Link href={cases} className={`mt-auto rounded font-semibold text-teal-900 underline underline-offset-4 ${focus}`}>View cases managed</Link>
              </article>
            </div>
          </section>

          <section id="expertise" className="scroll-mt-6 border-t border-stone-200 py-12 md:py-16" aria-labelledby="expertise-title">
            <h2 id="expertise-title" className="font-serif text-4xl tracking-tight">Expertise</h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              {[
                ["Obstetrics and gynaecology", clinicalSkills],
                ["Software development", softwareSkills],
              ].map(([label, skills]) => (
                <div key={label}>
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 marker:text-teal-700">
                    {skills.map((skill) => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-stone-200">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-7 text-sm text-slate-700 sm:px-8">
            <p>© Dr. Saka Shittu</p>
            <a href={github} className={`rounded font-semibold text-teal-900 underline underline-offset-4 ${focus}`}>GitHub profile</a>
          </div>
        </footer>
      </div>
    </>
  )
}
