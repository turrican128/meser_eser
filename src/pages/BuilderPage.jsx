import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../context/BuilderContext';
import { expandText } from '../services/textExpander';
import { buildImageUrl, getImageCategoryOptions } from '../services/imageFinder';

export default function BuilderPage() {
  const navigate = useNavigate();
  const { updateData } = useBuilder();

  const [form, setForm] = useState({
    bannerName: '',
    freeText: '',
    ownerName: '',
    ownerEmail: '',
    useAI: true,
    useImage: true,
    imageCategory: 'default',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bannerName || !form.freeText || !form.ownerName || !form.ownerEmail) {
      alert('נא למלא את כל השדות');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.ownerEmail)) {
      alert('נא להזין כתובת אימייל תקינה');
      return;
    }

    setLoading(true);

    let expandedText = null;
    let imageUrl = null;

    try {
      if (form.useAI) {
        expandedText = expandText(form.freeText);
      }
      if (form.useImage) {
        imageUrl = buildImageUrl(form.freeText, form.imageCategory);
      }
    } catch (err) {
      console.warn('Expansion failed:', err);
    }

    updateData({
      bannerName: form.bannerName,
      freeText: form.freeText,
      ownerName: form.ownerName,
      ownerEmail: form.ownerEmail,
      useAI: form.useAI,
      useImage: form.useImage,
      imageCategory: form.imageCategory,
      expandedText,
      imageUrl,
    });

    setLoading(false);
    navigate('/landing');
  };

  const categoryOptions = getImageCategoryOptions();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-brand-800 mb-2 text-center">
          בניית דף נחיתה
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          מלאו את הפרטים וניצור עבורכם דף נחיתה מקצועי
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="bannerName" className="block text-sm font-medium text-gray-700 mb-1">
              שם הבאנר
            </label>
            <input
              id="bannerName"
              name="bannerName"
              type="text"
              value={form.bannerName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="לדוגמה: מבצע קיץ 2026"
            />
          </div>

          <div>
            <label htmlFor="freeText" className="block text-sm font-medium text-gray-700 mb-1">
              תיאור העסק / טקסט חופשי
            </label>
            <textarea
              id="freeText"
              name="freeText"
              rows={4}
              value={form.freeText}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none"
              placeholder="תארו בקצרה את העסק או השירות — ואנחנו נרחיב את זה לדף מכירה מלא"
            />
            <p className="text-xs text-gray-400 mt-1">
              טיפ: ככל שתפרטו יותר, התוצאה תהיה מדויקת יותר
            </p>
          </div>

          <div className="flex items-center gap-3 bg-brand-50 rounded-lg p-3">
            <input
              id="useAI"
              name="useAI"
              type="checkbox"
              checked={form.useAI}
              onChange={handleChange}
              className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
            />
            <label htmlFor="useAI" className="text-sm text-gray-700 cursor-pointer flex-1">
              <span className="font-semibold">הרחב את הטקסט באופן אוטומטי</span>
              <br />
              <span className="text-xs text-gray-500">ניצור עבורכם כותרת, הסבר מפורט וסעיפי יתרונות</span>
            </label>
          </div>

          <div className="flex items-center gap-3 bg-brand-50 rounded-lg p-3">
            <input
              id="useImage"
              name="useImage"
              type="checkbox"
              checked={form.useImage}
              onChange={handleChange}
              className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
            />
            <label htmlFor="useImage" className="text-sm text-gray-700 cursor-pointer flex-1">
              <span className="font-semibold">הוסף תמונה רלוונטית</span>
              <br />
              <span className="text-xs text-gray-500">ניצור תמונה באמצעות בינה מלאכותית לפי תיאור העסק</span>
            </label>
          </div>

          {form.useImage && (
            <div>
              <label htmlFor="imageCategory" className="block text-sm font-medium text-gray-700 mb-1">
                סוג תמונה
              </label>
              <select
                id="imageCategory"
                name="imageCategory"
                value={form.imageCategory}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                id="ownerName"
                name="ownerName"
                type="text"
                value={form.ownerName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="השם שלך"
              />
            </div>

            <div>
              <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                אימייל
              </label>
              <input
                id="ownerEmail"
                name="ownerEmail"
                type="email"
                value={form.ownerEmail}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                יוצר את הדף...
              </>
            ) : (
              'צור דף נחיתה'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
