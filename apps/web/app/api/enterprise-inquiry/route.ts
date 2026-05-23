import { NextRequest, NextResponse } from 'next/server';
import {
  isValidEmail,
  normalizeOptionalString,
  submitToStrapiCollection,
} from '@/lib/strapi-form-submission';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = normalizeOptionalString(body?.name);
    const email = normalizeOptionalString(body?.email);
    const company = normalizeOptionalString(body?.company);
    const phone = normalizeOptionalString(body?.phone);
    const website = normalizeOptionalString(body?.website);
    const callMinutes = normalizeOptionalString(body?.callMinutes);
    const message = normalizeOptionalString(body?.message);

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please provide a valid email.' }, { status: 400 });
    }

    const saved = await submitToStrapiCollection('/api/enterprise-inquiries', {
      name,
      email,
      company,
      phone,
      website,
      callMinutes,
      message,
    });

    return NextResponse.json({ success: true, id: saved.id });
  } catch (err) {
    console.error('[enterprise-inquiry] Unexpected error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
