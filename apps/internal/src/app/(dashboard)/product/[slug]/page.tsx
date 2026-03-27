// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getSeedProductBySlug } from '../../seed-products/actions';

/**
 * Force dynamic rendering to ensure dashboard data is fetched at request time.
 */
export const dynamic = 'force-dynamic';

/**
 * Generates sample trend data for price and inventory charts.
 * In production, this would be replaced with real historical data.
 * @param priceInCents - Current price in cents
 * @param stock - Current stock level
 * @returns Array of monthly data points
 */
function generateTrendData(priceInCents: number, stock: number) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months.map((month, i) => {
    const variation = Math.sin(i * 0.8) * 0.15;
    const stockVariation = Math.cos(i * 0.5) * 0.2;
    return {
      month,
      price: Number(((priceInCents / 100) * (1 + variation)).toFixed(2)),
      inventory: Math.max(
        0,
        Math.round(stock * (1 + stockVariation - i * 0.05))
      ),
    };
  });
}

/** Props for the product detail page */
interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Product detail page showing information and trend graphs for price and inventory.
 * Uses Recharts via ShadCN patterns for chart rendering.
 */
export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getSeedProductBySlug(slug);
      if (!data) {
        toast.error('Product not found.');
      }
      setProduct(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/seed-products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Seed Products
          </Link>
        </Button>
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const trendData = generateTrendData(product.priceInCents, product.stock);

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/seed-products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Seed Products
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
        <p className="text-sm text-muted-foreground">/{product.slug}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${(product.priceInCents / 100).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">per {product.unit}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{product.stock}</p>
            <p className="text-xs text-muted-foreground">units available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{product.unit}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Related IMP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {product.relatedIntegratedManagementPlanId ?? '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{product.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Price Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    'Price',
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#2a2727"
                  strokeWidth={2}
                  name="Price ($)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [value, 'Inventory']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="inventory"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name="Inventory (units)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
