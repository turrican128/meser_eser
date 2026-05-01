import { useSearchParams } from 'react-router-dom';
import { useContact } from '../hooks/useContact';
import { expandText } from '../services/textExpander';
import { buildImageUrl } from '../services/imageFinder';
import LeadForm from '../components/LeadForm';
import FeatureCard from '../components/FeatureCard';
import SmartImage from '../components/SmartImage';

export default function LandingPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { contact, loading, error } = useContact(id);

  if (!id) {
    return (
      <CenteredMessage
        title="חסר מזהה דף"
        message="הקישור אינו מכיל מזהה. ודאו שהכתובת כוללת ?id=..."
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-brand-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-brand-800 font-medium">טוען את דף הנחיתה...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <CenteredMessage title="שגיאה בטעינה" message={error} />;
  }

  if (!contact) {
    return <CenteredMessage title="לא נמצא" message="לא נמצא דף נחיתה למזהה הזה." />;
  }

  const bannerName = contact.CustomField1 || '';
  const businessText = contact.CustomField2 || '';
  const providedImageUrl = contact.CustomField3 || '';
  const imageCategory = contact.CustomField4 || 'default';
  const ownerEmail = contact.CustomField5 || contact.EMail || '';
  const ownerName = `${contact.FirstName || ''} ${contact.LastName || ''}`.trim();

  const expandedText = businessText ? expandText(businessText) : null;
  const imageUrl = providedImageUrl || (businessText ? buildImageUrl(businessText, imageCategory) : null);

  const headline = expandedText?.headline || bannerName;
  const intro = expandedText?.intro || businessText;
  const benefits = expandedText?.benefits || [];
  const cta = expandedText?.cta || 'השאירו פרטים ונחזור אליכם בהקדם!';

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
              {bannerName || 'ברוכים הבאים'}
            </h2>
            <div className="w-2 h-2 bg-brand-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-right order-2">
              <div className="inline-block bg-brand-100 text-brand-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                {ownerName ? `בהשקעת ${ownerName}` : 'עכשיו חדש'}
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

            <div className="order-1">
              <SmartImage
                src={imageUrl}
                alt={bannerName}
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
                <FeatureCard title="חיסכון בזמן" desc="פתרונות מהירים ויעילים שחוסכים לכם שעות עבודה יקרות" icon="⏱️" />
                <FeatureCard title="מקצועיות" desc="צוות מנוסה עם ניסיון של שנים בתחום" icon="🎯" />
                <FeatureCard title="תוצאות" desc="לקוחות מרוצים ומספרים שמדברים בעד עצמם" icon="📈" />
                <FeatureCard title="זמינות" desc="זמינים עבורכם בכל עת, מכל מקום ובכל מכשיר" icon="📱" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">מוכנים להתחיל?</h2>
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">דברו איתנו</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{cta}</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2"><span className="text-brand-500">✓</span>תגובה תוך 24 שעות</li>
                <li className="flex items-center gap-2"><span className="text-brand-500">✓</span>ייעוץ ללא עלות וללא התחייבות</li>
                <li className="flex items-center gap-2"><span className="text-brand-500">✓</span>הצעת מחיר מותאמת אישית</li>
              </ul>

              {ownerEmail && (
                <div className="mt-8 p-4 bg-brand-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    או שלחו אימייל ישירות:
                    <br />
                    <a href={`mailto:${ownerEmail}`} className="text-brand-700 font-semibold hover:underline">
                      {ownerEmail}
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
                {ownerName
                  ? `© ${new Date().getFullYear()} ${ownerName}. כל הזכויות שמורות.`
                  : `© ${new Date().getFullYear()} כל הזכויות שמורות.`}
              </p>
            </div>

            {ownerEmail && (
              <div className="text-sm">
                <a href={`mailto:${ownerEmail}`} className="text-brand-400 hover:text-brand-300 transition-colors">
                  {ownerEmail}
                </a>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

function CenteredMessage({ title, message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-brand-800 mb-3">{title}</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
