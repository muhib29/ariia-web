#!/usr/bin/env node
/**
 * inject-careers.mjs
 * 1. Upserts Sales Representative & Market Lead in the `careers` collection
 * 2. Fetches existing career IDs already linked to careerPage.career_details
 * 3. Links ALL careers (existing + new) to careerPage so the landing page shows them
 *
 * Usage: node inject-careers.mjs
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

if (!STRAPI_TOKEN) {
  console.error('❌  NEXT_PUBLIC_STRAPI_API_TOKEN is not set. Aborting.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_TOKEN}`,
};

// ─── Career entry payloads ──────────────────────────────────────────────────

const SALES_REP = {
  title: 'Sales Representative',
  slug: 'sales-representative',
  careerCard: {
    description:
      "Shape the future of business communication by acquiring and supporting clients for our AI platform. As a remote Sales Representative, you'll manage the full sales cycle, build lasting relationships, and earn uncapped recurring commissions. Enjoy flexible hours, performance-based rewards, and the tools you need to grow your pipeline and income.",
    jobDescription: `## What You'll Do

- **Generate Leads:** Identify and qualify prospects to build a pipeline of potential customers.
- **Onboard Customers:** Guide new clients through setup and ensure a smooth start with our platform.
- **Drive Retention:** Support existing customers to maximize value and reduce churn.
- **Track Performance:** Use CRM and reporting tools to monitor pipeline, conversions, and commissions.

## Who You Are

- Proven sales or lead generation experience.
- Self-motivated with strong communication skills.
- Comfortable working independently in a remote environment.

## Compensation & Earnings Potential

**6-Month Recurring Commissions:** Earn recurring commissions for the first 6 months on each customer you bring (Pay-As-You-Go model).

- **Tier 1 (Starter):** $X/month per customer
- **Tier 2 (Growth):** $80/month per customer
- **Tier 3 (Scale):** $X/month per customer
- **Tier 4 (Enterprise):** $X/month per customer

**Example Earnings:** Month 1: 50 Tier 2 (Growth) customers = $4,000/month in recurring commissions.

## Annual Subscription Commission Structure (Commission Paid in Full After 30-Day Hold)

Tiers align with plan size; commission is paid in full after a 30-day hold period.

## Commission Payment and Clawback Policy

**Payment Timing:** Commissions are paid according to the schedule provided in your contractor agreement.

**Clawback Period:** If a customer churns or cancels within the clawback window, commission may be subject to clawback.

**Recovery Process:** The company may deduct clawback amounts from future commission payments or request repayment.

## Tools & Requirements

- You will be provided with a CRM to track your leads and sales.
- **Retention Focus:** Commissions depend on active subscriptions; supporting retention is part of your role.`,
    jobInfo: {
      employment: '1099 Independent Contractor',
      location: 'Remote',
      salary: 'Uncapped Commissions',
      equity: null,
      experience: null,
    },
    cta: {
      ctaText: 'Apply for This Role',
      httpsUrl: null,
      internalUrl: null,
    },
  },
  whyJoinUs: {
    title: 'Why Join Us?',
    description: `- Earn uncapped commissions and control your income.\n- Work remotely with flexible hours.\n- Be part of a team shaping how businesses use AI.`,
  },
};

const MARKET_LEAD = {
  title: 'Market Lead',
  slug: 'market-lead',
  careerCard: {
    description:
      "We're looking for a Market Lead to develop and implement the go-to-market strategy for our platform. Whether you're refining your marketing skills or bringing extensive experience, you'll create compelling campaigns, tell our brand story, and drive market expansion.",
    jobDescription: `## What You'll Do

- **Develop GTM Strategies:** Design and implement go-to-market strategies that align with product launches and business goals.
- **Create Content:** Produce and manage promotional content across channels to drive awareness and conversion.
- **Run Campaigns:** Manage and optimize multi-channel campaigns (digital, events, partnerships) to maximize reach and ROI.
- **Build Partnerships:** Cultivate strategic partnerships to extend brand reach and enter new segments.
- **Analyze Competitors:** Monitor competitors and market trends to inform positioning and messaging.
- **Measure Impact:** Leverage data and KPIs to track and report on campaign effectiveness.
- **Collaborate with Cross-functional Teams:** Work closely with sales, product, and engineering to align GTM efforts.
- **Manage Budgets:** Oversee marketing budgets to ensure efficient spend and strong ROI.
- **Drive Product Market Fit:** Validate and refine market fit through customer research and feedback loops.
- **Brand Development:** Ensure consistent messaging and visual identity across all touchpoints.
- **Customer Insights:** Analyze customer feedback and behavior to shape messaging and positioning.

## Metrics You'll Own

- Brand awareness lift
- Campaign ROI
- Market share growth`,
    jobInfo: {
      employment: 'Full-time',
      location: 'On-site (Chicago)',
      salary: 'N/A',
      equity: 'N/A',
      experience: 'Entry-Level & Experienced',
    },
    cta: {
      ctaText: 'Apply For This Role',
      httpsUrl: null,
      internalUrl: null,
    },
  },
  whyJoinUs: {
    title: 'Why Join Us?',
    description: `- Shape the way businesses view AI's impact on their operations.\n- Collaborate with a close-knit team to make a tangible difference.\n- Establish your marketing career or take charge of GTM strategies at scale.`,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function checkExists(slug) {
  const url = `${STRAPI_URL}/api/careers?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[limit]=1`;
  const res = await fetch(url, { headers });
  const json = await res.json();
  return json?.data?.length > 0 ? json.data[0] : null;
}

async function createEntry(payload) {
  const res = await fetch(`${STRAPI_URL}/api/careers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: payload }),
  });
  return res.json();
}

async function updateEntry(id, payload) {
  const res = await fetch(`${STRAPI_URL}/api/careers/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: payload }),
  });
  return res.json();
}

async function publishEntry(id) {
  const res = await fetch(`${STRAPI_URL}/api/careers/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  });
  return res.json();
}

/** Get all currently linked career_detail IDs from the careerPage single type */
async function getCareerPageLinkedIds() {
  const res = await fetch(
    `${STRAPI_URL}/api/career-page?populate[career_details][fields][0]=id`,
    { headers },
  );
  const json = await res.json();
  const linked = json?.data?.career_details ?? [];
  return linked.map((c) => c.id);
}

