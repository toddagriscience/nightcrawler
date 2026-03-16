# Feature Context: Soil Test Parser + Content-to-Markdown Parser

## Project Overview

You're working on the Nightcrawler platform for Todd Agriscience. The platform is a Next.js app (App Router, TypeScript, Drizzle ORM, Supabase auth, PostgreSQL on DigitalOcean, Tailwind, shadcn/ui, Bun).

You're building two parsers. Read this entire file before writing any code.

---

## PARSER 1: Soil Test File Parser

### What it does

Reads soil lab report data (from spreadsheets), converts raw values to PPM where needed, and inserts structured numerical data into the existing database tables (analysis, mineral, ph, solubility).

### Why it exists

Todd's partner lab sends soil test results as spreadsheets. Right now someone manually enters every number. This automates that. Farms test every 3-6 months, so this runs regularly.

### Input format

The lab reports come as spreadsheets with columns like:

```
No. | Description | Depth | SP(%) | pH | EC(dS/m) | Ca(meq/l) | Mg(meq/l) | Na(meq/l) | Cl | ESP(%) | Gypsum Req | Lime | B(mg/l) | NO3-N(mg/kg) | PO4-P(mg/kg) | K(mg/kg) | Zn(mg/kg) | Mn(mg/kg) | Fe(mg/kg) | Cu(mg/kg) | OM(%)
```

Example rows (raw from lab, values in meq/l for Ca/Mg/Na):

```
1  Harden 7     (Lettuce)      69  7.4  1.82  8.8   5.2  4.1   1    0.3  46  68   580  2.6  16   18   2.5  3.7
2  Spreckels 3E (Celery)       46  7.5  2.13  13.3  4.9  5.1   1.2  0.2  27  64   420  3.9  6.7  14   1.5  2.0
```

The same data already converted to PPM (from the Excel "Converted Soil Test Data" sheet):

```
1  Harden 7     (Lettuce)  69  7.4  176.35  63.19  94.26   1    0.3  46  68   580  2.6  16   18   2.5  3.7
2  Spreckels 3E (Celery)   46  7.5  266.53  59.55  117.25  1.2  0.2  27  64   420  3.9  6.7  14   1.5  2.0
```

### Conversion factors

- **Calcium**: meq/l × 20.04 = PPM
- **Magnesium**: meq/l × 12.15 = PPM
- **Sodium**: meq/l × 22.99 = PPM
- **EC/Salts**: dS/m × 640 = PPM
- Values already in mg/kg (PPM), no conversion needed: NO3-N, PO4-P, K, Zn, Mn, Fe, Cu

### Vincent's reference values (from the Data Framework sheet — these are authoritative)

```
Mineral ideal values (PPM):
  Calcium: 16,000      Four Lows threshold: below 2,000
  Magnesium: 11,000    Four Lows threshold: below 4,000
  Sodium: 500          Four Lows threshold: below 10
  Potassium: 1,200     Four Lows threshold: below 200
  Copper: 1.5
  Zinc: 1.5
  Sulfur: 85
  Iron: 85
  Manganese: 40
  Chromium: 20
  Boron: 0.5
  Aluminum: 140
  Phosphorus: 1,100

pH:
  Low: below 5.5
  Ideal: 6.5 - 7.0
  High: above 7.5

Note: if pH is low (below 5.5), cancel calcium mineral (lime) in Four Lows treatment.
```

IMPORTANT: There is a file in the codebase called `standard-values.ts` with DIFFERENT values (much smaller numbers like Ca ideal = 150 PPM). That file uses different reference standards. Vincent's Data Framework values above are the ones to use for this parser. Do NOT use the values from standard-values.ts.

### Lab reference ranges (for determining Low/Med/High tag)

From the lab report footer:

```
                  pH        EC(dS/m)  Ca(meq/l)  Mg(meq/l)  K(mg/kg)   Zn(mg/kg)  Mn(mg/kg)  Fe(mg/kg)  OM(%)
Low:             < 7.3      <1.0      < 5        < 3        <250       < 2.5      < 2.5      <5         <1.0
Medium/Optimal:  7.3-7.8    1.0-2.0   5-10       1/2 Ca     250-350    2.5-4.5    2.5-10     5-10       1-3
High:            7.8+       2.0+      10+        > Ca       350+       4.5+       10+        10+        3+
```

