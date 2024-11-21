'use client'
import { useEffect, useRef } from 'react'
import Typed from 'typed.js'

const TypedComponent = () => {
  const el = useRef(null)

  useEffect(() => {
    const options = {
      strings: ['', 'میتوانیم ', 'بهترینم ', 'درس میخوانیم ', 'حرفه‌‌ای میشویم '],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
      cursorChar: '|',
    }

    // Initialize Typed.js
    const typed = new Typed(el.current, options)

    // Cleanup function to destroy instance on unmount
    return () => {
      typed.destroy()
    }
  }, [])

  return <span ref={el} className="inline-block typed-text"></span>
}

export default TypedComponent
