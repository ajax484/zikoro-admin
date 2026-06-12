export interface InventorySubscription {
  id: number;
  created_at: string;
  organizationAlias: string | null;
  subscriptionPlanAlias: string | null;
  billingCycle: string | null;
  currency: string | null;
  trialExpiryDate: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  subscribedBy: number | null;
  cancelAtSubscriptionEnd: boolean | null;
  cancelledAt: string | null;
  updatedAt: string | null;
  amountPaid: number | null;
  discountCode: string | null;
  discountValue: number | null;
  plan?: string | null;
}

export interface ZikoroDiscount {
  id: number;
  created_at: string;
  discountCode: string | null;
  validUntil: string | null;
  discountAmount: number | null;
  discountPercentage: number | null;
}

export interface InventoryCurrencyConverter {
  id: number;
  created_at: string;
  currency: string | null;
  amount: number | null;
}

export interface SubscriptionPricing {
  id: number;
  created_at: string;
  currency: string | null;
  plan: string | null;
  productType: string | null;
  amount: number | null;
  pricingAlias: string | null;
  subscriptionCycle: string | null;
}

export interface InventorySubscriptionHistoryAndPayment {
  id: number;
  created_at: string;
  userId: number | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
  paymentMethod: string | null;
  organizationAlias: string | null;
  transactionReference: string | null;
  paidAt: string | null;
  eventType: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  subscriptionPricing: SubscriptionPricing | null;
  inventorySubscriptionHistoryAndPaymentAlias: string | null;
}
