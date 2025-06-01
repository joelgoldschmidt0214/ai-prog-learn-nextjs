// src/components/QuizSection.jsx
'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function QuizSection({
  quiz,
  quizAnswer, setQuizAnswer,
  handleQuizSubmit, isEvaluatingQuiz,
  quizEvaluationResult
}) {
  if (!quiz?.question) return null;

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
      {quizEvaluationResult && (
        <div role="alert" className={`alert mt-4 ${quizEvaluationResult.toLowerCase().includes("正解") || quizEvaluationResult.toLowerCase().includes("素晴らしい") ? "alert-success" : "alert-warning"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            {quizEvaluationResult.toLowerCase().includes("正解") || quizEvaluationResult.toLowerCase().includes("素晴らしい")
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
          </svg>
          <div>
            <h5 className="font-semibold mb-1">採点結果:</h5>
            <article className="prose prose-xs max-w-none">
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