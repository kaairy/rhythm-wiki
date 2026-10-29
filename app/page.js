'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProposalModal from '@/components/ProposalModal';

const GAME_TABS = [
  { id: 'all', name: 'ALL TRACKS', sub: '전체 검색', icon: '⚡', color: 'from-fuchsia-500 to-cyan-500', border: 'border-fuchsia-500/50' },
  { id: 'sdvx', name: 'SOUND VOLTEX', sub: '사운드 볼텍스', icon: '🎛️', color: 'from-pink-500 to-rose-500', border: 'border-pink-500/60' },
  { id: 'chunithm', name: 'CHUNITHM', sub: '츄니즘', icon: '🎹', color: 'from-amber-400 to-yellow-500', border: 'border-amber-400/60' },
  { id: 'maimai', name: 'maimai DX', sub: '마이마이', icon: '💿', color: 'from-cyan-400 to-blue-500', border: 'border-cyan-400/60' },
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}&game=${selectedGame}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-pink-500 selection:text-white pb-24 relative overflow-hidden font-sans">
      {/* 배경 그리드 및 네온 앰비언트 라이트 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 상단 아케이드 헤더 바 */}
      <header className="border-b border-cyan-500/20 bg-[#0b0e17]/80 backdrop-blur-md sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(236,72,153,0.4)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition">
              <div className="w-full h-full bg-[#0d111d] rounded-[11px] flex items-center justify-center text-lg">
                🕹️
              </div>
            </div>
            <div>
              <span className="text-xl font-black italic tracking-wider bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                BEAT//CODEX
              </span>
              <span className="hidden sm:inline-block ml-2 text-[9px] font-mono tracking-widest text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded bg-cyan-950/40">
                ARCADE VER.
              </span>
            </div>
          </Link>

          {/* 기체 상태 정보 & 기여 버튼 */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                ONLINE
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-bold tracking-wider">CREDIT: 01</span>
            </div>

            <Link
              href="/admin"
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition px-3 py-1.5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-cyan-500/30"
            >
              [SYS_ADMIN]
            </Link>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black tracking-wide rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/50 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              + ENTRY DATA
            </button>
          </div>
        </div>
      </header>

      {/* Hero 영역 */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <span className="animate-spin text-sm">✦</span> SOUND VOLTEX × CHUNITHM × maimai DX
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3 italic">
          SELECT YOUR <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">PATTERN & GUIDE</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto mb-8 font-mono">
          아케이드 리듬게임의 손배치, 기믹 대처법, 필수 용어를 즉시 검색하세요.
        </p>

        {/* 아케이드 검색 패널 */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto space-y-4">
          {/* 게임 선택 탭 버튼 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GAME_TABS.map((tab) => {
              const isSelected = selectedGame === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedGame(tab.id)}
                  className={`p-2.5 rounded-xl text-left transition relative border cursor-pointer ${
                    isSelected
                      ? `bg-slate-900/90 ${tab.border} shadow-[0_0_15px_rgba(236,72,153,0.25)]`
                      : 'bg-[#0d121f]/70 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{tab.icon}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    )}
                  </div>
                  <div className={`text-xs font-black mt-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {tab.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">{tab.sub}</div>
                </button>
              );
            })}
          </div>

          {/* 검색창 Input 바 */}
          <div className="relative flex items-center group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300" />
            <div className="relative w-full flex items-center bg-[#0a0e18] border border-slate-700/80 rounded-2xl overflow-hidden">
              <span className="pl-4 text-slate-500 font-mono text-sm">▶</span>
              <input
                type="text"
                placeholder="용어나 테크닉을 검색하세요 (예: 트릴, 노브, 슬라이드, 니어)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent py-4 pl-3 pr-28 text-sm text-white placeholder:text-slate-500 outline-none font-medium"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#07090e] text-xs font-black tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
              >
                {loading ? 'SEARCHING' : 'SEARCH'}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* 검색 결과 영역 */}
      {hasSearched && (
        <section className="max-w-3xl mx-auto px-4 mb-14 relative z-10">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">SEARCH RESULT</span>
              <span className="text-xs font-mono text-slate-500">[{searchResults.length} HIT]</span>
            </div>
            <button
              onClick={() => {
                setHasSearched(false);
                setSearchTerm('');
              }}
              className="text-xs font-mono text-slate-400 hover:text-pink-400 transition"
            >
              [CLEAR]
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0d121f]/60 border border-dashed border-slate-800 text-center text-slate-400 text-xs font-mono">
              NO MATCHING PATTERN FOUND. <br />
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-pink-400 font-bold mt-2 hover:underline inline-block"
              >
                + 새로운 용어 신청하기
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-cyan-500/50 transition relative overflow-hidden group shadow-lg"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition" />
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-cyan-500/30">
                      {item.game_id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.category === 'guide'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {item.category === 'guide' ? 'TECHNIQUE' : 'TERM'}
                    </span>
                    <h3 className="text-base font-black text-white ml-1">{item.term_name}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line pl-1">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 기체 캐비닛 선택 카드 섹션 */}
      <section className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono font-bold text-slate-400 tracking-widest">
            SELECT CABINET / ARCADE GUIDE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 사운드 볼텍스 카드 */}
          <Link
            href="/sdvx"
            className="group relative p-6 rounded-3xl bg-[#0d111d] border border-pink-500/20 hover:border-pink-500 transition duration-300 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.3)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl p-3 bg-pink-950/40 rounded-2xl border border-pink-500/30">🎛️</span>
              <span className="text-[10px] font-mono font-bold text-pink-400 px-2.5 py-1 rounded-full bg-pink-950/50 border border-pink-500/40">
                VOLTE
              </span>
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-pink-400 transition italic">
              SOUND VOLTEX
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              아날로그 디바이스(노브), 원핸드 버튼 처리, 직각 노브 팁
            </p>
            <div className="mt-5 flex items-center text-xs font-bold text-pink-400 group-hover:translate-x-1 transition">
              기체 공략 열기 →
            </div>
          </Link>

          {/* 츄니즘 카드 */}
          <Link
            href="/chunithm"
            className="group relative p-6 rounded-3xl bg-[#0d111d] border border-amber-500/20 hover:border-amber-400 transition duration-300 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl p-3 bg-amber-950/40 rounded-2xl border border-amber-500/30">🎹</span>
              <span className="text-[10px] font-mono font-bold text-amber-400 px-2.5 py-1 rounded-full bg-amber-950/50 border border-amber-500/40">
                AIR SENSOR
              </span>
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition italic">
              CHUNITHM
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              그라운드 슬라이더 분할 타격, 에어 액션 공중 유지, 플릭 판정
            </p>
            <div className="mt-5 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition">
              기체 공략 열기 →
            </div>
          </Link>

          {/* 마이마이 카드 */}
          <Link
            href="/maimai"
            className="group relative p-6 rounded-3xl bg-[#0d111d] border border-cyan-500/20 hover:border-cyan-400 transition duration-300 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl p-3 bg-cyan-950/40 rounded-2xl border border-cyan-500/30">💿</span>
              <span className="text-[10px] font-mono font-bold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/40">
                TOUCH & RING
              </span>
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition italic">
              maimai DX
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              슬라이드 1박자 지연 긋기, 8분할 터치 센서, 브레이크 판정법
            </p>
            <div className="mt-5 flex items-center text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition">
              기체 공략 열기 →
            </div>
          </Link>
        </div>
      </section>

      {/* 기여 신청 팝업 모달 */}
      <ProposalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}