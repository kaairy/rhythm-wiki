'use client';

import { useState } from 'react';

export default function AiSearchBar() {
  const [selectedGame, setSelectedGame] = useState('sdvx');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: selectedGame, term: query })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ message: '검색 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-5 border rounded-2xl shadow-lg bg-white">
      <div className="flex gap-2 mb-4 justify-center">
        {[
          { id: 'sdvx', label: '사운드 볼텍스' },
          { id: 'chunithm', label: '츄니즘' },
          { id: 'maimai', label: '마이마이' }
        ].map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => setSelectedGame(game.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
              selectedGame === game.id ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {game.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="궁금한 용어를 입력하세요 (예: 트릴, 노브, 슬라이드)"
          className="flex-grow p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="px-5 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 transition"
        >
          {loading ? '검색 중' : '검색'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 border rounded-xl">
          {result.message ? (
            <p className="text-gray-600 text-sm text-center">{result.message}</p>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{result.term}</h3>
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">{result.content}</p>
              {result.gifUrl && (
                <img
                  src={result.gifUrl}
                  alt={result.term}
                  className="rounded-lg max-h-56 mx-auto object-cover border"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}