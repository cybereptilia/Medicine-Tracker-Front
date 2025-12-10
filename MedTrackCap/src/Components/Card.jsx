// src/components/Card.jsx
export default function Card({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl bg-white/95 text-slate-800 ring-1 ring-black/5 shadow-md p-5 ${className}`}
    >
      {title && <h2 className="font-semibold text-slate-900 mb-1">{title}</h2>}
      <div className="text-[0.95rem] leading-6 text-slate-600">{children}</div>
    </section>
  );
}
