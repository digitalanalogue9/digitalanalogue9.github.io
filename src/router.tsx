import { createBrowserRouter, Link, NavLink, Outlet, useLocation, useMatches } from 'react-router-dom';
import CoreValuesLogoMark from './components/common/Navigation/CoreValuesLogoMark';
import { lazy, Suspense, useState, type ReactNode } from 'react';
import { NotFoundPage, RouteErrorPage } from './app/AppErrorPage';
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
const ReasoningRoute = lazy(() =>
  import('./app/ReasoningRoute').then(({ ReasoningRoute }) => ({ default: ReasoningRoute }))
);
const CompletedRoute = lazy(() =>
  import('./app/CompletedRoute').then(({ CompletedRoute }) => ({ default: CompletedRoute }))
);

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
  const [homeBackdrop, setHomeBackdrop] = useState<'overview' | 'values'>('overview');
  const valuesFlowPaths = ['/exercise', '/completed', '/reasoning', '/replay'];
  const backgroundVariant =
    location.pathname === '/behaviour'
      ? 'behaviour'
      : valuesFlowPaths.includes(location.pathname)
        ? 'values'
        : location.pathname === '/'
          ? homeBackdrop
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
        <header
          className="bg-ref-color-brand-primary flex-shrink-0 text-white shadow-sm print:hidden"
          role="banner"
          aria-label="Site header"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <Link
              className="hover:border-ref-color-brand-primary rounded-sys-radius-button-sm text-interface-title-3 inline-flex min-w-0 shrink items-center gap-2 border-b-2 border-transparent px-1 py-1 font-sans font-bold !text-white !no-underline transition-colors duration-200 hover:!text-white hover:!no-underline sm:px-2"
              to="/"
              aria-label="Core Values home"
            >
              <CoreValuesLogoMark className="h-8 w-8 flex-shrink-0" />
              <span className="truncate">Core Values</span>
            </Link>
            <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2" aria-label="Main navigation">
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/about' },
                { label: 'How to use', to: '/howtouse' },
                { label: 'Contact', to: '/contact' },
                { label: 'History', to: '/history' },
                { label: 'Privacy', to: '/privacy' },
              ].map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `rounded-sys-radius-button-sm text-interface-base-small min-h-11 border-b-2 px-2 py-2 font-sans font-semibold whitespace-nowrap !text-white !no-underline transition-colors duration-200 hover:bg-white/10 sm:px-3 ${
                      isActive ? 'border-ref-color-brand-primary bg-white/10 font-bold' : 'border-transparent'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
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
            <Outlet context={{ setHomeBackdrop }} />
          </Suspense>
        </main>
        <footer
          className="bg-ref-color-brand-primary text-white md:flex-shrink-0 print:hidden"
          role="contentinfo"
          aria-label="Site footer"
        >
          <div className="text-interface-base-small mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-white sm:px-6 lg:px-8">
            <span>© {new Date().getFullYear()} Core Values</span>
            <PersonalShareButtons />
          </div>
        </footer>
      </div>
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: (
          <RouteMetadata title="Core Values" description="Discover and prioritise your personal values." path="/">
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
            title="Session History - Core Values"
            description="Resume, review, export, and replay Core Values Sessions saved in this browser."
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
      { path: 'completed', element: <CompletedRoute /> },
      { path: 'reasoning', element: <ReasoningRoute /> },
      { path: '*', element: <NotFoundPage />, handle: 'not-found' },
    ],
  },
]);
