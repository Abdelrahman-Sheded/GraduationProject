"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "react-feather";
import styles from "./AnimatedSelect.module.scss";

export default function AnimatedSelect({ list, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);

  // close on outside click
  useEffect(() => {
    const h = (e) => !wrapper.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const current =
    list.find((opt) => String(opt.value) === String(value)) || null;

  return (
    <div className={styles.wrapper} ref={wrapper}>
      {/* trigger */}
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{current ? current.label : placeholder}</span>
        <ChevronDown size={16} className={open ? styles.rot : ""} />
      </button>

      {/* animated dropdown */}
      {open && (
        <ul className={styles.menu}>
          {list.map((opt) => (
            <li
              key={opt.value}
              className={
                String(opt.value) === String(value) ? styles.active : ""
              }
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
