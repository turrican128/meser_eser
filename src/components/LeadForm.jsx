import { useState } from 'react';
import { createContact } from '../services/api';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  freeText: '',
};

export default function LeadForm() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { kind: 'success' | 'error', message: string }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setStatus({ kind: 'error', message: 'נא למלא את כל שדות החובה' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus({ kind: 'error', message: 'נא להזין כתובת אימייל תקינה' });
      return;
    }

    setSubmitting(true);
    try {
      await createContact({
        FirstName: form.firstName,
        LastName: form.lastName,
        EMail: form.email,
        PhoneNo: form.phone,
        Address: '',
        City: '',
        Zipcode: '',
        ContactListName: '',
        CustomField1: form.freeText,
        CustomField2: '',
        CustomField3: '',
        CustomField4: '',
        CustomField5: '',
      });
      setStatus({ kind: 'success', message: 'הפרטים נשלחו בהצלחה!' });
      setForm(initialForm);
    } catch (err) {
      setStatus({ kind: 'error', message: err.message || 'שליחה נכשלה. נסו שוב.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-xl font-bold text-brand-800 mb-2 text-center">השאירו פרטים</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">נחזור אליכם בהקדם</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="leadFirstName" className="block text-sm font-medium text-gray-700 mb-1">
              שם פרטי <span className="text-red-500">*</span>
            </label>
            <input
              id="leadFirstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="שם פרטי"
            />
          </div>
          <div>
            <label htmlFor="leadLastName" className="block text-sm font-medium text-gray-700 mb-1">
              שם משפחה <span className="text-red-500">*</span>
            </label>
            <input
              id="leadLastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="שם משפחה"
            />
          </div>
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

        {status && (
          <div
            className={`text-sm rounded-lg px-4 py-2.5 ${
              status.kind === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
        >
          {submitting ? 'שולח...' : 'שלח'}
        </button>
      </form>
    </div>
  );
}
