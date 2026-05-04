export default function FeatureCard({ index, title, desc }) {
  const numeral = String(index ?? 1).padStart(2, '0');
  return (
    <div className="bg-cream-100 hover:bg-cream-50 transition-colors duration-300 p-8 lg:p-10 text-right group">
      <div className="flex items-baseline justify-between mb-8">
        <span
          className="font-serif text-3xl text-brand-600 leading-none transition-transform duration-300 group-hover:-translate-x-1"
          dir="ltr"
        >
          {numeral}
        </span>
        <div className="h-px w-12 bg-line group-hover:bg-brand-300 transition-colors duration-300" />
      </div>
      <h4 className="font-serif text-xl md:text-2xl text-ink-900 mb-3 leading-snug">{title}</h4>
      <p className="text-sm text-ink-700 leading-relaxed">{desc}</p>
    </div>
  );
}
