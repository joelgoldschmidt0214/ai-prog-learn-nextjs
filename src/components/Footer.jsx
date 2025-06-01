// src/components/Footer.jsx
'use client';

export default function Footer() {
  return (
    <footer className="mt-12 text-center text-xs py-4">
      <p>© {new Date().getFullYear()} FastAPI & Next.js Programming Learning Support App</p>
    </footer>
  );
}