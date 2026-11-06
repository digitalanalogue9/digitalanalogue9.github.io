import { createBrowserRouter, Link, NavLink, Outlet, useLocation, useMatches } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import { NotFoundPage, RouteErrorPage } from './app/AppErrorPage';
import CoreValuesLogoMark from './components/common/Navigation/CoreValuesLogoMark';
import CookieBanner from './components/common/CookieBanner';
import GoogleAnalytics from './components/common/GoogleAnalytics';
import OfflineIndicator from './components/common/OfflineIndicator';
import PWAPrompt from './components/common/PWAPrompt';
import HomeClient from './app/HomeClient';
import { AboutPage, ContactPage, HelpPage, PersonalShareButtons } from './personal';
import PageMetadata from './personal/PageMetadata';

const PrivacyPage = lazy(() => import('./app/privacy/page'));
const BehaviourReflectionPage = lazy(() => import('./app/behaviour/page'));
const ExerciseRoute = lazy(() => import('./app/ExerciseRoute').then(({ ExerciseRoute }) => ({ default: ExerciseRoute })));
const HistoryRoute = lazy(() => import('./app/HistoryRoute').then(({ HistoryRoute }) => ({ default: HistoryRoute })));
const ReplayRoute = lazy(() => import('./app/ReplayRoute').then(({ ReplayRoute }) => ({ default: ReplayRoute })));
const ReasoningRoute = lazy(() => import('./app/ReasoningRoute').then(({ ReasoningRoute }) => ({ default: ReasoningRoute })));
const CompletedRoute = lazy(() => import('./app/CompletedRoute').then(({ CompletedRoute }) => ({ default: CompletedRoute })));

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
  const location = useLocation();
  const isNotFoundRoute = useMatches().some((match) => match.handle === 'not-found');
  const valuesFlowPaths = ['/exercise', '/completed', '/reasoning', '/replay'];
  const backgroundVariant =
    location.pathname === '/behaviour'
      ? 'behaviour'
      : valuesFlowPaths.includes(location.pathname)
        ? 'values'
        : 'overview';
  const backgroundClassName = isNotFoundRoute
    ? 'core-values-error-background'
    : `core-values-background core-values-background--${backgroundVariant}`;

  return (
    <>
      <GoogleAnalytics GA_MEASUREMENT_ID="G-JZPX5JCP5D" />
      <OfflineIndicator />
      <PWAPrompt />
      <div className="core-values-shell flex min-h-screen flex-col">
        <header className="public-header print:hidden" role="banner" aria-label="Site header">
          <div className="public-header-inner">
            <Link className="public-brand" to="/" aria-label="Core Values home">
              <CoreValuesLogoMark className="h-8 w-8 flex-shrink-0" />
              <span>Core Values</span>
            </Link>
            <nav className="public-nav" aria-label="Main navigation">
              <NavLink to="/howtouse">How it works</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/history">History</NavLink>
              <Link className="public-nav-action" to="/exercise">Find my core values</Link>
            </nav>
          </div>
        </header>
        <CookieBanner />
        <main
          id="main-content"
          className={`${backgroundClassName} flex flex-1 flex-col bg-no-repeat px-4 py-8 sm:px-6 lg:px-8 print:block print:overflow-visible print:bg-none print:px-0 print:py-0`}
          role="main"
          aria-label="Main content"
        >
          <Suspense fallback={<p role="status">Loading page…</p>}>
            <Outlet />
          </Suspense>
        </main>
        <footer className="public-footer print:hidden" role="contentinfo" aria-label="Site footer">
          <div className="public-footer-inner">
            <span>© {new Date().getFullYear()} Core Values</span>
            <nav aria-label="Footer navigation">
              <Link to="/privacy">Privacy</Link>
              <Link to="/contact">Contact</Link>
            </nav>
            <PersonalShareButtons />
          </div>
        </footer>
      </div>
    </>
  );
}

const homeDescription =
  'Sort value cards, choose what matters most to you and reflect on your priorities. Save your exercise in this browser and return to it later.';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: (
          <RouteMetadata title="Core Values · Explore what matters to you" description={homeDescription} path="/">
            <HomeClient />
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
            <BehaviourReflectionPage />
          </RouteMetadata>
        ),
      },
      {
        path: 'exercise',
        element: (
          <RouteMetadata title="Core Values exercise" description="Sort personal or team-focused values into importance categories." path="/exercise">
            <ExerciseRoute />
          </RouteMetadata>
        ),
      },
      {
        path: 'history',
        element: (
          <RouteMetadata title="Session History - Core Values" description="Resume, review, export, and replay Core Values Sessions saved in this browser." path="/history">
            <HistoryRoute />
          </RouteMetadata>
        ),
      },
      {
        path: 'replay',
        element: (
          <RouteMetadata title="Session replay - Core Values" description="Replay the saved choices from a completed Core Values exercise." path="/replay">
            <ReplayRoute />
          </RouteMetadata>
        ),
      },
      { path: 'completed', element: <CompletedRoute /> },
      { path: 'reasoning', element: <ReasoningRoute /> },
      { path: '*', element: <NotFoundPage />, handle: 'not-found' },
    ],
  },
]);
