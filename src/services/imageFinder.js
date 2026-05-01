const IMAGE_CATEGORIES = {
  business: 'professional modern business office corporate elegant',
  restaurant: 'elegant restaurant interior food gourmet dining',
  cafe: 'cozy modern coffee shop cafe interior warm',
  shop: 'modern retail store boutique bright interior',
  fashion: 'fashion style boutique clothing elegant modern',
  tech: 'technology innovation futuristic modern clean',
  health: 'health medical wellness clinic professional clean',
  fitness: 'fitness gym modern workout equipment energetic',
  beauty: 'beauty spa salon wellness relaxing elegant',
  real_estate: 'modern real estate house property architecture',
  education: 'education learning modern classroom library',
  travel: 'travel vacation beautiful destination landscape',
  hotel: 'luxury hotel resort modern lobby elegant',
  wedding: 'wedding celebration elegant romantic venue',
  photography: 'professional photography camera studio creative',
  default: 'professional modern business elegant clean abstract',
};

export function buildImageUrl(text, category = 'default') {
  const categoryPrompt = IMAGE_CATEGORIES[category] || IMAGE_CATEGORIES.default;

  // Extract a short English-safe prompt from the text
  const cleanText = text
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 6)
    .join(' ');

  const prompt = cleanText
    ? `${categoryPrompt}, ${cleanText}, photorealistic, high quality, soft lighting`
    : `${categoryPrompt}, photorealistic, high quality, soft lighting`;

  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&nologo=true&seed=${Date.now()}`;
}

export function getImageCategoryOptions() {
  return [
    { value: 'default', label: 'כללי / עסקים' },
    { value: 'business', label: 'עסקים ושירותים' },
    { value: 'restaurant', label: 'מסעדה / אוכל' },
    { value: 'cafe', label: 'בית קפה' },
    { value: 'shop', label: 'חנות / קמעונאות' },
    { value: 'fashion', label: 'אופנה' },
    { value: 'tech', label: 'טכנולוגיה' },
    { value: 'health', label: 'בריאות / רפואה' },
    { value: 'fitness', label: 'כושר / חדר כושר' },
    { value: 'beauty', label: 'יופי / ספא' },
    { value: 'real_estate', label: 'נדל"ן' },
    { value: 'education', label: 'חינוך / לימודים' },
    { value: 'travel', label: 'תיירות / נסיעות' },
    { value: 'hotel', label: 'מלון / אירוח' },
    { value: 'wedding', label: 'אירועים / חתונות' },
    { value: 'photography', label: 'צילום / יצירתי' },
  ];
}
