'use client'
// components/TitleInput.js
const TitleInput = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1">
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 text-right">
        عنوان
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={value}
        onChange={onChange}
        placeholder="عنوان دوره"
        className={`w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 text-right
          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
      />
      {error && <p className="mt-1 text-sm text-red-600 text-right">{error}</p>}
    </div>
  )
}

export default TitleInput