### How to determine the "tag" (Low/Med/High)

Compare the real value to the lab reference ranges above. Use the raw (pre-conversion) values for comparison since the ranges are in the original units.

### How to determine "four_lows"

From Vincent's Data Framework: ALL FOUR must be true simultaneously:

- Calcium below 2,000 PPM
- Magnesium below 4,000 PPM
- Sodium below 10 PPM
- Potassium below 200 PPM

### Target database tables

Read these schema files before coding:

**analysis** (`src/lib/db/schema/analysis.ts`):

- `id`: varchar(13) — generate a unique ID
- `managementZone`: serial FK to management_zone.id
- `analysisDate`: date
- `createdAt`, `updatedAt`: timestamps

**mineral** (`src/lib/db/schema/mineral.ts`):

- `analysisId`: varchar(13) FK
- `name`: varchar (e.g. "Calcium", "Magnesium")
- `real_value`: numeric — the value IN PPM after conversion
- `ideal_value`: numeric — from Vincent's Data Framework above
- `tag`: enum Low/Med/High
- `four_lows`: boolean
- `units`: varchar — "ppm"

**ph** (`src/lib/db/schema/ph.ts`):

- `analysisId`: varchar(13) FK
- `realValue`: numeric
- `idealValueLower`, `idealValueUpper`: 6.5 and 7.0 from Vincent's framework
- `low`, `high`: 5.5 and 7.5 from Vincent's framework
- `tag`: enum Low/Med/High

**solubility** (`src/lib/db/schema/solubility.ts`) — for EC/salts data. Read the schema to see exact fields.

### Implementation

Build as `scripts/parse-soil-test.ts`. Should:

1. Accept a file path argument (CSV or Excel)
2. Parse each row
3. Convert meq/l → PPM where needed
4. Determine tags and four_lows
5. Generate analysis IDs
6. Insert into the DB tables
7. Log what was inserted

Later this becomes an API route for advisor uploads.

### Testing

Test against the DigitalOcean testing DB. Use Vincent's farm (id=2). Create a management zone for testing if needed. The sample data file is in the repo or can be downloaded from the Google Sheet Vincent shared.

Run with: `NODE_TLS_REJECT_UNAUTHORIZED=0 bun run scripts/parse-soil-test.ts <filepath>`

---

## PARSER 2: Content-to-Markdown Parser

### What it does

Takes any content (photos of physical guides, PDFs, Excel sheets with text content, Google Docs) and converts it to clean markdown. One parser, multiple input formats. If it can't understand something (like a hand-drawn diagram), it skips it.

### Why it exists

Todd has ~200 IMPs and physical agricultural guides (old textbook pages, reference charts, compliance documents) that need to be digitized. Vincent and advisors will use this to migrate content into the platform. Oscar is rendering IMPs as markdown in the UI for flexibility.

### The pipeline

```
Any content (image, PDF, spreadsheet, doc)
        ↓
  Detect input type
        ↓
  Extract text:
    - Image → send to vision AI (Gemini or OpenAI)
    - PDF → extract text, or send pages to vision AI if scanned
    - Excel/Spreadsheet with text → read cells
    - Plain text/doc → read directly
        ↓
  Format as clean markdown (headings, tables, lists preserved)
        ↓
  Output markdown string
        ↓
  (Optionally) Store in knowledge_article table + embed for search
```

### Input types to handle

**Images** (JPG, PNG): Physical guide pages like the ones Vincent sent. These contain:

- Reference tables (vegetable pH tolerance, rooting depths, soil-water characteristics)
- pH scale diagrams
- Irrigation diagrams with captions
- Plain text paragraphs
  Use a vision AI model to extract text. Preserve tables as markdown tables. Note when something is a diagram/image that can't be converted to text.

**PDFs**: Like the Produce Safety and Marketing guide (26 pages). These are text-based PDFs (not scanned), so text can be extracted directly. Convert to markdown preserving structure (headings, tables, lists, sections).

**Excel/Spreadsheets with text content**: Like the IMP sheet in Vincent's Excel file. The IMP sheet has columns: Category, Trigger, Body. Each row is a separate piece of content. Convert each row to a markdown document.

