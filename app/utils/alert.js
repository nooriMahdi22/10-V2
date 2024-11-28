'use client'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export const handleAlertSuccess = (text) => {
  toast.success(text, {
    className: ' ',
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })
}

export const handleAlertinfo = (text) => {
  toast.info(text, {
    className: ' ',
    position: 'bottom-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })
}

export const handleAlertinfoTop = (text) => {
  toast.info(text, {
    className: ' ',
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })
}

export const Toust = (
  <ToastContainer
    className=" "
    position="top-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={true}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
)

//********************* */ very goooooooooood cooooooooooooooode*******************
// ToastNotifications.js

// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// تابع عمومی برای نمایش توست
export const showToast = (type = 'info', message, options = {}) => {
  const defaultOptions = {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  }

  const combinedOptions = { ...defaultOptions, ...options }

  switch (type) {
    case 'success':
      toast.success(message, combinedOptions)
      break
    case 'error':
      toast.error(message, combinedOptions)
      break
    case 'info':
      toast.info(message, combinedOptions)
      break
    case 'warning':
      toast.warn(message, combinedOptions)
      break
    default:
      toast(message, combinedOptions)
  }
}

// کامپوننت ToastContainer برای استفاده در اپلیکیشن
export const ToastNotifications = () => (
  <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={true}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
)

// * مقادیری که میتونیم براش ست کنیم و شخصی سازی کنیم
// ?کجا باید تغییر ایجاد کنیم
// ! در تابع
// ! showToast
// ! باید تغییر ایجاد کنیم

//* موقعیت نمایش توست. مقادیر ممکن
// position: 'top-left'
// ;('top-center')
// ;('top-right')
// ;('bottom-left')
// ;('bottom-center')
// ;('bottom-right')

//*     مدت زمان (به میلی‌ثانیه) که توست به صورت خودکار بسته می‌شود. مقدار
// *     false به معنای عدم بستن خودکار است.
// autoClose:

// * اگر  باشد، نوار پیشرفت نمایش داده نمی‌شود.
// * 🔝 true
// hideProgressBar

// * اگر  باشد، جدیدترین توست‌ها در بالای لیست قرار می‌گیرند.
// * 🔝 true
// newestOnTop

// *  اگر  باشد، توست با کلیک بر روی آن بسته می‌شود.
// * 🔝 true
// closeOnClick

//* اگر  باشد، متن توست به صورت راست‌چین نمایش داده می‌شود.
// * 🔝 true
// rtl

//* اگر true باشد، توست هنگام از دست دادن تمرکز (focus) متوقف می‌شود.
// * 🔝 true
// pauseOnFocusLoss

//* اگر true باشد، کاربران می‌توانند توست را بکشند و رها کنند.
// draggable

//* اگر true باشد، توست هنگام قرار گرفتن ماوس روی آن متوقف می‌شود.
// pauseOnHover

//* تم ظاهری توست. مقادیر ممکن:
//* "light"
//* "dark"
// theme
