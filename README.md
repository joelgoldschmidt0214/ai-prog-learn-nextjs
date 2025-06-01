# ai-prog-learn-nextjs

AIを活用してプログラミング学習を支援するためのNext.jsフロントエンドアプリケーションです。  
FastAPIバックエンド（[ai-prog-learn-fastapi](../ai-prog-learn-fastapi/)）と連携し、ユーザーのレベルや目的に合わせて、解説、クイズ、参考文献などを提供します。

## ✨ 主な機能

* **パーソナライズされた学習支援:** 言語・目的・レベル・質問内容を選択し、AIが最適な学習コンテンツを生成
* **クイズ機能:** AIが生成した解説に基づくクイズ出題・採点・フィードバック
* **ファイルアップロード:** 学習に関連するファイルをアップロードし、AIが内容を解析
* **ダーク/ライトテーマ切替:** DaisyUIによるテーマ切替に対応
* **APIエンドポイントの柔軟な設定:** `.env.local` でバックエンドURLを切り替え可能

## 🚀 技術スタック

* **フロントエンド:** Next.js, React, Tailwind CSS, DaisyUI
* **マークダウン表示:** react-markdown, rehype-highlight, remark-gfm
* **アイコン:** Heroicons

## 🛠️ セットアップと実行方法

### 1. 前提条件

* Node.js 18以上推奨
* npm

### 2. リポジトリのクローン

```bash
git clone https://github.com/joelgoldschmidt0214/ai-prog-learn-nextjs.git
cd ai-prog-learn-nextjs
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 環境変数の設定

`.env.local` ファイルを作成し、FastAPIバックエンドのURLを設定します。

```env
NEXT_PUBLIC_API_ENDPOINT=http://127.0.0.1:8000
```

### 5. アプリケーションの実行

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## 🌐 主な画面・機能

* **トップページ:** 言語・目的・レベル・質問内容を入力し、AIにリクエスト
* **AIからの回答:** 解説・クイズ・参考文献をマークダウン形式で表示
* **クイズ:** 回答を入力し、AIによる自動採点・フィードバックを受け取る
* **ファイルアップロード:** テキストやノートブック等をAIに解析させる

## ⚙️ 設定変数

* `NEXT_PUBLIC_API_ENDPOINT`: バックエンドAPIのエンドポイントURL（.env.localで指定）

## 🤝 コントリビューション

バグ報告・機能提案・プルリクエスト歓迎です！

## 📝 ライセンス

このプロジェクトは **MIT License** の下で公開されています。
