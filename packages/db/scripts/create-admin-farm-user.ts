// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { and, desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  accountAgreementAcceptance,
  analysis,
  farm,
  farmLocation,
  farmSubscription,
  managementZone,
  mineral,
  standardValues,
  tab,
  user,
  widget,
} from '../src/schema';

const DEFAULT_SEED_ADMIN_EMAIL = 'example@testmail.com';

const argv = process.argv.slice(2);

function getArgValue(flag: string) {
  const index = argv.indexOf(flag);

  if (index === -1) {
    return undefined;
  }

  return argv[index + 1]?.trim();
}

const email =
  getArgValue('--email')?.toLowerCase() ??
  process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase() ??
  DEFAULT_SEED_ADMIN_EMAIL;
const password = getArgValue('--password') ?? process.env.SEED_ADMIN_PASSWORD;
const firstName =
  getArgValue('--first-name') ??
  process.env.SEED_ADMIN_FIRST_NAME?.trim() ??
  'Platform';
const lastName =
  getArgValue('--last-name') ??
  process.env.SEED_ADMIN_LAST_NAME?.trim() ??
  'Admin';
const farmName =
  getArgValue('--farm-name') ??
  process.env.SEED_FARM_NAME?.trim() ??
  'Nightcrawler Mineral Demo Farm';
const businessName =
  getArgValue('--business-name') ??
  process.env.SEED_BUSINESS_NAME?.trim() ??
  `${farmName} LLC`;
const zoneName =
  getArgValue('--zone-name') ??
  process.env.SEED_ZONE_NAME?.trim() ??
  'Complete Mineral Zone';

const isLocalDatabaseConfigured = Boolean(
  process.env.LOCAL_DATABASE_HOST &&
  process.env.LOCAL_DATABASE_PORT &&
  process.env.LOCAL_DATABASE_USER &&
  process.env.LOCAL_DATABASE_DATABASE
);

const localDatabaseUrl = isLocalDatabaseConfigured
  ? `postgresql://${encodeURIComponent(process.env.LOCAL_DATABASE_USER!)}:${encodeURIComponent(process.env.LOCAL_DATABASE_PASSWORD ?? '')}@${process.env.LOCAL_DATABASE_HOST}:${process.env.LOCAL_DATABASE_PORT}/${process.env.LOCAL_DATABASE_DATABASE}`
  : process.env.DATABASE_URL;

if (!localDatabaseUrl) {
  throw new Error(
    'Local database configuration is missing. Set LOCAL_DATABASE_* or DATABASE_URL.'
  );
}

const seededEmail = email;

const pool = new Pool({
  connectionString: localDatabaseUrl,
  ssl: isLocalDatabaseConfigured
    ? false
    : !process.env.NODE_TLS_REJECT_UNAUTHORIZED
      ? {
          ca: process.env.DATABASE_PEM_CERT!,
        }
      : false,
});

const db = drizzle(pool, { casing: 'snake_case' });

const mineralSeedData = [
  {
    name: 'Calcium' as const,
    realValue: 200,
    units: 'ppm' as const,
    actionableInfo: 'Your calcium is a bit on the high side.',
  },
  {
    name: 'Magnesium' as const,
    realValue: 240,
    units: 'ppm' as const,
  },
  {
    name: 'Sodium' as const,
    realValue: 58,
    units: 'ppm' as const,
  },
  {
    name: 'Potassium' as const,
    realValue: 310,
    units: 'ppm' as const,
  },
  {
    name: 'PH' as const,
    realValue: 6.6,
    units: '%' as const,
  },
  {
    name: 'Salinity' as const,
    realValue: 410,
    units: 'ppm' as const,
  },
  {
    name: 'NitrateNitrogen' as const,
    realValue: 24,
    units: 'ppm' as const,
  },
  {
    name: 'PhosphatePhosphorus' as const,
    realValue: 54,
    units: 'ppm' as const,
  },
  {
    name: 'Zinc' as const,
    realValue: 3.8,
    units: 'ppm' as const,
  },
  {
    name: 'Iron' as const,
    realValue: 42,
    units: 'ppm' as const,
  },
  {
    name: 'OrganicMatter' as const,
    realValue: 4.1,
    units: '%' as const,
  },
];

