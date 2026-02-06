# Product Requirements Document (Inferred)

## Product Vision
Harbor is a dual-sided marketplace and platform connecting "Contributors" (Data Supply) with "Enterprises" (Data Demand) for AI model training. It includes a token component, potentially for incentivization or payment.

## User Personas
1. **Contributor**: Individuals providing data (likely multimodal given "datasets", "videos", "lego") for AI training.
2. **Enterprise**: Companies purchasing datasets or accessing AI infrastructure.
3. **Admin**: Platform operators managing the system.

## Core Features

### 1. Public Presence & SEO
- Comprehensive marketing pages (Product, Token, Infrastructure, Pricing).
- Programmatic SEO Pages (Tools, Guides, Compare) to drive traffic.
- Blog system for content marketing.

### 2. Authentication & Onboarding
- Full auth flow (Signup, Login, Verify, Reset).
- "Smart Onboarding" to segment users into Organizations/Intents.

### 3. Web App (The "Harbor")
- **Dashboards**: Separate views for Contributors vs Enterprise.
- **Dataset Engine**: Browsing and viewing datasets.
- **Marketplace**: Buying/selling data assets.
- **Contribution**: Interface for uploading/annotating data.
- **Ads**: Ad management system (presumably for ads shown on the platform or related to data promotion).
- **Communication**: Inbox and Meeting rooms.

### 4. Admin Infrastructure
- Full control over users, ingestion pipelines, annotation, and revenue.
- Compliance and Infrastructure monitoring.

## Technical Requirements
- **Frontend**: React, Tailwind CSS, TypeScript.
- **Routing**: React Router DOM with role-based guards (RequireAuth, RequireOnboarding).
- **Design**: "Premium" aesthetic, black/white/gray palette with purpose, glassmorphism touches.
