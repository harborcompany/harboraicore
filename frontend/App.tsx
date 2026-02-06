import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './src/lib/authStore';

// Public Layout
import Layout from './src/components/Layout';

// Public Pages
// Public Pages
import Landing from './src/pages/Landing';
import Product from './src/pages/Product';
import Token from './src/pages/Token';
import Datasets from './src/pages/Datasets';
import Ads from './src/pages/AdsPage';
import Infrastructure from './src/pages/Infrastructure';
import Pricing from './src/pages/Pricing';
import Contact from './src/pages/Contact';
import Blog from './src/pages/Blog';
import BlogPost from './src/pages/BlogPost';
import SeoLanding from './src/pages/SeoLanding';
import About from './src/pages/About';
import Docs from './src/pages/Docs';
import HowItWorks from './src/pages/HowItWorks';
import UseCases from './src/pages/UseCases';
import Ambassadors from './src/pages/Ambassadors';
import Trust from './src/pages/Trust';
import Terms from './src/pages/Terms';
import Privacy from './src/pages/Privacy';
import StatusPage from './src/pages/Status';
import SeoPage from './src/pages/SeoPage';
import ModelDataRequests from './src/pages/ModelDataRequests';
import Jobs from './src/pages/Jobs';
import JobApplication from './src/pages/JobApplication';

// Auth Pages
import AuthGateway from './src/pages/auth/AuthGateway';
import Signup from './src/pages/auth/Signup';
import Verify from './src/pages/auth/Verify';
import Login from './src/pages/auth/Login';
import Reset from './src/pages/auth/Reset';

// Onboarding Pages
import Intent from './src/pages/onboarding/Intent';
import Organization from './src/pages/onboarding/Organization';
import DataTypes from './src/pages/onboarding/DataTypes';
import Consent from './src/pages/onboarding/Consent';
import LegoExperience from './src/pages/onboarding/LegoExperience';
import Complete from './src/pages/onboarding/Complete';

// App Layout & Pages (Asymmetric)
import AppLayout from './src/components/layouts/AppLayout';
import Overview from './src/pages/app/Overview';
import ContributorDashboard from './src/pages/app/ContributorDashboard';
import EnterpriseDashboard from './src/pages/app/EnterpriseDashboard';
import DatasetEngine from './src/pages/app/DatasetEngine';
import DatasetView from './src/pages/app/DatasetView';
import Inbox from './src/pages/app/Inbox';
import MarketplacePage from './src/pages/app/MarketplacePage';
import AdsPage from './src/pages/app/AdsPage';
import ContributePage from './src/pages/app/ContributePage';
import ApiPage from './src/pages/app/ApiPage';
import Settings from './src/pages/app/Settings';
import MeetingPage from './src/pages/app/MeetingPage';

// Docs Components
import DocsLayout from './src/layouts/DocsLayout';
import DocsIntroduction from './src/pages/docs/Introduction';
import DocsQuickstart from './src/pages/docs/Quickstart';
import DocsApiOverview from './src/pages/docs/ApiOverview';

// Admin Panel Pages
import {
  AdminLayout,
  AdminOverview,
  AdminUsers,
  AdminIngestion,
  AdminAnnotation,
  AdminDatasets,
  AdminMarketplace,
  AdminAds,
  AdminRevenue,
  AdminInfrastructure,
  AdminCompliance,
  AdminMemory,
  AdminRealtime,
  AdminSettings,
  AdminContributors,
  AdminSubmissionReview,
} from './src/pages/admin';

// ScrollToTop component
const ScrollToTopWrapper: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Auth Guard - Redirects unauthenticated users
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuth();
  const location = useLocation();

  if (!user.authenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Onboarding Guard - Redirects to onboarding if incomplete
const RequireOnboarding: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuth();
  const location = useLocation();

  if (!user.authenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // We now handle onboarding via the SmartOnboardingModal in AppLayout
  // So we don't redirect to separate pages anymore.

  return <>{children}</>;
};

// Redirect authenticated users away from auth pages
const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuth();

  if (user.authenticated && user.onboardingComplete) {
    return <Navigate to="/app" replace />;
  }

  if (user.authenticated && !user.onboardingComplete) {
    return <Navigate to="/onboarding/intent" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTopWrapper />
      <Routes>
        {/* Public Marketing Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="product" element={<Product />} />
          <Route path="token" element={<Token />} />
          <Route path="use-cases" element={<UseCases />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="ads" element={<Ads />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="explore/:slug" element={<SeoLanding />} />
          <Route path="about" element={<About />} />
          <Route path="use-cases" element={<UseCases />} />
          <Route path="ambassadors" element={<Ambassadors />} />

          {/* Documentation Routes */}
          <Route path="docs" element={<DocsLayout />}>
            <Route index element={<DocsIntroduction />} />
            <Route path="quickstart" element={<DocsQuickstart />} />
            <Route path="api" element={<DocsApiOverview />} />
            {/* Fallback for uncreated routes to Intro for now */}
            <Route path="*" element={<DocsIntroduction />} />
          </Route>

          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="trust" element={<Trust />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="status" element={<StatusPage />} />

          {/* Programmatic SEO Routes (168,420+ pages) */}
          {/* Programmatic SEO Routes (168,420+ pages) */}
          <Route path="r/:slug" element={<SeoPage />} />
          <Route path="model-data-requests" element={<ModelDataRequests />} />

          {/* Jobs Routes */}
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobApplication />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<RedirectIfAuthenticated><AuthGateway /></RedirectIfAuthenticated>} />
        <Route path="/auth/signup" element={<RedirectIfAuthenticated><Signup /></RedirectIfAuthenticated>} />
        <Route path="/auth/verify" element={<Verify />} />
        <Route path="/auth/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
        <Route path="/auth/reset" element={<Reset />} />

        {/* Onboarding Routes - Deprecated, redirect to App */}
        <Route path="/onboarding/intent" element={<Intent />} />
        <Route path="/onboarding/lego-experience" element={<LegoExperience />} />
        <Route path="/onboarding/*" element={<Navigate to="/app" replace />} />

        {/* Protected App Routes - Role Based */}
        <Route path="/app" element={<RequireOnboarding><AppLayout /></RequireOnboarding>}>
          <Route index element={<Overview />} />

          {/* Supply Side (Contributor) */}
          <Route path="contributor" element={<ContributorDashboard />} />

          {/* Demand Side (Enterprise) */}
          <Route path="enterprise" element={<EnterpriseDashboard />} />

          <Route path="inbox" element={<Inbox />} />
          <Route path="datasets" element={<DatasetEngine />} />
          <Route path="datasets/:id" element={<DatasetView />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="ads" element={<AdsPage />} />
          <Route path="contribute" element={<ContributePage />} />
          <Route path="api" element={<ApiPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="meet/:room" element={<MeetingPage />} />
        </Route>

        {/* Admin Panel Routes - Internal Only */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="contributors" element={<AdminContributors />} />
          <Route path="submission/:id" element={<AdminSubmissionReview />} />
          <Route path="ingestion" element={<AdminIngestion />} />
          <Route path="annotation" element={<AdminAnnotation />} />
          <Route path="datasets" element={<AdminDatasets />} />
          <Route path="memory" element={<AdminMemory />} />
          <Route path="realtime" element={<AdminRealtime />} />
          <Route path="marketplace" element={<AdminMarketplace />} />
          <Route path="ads" element={<AdminAds />} />
          <Route path="revenue" element={<AdminRevenue />} />
          <Route path="infrastructure" element={<AdminInfrastructure />} />
          <Route path="compliance" element={<AdminCompliance />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;