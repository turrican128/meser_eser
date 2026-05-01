import { useState } from 'react';

export default function LeadForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    freeText: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert('נא למלא את כל שדות החובה');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('נא להזין כתובת אימייל תקינה');
      return;
    }
    console.log('Lead captured:', form);
    alert('הפרטים נשלחו בהצלחה! (נבדקו בקונסול)');
    setForm({ name: '', email: '', phone: '', freeText: '' });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-xl font-bold text-brand-800 mb-2 text-center">השאירו פרטים</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">נחזור אליכם בהקדם</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="leadName" className="block text-sm font-medium text-gray-700 mb-1">
            שם מלא <span className="text-red-500">*</span>
          </label>
          <input
            id="leadName"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            placeholder="השם המלא שלך"
          />
        </div>

        <div>
          <label htmlFor="leadEmail" className="block text-sm font-medium text-gray-700 mb-1">
            אימייל <span className="text-red-500">*</span>
          </label>
          <input
            id="leadEmail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="leadPhone" className="block text-sm font-medium text-gray-700 mb-1">
            טלפון <span className="text-red-500">*</span>
          </label>
          <input
            id="leadPhone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            placeholder="050-1234567"
          />
        </div>

        <div>
          <label htmlFor="leadFreeText" className="block text-sm font-medium text-gray-700 mb-1">
            הודעה חופשית
          </label>
          <textarea
            id="leadFreeText"
            name="freeText"
            rows={3}
            value={form.freeText}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none"
            placeholder="כתוב כאן כל הודעה או בקשה..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
        >
          שלח
        </button>
      </form>
    </div>
  );
}
