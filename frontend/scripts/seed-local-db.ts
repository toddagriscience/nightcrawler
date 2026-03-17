// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { type InferInsertModel } from 'drizzle-orm';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  farm,
  farmLocation,
  managementZone,
  tab,
  widget,
  mineral,
  analysis,
  user,
  accountAgreementAcceptance,
  farmInfoInternalApplication,
  farmSubscription,
  knowledgeArticle,
} from '../src/lib/db/schema';

type SeedArticle = Pick<
  InferInsertModel<typeof knowledgeArticle>,
  'title' | 'content' | 'category' | 'source'
>;

const knowledgeArticles: SeedArticle[] = [
  {
    title: 'Understanding Soil pH for Crop Production',
    content:
      'Soil pH strongly affects nutrient availability, microbial activity, and root health. Most crops perform best between pH 6.0 and 7.0.',
    category: 'soil',
    source: 'Todd Field Guide',
  },
  {
    title: 'The Four Lows Condition in Soil',
    content:
      'When calcium, magnesium, potassium, and sodium are all low, the soil is biologically depleted. Restore biology first, then rebalance minerals.',
    category: 'soil',
    source: 'Todd Field Guide',
  },
  {
    title: 'Carrot Production and Soil Requirements',
    content:
      'Carrots prefer loose, well-drained sandy loam with pH 6.0 to 6.8. Avoid excess nitrogen and keep moisture consistent during germination.',
    category: 'planting',
    source: 'Todd Field Guide',
  },
  {
    title: 'Irrigation Scheduling and Water Management',
    content:
      'Effective irrigation maintains root-zone moisture without waterlogging. Sandy soils need lighter, frequent watering and clay soils need slower cycles.',
    category: 'water',
    source: 'Todd Field Guide',
  },
];

const EMBEDDING_DIMENSIONS = 3072;

function createDeterministicEmbedding(seedText: string): number[] {
  let seed = 0;

  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }

  const values = new Array<number>(EMBEDDING_DIMENSIONS);
  let state = seed || 1;

  for (let i = 0; i < EMBEDDING_DIMENSIONS; i += 1) {
    state = (1664525 * state + 1013904223) >>> 0;
    values[i] = state / 0xffffffff;
  }

  return values;
}

async function promptForEmail(): Promise<string> {
  const readline = createInterface({ input, output });

  try {
    const enteredEmail = (
      await readline.question('Enter email for seeded admin user: ')
    ).trim();

    if (!enteredEmail) {
      throw new Error('Email is required.');
    }

    return enteredEmail.toLowerCase();
  } finally {
    readline.close();
  }
}

async function createSupabaseUserIfMissing(email: string): Promise<void> {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectId || !secretKey) {
    console.warn(
      'Skipping Supabase user creation: missing NEXT_PUBLIC_SUPABASE_PROJECT_ID or SUPABASE_SECRET_KEY.'
    );
    return;
  }

  const supabase = createClient(`https://${projectId}.supabase.co`, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let page = 1;
  const perPage = 1000;
  let userExists = false;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    if (data.users.some((supabaseUser) => supabaseUser.email === email)) {
      userExists = true;
      break;
    }

    if (data.users.length < perPage) {
      break;
    }

    page += 1;
  }

  if (userExists) {
    return;
  }

  const { error } = await supabase.auth.admin.createUser({
    email,
    password: 'Test123!',
    email_confirm: true,
    user_metadata: {
      first_name: 'Local',
      name: 'Local Admin',
    },
  });

  if (error) {
    throw error;
  }
}

