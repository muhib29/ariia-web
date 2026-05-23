#!/usr/bin/env node
/**
 * inject-form-collections.mjs
 * Creates Enterprise Inquiry and Career Application collections in Strapi
 * by submitting test entries to verify the collections exist.
 *
 * NOTE: You must create the collections first in Strapi Admin (Content-Type Builder),
 * then run this script to verify they are working.
 *
 * Run: node scripts/inject-form-collections.mjs
 */

const STRAPI_URL =
  process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

if (!STRAPI_TOKEN) {
  console.error('❌  STRAPI_API_TOKEN is not set.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_TOKEN}`,
};

async function testCollection(endpoint, testData, label) {
  console.log(`\n🔍  Testing ${label} (${endpoint})...`);
  const res = await fetch(`${STRAPI_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: testData }),
  });
  const json = await res.json();
  if (json?.error) {
    console.error(`   ❌ Error:`, JSON.stringify(json.error, null, 2));
    console.log(`   ⚠️  Make sure the collection type exists in Strapi Admin.`);
    return false;
  }
  const id = json?.data?.id;
  console.log(`   ✅ ${label} collection is working! Test entry created (id: ${id})`);

  // Clean up the test entry
  if (id) {
    await fetch(`${STRAPI_URL}${endpoint}/${id}`, { method: 'DELETE', headers });
    console.log(`   🗑️  Test entry deleted.`);
  }
  return true;
}

(async () => {
  console.log('🚀  Ariia Form Collections Tester');
  console.log(`📡  Strapi URL: ${STRAPI_URL}`);
  console.log('────────────────────────────────────────────');

  await testCollection('/api/enterprise-inquiries', {
    name: 'TEST',
    email: 'test@test.com',
    company: 'Test Co',
    phone: '123',
    website: 'https://test.com',
    callMinutes: '1000',
    message: 'Test',
    submittedAt: new Date().toISOString(),
  }, 'Enterprise Inquiries');

  await testCollection('/api/career-applications', {
    name: 'TEST',
    email: 'test@test.com',
    linkedinUrl: null,
    college: null,
    location: 'Chicago',
    salaryExpectations: null,
    role: 'Test Role',
    resumeFileName: 'cv.pdf',
    submittedAt: new Date().toISOString(),
  }, 'Career Applications');

  console.log('\n────────────────────────────────────────────');
  console.log('Done. If you saw ✅ for both — the forms will save correctly.');
  console.log('If you saw ❌ — create those collections in Strapi Admin first (see implementation plan).');
})();
