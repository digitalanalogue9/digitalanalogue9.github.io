import { createBrowserRouter, Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ExerciseRoute } from './app/ExerciseRoute';
import { HistoryRoute } from './app/HistoryRoute';
import { ReplayRoute } from './app/ReplayRoute';
import { ReasoningRoute } from './app/ReasoningRoute';
import PrivacyPage from './app/privacy/page';
import CookieBanner from './components/common/CookieBanner';
import GoogleAnalytics from './components/common/GoogleAnalytics';
import OfflineIndicator from './components/common/OfflineIndicator';
import PWAPrompt from './components/common/PWAPrompt';
import { ScenarioReflectionRoute } from './components/features/ScenarioReflection';
import { AboutPage, ContactPage, HelpPage, PersonalShareButtons } from './personal';
import PageMetadata from './personal/PageMetadata';

function RouteMetadata({
  title,
  description,
  path,
  children,
}: {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageMetadata title={title} description={description} path={path} />
      {children}
    </>
  );
}

function SiteLayout() {
  return (
    <>
      <GoogleAnalytics GA_MEASUREMENT_ID="G-JZPX5JCP5D" />
      <OfflineIndicator />
      <PWAPrompt />
      <header role="banner" aria-label="Site header">
        <Link to="/" aria-label="Core Values home">
          Core Values
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/about">About</Link>
          <Link to="/howtouse">How to use</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/history">History</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
      </header>
      <main id="main-content" role="main" aria-label="Main content">
        <Outlet />
      </main>
      <CookieBanner />
      <footer role="contentinfo" aria-label="Site footer">
        <span>© {new Date().getFullYear()} Core Values</span>
        <PersonalShareButtons />
      </footer>
    </>
  );
}

function HomePage() {
  return (
    <section aria-labelledby="home-heading">
      <h1 id="home-heading">Core Values</h1>
      <p>Reflect on what matters to you.</p>
      <nav aria-label="Core Values activities">
        <Link to="/exercise">Start an exercise</Link>
        <Link to="/behaviour">Explore behaviour reflection</Link>
      </nav>
    </section>
  );
}

function LegacySessionRoute({ destination }: { destination: string }) {
  const { search } = useLocation();
  return <Navigate to={`${destination}${search}`} replace />;
}

function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <Link to="/">Return home</Link>
    </section>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      {
        index: true,
        element: (
          <RouteMetadata title="Core Values" description="Discover and prioritise your personal values." path="/">
            <HomePage />
          </RouteMetadata>
        ),
      },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'howtouse', element: <HelpPage /> },
      {
        path: 'privacy',
        element: (
          <RouteMetadata
            title="Core Values Privacy Policy"
            description="Learn how Core Values stores local data and uses analytics only with your consent."
            path="/privacy"
          >
            <PrivacyPage />
          </RouteMetadata>
        ),
      },
      {
        path: 'behaviour',
        element: (
          <RouteMetadata
            title="Scenario reflection - Core Values"
            description="Consider possible intentions and perceptions of hypothetical choices."
            path="/behaviour"
          >
            <ScenarioReflectionRoute />
          </RouteMetadata>
        ),
      },
      {
        path: 'exercise',
        element: (
          <RouteMetadata
            title="Core Values exercise"
            description="Sort personal or team-focused values into importance categories."
            path="/exercise"
          >
            <ExerciseRoute />
          </RouteMetadata>
        ),
      },
      {
        path: 'history',
        element: (
          <RouteMetadata
            title="Session history - Core Values"
            description="Review, resume, export, and replay locally saved Core Values exercises."
            path="/history"
          >
            <HistoryRoute />
          </RouteMetadata>
        ),
      },
      {
        path: 'replay',
        element: (
          <RouteMetadata
            title="Session replay - Core Values"
            description="Replay the saved choices from a completed Core Values exercise."
            path="/replay"
          >
            <ReplayRoute />
          </RouteMetadata>
        ),
      },
      { path: 'completed', element: <LegacySessionRoute destination="/exercise" /> },
      { path: 'reasoning', element: <ReasoningRoute /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
