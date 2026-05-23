import { NextRequest, NextResponse } from 'next/server';
import {
  isValidEmail,
  normalizeOptionalString,
  submitCareerApplicationToStrapi,
} from '@/lib/strapi-form-submission';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const isFormData = contentType.includes('multipart/form-data');
    let name: string | null = null;
    let email: string | null = null;
    let linkedinUrl: string | null = null;
    let college: string | null = null;
    let location: string | null = null;
    let salaryExpectations: string | null = null;
    let role: string | null = null;
    let resumeFile: File | null = null;

    try {
      if (isFormData) {
        const body = await req.formData();
        const getValue = (key: string) => {
          const value = body.get(key);
          return typeof value === 'string' ? value : null;
        };

        name = normalizeOptionalString(getValue('name'));
        email = normalizeOptionalString(getValue('email'));
        linkedinUrl = normalizeOptionalString(getValue('linkedin'));
        college = normalizeOptionalString(getValue('college'));
        location = normalizeOptionalString(getValue('location'));
        salaryExpectations = normalizeOptionalString(getValue('salaryExpectations'));
        role = normalizeOptionalString(getValue('role'));
        resumeFile = body.get('resume') instanceof File ? (body.get('resume') as File) : null;
      } else {
        const body = (await req.json()) as Record<string, unknown>;
        name = normalizeOptionalString(body?.name);
        email = normalizeOptionalString(body?.email);
        linkedinUrl = normalizeOptionalString(body?.linkedin);
        college = normalizeOptionalString(body?.college);
        location = normalizeOptionalString(body?.location);
        salaryExpectations = normalizeOptionalString(body?.salaryExpectations);
        role = normalizeOptionalString(body?.role);
      }
    } catch (parseErr) {
      console.error('[career-application] Failed to parse request body:', parseErr);
      return NextResponse.json({ error: 'Invalid application payload.' }, { status: 400 });
    }

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please provide a valid email.' }, { status: 400 });
    }

    const saved = await submitCareerApplicationToStrapi(
      {
        name,
        email,
        linkedinUrl,
        college,
        location,
        salaryExpectations,
        role,
      },
      resumeFile instanceof File ? resumeFile : null,
    );

    return NextResponse.json({ success: true, id: saved.id });
  } catch (err) {
    console.error('[career-application] Unexpected error:', err);
    return NextResponse.json({ error: 'Unable to submit application right now.' }, { status: 500 });
  }
}
