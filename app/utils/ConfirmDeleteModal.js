// components/ConfirmDeleteModal.js
import React from 'react'

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div dir="rtl" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 sm:w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">تأیید حذف</h2>
        <p className="text-gray-600 mb-4">آیا مطمئن هستید که می‌خواهید این دوره را حذف کنید؟</p>
        <div dir="ltr" className="flex justify-end space-x-2 gap-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
          >
            لغو
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
