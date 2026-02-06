# App Flow

## Public Marketing
**Layout**: `components/Layout`
- `/` - Landing Page
- `/product` - Product Overview
- `/token` - Token Information
- `/use-cases` - Use Cases
- `/datasets` - Datasets Browser
- `/ads` - Advertising Info
- `/infrastructure` - Infrastructure Details
- `/pricing` - Pricing Plans
- `/contact` - Contact Form
- `/blog` - Blog Index
- `/blog/:slug` - Blog Post
- `/about` - About Us
- `/ambassadors` - Ambassadors Program
- `/docs` - Documentation
- `/how-it-works` - How functionality works
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/status` - System Status
- `/model-data-requests` - Model Data Requests Page

### Programmatic SEO
- `/tools/:category/:slug`
- `/guides/:slug`
- `/compare/:slug`

## Authentication
**Gateways**:
- `/auth`
- `/auth/signup`
- `/auth/verify`
- `/auth/login`
- `/auth/reset`

## Onboarding (Deprecated/Redirects)
- `/onboarding/intent` -> App
- `/onboarding/*` -> App

## Web App (Protected)
**Layout**: `components/layouts/AppLayout`
**Requirement**: Auth + Onboarding Complete
- `/app` - Overview Dashboard
- `/app/contributor` - Contributor Dashboard (Supply Side)
- `/app/enterprise` - Enterprise Dashboard (Demand Side)
- `/app/inbox` - Messages/Notifications
- `/app/datasets` - Dataset Engine
- `/app/datasets/:id` - Dataset View
- `/app/marketplace` - Marketplace
- `/app/ads` - Ad Management
- `/app/contribute` - Contribution Interface
- `/app/api` - API Key/Dev Settings
- `/app/settings` - User Settings
- `/app/meet/:room` - Meeting Interface

## Admin Panel (Internal)
**Layout**: `pages/admin/AdminLayout`
- `/admin` - Overview
- `/admin/users` - User Management
- `/admin/ingestion` - Ingestion Pipeline
- `/admin/annotation` - Annotation Tools
- `/admin/datasets` - Dataset Admin
- `/admin/memory` - Memory/Context Admin
- `/admin/realtime` - Realtime Monitoring
- `/admin/marketplace` - Marketplace Admin
- `/admin/ads` - Ad Admin
- `/admin/revenue` - Revenue/Finance
- `/admin/infrastructure` - Infra Status
- `/admin/compliance` - Compliance/Legal
- `/admin/settings` - System Settings
