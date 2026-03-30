// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Single line item stored in the customer's local order. */
export interface OrderItem {
  /** Seed product id stored in the database */
  seedProductId: number;
  /** Product slug used for linking back to the detail page */
  slug: string;
  /** Product name shown in the order UI */
  name: string;
  /** Short product description for order review */
  description: string;
  /** Remaining stock at the time the item was added */
  stock: number;
  /** Product image URL or local asset path */
  imageUrl: string | null;
  /** Unit label used when displaying quantity and price */
  unit: string;
  /** Unit price in cents */
  priceInCents: number;
  /** Quantity requested by the customer */
  quantity: number;
}

/** Serialized order state saved in local storage. */
export interface OrderState {
  /** All currently selected items */
  items: OrderItem[];
  /** ISO timestamp for the latest local order change */
  updatedAt: string | null;
}

/** Product payload required to add a new line item to the local order. */
export interface AddOrderItemInput extends Omit<OrderItem, 'quantity'> {
  /** Optional starting quantity, defaults to 1 */
  quantity?: number;
}
