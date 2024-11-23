// components/comAddCourses/DurationInput.js
import React from 'react'

// تابع تبدیل اعداد فارسی به انگلیسی
const convertPersianToEnglish = (str) => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return str.replace(/[۰-۹]/g, (d) => persianNumbers.indexOf(d))
}

export default function DurationInput({ value, onChange, error, setFormData, setErrors }) {
  return (
    <div className="space-y-1">
      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 text-right">
        مدت زمان دوره (ساعت)
      </label>
      <input
        type="text"
        name="duration"
        id="duration"
        value={value}
        onChange={(e) => {
          const englishValue = convertPersianToEnglish(e.target.value)

          if (englishValue === '' || /^[0-9]+$/.test(englishValue)) {
            setFormData((prev) => ({ ...prev, duration: englishValue }))

            // اعتبارسنجی مدت زمان
            if (englishValue === '' || isNaN(englishValue) || parseInt(englishValue) <= 0) {
              setErrors((prev) => ({ ...prev, duration: 'مدت زمان دوره باید عددی مثبت باشد' }))
            } else {
              setErrors((prev) => ({ ...prev, duration: '' }))
            }
          }
        }}
        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 text-right
          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
        placeholder="مثال: 30"
      />
      {error && <p className="mt-1 text-sm text-red-600 text-right">{error}</p>}
    </div>
  )
}
