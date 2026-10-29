'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProposalModal from '@/components/ProposalModal';

const GAME_INFO = {
  sdvx: {
    title: 'SOUND VOLTEX',
    koreanTitle: '사운드 볼텍스 (SDVX)',
    description: '아날로그 디바이스(노브)와 6개 버튼(BT/FX)을 조작하는 하이스피드 아케이드 기체',
    accentColor: 'text-pink-400',
    borderGlow: 'border-pink-500/40 hover:border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]',
    badgeBg: 'bg-pink-950/60 border-pink-500/40 text-pink-300',
    headerGrad: 'from-pink-950/50 via-[#0d111d] to-[#07090e]',
    icon: '🎛️',
    tag: 'ANALOG DEVICE',
  },
  chunithm: {
    title: 'CHUNITHM',
    koreanTitle: '츄니즘 (CHUNITHM)',
    description: '그라운드 슬라이더 터치 패널과 적외선 공간 센서(에어)를 조작하는 인터페이스',
    accentColor: 'text-amber-400',
    borderGlow: 'border-amber-500/40 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    badgeBg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
    headerGrad: 'from-amber-950/40 via-[#0d111d] to-[#07090e]',
    icon: '🎹',
    tag: 'AIR & GROUND SLIDER',
  },
  maimai: {
    title: 'maimai DX',
    koreanTitle: '마이마이 DX (maimai)',
    description: '원형 화면 8방향 외곽 버튼과 내부 멀티 터치 센서 스크린을 활용한 드럼형 기체',
    accentColor: 'text-cyan-400',
    borderGlow: 'border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]',
    badgeBg: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
    headerGrad: 'from-cyan-950/40 via-[#0d111d] to-[#07090e]',
    icon: '💿',
    tag: 'RING TOUCH & BUTTON',
  },
};

const ITEMS_PER_PAGE = 6; // 한 페이지에 표시할 용어 수

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.game;
  const game = GAME_INFO[gameId] || {
    title: 'RHYTHM WIKI',
    koreanTitle: '리듬게임 가이드',
    description: '아케이드 리듬게임 종합 용어집 및 공략집',
    accentColor: 'text-fuchsia-400',
    borderGlow: 'border-fuchsia-500/40 hover:border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.15)]',
    badgeBg: 'bg-fuchsia-950/60 border-fuchsia-500/40 text-fuchsia-300',
    headerGrad: 'from-fuchsia-950/40 via-[#0d111d] to-[#07090e]',
    icon: '🎮',
    tag: 'SYSTEM MANUAL',
  };

  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGlossary = async () => {
    setLoading(true);
    let query = supabase
      .from('glossary')
      .select('*')
      .eq('game_id', gameId)
      .order('term_name', { ascending: true });

    if (activeTab !== 'all') {
      query = query.eq('category', activeTab);
    }

    const { data, error } = await query;
    if (!error && data) {
      setItems(data);
    } else {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (gameId) {
      fetchGlossary();
    }
  }, [gameId, activeTab]);

  // 탭 변경 시 1페이지로 리셋
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-pink-500 selection:text-white pb-24 relative font-sans">
      {/* 배경 그리드 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* 상단 네비게이션 */}
      <header className="border-b border-cyan-500/20 bg-[#0b0e17]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-cyan-400 transition"
          >
            <span>◀</span>
            <span>[RETURN TO MAIN]</span>
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black tracking-wide rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)] border border-pink-400/40 transition cursor-pointer"
          >
            + ADD ENTRY
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-10 space-y-8 relative z-10">
        {/* 기체 배너 카드 */}
        <section
          className={`p-6 md:p-8 rounded-3xl bg-gradient-to-b ${game.headerGrad} border border-slate-800 relative overflow-hidden`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl p-3 bg-[#07090e]/80 rounded-2xl border border-slate-800 inline-block shadow-lg">
              {game.icon}
            </span>
            <span
              className={`text-[10px] font-mono font-extrabold px-3 py-1 rounded-full border ${game.badgeBg}`}
            >
              {game.tag}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white italic tracking-tight">
            {game.title}
          </h1>
          <p className={`text-sm font-bold mt-1 ${game.accentColor}`}>
            {game.koreanTitle}
          </p>
          <p className="text-xs md:text-sm text-slate-400 mt-3 font-mono leading-relaxed max-w-2xl">
            {game.description}
          </p>
        </section>

        {/* 탭 필터 (아케이드 버튼 형태) */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 flex-wrap gap-2">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'ALL', icon: '✦' },
              { id: 'glossary', label: 'TERMS', icon: '📖' },
              { id: 'guide', label: 'TECHNIQUES', icon: '🎯' },
            ].map((tab) => {
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    isCurrent
                      ? 'bg-slate-900 text-cyan-400 border-cyan-500/60 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                      : 'bg-[#0d121f]/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 전체 개수 안내 */}
          <span className="text-[11px] font-mono text-slate-500">
            TOTAL: <strong className="text-slate-300">{items.length}</strong> ENTRIES
          </span>
        </div>

        {/* 용어 & 가이드 카드 목록 */}
        {loading ? (
          <div className="text-center py-20 text-xs font-mono text-slate-500">
            LOADING ENTRY DATABASE...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0d121f]/50 border border-dashed border-slate-800 text-center text-xs font-mono text-slate-500">
            NO REGISTERED DATA IN THIS SECTION.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4">
              {paginatedItems.map((item) => (
                <article
                  key={item.id}
                  className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-cyan-500/40 transition relative overflow-hidden group shadow-md"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-pink-500 opacity-50 group-hover:opacity-100 transition" />
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.category === 'guide'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                          : 'bg-purple-950/60 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      {item.category === 'guide' ? 'TECHNIQUE' : 'TERM'}
                    </span>
                    <h2 className="text-lg font-black text-white">{item.term_name}</h2>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                    {item.content}
                  </p>

                  {item.gif_url && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <a
                        href={item.gif_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 underline"
                      >
                        ▶ VIEW MEDIA / REFERENCE ↗
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* 아케이드 스타일 페이지네이션 바 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0d121f] text-xs font-mono text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-500/50 hover:text-white transition cursor-pointer"
                >
                  ◀ PREV
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                    const isCurrent = currentPage === num;
                    return (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-8 h-8 rounded-lg text-xs font-mono font-bold border transition flex items-center justify-center cursor-pointer ${
                          isCurrent
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                            : 'bg-[#0d121f] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0d121f] text-xs font-mono text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-500/50 hover:text-white transition cursor-pointer"
                >
                  NEXT ▶
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ProposalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}