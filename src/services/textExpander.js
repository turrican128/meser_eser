const hebrewTemplates = {
  headline: (topic) => [
    `${topic} — הפתרון המושלם בשבילך`,
    `גלה את ${topic} כמו שלא הכרת`,
    `${topic}: המומחים מספרים איך להתחיל`,
    `הדרך החכמה ל${topic}`,
    `כל מה שצריך לדעת על ${topic}`,
  ],
  intro: (topic) => [
    `אנחנו מאמינים ש${topic} צריך להיות פשוט, נגיש ומותאם אישית לכל אחד. המשימה שלנו היא לספק לך את הכלים, הידע והליווי המקצועי כדי שתוכל לקבל את ההחלטות הטובות ביותר — בביטחון מלא.`,
    `העולם של ${topic} מתפתח בקצב מסחרר, ואנחנו כאן כדי לוודא שלא תפספסו שום הזדמנות. הצוות שלנו מורכב ממומחים עם ניסיון של שנים, שמביאים איתם תובנות עמוקות וגישה אישית לכל לקוח.`,
    `אם חיפשתם דרך חדשנית ואפקטיבית ל${topic}, הגעתם למקום הנכון. אנחנו משלבים טכנולוגיה מתקדמת עם שירות אנושי וחם — כדי שתרגישו בבית כבר מהרגע הראשון.`,
  ],
  benefits: (topic) => [
    {
      title: 'חיסכון בזמן',
      desc: `עם המערכת החכמה שלנו ל${topic}, תוכלו להשיג תוצאות בקצרה — בלי בזבוז זמן יקר על תהליכים מיותרים.`,
    },
    {
      title: 'מקצועיות ללא פשרות',
      desc: `צוות המומחים שלנו מלווה אתכם בכל שלב בתהליך ה${topic}, עם ייעוץ אישי ופתרונות מותאמים בדיוק לצרכים שלכם.`,
    },
    {
      title: 'תוצאות מוכחות',
      desc: `למעלה מאלף לקוחות כבר בחרו בנו ל${topic} — והמספרים מדברים בעד עצמם. הצטרפו למעגל המרוצים.`,
    },
    {
      title: 'נגישות מלאה',
      desc: `השירות שלנו זמין עבורכם 24/7, מכל מכשיר ובכל מקום. ${topic} עכשיו נגיש יותר מתמיד.`,
    },
  ],
  cta: (topic) => [
    `רוצים לקבל עוד מידע על ${topic}? השאירו פרטים ונחזור אליכם בהקדם עם הצעה מותאמת אישית.`,
    `ההזדמנות שלכם ל${topic} מחכה כאן. מלאו את הטופס ונציג שלנו יצור קשר תוך שעות ספורות.`,
    `אל תחמיצו — ${topic} הפך פשוט יותר מאי פעם. השאירו פרטים ונתחיל יחד.`,
  ],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function extractKeywords(text) {
  // Simple keyword extraction: take the first 3-5 meaningful words
  const words = text
    .replace(/[^֐-׿\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
  return words.slice(0, 5).join(' ') || text.slice(0, 30);
}

export function expandText(originalText) {
  const topic = extractKeywords(originalText);

  return {
    headline: pickRandom(hebrewTemplates.headline(topic)),
    intro: pickRandom(hebrewTemplates.intro(topic)),
    benefits: hebrewTemplates.benefits(topic),
    cta: pickRandom(hebrewTemplates.cta(topic)),
    raw: originalText,
  };
}
