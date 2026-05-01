import { useBuilder } from '../context/BuilderContext';
import LeadForm from '../components/LeadForm';
import FeatureCard from '../components/FeatureCard';
import SmartImage from '../components/SmartImage';

export default function LandingPage() {
  const { data } = useBuilder();

  const headline = data.expandedText?.headline || data.bannerName;
  const intro = data.expandedText?.intro || data.freeText;
  const benefits = data.expandedText?.benefits || [];
  const cta = data.expandedText?.cta || 'השאירו פרטים ונחזור אליכם בהקדם!';

  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">
      {/* Decorative top gradient blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200 rounded-full blur-3xl opacity-30 -z-10 translate-x-1/3 -translate-y-1/3"></div>

      {/* Banner */}
      <header className="bg-gradient-to-l from-brand-700 to-brand-600 text-white py-4 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-brand-300 rounded-full animate-pulse"></div>
            <h2 className="text-base md:text-lg font-semibold tracking-wide">
              {data.bannerName || 'ברוכים הבאים'}
            </h2>
            <div className="w-2 h-2 bg-brand-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Text — on the LEFT in RTL (order-2) */}
            <div className="text-right order-2">
              <div className="inline-block bg-brand-100 text-brand-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                {data.ownerName ? `בהשקעת ${data.ownerName}` : 'עכשיו חדש'}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                {headline}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
                {intro}
              </p>
              <a
                href="#lead-form"
                className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                השאירו פרטים עכשיו
              </a>
            </div>

            {/* Image — on the RIGHT in RTL (order-1) */}
            <div className="order-1">
              <SmartImage
                src={data.imageUrl}
                alt={data.bannerName}
                className="w-full h-64 md:h-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-gray-200" />
      </div>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              למה לבחור בנו?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              הנה כמה סיבות טובות להתחיל איתנו כבר היום
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.length > 0 ? (
              benefits.map((b, i) => (
                <FeatureCard
                  key={i}
                  title={b.title}
                  desc={b.desc}
                  icon={['⏱️', '🎯', '📈', '📱'][i % 4]}
                />
              ))
            ) : (
              <>
                <FeatureCard
                  title="חיסכון בזמן"
                  desc="פתרונות מהירים ויעילים שחוסכים לכם שעות עבודה יקרות"
                  icon="⏱️"
                />
                <FeatureCard
                  title="מקצועיות"
                  desc="צוות מנוסה עם ניסיון של שנים בתחום"
                  icon="🎯"
                />
                <FeatureCard
                  title="תוצאות"
                  desc="לקוחות מרוצים ומספרים שמדברים בעד עצמם"
                  icon="📈"
                />
                <FeatureCard
                  title="זמינות"
                  desc="זמינים עבורכם בכל עת, מכל מקום ובכל מכשיר"
                  icon="📱"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            מוכנים להתחיל?
          </h2>
          <p className="text-brand-100 text-lg mb-8">{cta}</p>
          <a
            href="#lead-form"
            className="inline-block bg-white text-brand-700 hover:bg-brand-50 font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
          >
            השאירו פרטים
          </a>
        </div>
      </section>

      {/* Lead Form Section */}
      <section id="lead-form" className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="text-right">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                דברו איתנו
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {cta}
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-brand-500">✓</span>
                  תגובה תוך 24 שעות
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-500">✓</span>
                  ייעוץ ללא עלות וללא התחייבות
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-500">✓</span>
                  הצעת מחיר מותאמת אישית
                </li>
              </ul>

              {data.ownerEmail && (
                <div className="mt-8 p-4 bg-brand-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    או שלחו אימייל ישירות:
                    <br />
                    <a
                      href={`mailto:${data.ownerEmail}`}
                      className="text-brand-700 font-semibold hover:underline"
                    >
                      {data.ownerEmail}
                    </a>
                  </p>
                </div>
              )}
            </div>

            <LeadForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-right">
              <p className="text-sm">
                {data.ownerName
                  ? `© ${new Date().getFullYear()} ${data.ownerName}. כל הזכויות שמורות.`
                  : `© ${new Date().getFullYear()} כל הזכויות שמורות.`}
              </p>
            </div>

            {data.ownerEmail && (
              <div className="text-sm">
                <a
                  href={`mailto:${data.ownerEmail}`}
                  className="text-brand-400 hover:text-brand-300 transition-colors"
                >
                  {data.ownerEmail}
                </a>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
