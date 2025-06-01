// src/app/layout.jsx
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./ThemeProvider"; // 後で作成するテーマプロバイダー

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext'], // 利用可能なサブセットに変更 (日本語グリフはこれらでカバーされる)
  display: 'swap',
  variable: "--font-noto-sans-jp",
});

export const metadata = {
  title: "AIプログラミング学習サポート",
  description: "AIと一緒にプログラミングを学ぼう",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable}`} data-theme="corporate">
      {/*
        ThemeProviderで囲むことで、クライアントサイドでのテーマ初期化の
        ちらつき (FOUC) を防ぎ、Hydration Error のリスクを低減できます。
        data-theme属性はThemeProvider内で動的に設定されます。
      */}
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}