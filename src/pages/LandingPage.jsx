import { useSearchParams } from 'react-router-dom';
import { useContact } from '../hooks/useContact';
import { expandText } from '../services/textExpander';
import { buildImageUrl, getImageCategoryOptions } from '../services/imageFinder';
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
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-2 border-line border-t-brand-600 rounded-full animate-spin" />
          <p className="text-xs tracking-[0.25em] uppercase text-ink-500" dir="ltr">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (error) return <CenteredMessage title="שגיאה בטעינה" message={error} />;
  if (!contact) return <CenteredMessage title="לא נמצא" message="לא נמצא דף נחיתה למזהה הזה." />;

  const bannerName = contact.CustomField1 || '';
  const businessText = contact.CustomField2 || '';
  const providedImageUrl = contact.CustomField3 || '';
  const imageCategory = contact.CustomField4 || 'default';
  const ownerEmail = contact.CustomField5 || contact.EMail || '';
  const ownerName = `${contact.FirstName || ''} ${contact.LastName || ''}`.trim();

  const expandedText = businessText ? expandText(businessText) : null;
  const imageUrl =
    providedImageUrl || (businessText ? buildImageUrl(bannerName || businessText, imageCategory) : null);

  const headline = expandedText?.headline || bannerName;
  const intro = expandedText?.intro || businessText;
  const benefits = (expandedText?.benefits || []).slice(0, 4);
  const cta = expandedText?.cta || 'השאירו פרטים ונחזור אליכם בהקדם';

  const categoryLabel =
    getImageCategoryOptions().find((o) => o.value === imageCategory)?.label || '';

  return (
    <div className="min-h-screen bg-cream-100 text-ink-900" dir="rtl">
      <SiteHeader bannerName={bannerName} categoryLabel={categoryLabel} />

      <Hero
        headline={headline}
        intro={intro}
        imageUrl={imageUrl}
        bannerName={bannerName}
        ownerName={ownerName}
      />

      <Benefits benefits={benefits} />

      <CtaBand cta={cta} />

      <ContactSection cta={cta} ownerEmail={ownerEmail} />

      <SiteFooter ownerName={ownerName} />
    </div>
  );
}

function SiteHeader({ bannerName, categoryLabel }) {
  return (
    <header className="border-b border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between gap-4">
        <div
          className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-ink-500 font-medium"
          dir="ltr"
        >
          MESER ESER · LANDING
        </div>
        <h2 className="font-serif text-base md:text-lg text-ink-900 truncate">
          {bannerName || 'ברוכים הבאים'}
        </h2>
        <div
          className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-ink-500 font-medium hidden md:block"
          dir="ltr"
        >
          {categoryLabel ? '·' : '01 / 04'}
        </div>
      </div>
    </header>
  );
}

