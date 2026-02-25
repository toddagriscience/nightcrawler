import { Pool } from 'pg';

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text }] },
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    console.error('Gemini error:', JSON.stringify(data));
    throw new Error('Embedding failed: ' + response.status);
  }
  return data.embedding.values;
}

const articles = [
  {
    title: 'Understanding Soil pH for Crop Production',
    content: `Soil pH is one of the most important factors in crop production. It affects nutrient availability, microbial activity, and root health. Most crops thrive in a pH range of 6.0 to 7.0. When pH drops below 6.0, key nutrients like calcium, magnesium, and phosphorus become less available. When pH rises above 7.5, micronutrients like iron, manganese, and zinc get locked out. To raise pH, apply agricultural lime (calcitic or dolomitic depending on magnesium needs). To lower pH, use elemental sulfur or sulfur-based amendments. Always test before amending. Changes take time — expect 3 to 6 months for full effect. Re-test annually at minimum.`,
    category: 'soil',
    source: 'Todd Field Guide',
  },
  {
    title: 'The Four Lows Condition in Soil',
    content: `When all four base minerals — calcium, magnesium, potassium, and sodium — test low simultaneously, this is called the "four lows" condition. It indicates severely depleted soil biology. The soil is essentially inactive and cannot effectively cycle nutrients. In this state, simply adding mineral amendments will not work because the biological systems needed to make those minerals available to plants are not functioning. The priority is restoring soil biology first. Apply high-quality compost at 3 to 5 tons per acre, introduce microbial inoculants, and consider humic and fulvic acid applications. Once biology recovers, mineral levels will begin to normalize. This process typically takes one to two growing seasons.`,
    category: 'soil',
    source: 'Todd Field Guide',
  },
  {
    title: 'Carrot Production and Soil Requirements',
    content: `Carrots perform best in loose, well-drained sandy loam soils with a pH between 6.0 and 6.8. Heavy clay soils cause forking and misshapen roots. Remove rocks and break up compacted layers before planting. Carrots are light feeders but need consistent potassium for root development and phosphorus for early growth. Avoid fresh manure or high-nitrogen amendments which cause excessive top growth and hairy roots. Plant seeds directly — carrots do not transplant well. Thin seedlings to 2 to 3 inches apart. Keep soil consistently moist during germination, which takes 10 to 21 days. Mulch to retain moisture and prevent green shoulders from sun exposure.`,
    category: 'planting',
    source: 'Todd Field Guide',
  },
  {
    title: 'Irrigation Scheduling and Water Management',
    content: `Effective irrigation is about timing and amount, not just turning on water. Overwatering leaches nutrients, promotes root rot, and wastes resources. Underwatering stresses plants and reduces yield. The goal is to maintain soil moisture in the root zone between field capacity and the management allowable depletion point. Use soil moisture monitoring — tensiometers, capacitance probes, or even the simple feel test — to make informed decisions. Sandy soils need more frequent, lighter irrigations. Clay soils hold more water but are prone to waterlogging. Drip irrigation is the most efficient method for most vegetable crops, reducing water use by 30 to 50 percent compared to overhead sprinklers.`,
    category: 'water',
    source: 'Todd Field Guide',
  },
  {
    title: 'Organic Pest Management Strategies',
    content: `Integrated pest management starts with prevention, not reaction. Healthy soil produces healthy plants that are naturally more resistant to pests and disease. Rotate crops every season to break pest cycles. Use cover crops to suppress weeds and attract beneficial insects. When intervention is needed, start with the least disruptive method. Physical barriers like row covers prevent insect access. Beneficial insects like ladybugs and lacewings control aphids naturally. Bt (Bacillus thuringiensis) targets caterpillars without harming beneficial insects. Neem oil works as both an insecticide and fungicide. Copper-based sprays address fungal diseases but should be used sparingly as copper accumulates in soil over time.`,
    category: 'insects_disease',
    source: 'Todd Field Guide',
  },
  {
    title: 'Post-Harvest Handling and Storage',
    content: `How you handle produce after harvest directly affects shelf life and quality. Cool crops as quickly as possible after picking — field heat is the enemy of freshness. Most vegetables benefit from hydrocooling or forced-air cooling within one hour of harvest. Store leafy greens at 32 to 35 degrees Fahrenheit with high humidity. Root vegetables like carrots and beets store well at 32 to 40 degrees with 90 to 95 percent humidity. Tomatoes should never be refrigerated below 50 degrees as cold damages flavor and texture. Keep ethylene-producing fruits (apples, tomatoes) away from ethylene-sensitive crops (lettuce, broccoli). Clean and sanitize all storage areas between batches.`,
    category: 'harvest_storage',
    source: 'Todd Field Guide',
  },
  {
    title: 'Direct-to-Consumer Market Strategies',
    content: `Farmers markets, CSA programs, and farm stands allow you to capture retail margins instead of wholesale prices. The key is consistency — show up every week with quality product and your customer base will grow. Price based on your actual cost of production plus a fair margin, not based on what the grocery store charges. Tell your story — consumers at farmers markets are buying the relationship as much as the produce. Certifications like organic or regenerative can command premium prices but calculate whether the certification cost is justified by your volume. Consider value-added products like salsa, dried herbs, or pickles to extend your season and increase revenue per acre.`,
    category: 'go_to_market',
    source: 'Todd Field Guide',
  },
  {
    title: 'Understanding Soil Salinity and EC',
    content: `Electrical conductivity (EC) or solubility measures the salt concentration in soil. High salinity damages root cells, reduces water uptake, and stunts growth. An EC above 2.0 mmhos/cm starts to affect sensitive crops. Above 4.0 mmhos/cm, most crops suffer significant yield loss. Common causes include over-fertilization, poor drainage, irrigation with high-salt water, and coastal proximity. To manage salinity, apply gypsum (calcium sulfate) to displace sodium, increase irrigation to leach salts below the root zone, improve drainage, and switch to low-salt fertilizer sources. Salt-tolerant cover crops like barley or certain clovers can help remediate moderately saline soils over time.`,
    category: 'soil',
    source: 'Todd Field Guide',
  },
  {
    title: 'Cover Cropping for Soil Health',
    content: `Cover crops are planted not for harvest but to benefit the soil. They prevent erosion, suppress weeds, fix nitrogen, improve soil structure, and feed soil biology. Legumes like crimson clover and hairy vetch fix atmospheric nitrogen, reducing fertilizer needs for the following cash crop. Grasses like cereal rye produce massive root systems that break up compaction and add organic matter. Brassicas like tillage radish create deep channels that improve water infiltration. Plant cover crops immediately after harvest. Terminate before they set seed using mowing, rolling, or incorporation. Leave residue on the surface as mulch when possible.`,
    category: 'planting',
    source: 'Todd Field Guide',
  },
  {
    title: 'Todd Seed Product: Crimson Clover',
    content: `Crimson clover is a cool-season annual legume and one of our most popular cover crop seeds. It fixes 70 to 150 pounds of nitrogen per acre, reducing or eliminating the need for synthetic nitrogen on the following crop. It establishes quickly in fall, provides excellent weed suppression, and produces dense biomass. The deep red flowers attract pollinators and beneficial insects. Seed at 15 to 25 pounds per acre. Plant in early fall for best results, at least 6 weeks before the first expected frost. Crimson clover prefers well-drained soils with pH between 6.0 and 7.0. It winter-kills in very cold climates (below zone 6) which can be an advantage for no-till systems.`,
    category: 'seed_products',
    source: 'Todd Seed Catalog',
  },
];

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();

  // Check if already seeded
  const existing = await client.query('SELECT COUNT(*) FROM knowledge_article');
  if (parseInt(existing.rows[0].count) > 0) {
    console.log('Articles already exist. Skipping seed.');
    client.release();
    await pool.end();
    process.exit(0);
  }

  for (const article of articles) {
    console.log('Embedding:', article.title);
    const embedding = await getEmbedding(article.title + ' ' + article.content);
    const embeddingStr = '[' + embedding.join(',') + ']';

    await client.query(
      `INSERT INTO knowledge_article (title, content, category, source, embedding)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        article.title,
        article.content,
        article.category,
        article.source,
        embeddingStr,
      ]
    );
    console.log('Inserted:', article.title);
  }

  console.log('Done! Seeded ' + articles.length + ' articles.');
  client.release();
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
