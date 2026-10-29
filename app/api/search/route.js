import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { game, term } = await req.json();

    // 1. 환경 변수 체크
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        message: '오류: .env.local 파일의 URL 또는 KEY를 불러오지 못했습니다. 서버를 재시작해보세요.'
      });
    }

    // 2. Supabase DB 조회
    const { data, error } = await supabase
      .from('glossary')
      .select('term_name, content, gif_url')
      .eq('game_id', game)
      .ilike('term_name', `%${term}%`)
      .limit(1)
      .maybeSingle();

    // 3. 에러 발생 시 구체적인 Supabase 에러 메시지 반환
    if (error) {
      console.error('Supabase DB 에러:', error);
      return NextResponse.json({
        message: `DB 에러 발생: ${error.message} (코드: ${error.code})`
      });
    }

    if (!data) {
      return NextResponse.json({
        message: `'${term}'에 대한 검색 결과를 찾지 못했습니다.`
      });
    }

    return NextResponse.json({
      term: data.term_name,
      content: data.content,
      gifUrl: data.gif_url
    });
  } catch (err) {
    return NextResponse.json({ message: `서버 예외: ${err.message}` });
  }
}