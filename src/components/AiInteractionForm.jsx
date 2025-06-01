// src/components/AiInteractionForm.jsx
'use client';

export default function AiInteractionForm({
  selectedLanguage, setSelectedLanguage,
  selectedGoal, setSelectedGoal,
  selectedLevel, setSelectedLevel,
  problemDetails, setProblemDetails,
  selectedFile, handleFileChange,
  handleSubmit, isLoading, isBackendReady,
  geminiError
}) {
  return (
    <div className="card bg-base-100 shadow-xl mb-12">
      <div className="card-body">
        <h2 className="card-title text-2xl border-b pb-2">プログラミング学習サポートAI (Gemini)</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              {["全くの初学者", "Progateを少しやった", "基本的な文法は理解しているが、自分でアプリは作れない", "簡単なWebアプリなら自力で作れる", "業務での開発経験あり"].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
          </div>
          <div className="form-control w-full">
            <label className="label" htmlFor="details"><span className="label-text">質問や困りごと、学習したい内容:</span></label>
            <textarea id="details" value={problemDetails} onChange={(e) => setProblemDetails(e.target.value)} rows="5" className="textarea textarea-bordered w-full" placeholder="例: Pythonのクラスの継承について、具体的なコード例を交えて教えてください。"></textarea>
          </div>
          <div className="form-control w-full">
            <label className="label" htmlFor="file"><span className="label-text">関連ファイル (任意):</span></label>
            <input type="file" id="file" onChange={handleFileChange} className="file-input file-input-bordered file-input-primary w-full"/>
            {selectedFile && <p className="text-xs mt-1">選択中: {selectedFile.name}</p>}
          </div>
          <button type="submit" disabled={isLoading || !isBackendReady} className={`btn btn-primary w-full ${isLoading || !isBackendReady ? 'btn-disabled' : ''}`}>
            {isLoading ? <span className="loading loading-spinner"></span> : ''}
            {isLoading ? 'AIが考え中...' : 'AIに質問する'}
          </button>
        </form>
        {geminiError && (
          <div role="alert" className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{geminiError}</span>
          </div>
        )}
      </div>
    </div>
  );
}