**IMP format from the Excel** (34 rows of trigger-based recommendations):

- Category: tags like "spinach, amaranthus" or "soil, pasture" or "corn"
- Trigger: conditions like "low @zinc" or "high @ph" or "@corn + @october-april"
- Body: the actual recommendation text

Example IMP row:

- Category: "spinach, amaranthus"
- Trigger: "low @zinc"
- Body: "In certain Amaranthus species, including spinach and amaranth, plants tend to absorb higher amounts of cadmium..."

### Vision AI setup

The project has an OpenAI API key (`OPENAI_EMBEDDINGS_KEY` in `.env.local`). You can use `gpt-4o` or `gpt-4o-mini` for vision tasks. Or use the Gemini key (`GEMINI_API_KEY`) with `gemini-2.0-flash` for vision.

### Output format

Clean markdown. For reference tables, use markdown tables:

```markdown
# Relative Tolerance of Vegetable Crops to Soil Acidity

| Slightly Tolerant (pH 6.8-6.0) | Moderately Tolerant (pH 6.8-5.5) | Very Tolerant (pH 6.8-5.0) |
| ------------------------------ | -------------------------------- | -------------------------- |
| Asparagus                      | Bean                             | Chicory                    |
| Beet                           | Brussels sprouts                 | Dandelion                  |
```

For text content, use headings, paragraphs, and lists as appropriate.

### Implementation

Build as `src/lib/ai/content-parser.ts` with exported functions:

- `parseImage(imagePath: string): Promise<string>` — image → markdown
- `parsePdf(pdfPath: string): Promise<string>` — PDF → markdown
- `parseExcelContent(filePath: string, sheetName: string): Promise<string[]>` — spreadsheet → array of markdown strings (one per row/section)
- `parseContent(filePath: string): Promise<string | string[]>` — auto-detect type and delegate

Also build a script `scripts/parse-content.ts` for CLI usage:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 bun run scripts/parse-content.ts <filepath>
```

Later this becomes part of the advisor dashboard where they upload files through a UI.

### Integration with search

After parsing content to markdown, it can optionally be:

1. Stored in the `knowledge_article` table (existing schema in `src/lib/db/schema/knowledge.ts`)
2. Embedded using OpenAI embeddings (existing function in `src/lib/ai/embeddings.ts`)
3. Made searchable through the existing `/api/search` endpoint

The search system already works — it was built previously using pgvector with cosine similarity. Embeddings use OpenAI `text-embedding-3-large` (3072 dimensions). The `knowledge_article` table has a `vector(3072)` column.

---

## Environment

- `DATABASE_URL` is set in `.env.local` (DigitalOcean PostgreSQL)
- `NODE_TLS_REJECT_UNAUTHORIZED=0` in `.env.local` for SSL
- `OPENAI_EMBEDDINGS_KEY` in `.env.local` — for embeddings AND vision
- `GEMINI_API_KEY` in `.env.local` — alternative for vision
- Use `bun` to run everything
- DB connection: `src/lib/db/schema/connection.ts`

## Repo Conventions

- Copyright header: `// Copyright © Todd Agriscience, Inc. All rights reserved.`
- Use `logger` from `@/lib/logger` instead of console.log (standalone scripts can use console)
- JSDoc on all exported functions
- Strict TypeScript
- kebab-case files, PascalCase components
- Do NOT create migrations or run `drizzle-kit generate`
- Do NOT modify `standard-values.ts`
- Run `bun format` after work

## Key files to read first

1. `src/lib/db/schema/analysis.ts`
2. `src/lib/db/schema/mineral.ts`
3. `src/lib/db/schema/ph.ts`
4. `src/lib/db/schema/solubility.ts`
5. `src/lib/db/schema/knowledge.ts`
6. `src/lib/db/schema/connection.ts`
7. `src/lib/ai/embeddings.ts`
8. `src/lib/ai/search.ts`
9. `src/lib/db/schema/standard-values.ts` (read but do NOT use its values for the parser)

## Build order

1. Soil test parser first (structured data, more straightforward)
2. Content-to-markdown parser second (multimodal, more complex)
3. Wire markdown output into knowledge base + search (leverages existing infrastructure)
