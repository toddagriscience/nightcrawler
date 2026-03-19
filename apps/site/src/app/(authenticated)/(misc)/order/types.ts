// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { OrderItem } from '@/lib/order/types';

/** Minimal order item payload accepted by the checkout-session server action. */
export interface CreateOrderCheckoutSessionItemInput {
  /** Database id for the seed product. */
  seedProductId: number;
  /** Customer-facing product slug. */
  slug: string;
  /** Customer-facing product name. */
  name: string;
  /** Requested quantity for this line item. */
  quantity: number;
}

/** Payload required to create a Stripe Checkout Session for the current order. */
export interface CreateOrderCheckoutSessionInput {
  /** Current local-order line items. */
  items: CreateOrderCheckoutSessionItemInput[];
}

/** Result returned after attempting to create a Stripe Checkout Session. */
export interface CreateOrderCheckoutSessionResult {
  /** Stripe client secret used to render embedded checkout. */
  clientSecret: string | null;
  /** Recoverable configuration or validation error for checkout. */
  error: string | null;
}

/** Session status returned after a redirected Stripe Checkout completion. */
export interface OrderCheckoutSessionStatusResult {
  /** Stripe Checkout Session status. */
  status: string | null;
  /** Recoverable configuration or validation error for checkout status. */
  error: string | null;
}

/** Props required to render the `/order` client page. */
export interface OrderClientProps {
  /** Current server-provided Stripe publishable key. */
  stripePublishableKey: string | null;
}

/** Visual state for the `/order` checkout modal. */
export type OrderCheckoutModalState = 'loading' | 'checkout';

/** Props required to render the embedded `/order` checkout panel. */
export interface OrderEmbeddedCheckoutProps {
  /** Snapshot of the current local order used to create the checkout session. */
  checkoutItems: OrderItem[];
  /** Current server-provided Stripe publishable key. */
  stripePublishableKey: string;
  /** Called after Stripe reports the checkout completed successfully. */
  onPaymentSuccess: () => void;
  /** Updates the recoverable checkout error shown above the embedded checkout. */
  onErrorChange: (errorMessage: string | null) => void;
}

/** Props required to render the `/order` checkout modal. */
export interface OrderCheckoutModalProps {
  /** Whether the checkout modal is open. */
  isOpen: boolean;
  /** Controls the checkout modal visibility. */
  onOpenChange: (isOpen: boolean) => void;
  /** Current modal state. */
  modalState: OrderCheckoutModalState;
  /** Snapshot of the current local order used to create the checkout session. */
  checkoutItems: OrderItem[];
  /** Current order subtotal shown in the modal summary. */
  subtotal: number;
  /** Total quantity shown in the modal summary. */
  totalUnits: number;
  /** Current server-provided Stripe publishable key. */
  stripePublishableKey: string | null;
  /** Updates the recoverable checkout error shown inside the modal. */
  onErrorChange: (errorMessage: string | null) => void;
  /** Called after Stripe reports the checkout completed successfully. */
  onPaymentSuccess: () => void;
}
