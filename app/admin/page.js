'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // 목록 불러오기 (서버 API 호출)
  const fetchProposals = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/proposals');
      const result = await res.json();

      if (result.error) {
        setErrorMsg(result.error);
      } else {
        setProposals(result.data || []);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // [승인] 처리
  const handleApprove = async (item) => {
    if (!confirm(`'${item.term_name}' 용어를 정식 사전에 등록하시겠습니까?`)) return;

    try {
      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', item }),
      });
      const result = await res.json();

      if (result.error) {
        alert('승인 실패: ' + result.error);
      } else {
        alert('성공적으로 등록되었습니다!');
        fetchProposals();
      }
    } catch (err) {
      alert('요청 중 오류가 발생했습니다.');
    }
  };

  // [반려/삭제] 처리
  const handleReject = async (id) => {
    if (!confirm('이 신청 항목을 반려(삭제)하시겠습니까?')) return;

    try {
      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', id }),
      });
      const result = await res.json();

      if (result.error) {
        alert('삭제 실패: ' + result.error);
      } else {
        alert('삭제되었습니다.');
        fetchProposals();
      }
    } catch (err) {
      alert('요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <div>
            <h1 className="text-2xl font-black text-gray-900">관리자 대시보드</h1>
            <p className="text-sm text-gray-500 mt-1">유저들이 신청한 용어 및 가이드를 검토합니다.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchProposals}
              className="text-sm font-semibold text-gray-700 bg-white border px-3 py-2 rounded-xl hover:bg-gray-50"
            >
              🔄 새로고침
            </button>
            <Link
              href="/"
              className="text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
            >
              ← 메인으로 이동
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold">
            DB 에러: {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">목록을 불러오는 중...</div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border text-gray-400">
            현재 대기 중인 신청 내역이 없습니다.
          </div>
        ) : (
          <div className="grid gap-4">
            {proposals.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase">
                      {item.game_id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      {item.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.status === 'approved' ? '승인 완료' : '검토 대기'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">{item.term_name}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>

                  {item.gif_url && (
                    <div className="pt-2">
                      <a
                        href={item.gif_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-500 underline"
                      >
                        첨부 링크 확인 ↗
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col justify-end gap-2 shrink-0">
                  {item.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(item)}
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer"
                    >
                      승인 및 등록
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(item.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-xl hover:bg-red-100 transition cursor-pointer"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}