async function createSupabaseUserIfMissing() {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectId || !secretKey) {
    return {
      created: false,
      skipped: true,
      reason:
        'Skipping Supabase auth user creation because NEXT_PUBLIC_SUPABASE_PROJECT_ID or SUPABASE_SECRET_KEY is missing.',
    };
  }

  if (!password) {
    return {
      created: false,
      skipped: true,
      reason:
        'Skipping Supabase auth user creation because no password was provided.',
    };
  }

  const supabase = createClient(`https://${projectId}.supabase.co`, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const existingAuthUser = data.users.find(
      (supabaseUser) => supabaseUser.email === seededEmail
    );

    if (existingAuthUser) {
      return {
        created: false,
        skipped: false,
        reason: 'Supabase auth user already exists.',
      };
    }

    if (data.users.length < perPage) {
      break;
    }

    page += 1;
  }

  const { error } = await supabase.auth.admin.createUser({
    email: seededEmail,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`.trim(),
      email_verified: true,
    },
  });

  if (error) {
    throw error;
  }

  return {
    created: true,
    skipped: false,
    reason: 'Supabase auth user created.',
  };
}

async function main() {
  const authResult = await createSupabaseUserIfMissing();

  const result = await db.transaction(async (tx) => {
    let [existingUser] = await tx
      .select()
      .from(user)
      .where(eq(user.email, seededEmail))
      .limit(1);

    let farmId = existingUser?.farmId ?? null;

    if (!farmId) {
      const [createdFarm] = await tx
        .insert(farm)
        .values({
          informalName: farmName,
          businessName,
          businessWebsite: 'https://example.com',
          approved: true,
          stripeCustomerId: `seed_customer_${seededEmail.replace(/[^a-z0-9]/g, '_')}`,
        })
        .returning({ id: farm.id });

      farmId = createdFarm.id;
    } else {
      await tx
        .update(farm)
        .set({
          informalName: farmName,
          businessName,
          approved: true,
          businessWebsite: 'https://example.com',
        })
        .where(eq(farm.id, farmId));
    }

    if (!existingUser) {
      [existingUser] = await tx
        .insert(user)
        .values({
          farmId,
          firstName,
          lastName,
          email: seededEmail,
          role: 'Admin',
          job: 'Owner / Platform Administrator',
          didOwnAndControlParcel: true,
          didManageAndControl: true,
        })
        .returning();
    } else {
      [existingUser] = await tx
        .update(user)
        .set({
          farmId,
          firstName,
          lastName,
          role: 'Admin',
          job: 'Owner / Platform Administrator',
          didOwnAndControlParcel: true,
          didManageAndControl: true,
        })
        .where(eq(user.id, existingUser.id))
        .returning();
    }

    await tx
      .insert(farmLocation)
      .values({
        farmId,
        countyState: 'Yolo County, CA',
        country: 'United States',
        state: 'CA',
        postalCode: '95618',
        address1: '100 Mineral Demo Road',
        location: [-120.35, 38.52],
      })
      .onConflictDoUpdate({
        target: farmLocation.farmId,
        set: {
          countyState: 'Yolo County, CA',
          country: 'United States',
          state: 'CA',
          postalCode: '95618',
          address1: '100 Mineral Demo Road',
          location: [-120.35, 38.52],
        },
      });

    await tx
      .insert(standardValues)
      .values({ farmId })
      .onConflictDoNothing({ target: standardValues.farmId });

    await tx
      .insert(farmSubscription)
      .values({
        farmId,
        stripeSubscriptionId: `seed_subscription_${farmId}`,
        stripePriceId: 'price_seed_admin_farm',
        status: 'active',
        amount: 9900,
        currency: 'usd',
        billingInterval: 'month',
        billingIntervalCount: 1,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: new Date('2027-01-01T00:00:00Z'),
      })
      .onConflictDoUpdate({
        target: farmSubscription.farmId,
        set: {
          status: 'active',
          amount: 9900,
          currency: 'usd',
          billingInterval: 'month',
          billingIntervalCount: 1,
          cancelAtPeriodEnd: false,
          currentPeriodEnd: new Date('2027-01-01T00:00:00Z'),
        },
      });

    let [existingZone] = await tx
      .select()
      .from(managementZone)
      .where(
        and(
          eq(managementZone.farmId, farmId),
          eq(managementZone.name, zoneName)
        )
      )
      .limit(1);

    if (!existingZone) {
      [existingZone] = await tx
        .insert(managementZone)
        .values({
          farmId,
          name: zoneName,
          location: [-120.35, 38.52],
          irrigation: true,
          waterConservation: true,
          npk: false,
        })
        .returning();
    } else {
      [existingZone] = await tx
        .update(managementZone)
        .set({
          location: [-120.35, 38.52],
          irrigation: true,
          waterConservation: true,
          npk: false,
        })
        .where(eq(managementZone.id, existingZone.id))
        .returning();
    }

    await tx
      .insert(tab)
      .values({
        user: existingUser.id,
        managementZone: existingZone.id,
      })
      .onConflictDoNothing();

    await tx
      .insert(widget)
      .values([
        {
          managementZone: existingZone.id,
          name: 'Macro Radar',
          widgetMetadata: { i: 'macro-radar-widget', x: 0, y: 0 },
        },
        {
          managementZone: existingZone.id,
          name: 'Calcium Widget',
          widgetMetadata: { i: 'calcium-widget', x: 6, y: 0 },
        },
        {
          managementZone: existingZone.id,
          name: 'PH Widget',
          widgetMetadata: { i: 'ph-widget', x: 0, y: 4 },
        },
        {
          managementZone: existingZone.id,
          name: 'Insights',
          widgetMetadata: { i: 'insights-widget', x: 6, y: 4 },
        },
      ])
      .onConflictDoNothing();

    let [existingAnalysis] = await tx
      .select()
      .from(analysis)
      .where(eq(analysis.managementZone, existingZone.id))
      .orderBy(desc(analysis.analysisDate))
      .limit(1);

    if (!existingAnalysis) {
      const analysisId = `ZN${String(existingZone.id % 10000).padStart(4, '0')}-MIN001`;

      [existingAnalysis] = await tx
        .insert(analysis)
        .values({
          id: analysisId,
          managementZone: existingZone.id,
          analysisDate: new Date('2026-02-01'),
          summary:
            'Seeded baseline analysis covering every supported mineral attribute.',
          macroActionableInfo:
            'This seeded analysis is intended to exercise all mineral widgets and related UI paths.',
        })
        .returning();
    } else {
      [existingAnalysis] = await tx
        .update(analysis)
        .set({
          analysisDate: new Date('2026-02-01'),
          summary:
            'Seeded baseline analysis covering every supported mineral attribute.',
          macroActionableInfo:
            'This seeded analysis is intended to exercise all mineral widgets and related UI paths.',
        })
        .where(eq(analysis.id, existingAnalysis.id))
        .returning();
    }

    await tx.delete(mineral).where(eq(mineral.analysisId, existingAnalysis.id));

    await tx.insert(mineral).values(
      mineralSeedData.map((mineralItem) => ({
        analysisId: existingAnalysis.id,
        ...mineralItem,
      }))
    );

    const [existingAcceptance] = await tx
      .select()
      .from(accountAgreementAcceptance)
      .where(eq(accountAgreementAcceptance.userId, existingUser.id))
      .limit(1);

    if (!existingAcceptance) {
      await tx.insert(accountAgreementAcceptance).values({
        userId: existingUser.id,
        timeAccepted: new Date('2026-02-01T10:00:00Z'),
        accepted: true,
        ipAddress: '10.0.0.10/32',
        version: 'v1',
      });
    }

    return {
      userId: existingUser.id,
      farmId,
      managementZoneId: existingZone.id,
      analysisId: existingAnalysis.id,
      mineralCount: mineralSeedData.length,
    };
  });

  console.log(
    JSON.stringify(
      {
        email: seededEmail,
        password: password ?? null,
        auth: authResult,
        ...result,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error('Failed to create admin farm user:', error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