async function seedLocalDb() {
  const db = drizzle(process.env.DATABASE_URL!, { casing: 'snake_case' });
  const seedEmail = await promptForEmail();

  // eslint-disable-next-line
  await db.delete(widget);
  // eslint-disable-next-line
  await db.delete(tab);
  // eslint-disable-next-line
  await db.delete(mineral);
  // eslint-disable-next-line
  await db.delete(analysis);
  // eslint-disable-next-line
  await db.delete(accountAgreementAcceptance);
  // eslint-disable-next-line
  await db.delete(user);
  // eslint-disable-next-line
  await db.delete(farmInfoInternalApplication);
  // eslint-disable-next-line
  await db.delete(farmSubscription);
  // eslint-disable-next-line
  await db.delete(farmLocation);
  // eslint-disable-next-line
  await db.delete(managementZone);
  // eslint-disable-next-line
  await db.delete(farm);
  // eslint-disable-next-line
  await db.delete(knowledgeArticle);

  const [seededFarm] = await db
    .insert(farm)
    .values({
      informalName: 'Nightcrawler Demo Farm',
      businessName: 'Nightcrawler Demo Farm LLC',
      businessWebsite: 'https://example.com',
      approved: true,
      stripeCustomerId: 'cus_local_demo_001',
    })
    .returning({ id: farm.id });

  const [seededZone] = await db
    .insert(managementZone)
    .values({
      farmId: seededFarm.id,
      name: 'North Block',
      location: [-120.35, 38.52],
      irrigation: true,
      waterConservation: true,
      npk: false,
    })
    .returning({ id: managementZone.id });

  const [seededUser] = await db
    .insert(user)
    .values({
      farmId: seededFarm.id,
      firstName: 'Local',
      lastName: 'Admin',
      email: seedEmail,
      role: 'Admin',
      job: 'Owner / Viewer',
      didOwnAndControlParcel: true,
      didManageAndControl: true,
    })
    .returning({ id: user.id });

  await db.insert(tab).values({
    user: seededUser.id,
    managementZone: seededZone.id,
  });

  await db.insert(widget).values([
    {
      managementZone: seededZone.id,
      name: 'Macro Radar',
      widgetMetadata: { i: 'macro-radar-widget', x: 0, y: 0 },
    },
    {
      managementZone: seededZone.id,
      name: 'Calcium Widget',
      widgetMetadata: { i: 'calcium-widget', x: 6, y: 0 },
    },
    {
      managementZone: seededZone.id,
      name: 'Insights',
      widgetMetadata: { i: 'insights-widget', x: 0, y: 4 },
    },
  ]);

  const analysisId = 'LOC001-ANL001';

  await db.insert(analysis).values({
    id: analysisId,
    managementZone: seededZone.id,
    analysisDate: new Date('2026-01-15'),
    summary: 'Healthy baseline mineral profile for initial local demo.',
    macroActionableInfo:
      'Maintain calcium and organic matter; monitor salinity seasonally.',
  });

  await db.insert(mineral).values([
    {
      analysisId: analysisId,
      name: 'Calcium',
      realValue: 1850,
      units: 'ppm',
      actionableInfo: 'Within target range.',
    },
    {
      analysisId: analysisId,
      name: 'Magnesium',
      realValue: 240,
      units: 'ppm',
      actionableInfo: 'Slightly low; monitor over next cycle.',
    },
    {
      analysisId: analysisId,
      name: 'PH',
      realValue: 6.5,
      units: '%',
      actionableInfo: 'Optimal pH for most crops.',
    },
    {
      analysisId: analysisId,
      name: 'OrganicMatter',
      realValue: 3.2,
      units: '%',
      actionableInfo: 'Increase cover cropping to push above 4%.',
    },
  ]);

  await db.insert(farmLocation).values({
    farmId: seededFarm.id,
    countyState: 'Yolo County, CA',
    country: 'United States',
    location: [-120.35, 38.52],
    address1: '100 Demo Farm Rd',
    postalCode: '95618',
    state: 'CA',
  });

  await db.insert(farmInfoInternalApplication).values({
    farmId: seededFarm.id,
    totalAcreage: 120,
    mainCrops: 'Carrots, lettuce, brassicas',
    managementZoneStructure: 'North block sandy loam, drip irrigated.',
    primaryMarketVenues: { farmersMarket: true, csa: true },
  });

  await db.insert(farmSubscription).values({
    farmId: seededFarm.id,
    stripeSubscriptionId: 'sub_local_demo_001',
    stripePriceId: 'price_local_demo_001',
    status: 'active',
    amount: 9900,
    currency: 'usd',
    billingInterval: 'month',
    billingIntervalCount: 1,
    cancelAtPeriodEnd: false,
    currentPeriodEnd: new Date('2026-12-31'),
  });

  await db.insert(accountAgreementAcceptance).values({
    userId: seededUser.id,
    timeAccepted: new Date('2026-01-10T10:00:00Z'),
    accepted: true,
    ipAddress: '10.0.0.10/32',
    version: 'v1',
  });

  await db.insert(knowledgeArticle).values(
    knowledgeArticles.map((article) => ({
      ...article,
      embedding: createDeterministicEmbedding(
        `${article.title} ${article.content}`
      ),
    }))
  );

  await createSupabaseUserIfMissing(seedEmail);
  console.log(
    `Database initialized with email ${seedEmail} and password Test123!`
  );
}

seedLocalDb().catch((error) => {
  console.error('Failed to seed local DB:', error);
  process.exit(1);
});
