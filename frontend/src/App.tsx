import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './lib/authStore';
import { RequireAuth } from './components/auth/RequireAuth';
import { RequireAdmin } from './components/auth/RequireAdmin';

// Public Layout
import Layout from './components/Layout';

// Public Pages
// Public Pages
import Landing from './pages/Landing';
import Product from './pages/Product';
import Token from './pages/Token';
import Datasets from './pages/Datasets';
import Ads from './pages/AdsPage';
import Infrastructure from './pages/Infrastructure';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SeoLanding from './pages/SeoLanding';
import About from './pages/About';
import Docs from './pages/Docs';
import HowItWorks from './pages/HowItWorks';
import UseCases from './pages/UseCases';
import Ambassadors from './pages/Ambassadors';
import Trust from './pages/Trust';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import StatusPage from './pages/Status';
import SeoPage from './pages/SeoPage';
import ModelDataRequests from './pages/ModelDataRequests';
import Jobs from './pages/Jobs';
import JobApplication from './pages/JobApplication';

// Auth Pages
import AuthGateway from './pages/auth/AuthGateway';
import Signup from './pages/auth/Signup';
import Verify from './pages/auth/Verify';
import Login from './pages/auth/Login';
import Reset from './pages/auth/Reset';

// Onboarding Pages
import Intent from './pages/onboarding/Intent';
import Organization from './pages/onboarding/Organization';
import DataTypes from './pages/onboarding/DataTypes';
import Consent from './pages/onboarding/Consent';
import LegoExperience from './pages/onboarding/LegoExperience';
import Complete from './pages/onboarding/Complete';

// App Layout & Pages (Asymmetric)
import AppLayout from './components/layouts/AppLayout';
import Overview from './pages/app/Overview';
import ContributorDashboard from './pages/app/ContributorDashboard';
import EnterpriseDashboard from './pages/app/EnterpriseDashboard';
import DatasetEngine from './pages/app/DatasetEngine';
import DatasetView from './pages/app/DatasetView';
import Inbox from './pages/app/Inbox';
import MarketplacePage from './pages/app/MarketplacePage';
import AdsPage from './pages/app/AdsPage';
import ContributePage from './pages/app/ContributePage';
import ApiPage from './pages/app/ApiPage';
import Settings from './pages/app/Settings';
import MeetingPage from './pages/app/MeetingPage';

// Docs Components
import DocsLayout from './layouts/DocsLayout';
import DocsIntroduction from './pages/docs/Introduction';
import DocsQuickstart from './pages/docs/Quickstart';
import DocsApiOverview from './pages/docs/ApiOverview';

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
} from './pages/admin';

// ScrollToTop component
const ScrollToTopWrapper: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
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
        <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
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
        <Route path="/admin" element={
          <RequireAuth>
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          </RequireAuth>
        }>
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