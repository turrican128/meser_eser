// Curated Unsplash photos per business category. Each entry is a real Unsplash
// photo URL — no AI generation, no Hebrew-incompatible text munging. We hash
// the contact's banner name so the same contact deterministically gets the
// same image, but different contacts in the same category land on different
// shots.

const u = (id) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

const IMAGE_CATEGORIES = {
  cafe: [
    u('1554118811-1e0d58224f24'),
    u('1495474472287-4d71bcdd2085'),
    u('1453614512568-c4024d13c247'),
  ],
  restaurant: [
    u('1517248135467-4c7edcad34c4'),
    u('1414235077428-338989a2e8c0'),
    u('1555396273-367ea4eb4db5'),
  ],
  tech: [
    u('1517694712202-14dd9538aa97'),
    u('1573497019940-1c28c88b4f3e'),
    u('1551434678-e076c223a692'),
  ],
  fitness: [
    u('1545205597-3d9d02c29597'),
    u('1571902943202-507ec2618e8f'),
    u('1518611012118-696072aa579a'),
  ],
  health: [
    u('1576091160399-112ba8d25d1d'),
    u('1505751172876-fa1923c5c528'),
    u('1631815589968-fdb09a223b1e'),
  ],
  beauty: [
    u('1560750588-73207b1ef5b8'),
    u('1487412947147-5cebf100ffc2'),
    u('1571019613454-1cb2f99b2d8b'),
  ],
  shop: [
    u('1441986300917-64674bd600d8'),
    u('1520975954732-35dd22299614'),
    u('1567401893414-76b7b1e5a7a5'),
  ],
  fashion: [
    u('1483985988355-763728e1935b'),
    u('1490481651871-ab68de25d43d'),
    u('1509631179647-0177331693ae'),
  ],
  real_estate: [
    u('1518780664697-55e3ad937233'),
    u('1564013799919-ab600027ffc6'),
    u('1542314831-068cd1dbfeeb'),
  ],
  education: [
    u('1517486808906-6ca8b3f04846'),
    u('1503676260728-1c00da094a0b'),
    u('1497486751825-1233686d5d80'),
  ],
  travel: [
    u('1488646953014-85cb44e25828'),
    u('1530521954074-e64f6810b32d'),
    u('1516834474-48c0abc2a902'),
  ],
  hotel: [
    u('1566073771259-6a8506099945'),
    u('1551882547-ff40c63fe5fa'),
    u('1582719508461-905c673771fd'),
  ],
  wedding: [
    u('1519741497674-611481863552'),
    u('1591604466107-ec97de577aff'),
    u('1519225421980-715cb0215aed'),
  ],
  photography: [
    u('1502920917128-1aa500764cbd'),
    u('1452587925148-ce544e77e70d'),
    u('1452780212940-6f5c0d14d848'),
  ],
  business: [
    u('1497366216548-37526070297c'),
    u('1497366754035-f200968a6e72'),
    u('1521737604893-d14cc237f11d'),
  ],
  default: [
    u('1497366216548-37526070297c'),
    u('1497366811353-6870744d04b2'),
    u('1486406146926-c627a92ad1ab'),
  ],
};

function hash(str) {
  let h = 5381;
  const s = str || '';
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function buildImageUrl(text, category = 'default') {
  const pool = IMAGE_CATEGORIES[category] || IMAGE_CATEGORIES.default;
  return pool[hash(text) % pool.length];
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
