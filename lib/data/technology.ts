export const techTabs = [
  { key: 'Frontend', items: [
    ['Next.js', 'Routing, rendering and performance for content-rich sites and apps.'],
    ['React', 'Component model that keeps interfaces predictable as they grow.'],
    ['TypeScript', 'Catches data-shape errors before they reach users.'],
    ['Tailwind CSS', 'Consistent spacing and colour tokens across pages.'],
    ['Framer Motion', 'Purposeful motion that respects reduced-motion settings.'],
    ['Three.js', 'Used selectively for 3D where it adds real value.'] ] },
  { key: 'Backend', items: [
    ['Node.js', 'A single language across front end and back end for faster teams.'],
    ['REST APIs', 'Clear, cacheable endpoints that other systems can consume.'],
    ['Authentication', 'Verifies who the user is, using proven providers rather than custom crypto.'],
    ['Authorisation', 'Decides what each role may do, enforced on the server.'],
    ['API validation', 'Schemas reject malformed input at the boundary.'],
    ['Modular services', 'Separated business logic that can evolve independently.'] ] },
  { key: 'Database', items: [
    ['Relational (PostgreSQL)', 'Strong consistency for orders, invoices and bookings.'],
    ['Document stores', 'Flexible schemas for content that varies between records.'],
    ['Data modelling', 'Designing tables around real business questions.'],
    ['Indexing', 'Keeps frequent queries fast as data grows.'],
    ['Backup and recovery', 'Tested restore procedures matter more than backup files alone.'] ] },
  { key: 'Cloud & Infrastructure', items: [
    ['AWS', 'Broad managed services where scale or compliance needs justify them.'],
    ['Vercel', 'Fast deployment for Next.js front ends with preview environments.'],
    ['Docker', 'Packages applications so they run the same way everywhere.'],
    ['CI/CD', 'Automated tests and deployments on every change.'],
    ['Monitoring and logging', 'Early warning when something degrades in production.'] ] },
  { key: 'AI & Data', items: [
    ['AI API integration', 'Connects established model APIs to your workflows.'],
    ['Chatbot systems', 'Grounded answers with human escalation.'],
    ['Image analysis', 'Classification and detection for inspection or identification tasks.'],
    ['Data processing', 'Cleaning and transforming data before analysis.'],
    ['Analytics', 'Dashboards that make trends visible to decision-makers.'] ] },
  { key: 'Security & Delivery', items: [
    ['Least privilege', 'Every account and service gets only the access it needs.'],
    ['Input validation', 'Never trust data from the browser or other systems.'],
    ['Secret management', 'Keys live in environment or vault stores, never in source code.'],
    ['HTTPS and headers', 'Encrypted transport and secure browser policies.'],
    ['Dependency maintenance', 'Regular updates and vulnerability scanning.'] ] },
];
