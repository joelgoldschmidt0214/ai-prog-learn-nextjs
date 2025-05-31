'use client';
import { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // ダークテーマ用ハイライト (github.css から変更)
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [initStatusMessage, setInitStatusMessage] = useState('バックエンドの初期化状態を確認中...');
  const [isBackendReady, setIsBackendReady] = useState(false);
  // const [getMessage, setGetMessage] = useState('');
  // const [multiplyNumber, setMultiplyNumber] = useState('');
  // const [multiplyResult, setMultiplyResult] = useState('');
  // const [devideNumber, setDevideNumber] = useState('');
  // const [devideResult, setDevideResult] = useState('');
  // const [countString, setCountString] = useState('');
  // const [countResult, setCountResult] = useState('');
  // const [postMessage, setPostMessage] = useState('');
  // const [postResult, setPostResult] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [selectedGoal, setSelectedGoal] = useState('プログラミング学習');
  const [selectedLevel, setSelectedLevel] = useState('初学者');
  const [problemDetails, setProblemDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [geminiError, setGeminiError] = useState('');
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizEvaluationResult, setQuizEvaluationResult] = useState('');
  const [isEvaluatingQuiz, setIsEvaluatingQuiz] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    // highlight.jsのテーマも動的に変更 (オプション)
    const highlightLink = document.querySelector('link[href*="highlight.js"]');
    if (highlightLink) {
      highlightLink.href = savedTheme === 'dark'
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    // highlight.jsのテーマも動的に変更 (オプション)
    const highlightLink = document.querySelector('link[href*="highlight.js"]');
    if (highlightLink) {
      highlightLink.href = newTheme === 'dark'
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    }
  };

  const getDisplayErrorMessage = useCallback(async (response, defaultMessage = "リクエスト処理中にエラーが発生しました。") => {
    try {
      const errorData = await response.clone().json();
      if (errorData && errorData.detail) {
        switch (errorData.detail) {
          case "GEMINI_INITIALIZING": return "モデルが初期化中です。しばらくしてから再試行してください。";
          case "GEMINI_UNAVAILABLE": return "モデルが現在利用できません。サーバー管理者に連絡してください。";
          case "BLOCKED_PROMPT": return "リクエスト内容に問題があり、処理できませんでした。入力内容を確認してください。";
          case "API_TIMEOUT": return "処理がタイムアウトしました。時間を置いて再試行してください。";
          case "INTERNAL_SERVER_ERROR": return "サーバー内部でエラーが発生しました。しばらくしてから再試行してください。";
          default: return `エラー: ${errorData.detail} (ステータス: ${response.status})`;
        }
      }
    } catch (e) { console.error("Error parsing error response:", e); }
    if (response.status) { return `${defaultMessage} (ステータス: ${response.status})`; }
    return defaultMessage;
  }, []);

  const checkBackendInitialization = useCallback(async () => {
    setInitStatusMessage('バックエンドの初期化状態を確認しています...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/gemini/status`, { cache: "no-cache" });
      if (!response.ok) {
        const errorMsg = await getDisplayErrorMessage(response, "初期化状態の確認に失敗しました。");
        throw new Error(errorMsg);
      }
      const data = await response.json();
      if (data.is_initializing) {
        setInitStatusMessage('バックエンドは現在初期化処理中です。5秒後に再確認します...');
        setIsBackendReady(false);
        setTimeout(checkBackendInitialization, 5000);
      } else if (data.initialized && data.model_ready) {
        setInitStatusMessage('バックエンドのGeminiモデルは準備完了です！');
        setIsBackendReady(true);
      } else {
        setInitStatusMessage('バックエンドのGeminiモデルの初期化に失敗したか、まだ完了していません。');
        setIsBackendReady(false);
      }
    } catch (error) {
      setInitStatusMessage(`初期化状態確認エラー: ${error.message}`);
      setIsBackendReady(false);
    }
  }, [getDisplayErrorMessage]);

  useEffect(() => { checkBackendInitialization(); }, [checkBackendInitialization]);

  const handleApiRequest = async (setter, url, errorMessagePrefix, processData, body = null) => {
    setter("処理中...");
    try {
      const options = body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {};
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(await getDisplayErrorMessage(response, `${errorMessagePrefix}リクエストに失敗しました。`));
      const data = await response.json();
      setter(processData(data));
    } catch (error) {
      setter(error.message);
    }
  };

  // const handleGetRequest = () => handleApiRequest(setGetMessage, `${API_BASE_URL}/api/hello`, "GET ", data => `サーバーからのGET応答: ${data.greeting}`);
  // const handleMultiplyRequest = () => {
  //   if (!multiplyNumber) { setMultiplyResult("数値を入力してください。"); return; }
  //   handleApiRequest(setMultiplyResult, `${API_BASE_URL}/api/multiply/${multiplyNumber}`, "数値2倍 ", data => `入力値 ${data.input_value} の2倍は ${data.doubled_value} です。`);
  // };
  // const handleDevideRequest = () => {
  //   if (!devideNumber) { setDevideResult("数値を入力してください。"); return; }
  //   handleApiRequest(setDevideResult, `${API_BASE_URL}/api/half/${devideNumber}`, "数値半減 ", data => `入力値 ${data.input_value} の半分は ${data.halfed_value} です。`);
  // };
  // const handleCountRequest = () => {
  //   if (!countString) { setCountResult("文字列を入力してください。"); return; }
  //   handleApiRequest(setCountResult, `${API_BASE_URL}/api/count/${countString}`, "文字数カウント ", data => `「${data.input_string}」の文字数は ${data.count_value} です。`);
  // };
  // const handlePostRequest = () => {
  //   if (!postMessage) { setPostResult("メッセージを入力してください。"); return; }
  //   handleApiRequest(setPostResult, `${API_BASE_URL}/api/echo`, "POST ", data => `サーバーからのエコー: ${data.echoed_content}`, { message: postMessage });
  // };

  const handleFileChange = (event) => setSelectedFile(event.target.files && event.target.files[0] ? event.target.files[0] : null);

  const handleGeminiSubmit = async (event) => {
    event.preventDefault();
    if (!isBackendReady) { setGeminiError("バックエンドの準備ができていません。"); return; }
    if (!problemDetails.trim() && !selectedFile) { setGeminiError("質問内容を入力するか、ファイルをアップロードしてください。"); return; }
    setIsLoadingGemini(true);
    setGeminiResponse(null);
    setQuizEvaluationResult('');
    setQuizAnswer('');
    setGeminiError('');

    const formData = new FormData();
    formData.append('selected_language', selectedLanguage);
    formData.append('selected_goal', selectedGoal);
    formData.append('selected_level', selectedLevel);
    formData.append('problem_details', problemDetails);
    if (selectedFile) formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error(await getDisplayErrorMessage(response, "Gemini APIリクエストに失敗しました。"));
      const data = await response.json();
      setGeminiResponse(data);
    } catch (error) {
      setGeminiError(error.message);
    } finally {
      setIsLoadingGemini(false);
      if (document.getElementById('file')) document.getElementById('file').value = ''; // ファイル選択をリセット
      setSelectedFile(null);
    }
  };

  const handleQuizSubmit = async (event) => {
    event.preventDefault();
    if (!geminiResponse?.quiz?.question || !geminiResponse?.explanation) { setQuizEvaluationResult("採点対象のクイズまたは解説が見つかりません。"); return; }
    if (!quizAnswer.trim()) { setQuizEvaluationResult("クイズの答えを入力してください。"); return; }
    setIsEvaluatingQuiz(true);
    setQuizEvaluationResult('採点中です...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/evaluate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_explanation: geminiResponse.explanation,
          quiz_question: geminiResponse.quiz.question,
          user_answer: quizAnswer,
        }),
      });
      if (!response.ok) throw new Error(await getDisplayErrorMessage(response, "クイズの採点に失敗しました。"));
      const data = await response.json();
      setQuizEvaluationResult(data.evaluation_comment);
    } catch (error) {
      setQuizEvaluationResult(error.message);
    } finally {
      setIsEvaluatingQuiz(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-center flex-grow">Next.js & FastAPI プログラミング学習サポートアプリ</h1>
          <label className="swap swap-rotate">
            <input type="checkbox" onChange={toggleTheme} checked={currentTheme === 'dark'} aria-label="テーマ切り替え" />
            <SunIcon className="swap-on fill-current w-7 h-7" />
            <MoonIcon className="swap-off fill-current w-7 h-7" />
          </label>
        </div>
        <p className={`text-center mt-2 font-semibold ${isBackendReady ? 'text-success' : 'text-warning'}`}>{initStatusMessage}</p>
      </header>

      <div className="card bg-base-100 shadow-xl mb-12">
        <div className="card-body">
          <h2 className="card-title text-2xl border-b pb-2">プログラミング学習サポートAI (Gemini)</h2>
          <form onSubmit={handleGeminiSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label" htmlFor="language"><span className="label-text">学習したい言語:</span></label>
              <select id="language" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="select select-bordered w-full">
                {["Python", "JavaScript", "HTML", "CSS", "SQL", "その他"].map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label" htmlFor="goal"><span className="label-text">目的:</span></label>
              <select id="goal" value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)} className="select select-bordered w-full">
                <option value="プログラミング学習">プログラミング学習 (解説とクイズ)</option>
                <option value="困りごとの解決">困りごとの解決 (解説と参考文献)</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label" htmlFor="level"><span className="label-text">現在の技術レベル:</span></label>
              <select id="level" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="select select-bordered w-full">
                {["初学者", "何となくコードを読める", "自分でコーディングできる", "自力でバグ解消できる"].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label" htmlFor="details"><span className="label-text">質問や困りごと、学習したい内容:</span></label>
              <textarea id="details" value={problemDetails} onChange={(e) => setProblemDetails(e.target.value)} rows="4" className="textarea textarea-bordered w-full" placeholder="例: Pythonのクラスについて基本から教えてください。"></textarea>
            </div>
            <div className="form-control w-full">
              <label className="label" htmlFor="file"><span className="label-text">関連ファイル (任意):</span></label>
              <input type="file" id="file" onChange={handleFileChange} className="file-input file-input-bordered file-input-primary w-full"/>
              {selectedFile && <p className="text-xs mt-1">選択中: {selectedFile.name}</p>}
            </div>
            <button type="submit" disabled={isLoadingGemini || !isBackendReady} className={`btn btn-primary w-full ${isLoadingGemini || !isBackendReady ? 'btn-disabled' : ''}`}>
              {isLoadingGemini ? <span className="loading loading-spinner"></span> : ''}
              {isLoadingGemini ? 'AIが考え中...' : 'AIに質問する'}
            </button>
          </form>
          {geminiError && (
            <div role="alert" className="alert alert-error mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{geminiError}</span>
            </div>
          )}
          {geminiResponse && (
            <div className="mt-8 p-4 border border-base-300 rounded-lg bg-base-200">
              <h3 className="text-xl font-semibold mb-3">AIからの回答:</h3>
              <div className="prose prose-sm max-w-none overflow-x-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={rehypeHighlight ? [rehypeHighlight] : []}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && match) { // ブロックコード (変更なし)
                      return (
                        <pre className={`language-${match} bg-neutral text-neutral-content p-3 my-2 rounded-md overflow-x-auto whitespace-pre-wrap break-all`} {...props}>
                          <code>{children}</code>
                        </pre>
                      );
                    }
                    // ★★★ インラインコードのスタイルを修正 ★★★
                    return (
                      <code className={`${className || ''} bg-base-300 text-base-content px-1 rounded-sm text-xs`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  a: ({node, ...props}) => <a className="link link-hover break-all" {...props} />,
                }}
              >
                {geminiResponse.explanation || "解説はありませんでした。"}
              </ReactMarkdown>
              </div>
              
              {geminiResponse.quiz && (
                <div className="mt-6 border-t border-base-300 pt-4">
                  <h4 className="font-semibold mb-2">理解度チェッククイズ:</h4>
                  <p className="mb-3 whitespace-pre-wrap break-words">{geminiResponse.quiz.question}</p>
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
                        <div className="prose prose-xs max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{ // ★★★ こちらにも同様のcodeスタイルを適用 ★★★
                              code({node, inline, className, children, ...props}) {
                                // インラインコード専用のシンプルなスタイル。必要ならブロックコードも上記と同様に分岐。
                                // ここでは主にインラインコードが使われると想定。
                                return (
                                  <code className={`${className || ''} bg-base-300 text-base-content px-1 rounded-sm`} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              // 必要に応じて他の要素(a, pなど)のスタイルもここでカスタマイズ可能
                            }}
                          >
                            {quizEvaluationResult}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                        <pre className="mt-1 p-2 bg-neutral text-neutral-content rounded whitespace-pre-wrap break-all overflow-x-auto">{geminiResponse.raw_gemini_text}</pre>
                      </div>
                  </details>
              )}
            </div>
          )}
        </div>
      </div>

      {/* <details className="collapse collapse-arrow border border-base-300 bg-base-100 mb-8">
        <summary className="collapse-title text-xl font-semibold">▼ サンプルAPIテスト (クリックで展開)</summary>
        <div className="collapse-content p-6 bg-base-200">
          <div className="space-y-8">
            {[
              { title: "GETリクエスト", action: handleGetRequest, result: getMessage, buttonText: "Helloメッセージ取得", input: null },
              { title: "数値2倍 (GET with Path Param)", action: handleMultiplyRequest, result: multiplyResult, buttonText: "送信", input: { type: "number", value: multiplyNumber, setter: setMultiplyNumber, placeholder: "数値を入力" } },
              { title: "数値半減 (GET with Path Param)", action: handleDevideRequest, result: devideResult, buttonText: "送信", input: { type: "number", value: devideNumber, setter: setDevideNumber, placeholder: "数値を入力" } },
              { title: "文字数カウント (GET with Path Param)", action: handleCountRequest, result: countResult, buttonText: "送信", input: { type: "text", value: countString, setter: setCountString, placeholder: "文字列を入力", grow: true } },
              { title: "エコー (POST)", action: handlePostRequest, result: postResult, buttonText: "送信", input: { type: "text", value: postMessage, setter: setPostMessage, placeholder: "メッセージを入力", grow: true } },
            ].map(api => (
              <section key={api.title}>
                <h3 className="text-lg font-semibold mb-3">{api.title}</h3>
                <div className={`flex gap-2 items-center ${api.input ? '' : 'justify-start'}`}>
                  {api.input && (
                    <input
                      type={api.input.type}
                      value={api.input.value}
                      onChange={(e) => api.input.setter(e.target.value)}
                      placeholder={api.input.placeholder}
                      className={`input input-bordered input-sm ${api.input.grow ? 'flex-grow' : 'w-32'}`}
                    />
                  )}
                  <button onClick={api.action} className="btn btn-info btn-sm">{api.buttonText}</button>
                </div>
                {api.result && <div role="alert" className="alert alert-sm mt-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>{api.result}</span></div>}
              </section>
            ))}
          </div>
        </div>
      </details> */}

      <footer className="mt-12 text-center text-xs">
        <p>© {new Date().getFullYear()} FastAPI & Next.js Programming Learning Support App</p>
      </footer>
    </div>
  );
}