// src/components/Header.jsx
'use client';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Header({ currentTheme, toggleTheme, initStatusMessage, isBackendReady }) {
  return (
    <header className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-center flex-grow">
          Next.js & FastAPI プログラミング学習サポートアプリ
        </h1>
        <label className="swap swap-rotate btn btn-ghost btn-circle">
          <input
            type="checkbox"
            onChange={toggleTheme}
            checked={currentTheme === 'business'} // 'business' をダークテーマと仮定
            aria-label="テーマ切り替え"
          />
          <SunIcon className="swap-on fill-current w-7 h-7" />
          <MoonIcon className="swap-off fill-current w-7 h-7" />
        </label>
      </div>
      <p className={`text-center mt-2 font-semibold ${isBackendReady ? 'text-success' : 'text-warning'}`}>
        {initStatusMessage}
      </p>
    </header>
  );
}