export const faqCategories = ['General', 'Services', 'Development Process', 'Project Estimation', 'Security and Privacy', 'Maintenance and Support', 'Internships and Careers'] as const;

export const faqs: { q: string; a: string; category: (typeof faqCategories)[number] }[] = [
  { category: 'General', q: 'What does Yakunex Technologies do?', a: 'We build custom software, web and mobile applications, AI solutions, cloud infrastructure and IT services for businesses.' },
  { category: 'General', q: 'Where are you based?', a: 'Our address is No. 280/A, Illukwaththa, Kadugannawa, Sri Lanka.' },
  { category: 'Services', q: 'Do you only build websites?', a: 'No. Our services cover software engineering, mobile apps, AI integration, data, cloud, security, design, marketing and training.' },
  { category: 'Development Process', q: 'How does a typical project run?', a: 'We move through discovery, planning, build, and delivery, with regular reviews so you can see progress and steer the work.' },
  { category: 'Project Estimation', q: 'Is the online estimator a quotation?', a: 'No. The estimator gives an indicative range only. A formal proposal follows a detailed discussion of your requirements.' },
  { category: 'Project Estimation', q: 'How accurate are the estimates?', a: 'Estimates depend on scope, which is refined during discovery. Treat the result as a starting point for conversation.' },
  { category: 'Security and Privacy', q: 'How is my contact information handled?', a: 'Inquiries are used only to respond to your request or application. See our Privacy Policy for full details.' },
  { category: 'Security and Privacy', q: 'Do you follow security best practices?', a: 'We apply practices such as input validation, least-privilege access and secret management. Specific certifications are not claimed on this site.' },
  { category: 'Maintenance and Support', q: 'Do you offer support after launch?', a: 'Yes. IT Support and Maintenance covers fixes, updates and monitoring. Terms are agreed per engagement.' },
  { category: 'Internships and Careers', q: 'Do you offer internships?', a: 'Our IT Education and internship programme offers learning tracks in software, frontend, mobile, AI, cloud and design.' },
  { category: 'Internships and Careers', q: 'Are there open positions right now?', a: 'Only positions confirmed as open are listed on the Careers page. Otherwise, you can send an expression of interest.' },
];
