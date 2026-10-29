'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProposalModal({ isOpen, onClose }) {
  const [game, setGame] = useState('sdvx');
  const [category, setCategory] = useState('glossary');
  const [termName, setTermName] = useState('');
  const [content, setContent] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Supabase에 데이터 등록 요청
    const { data, error } = await supabase.from('term_proposals').insert([
      {
        game_id: game,
        category: category,
        term_name: termName,
        content: content,
        gif_url: gifUrl || null,
        status: 'pending',
      },
    ]).select();

    setSubmitting(false);

    if (error) {
      alert('신청 실패 에러: ' + error.message + ' (코드: ' + error.code + ')');
      console.error('Supabase Proposal Error:', error);
      return;
    }

    alert('신청이 성공적으로 접수되었습니다!');
    setTermName('');
    setContent('');
    setGifUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">가이드 / 용어 추가 신청</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">대상 게임</label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="sdvx">사운드 볼텍스</option>
              <option value="chunithm">츄니즘</option>
              <option value="maimai">마이마이</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">분류</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="glossary">단순 용어</option>
              <option value="guide">게임 가이드/공략</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">용어/제목</label>
            <input
              type="text"
              required
              placeholder="예: 니어, 체인, 슬라이드"
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">설명 내용</label>
            <textarea
              required
              rows={4}
              placeholder="해당 용어나 가이드에 대한 설명을 작성해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">참고 이미지/GIF 링크 (선택)</label>
            <input
              type="url"
              placeholder="https://example.com/image.gif"
              value={gifUrl}
              onChange={(e) => setGifUrl(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-1/2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? '신청 중...' : '신청하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}