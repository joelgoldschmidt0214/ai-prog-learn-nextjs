// src/components/AiResponseDisplay.jsx
'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import QuizSection from './QuizSection'; // QuizSectionをインポート

export default function AiResponseDisplay({
  geminiResponse,
  quizAnswer, setQuizAnswer,
  handleQuizSubmit, isEvaluatingQuiz,
  quizEvaluationResult
}) {
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const handleCopyMarkdown = async () => {
    if (!geminiResponse?.explanation) return;
    try {
      await navigator.clipboard.writeText(geminiResponse.explanation);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch (err) {
      console.error('Markdownのコピーに失敗しました:', err);
      alert('Markdownのコピーに失敗しました。コンソールをご確認ください。');
    }
  };

  if (!geminiResponse) return null;

  return (
    <div className="mt-8 p-4 border border-base-1 rounded-lg bg-base-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">AIからの回答:</h3>
        {geminiResponse.explanation && ( // explanation がある場合のみコピーボタンを表示
          <button
            onClick={handleCopyMarkdown}
            className="btn btn-sm btn-outline"
            disabled={!geminiResponse.explanation}
          >
            {copiedMarkdown ? 'コピーしました!' : 'Markdownをコピー'}
          </button>
        )}
      </div>
      <article className="prose prose-sm max-w-none overflow-x-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={rehypeHighlight ? [rehypeHighlight] : []}
          components={{
            a: ({node, ...props}) => <a className="link link-hover break-all" {...props} target="_blank" rel="noopener noreferrer"/>,
            // pre や code のカスタムレンダリングは、tailwind.config.mjsのtypographyとglobals.cssのhighlight.jsスタイルに依存
          }}
        >
          {geminiResponse.explanation || "解説はありませんでした。"}
        </ReactMarkdown>
      </article>
      
      <QuizSection
        quiz={geminiResponse.quiz}
        quizAnswer={quizAnswer}
        setQuizAnswer={setQuizAnswer}
        handleQuizSubmit={handleQuizSubmit}
        isEvaluatingQuiz={isEvaluatingQuiz}
        quizEvaluationResult={quizEvaluationResult}
      />

      {geminiResponse.references && geminiResponse.references.length > 0 && (
        <div className="mt-6 border-t border-base-300 pt-4">
          <h4 className="font-semibold mb-2">参考文献:</h4>
          <ul className="list-disc list-inside space-y-1">
            {geminiResponse.references.map((ref, index) => (
              <li key={index} className="text-sm">
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="link link-hover link-primary break-all">{ref.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {geminiResponse.raw_gemini_text && (
        <details className="collapse collapse-arrow border border-base-300 bg-base-200 mt-4 text-xs">
          <summary className="collapse-title font-medium">モデルからの生テキストを表示 (デバッグ用)</summary>
          <div className="collapse-content">
            <pre className="mt-1 p-2 bg-neutral text-neutral-content rounded-sm whitespace-pre-wrap break-all overflow-x-auto">
              {geminiResponse.raw_gemini_text}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
}