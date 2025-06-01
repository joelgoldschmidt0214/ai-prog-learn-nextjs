// src/app/ThemeProvider.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';

export default function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light'); // デフォルトテーマ

  // ページ読み込み時にlocalStorageからテーマを取得し、htmlタグに設定
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    // システムのテーマ設定を優先するか、固定のデフォルトテーマを使うか選択
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // const initialTheme = storedTheme || (prefersDark ? 'business' : 'corporate');
    const initialTheme = storedTheme || 'corporate'; // corporate をライトのデフォルトとする

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    setMounted(true); // マウント後にテーマ設定が完了したことを示す
  }, []);

  // mountedされるまで実際のコンテンツをレンダリングしないことでちらつきを防ぐ
  if (!mounted) {
    return null; // またはローディングスピナーなどを表示
  }

  return <>{children}</>;
}