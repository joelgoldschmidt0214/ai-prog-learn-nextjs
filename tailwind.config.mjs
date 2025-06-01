// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // components ディレクトリを追加
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Noto Sans JP をデフォルトの sans-serif フォントとして設定
        sans: ['var(--font-noto-sans-jp)', 'ui-sans-serif', 'system-ui', /* ...既存のフォールバック... */],
        // mono は必要に応じて設定 (例: Fira Code, JetBrains Monoなど)
        // mono: ['var(--font-geist-mono)', 'ui-monospace', /* ... */],
      },
      // prose クラスのカスタマイズ (DaisyUIのテーマに合わせて調整)
      // typography: (theme) => ({
      //   DEFAULT: { // ライトテーマ用の prose スタイル (主に DaisyUI の corporate に合わせる)
      //     css: {
      //       '--tw-prose-body': theme('colors.base-content'),
      //       '--tw-prose-headings': theme('colors.base-content'),
      //       '--tw-prose-lead': theme('colors.base-content'),
      //       '--tw-prose-links': theme('colors.primary'),
      //       '--tw-prose-bold': theme('colors.base-content'),
      //       '--tw-prose-counters': theme('colors.base-content'),
      //       '--tw-prose-bullets': theme('colors.base-content'),
      //       '--tw-prose-hr': theme('colors.base-300'),
      //       '--tw-prose-quotes': theme('colors.base-content'),
      //       '--tw-prose-quote-borders': theme('colors.primary'),
      //       '--tw-prose-captions': theme('colors.base-content'),
      //       '--tw-prose-code': theme('colors.primary-content'), // インラインコードのテキスト色
      //       '--tw-prose-pre-code': theme('colors.neutral-content'), // ブロックコードのテキスト色
      //       '--tw-prose-pre-bg': theme('colors.neutral'),          // ブロックコードの背景色
      //       '--tw-prose-th-borders': theme('colors.base-300'),
      //       '--tw-prose-td-borders': theme('colors.base-200'),
      //       // ダークテーマ用の反転色はここに定義せず、DaisyUIのテーマに任せるか、
      //       // もしDaisyUIのdarkテーマでproseの色が期待通りでなければ、
      //       // `--tw-prose-invert-body` などを設定します。
      //       // DaisyUIがdata-themeで色を制御するので、通常は上記で十分なはず。

      //       // リストのインデントやマージン調整 (必要であれば)
      //       'ul > li::before': {
      //         backgroundColor: theme('colors.primary'), // DaisyUIのプライマリカラーに合わせる
      //       },
      //       'ol > li::before': {
      //         color: theme('colors.base-content'),
      //       },
      //       'li': {
      //         marginTop: '0.5em',
      //         marginBottom: '0.5em',
      //       },
      //       'ul ul, ul ol, ol ul, ol ol': {
      //         marginTop: '0.5em',
      //         marginBottom: '0.5em',
      //       },
      //        // インラインコードの背景 (proseデフォルトは薄いグレーなので、DaisyUIテーマに合わせる)
      //       ':where(code):not(:where([class~="not-prose"] *))': {
      //         backgroundColor: theme('colors.base-300'), // または primary-content の背景など
      //         padding: '0.2em 0.4em',
      //         borderRadius: theme('borderRadius.sm'),
      //         fontWeight: '500',
      //       },
      //       // pre > code のスタイルを調整 (highlight.js のスタイルと競合しないように)
      //       'pre > code': {
      //         backgroundColor: 'transparent', // pre で背景色を指定するので code 自体は透明に
      //         padding: '0',
      //         borderRadius: '0',
      //         color: 'inherit', // pre の文字色を継承
      //         fontWeight: 'normal',
      //       },
          // },
        // },
        // DaisyUIのダークテーマ(例: business)に合わせたproseスタイルが必要な場合、
        // ここに `dark` バリアント用のスタイルを定義することもできますが、
        // 通常はDaisyUIのテーマがCSS変数を上書きしてくれるはずです。
        // 例:
        // dark: {
        //   css: {
        //     '--tw-prose-body': theme('colors.neutral-content'),
        //     // ...
        //   }
        // }
      // }
    // ),
    },
  },
  // plugins: [
  //   // require('@tailwindcss/typography'), // typography プラグインを先頭に
  //   require('daisyui'),
  // ],
  // daisyui: {
  //   themes: ['corporate', 'business'], // corporateがライト、businessがダークと想定
  //   darkTheme: "business", // DaisyUI v3以降、ダークテーマの指定方法
  //   base: false,
  // },
};

export default config;