function Hero({ headline, intro, imageUrl, bannerName, ownerName }) {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text — order-2 in RTL puts this on the LEFT visually */}
          <div className="lg:col-span-7 lg:order-2">
            <div className="flex items-center gap-4 mb-8 fade-up" dir="ltr">
              <div className="h-px w-12 bg-brand-600 draw-line" />
              <span className="text-xs tracking-[0.3em] uppercase text-brand-700 font-medium">
                01 — Story
              </span>
            </div>

            <h1
              className="font-serif text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.95] tracking-tight text-ink-900 mb-8 fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              {headline}
            </h1>

            <p
              className="text-lg md:text-xl leading-relaxed text-ink-700 max-w-xl mb-10 fade-up"
              style={{ animationDelay: '0.22s' }}
            >
              {intro}
            </p>

            <div className="fade-up" style={{ animationDelay: '0.34s' }}>
              <a
                href="#lead-form"
                className="group inline-flex items-center gap-3 bg-ink-900 hover:bg-brand-700 text-cream-50 px-8 py-4 transition-all duration-300"
              >
                <span className="text-sm font-medium tracking-wider">השאירו פרטים עכשיו</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:-translate-x-1 rotate-180"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 10h10M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Image — order-1 in RTL puts this on the RIGHT visually */}
          <div
            className="lg:col-span-5 lg:order-1 relative fade-in"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 border-r border-t border-brand-600 -z-0 hidden md:block" />
              <SmartImage
                src={imageUrl}
                alt={bannerName}
                className="relative w-full aspect-[4/5] z-10"
              />
              {ownerName && (
                <div
                  className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 px-4 py-2 bg-cream-100 border border-line text-[10px] md:text-xs tracking-[0.25em] uppercase text-ink-700 z-20"
                  dir="ltr"
                >
                  {ownerName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits({ benefits }) {
  const fallback = [
    { title: 'חיסכון בזמן', desc: 'פתרונות מהירים ויעילים שחוסכים שעות עבודה יקרות.' },
    { title: 'מקצועיות', desc: 'צוות מנוסה עם ניסיון של שנים בתחום, תוצאות מוכחות.' },
    { title: 'תוצאות', desc: 'לקוחות מרוצים ומספרים שמדברים בעד עצמם.' },
    { title: 'זמינות', desc: 'זמינים עבורכם בכל עת, מכל מקום ובכל מכשיר.' },
  ];
  const items = benefits.length > 0 ? benefits : fallback;

  return (
    <section className="border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-baseline justify-between gap-4 mb-14 md:mb-20">
          <div>
            <div
              className="text-xs tracking-[0.3em] uppercase text-brand-700 mb-4 font-medium"
              dir="ltr"
            >
              02 — Why us
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-ink-900 leading-tight">
              למה לבחור בנו?
            </h2>
          </div>
          <div
            className="hidden md:block text-xs tracking-[0.3em] uppercase text-ink-300 font-medium"
            dir="ltr"
          >
            04 values
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          {items.slice(0, 4).map((b, i) => (
            <FeatureCard key={i} index={i + 1} title={b.title} desc={b.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand({ cta }) {
  return (
    <section className="bg-ink-900 text-cream-50 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, var(--color-brand-400) 0%, transparent 50%), radial-gradient(circle at 80% 50%, var(--color-brand-600) 0%, transparent 50%)',
        }}
      />
      <div className="relative max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
        <div
          className="text-xs tracking-[0.3em] uppercase text-brand-300 mb-5 font-medium"
          dir="ltr"
        >
          03 — Take the next step
        </div>
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
          מוכנים להתחיל?
        </h2>
        <p className="text-lg md:text-xl text-ink-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          {cta}
        </p>
        <a
          href="#lead-form"
          className="group inline-flex items-center gap-3 border border-cream-50 hover:bg-cream-50 hover:text-ink-900 px-10 py-4 text-sm font-medium tracking-wider transition-colors duration-300"
        >
          <span>השאירו פרטים</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1 rotate-180"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 10h10M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}

function ContactSection({ cta, ownerEmail }) {
  const promises = [
    'תגובה תוך 24 שעות',
    'ייעוץ ללא עלות וללא התחייבות',
    'הצעת מחיר מותאמת אישית',
  ];

  return (
    <section id="lead-form" className="border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <div
              className="text-xs tracking-[0.3em] uppercase text-brand-700 mb-4 font-medium"
              dir="ltr"
            >
              04 — Contact
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-ink-900 mb-6 leading-tight">
              דברו איתנו
            </h2>
            <p className="text-lg text-ink-700 max-w-lg mb-10 leading-relaxed">{cta}</p>

            <ul className="space-y-0 max-w-md">
              {promises.map((item, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-5 border-t border-line py-5 last:border-b"
                >
                  <span
                    className="font-serif text-2xl text-brand-600 leading-none w-8 shrink-0"
                    dir="ltr"
                  >
                    {`0${i + 1}`}
                  </span>
                  <span className="text-ink-700">{item}</span>
                </li>
              ))}
            </ul>

            {ownerEmail && (
              <div className="mt-12">
                <div
                  className="text-xs tracking-[0.3em] uppercase text-ink-500 mb-3 font-medium"
                  dir="ltr"
                >
                  Direct line
                </div>
                <a
                  href={`mailto:${ownerEmail}`}
                  className="font-serif text-xl md:text-2xl text-ink-900 hover:text-brand-700 transition-colors border-b border-line hover:border-brand-700 pb-1"
                >
                  {ownerEmail}
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter({ ownerName }) {
  return (
    <footer className="border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-ink-500">
          {ownerName
            ? `© ${new Date().getFullYear()} ${ownerName}. כל הזכויות שמורות.`
            : `© ${new Date().getFullYear()} כל הזכויות שמורות.`}
        </div>
        <div
          className="text-[10px] tracking-[0.3em] uppercase text-ink-300 font-medium"
          dir="ltr"
        >
          Powered by Meser Eser
        </div>
      </div>
    </footer>
  );
}

function CenteredMessage({ title, message }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cream-100 px-6"
      dir="rtl"
    >
      <div className="w-full max-w-md text-center">
        <div
          className="text-xs tracking-[0.3em] uppercase text-brand-700 mb-4 font-medium"
          dir="ltr"
        >
          —— Notice ——
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink-900 mb-4">{title}</h1>
        <p className="text-ink-700 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
