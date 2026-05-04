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
  const [status, setStatus] = useState(null);

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
      setStatus({ kind: 'success', message: 'הפרטים נשלחו. נחזור אליכם בהקדם.' });
      setForm(initialForm);
    } catch (err) {
      setStatus({ kind: 'error', message: err.message || 'שליחה נכשלה. נסו שוב.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream-50 border border-line p-8 md:p-10">
      <div className="mb-8">
        <div
          className="text-xs tracking-[0.3em] uppercase text-brand-700 mb-2 font-medium"
          dir="ltr"
        >
          The form
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-ink-900">השאירו פרטים</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-5">
          <Field
            id="leadFirstName"
            name="firstName"
            label="שם פרטי"
            required
            value={form.firstName}
            onChange={handleChange}
            placeholder="שם פרטי"
          />
          <Field
            id="leadLastName"
            name="lastName"
            label="שם משפחה"
            required
            value={form.lastName}
            onChange={handleChange}
            placeholder="שם משפחה"
          />
        </div>

        <Field
          id="leadEmail"
          name="email"
          type="email"
          label="אימייל"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          dir="ltr"
        />

        <Field
          id="leadPhone"
          name="phone"
          type="tel"
          label="טלפון"
          required
          value={form.phone}
          onChange={handleChange}
          placeholder="050-1234567"
          dir="ltr"
        />

        <Field
          id="leadFreeText"
          name="freeText"
          label="הודעה (אופציונלי)"
          value={form.freeText}
          onChange={handleChange}
          placeholder="כתוב כאן כל הודעה או בקשה..."
          textarea
        />

        {status && (
          <div
            className={`text-sm px-4 py-3 border ${
              status.kind === 'success'
                ? 'bg-cream-100 text-ink-900 border-brand-300'
                : 'bg-cream-100 text-brand-800 border-brand-400'
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group w-full bg-ink-900 hover:bg-brand-700 disabled:bg-ink-500 text-cream-50 px-8 py-4 transition-colors duration-300 flex items-center justify-center gap-3"
        >
          <span className="text-sm font-medium tracking-wider">
            {submitting ? 'שולח...' : 'שלח'}
          </span>
          {!submitting && (
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1 rotate-180"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 10h10M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

function Field({
  id,
  name,
  type = 'text',
  label,
  required,
  value,
  onChange,
  placeholder,
  textarea,
  dir,
}) {
  const inputCls =
    'w-full bg-transparent border-0 border-b border-line focus:border-brand-600 focus:outline-none focus:ring-0 px-0 py-3 text-ink-900 placeholder:text-ink-300 transition-colors';

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[10px] tracking-[0.3em] uppercase text-ink-500 mb-2 font-medium"
        dir="ltr"
      >
        {label}
        {required && <span className="text-brand-600 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={dir}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          dir={dir}
          className={inputCls}
        />
      )}
    </div>
  );
}
