// src/components/QuizSection.jsx
'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function QuizSection({
  quiz,
  quizAnswer, setQuizAnswer,
  handleQuizSubmit, isEvaluatingQuiz,
  quizEvaluationResult
}) {
  if (!quiz?.question) return null;

  // 採点結果に基づいて alert のタイプとアイコンを決定
  let alertType = '';
  let AlertIcon = null; // アイコンコンポーネントを格納する変数

  if (quizEvaluationResult) {
    const resultText = quizEvaluationResult.toLowerCase();
    if (resultText.includes("採点結果：正解")) {
      alertType = "alert-success";
      AlertIcon = <CheckCircleIcon className="stroke-current shrink-0 h-6 w-6" />;
    } else if (resultText.includes("採点結果：惜しい")) {
      alertType = "alert-warning";
      AlertIcon = <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6" />;
    } else if (resultText.includes("採点結果：不正解") || resultText.includes("採点結果：誤り")) {
      alertType = "alert-error";
      AlertIcon = <XCircleIcon className="stroke-current shrink-0 h-6 w-6" />;
    } else {
      // 上記以外の場合（例えばエラーメッセージなど）はデフォルトでwarning表示など
      alertType = "alert-info"; // または "alert-warning"
      AlertIcon = <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6" />;
    }
  }

  return (
    <div className="mt-6 border-t border-base-300 pt-4">
      <h4 className="font-semibold mb-2">理解度チェッククイズ:</h4>
      <p className="mb-3 whitespace-pre-wrap break-words">{quiz.question}</p>
      <form onSubmit={handleQuizSubmit} className="space-y-3">
        <div className="form-control w-full">
          <label className="label" htmlFor="quizAnswer"><span className="label-text">あなたの答え:</span></label>
          <input type="text" id="quizAnswer" value={quizAnswer} onChange={(e) => setQuizAnswer(e.target.value)} className="input input-bordered w-full" placeholder="答えを入力してください"/>
        </div>
        <button type="submit" disabled={isEvaluatingQuiz} className={`btn btn-success btn-sm ${isEvaluatingQuiz ? 'btn-disabled' : ''}`}>
          {isEvaluatingQuiz ? <span className="loading loading-spinner loading-xs"></span> : ''}
          {isEvaluatingQuiz ? '採点中...' : '答えを送信して採点'}
        </button>
      </form>
      {quizEvaluationResult && alertType && AlertIcon && ( // alertTypeとAlertIconが設定されている場合のみ表示
        <div role="alert" className={`alert mt-4 ${alertType}`}>
          {AlertIcon} {/* 動的に選択されたアイコンを表示 */}
          <div className={`w-full ${alertType}`}> {/* 背景色と文字色を確実に適用 */}
            {/* <h5 className="font-semibold mb-1">採点結果:</h5> */}
            <article className="prose prose-xs max-w-none text-gray-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {quizEvaluationResult}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}