// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Form values for the seed product order form. */
export interface SeedOrderFormValues {
  /** Requested quantity to add to the local order */
  quantity: number;
}

/** Props required to add a seed product to the local order. */
export interface SeedOrderFormProps {
  /** Database id for the seed product */
  seedProductId: number;
  /** Product slug used for links and storage keys */
  slug: string;
  /** Customer-facing product name */
  name: string;
  /** Product summary used in the order line item */
  description: string;
  /** Available inventory for client-side quantity limits */
  stock: number;
  /** Image URL or local asset path for the product */
  imageUrl: string | null;
  /** Unit label used in price and quantity messaging */
  unit: string;
  /** Unit price in cents */
  priceInCents: number;
}

/** Props for the product order success modal. */
export interface OrderSuccessModalProps {
  /** Whether the success modal is open */
  isOpen: boolean;
  /** Called when the success modal open state changes */
  onOpenChange: (isOpen: boolean) => void;
  /** Customer-facing product name shown in the success copy */
  productName: string;
}
