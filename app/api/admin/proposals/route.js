import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('term_proposals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { action, item, id } = await req.json();

    if (action === 'approve') {
      const { error: insertError } = await supabase.from('glossary').insert([
        {
          game_id: item.game_id,
          term_name: item.term_name,
          category: item.category,
          content: item.content,
          gif_url: item.gif_url,
        },
      ]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      await supabase
        .from('term_proposals')
        .update({ status: 'approved' })
        .eq('id', item.id);

      return NextResponse.json({ success: true });
    }

    if (action === 'reject') {
      const { error: deleteError } = await supabase
        .from('term_proposals')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}