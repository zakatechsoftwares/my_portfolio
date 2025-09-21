export default function CaseStudy({title, summary, tags, impact, repo}){
  return (
    <article className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-slate-700 mt-2">{summary}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map(t => (
              <span key={t} className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">{t}</span>
            ))}
          </div>
        </div>

        <div className="text-right text-sm text-slate-500">
          <div>{impact}</div>
          <a href={repo} className="mt-2 inline-block text-slate-700 hover:underline">View repo</a>
        </div>
      </div>
    </article>
  )
}
