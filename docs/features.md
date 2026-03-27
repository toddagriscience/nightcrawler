# Features and Application System

This is a brief list of features that might be helpful to a newcomer or someone that's unfamiliar with the repository.

## Applications

### Site App (apps/site)

Public website + customer platform.

**Routes**:

- `(unauthenticated)/` - Marketing site (public)
- `(authenticated)/` - Customer account, orders (login required)
- `(viewer-agreement)/` - Legal flow
- `(go)/` - Shortlinks

**Features**:

- User authentication (Supabase)
- Seed ordering + Stripe checkout
- Order management
- AI-powered search
- Content from Sanity CMS
- Internationalization

### Internal Dashboard (apps/internal)

Admin tools, separate Vercel project, same database.

**Features**:

- User management
- Order management
- Database admin
- Team dashboards

## Core Features

### 1. Authentication

- **System**: Supabase
- **Tables**: `users`, `internal_account`
- **Protected routes**: `(authenticated)/`

### 2. Search

- **Tech**: OpenAI embeddings + pgvector
- **Process**: Query → embedding → similarity search
- **Code**: `apps/site/src/lib/ai/`

### 3. Seed Orders

- **Flow**: Browse → Cart → Checkout (Stripe) → Order stored
- **Code**: `apps/site/src/lib/order/`
- **Table**: `seed_order_checkout`

### 4. Content Management

- **CMS**: Sanity
- **Code**: `apps/site/src/lib/sanity/`
- **Components**: `apps/site/src/components/sanity/`

### 5. Payments

- **Provider**: Stripe
- **Uses**: One-time payments, subscriptions
- **Webhook**: `apps/site/src/app/api/stripe/webhook`

### 6. Email

- **Provider**: Nodemailer
- **Uses**: Order confirmations, notifications
- **Config**: `ORDER_EMAIL_*` environment variables

### 7. Analytics

- **Provider**: PostHog
- **Tracks**: User actions, events, errors
- **Setup**: `apps/site/src/app/layout.tsx`

### 8. Admin Panel

- **Code**: `apps/site/src/app/api/admin/`
- **Features**: Product management, order management, promo codes

### 9. Internationalization

- **Tech**: next-intl
- **Translations**: `apps/site/src/messages/`
- **URLs**: `/en/products`, `/es/productos`

## Architecture

We use featured sliced architecture as much as possible.

### Mostly Server Components

- Better performance
- Reduced JS
- Direct DB access

### Server Actions

Data mutations and form handling.

Examples:

```typescript
// apps/site/src/lib/actions/submit-order.ts
async function submitOrder(data: OrderData) {
  // Database mutation
  // Email sending
  // Validation
}
```

### Database Access

All via Drizzle ORM:

- **Queries**: `packages/db/src/queries/`
- **Schema**: `packages/db/src/schema/`
- **Tables**: users, orders, minerals, solubility, etc.

### Logging

```typescript
import { logger } from '@/lib/logger';
logger.info('msg');
logger.error('msg', { error });
```

## Key Tables

- **users** - Accounts
- **internal_account** - Admin accounts
- **seed_order_checkout** - Orders
- **minerals** - Products
- **farm_subscription** - Subscriptions
- **tabs**, **widget** - Dashboard config
- **solubility** - Reference data

## Code Structure

```
apps/site/src/
├── app/
│   ├── (authenticated)/     # Login required
│   ├── (unauthenticated)/   # Public
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # ShadCN
│   └── common/              # Developer created
├── lib/
│   ├── actions/             # Server actions
│   ├── stripe/
│   ├── supabase/            # Auth
│   ├── ai/                  # Embeddings
│   ├── order/
│   ├── sanity/              # Logic for Sanity CMS
│   └── logger.ts
└── ...

packages/db/src/
├── schema/                  # Table definitions
└── queries/                 # Query helpers
```

## Testing

```bash
bun run test           # Run tests
bun run test:coverage  # Coverage
bun storybook          # Component explorer
```

## Environment Variables

See `/apps/site/env.example` for full list.

**Categories**:

- Database: `DATABASE_URL`, `DATABASE_PEM_CERT`
- Auth: `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SECRET_KEY`
- Payments: `STRIPE_*`
- Email: `ORDER_EMAIL_*`
- AI: `OPENAI_EMBEDDINGS_KEY`
- Analytics: `NEXT_PUBLIC_POSTHOG_*`

## Adding Features

Generally speaking, I recommend that you approach new features from the top down, then bottom up. In other words, plan the UI in Figma first, then design the database schema, any routes, and finally, implement the UI the you initially designed in Figma.

1. Plan requirements
2. Add database schema if needed (test locally)
3. Implement server actions/API
4. Create components
5. Add tests
6. Document with JSDoc
7. Add logging
