export type SubscriptionPlan = 'starter' | 'growth' | 'scale' | 'enterprise';

export interface PlanConfig {
  name: string;
  branchLimit: number;
  monthlyPrice: number;
}

export const PLANS: Record<SubscriptionPlan, PlanConfig> = {
  starter: {
    name: 'Starter',
    branchLimit: 1,
    monthlyPrice: 5000, // NGN
  },
  growth: {
    name: 'Growth',
    branchLimit: 5,
    monthlyPrice: 15000,
  },
  scale: {
    name: 'Scale',
    branchLimit: 20,
    monthlyPrice: 50000,
  },
  enterprise: {
    name: 'Enterprise',
    branchLimit: 9999, // Unlimited
    monthlyPrice: 150000,
  },
};
