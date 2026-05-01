export default function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow text-right">
      <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
        {icon}
      </div>
      <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