/** Update careerPage.career_details relation to include all given IDs */
async function linkCareersToPage(ids) {
  console.log(`\n🔗  Linking career IDs [${ids.join(', ')}] → careerPage.career_details`);
  const res = await fetch(`${STRAPI_URL}/api/career-page`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      data: {
        career_details: ids,
      },
    }),
  });
  const json = await res.json();
  if (json?.error) {
    console.error('   ❌ Link error:', JSON.stringify(json.error, null, 2));
    return false;
  }
  console.log('   ✅ careerPage.career_details updated successfully');
  return true;
}

/** Get ALL career IDs from the careers collection */
async function getAllCareerIds() {
  const res = await fetch(`${STRAPI_URL}/api/careers?fields[0]=id&pagination[limit]=100`, {
    headers,
  });
  const json = await res.json();
  return (json?.data ?? []).map((c) => c.id);
}

async function upsert(entry) {
  const { slug, title } = entry;
  console.log(`\n📋  Processing: ${title} (slug: ${slug})`);

  const existing = await checkExists(slug);
  let result;

  if (existing) {
    console.log(`   ⚡ Entry exists (id: ${existing.id}), updating...`);
    result = await updateEntry(existing.id, entry);
  } else {
    console.log(`   ✨ Creating new entry...`);
    result = await createEntry(entry);
  }

  if (result?.error) {
    console.error(`   ❌ Error:`, JSON.stringify(result.error, null, 2));
    return null;
  }

  const id = result?.data?.id;
  if (!id) {
    console.error(`   ❌ Unexpected response:`, JSON.stringify(result, null, 2));
    return null;
  }

  const pubResult = await publishEntry(id);
  if (pubResult?.error) {
    console.warn(`   ⚠️  Publish warning:`, JSON.stringify(pubResult.error, null, 2));
  } else {
    console.log(`   ✅ Published (id: ${id})`);
  }

  return id;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log('🚀  Ariia Career Injector v2');
  console.log(`📡  Strapi URL: ${STRAPI_URL}`);
  console.log('───────────────────────────────────────');

  // 1. Upsert and publish each role
  await upsert(SALES_REP);
  await upsert(MARKET_LEAD);

  // 2. Collect ALL career IDs (existing + newly created)
  console.log('\n📦  Fetching all career IDs from collection...');
  const allIds = await getAllCareerIds();
  console.log(`   Found ${allIds.length} career(s): [${allIds.join(', ')}]`);

  if (allIds.length === 0) {
    console.error('   ❌ No career entries found. Something went wrong above.');
    process.exit(1);
  }

  // 3. Link them all to careerPage.career_details
  await linkCareersToPage(allIds);

  console.log('\n───────────────────────────────────────');
  console.log('✅  Done! All careers are linked to the careerPage and should appear on the site.');
})();
