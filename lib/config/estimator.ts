export const estimator = {
  currency: 'LKR',
  disclaimer:
    'Indicative estimate only. This is not a binding quotation; final pricing and delivery schedules are confirmed following technical discovery.',
  roundTo: 10000,
  rangeLow: 0.9,
  rangeHigh: 1.2,
  projectTypes: {
    web: { label: 'Web Application', base: 400000, weeks: 8 },
    mobile: { label: 'Mobile Application', base: 550000, weeks: 10 },
    ai: { label: 'AI Solution or Chatbot', base: 600000, weeks: 10 },
    enterprise: { label: 'Enterprise Software', base: 900000, weeks: 16 },
    ecommerce: { label: 'E-commerce Platform', base: 750000, weeks: 14 },
    custom: { label: 'Custom Project', base: 500000, weeks: 10 },
  },
  features: {
    auth: { label: 'Authentication', cost: 80000, weeks: 1 },
    admin: { label: 'Admin Dashboard', cost: 150000, weeks: 2 },
    payment: { label: 'Payment Integration', cost: 200000, weeks: 2 },
    thirdparty: { label: 'Third-Party API Integration', cost: 120000, weeks: 1.5 },
    ai: { label: 'AI Features', cost: 250000, weeks: 3 },
    multilang: { label: 'Multi-language Support', cost: 90000, weeks: 1 },
    realtime: { label: 'Real-time Chat', cost: 180000, weeks: 2 },
    analytics: { label: 'Analytics and Reports', cost: 160000, weeks: 2 },
    notifications: { label: 'Notifications', cost: 70000, weeks: 1 },
    cloud: { label: 'Cloud Deployment', cost: 110000, weeks: 1 },
  },
  timelines: {
    '1m': { label: 'Approximately 1 Month', maxWeeks: 4 },
    '3m': { label: 'Approximately 3 Months', maxWeeks: 13 },
    '6m': { label: 'Approximately 6 Months', maxWeeks: 26 },
    flex: { label: 'Flexible Timeline', maxWeeks: 1000 },
  },
} as const;

export type ProjectTypeKey = keyof typeof estimator.projectTypes;
export type FeatureKey = keyof typeof estimator.features;
export type TimelineKey = keyof typeof estimator.timelines;
