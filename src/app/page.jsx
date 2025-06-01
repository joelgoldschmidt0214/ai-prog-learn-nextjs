// src/app/page.jsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import AiInteractionForm from '../components/AiInteractionForm';
import AiResponseDisplay from '../components/AiResponseDisplay';
import Footer from '../components/Footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState('corporate'); // DaisyUIのデフォルトライトテーマ名
  const [initStatusMessage, setInitStatusMessage] = useState('バックエンドの初期化状態を確認中...');
  const [isBackendReady, setIsBackendReady] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [selectedGoal, setSelectedGoal] = useState('プログラミング学習');
  const [selectedLevel, setSelectedLevel] = useState('全くの初学者'); // 初期値を更新
  const [problemDetails, setProblemDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [geminiError, setGeminiError] = useState('');

  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizEvaluationResult, setQuizEvaluationResult] = useState('');
  const [isEvaluatingQuiz, setIsEvaluatingQuiz] = useState(false);

  // テーマの初期化
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'corporate';
    setCurrentTheme(storedTheme);
    // ThemeProviderがhtmlタグのdata-themeを更新するので、ここではsetCurrentThemeのみ
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'corporate' ? 'business' : 'corporate';
    console.log('Toggling theme from:', currentTheme, 'to:', newTheme); // ★ログ追加
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    console.log('<html> data-theme set to:', document.documentElement.getAttribute('data-theme')); // ★ログ追加
  };

  const getDisplayErrorMessage = useCallback(async (response, defaultMessage = "リクエスト処理中にエラーが発生しました。") => {
    try {
      const errorData = await response.clone().json(); // responseが消費されないようにclone
      if (errorData && errorData.detail) {
        switch (errorData.detail) {
          case "GEMINI_INITIALIZING": return "モデルが初期化中です。しばらくしてから再試行してください。";
          case "GEMINI_UNAVAILABLE": return "モデルが現在利用できません。サーバー管理者に連絡してください。";
          case "BLOCKED_PROMPT": return "リクエスト内容に問題があり、処理できませんでした。入力内容を確認してください。";
          case "API_TIMEOUT": return "処理がタイムアウトしました。時間を置いて再試行してください。";
          case "INTERNAL_SERVER_ERROR": return "サーバー内部でエラーが発生しました。しばらくしてから再試行してください。";
          case "SYSTEM_PROMPT_LOAD_ERROR": return "システム設定の読み込みに失敗しました。管理者に連絡してください。";
          case "EVALUATION_PROMPT_LOAD_ERROR": return "採点設定の読み込みに失敗しました。管理者に連絡してください。";
          default: return `エラー: ${errorData.detail} (ステータス: ${response.status})`;
        }
      }
    } catch (e) { console.error("Error parsing error response:", e); }
    // エラーレスポンスがJSONでない場合や、detailがない場合
    try {
        const textError = await response.text(); // テキストとしてエラー内容を試みる
        if(textError) return `${defaultMessage} サーバーからのメッセージ: ${textError.substring(0,100)} (ステータス: ${response.status})`;
    } catch (e) { console.error("Error getting text from error response:", e); }

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
        setInitStatusMessage('バックエンドのGeminiモデルの初期化に失敗したか、まだ完了していません。再度確認します...');
        setIsBackendReady(false);
        setTimeout(checkBackendInitialization, 5000); // 失敗時もリトライ
      }
    } catch (error) {
      setInitStatusMessage(`初期化状態確認エラー: ${error.message} 5秒後に再試行します。`);
      setIsBackendReady(false);
      setTimeout(checkBackendInitialization, 5000); // キャッチしたエラーでもリトライ
    }
  }, [getDisplayErrorMessage]); // getDisplayErrorMessage を依存配列に追加

  useEffect(() => { checkBackendInitialization(); }, [checkBackendInitialization]);

  const handleFileChange = (event) => setSelectedFile(event.target.files && event.target.files[0] ? event.target.files[0] : null);

  const handleGeminiSubmit = async (event) => {
    event.preventDefault();
    if (!isBackendReady) { setGeminiError("バックエンドの準備ができていません。画面上部のメッセージを確認してください。"); return; }
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
      const responseForErrorCheck = response.clone(); // エラーメッセージ取得用にレスポンスを複製
      if (!response.ok) {
        const errorMsg = await getDisplayErrorMessage(responseForErrorCheck, "Gemini APIリクエストに失敗しました。");
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setGeminiResponse(data);
    } catch (error) {
      setGeminiError(error.message);
    } finally {
      setIsLoadingGemini(false);
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
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
      const responseForErrorCheck = response.clone();
      if (!response.ok) {
        const errorMsg = await getDisplayErrorMessage(responseForErrorCheck, "クイズの採点に失敗しました。");
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setQuizEvaluationResult(data.evaluation_comment);
    } catch (error) {
      setQuizEvaluationResult(error.message);
    } finally {
      setIsEvaluatingQuiz(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen flex flex-col">
      <Header
        currentTheme={currentTheme}
        toggleTheme={toggleTheme}
        initStatusMessage={initStatusMessage}
        isBackendReady={isBackendReady}
      />
      {/* デバッグ用 */}
      <div className="m-4 p-4 bg-primary text-primary-content">
        テーマテスト: Primary
      </div>
      <div className="m-4 p-4 bg-secondary text-secondary-content">
        テーマテスト: Secondary
      </div>
      <div className="m-4 p-4 bg-base-100 text-base-content">
        テーマテスト: Base
      </div>
      <main className="grow">
        <AiInteractionForm
          selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage}
          selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal}
          selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel}
          problemDetails={problemDetails} setProblemDetails={setProblemDetails}
          selectedFile={selectedFile} handleFileChange={handleFileChange}
          handleSubmit={handleGeminiSubmit} isLoading={isLoadingGemini} isBackendReady={isBackendReady}
          geminiError={geminiError}
        />
        <AiResponseDisplay
          geminiResponse={geminiResponse}
          quizAnswer={quizAnswer} setQuizAnswer={setQuizAnswer}
          handleQuizSubmit={handleQuizSubmit} isEvaluatingQuiz={isEvaluatingQuiz}
          quizEvaluationResult={quizEvaluationResult}
        />
      </main>
      <Footer />
    </div>
  );
}