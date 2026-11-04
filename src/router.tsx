import { createBrowserRouter, Link, Outlet } from 'react-router-dom';
import OfflineIndicator from './components/common/OfflineIndicator';
import PWAPrompt from './components/common/PWAPrompt';

const routeTitles: Record<string, string> = {
  about: 'About',
  behaviour: 'Behaviour reflection',
  completed: 'Completed session',
  exercise: 'Exercise',
  history: 'History',
  howtouse: 'How to use',
  privacy: 'Privacy',
  reasoning: 'Reasoning',
  replay: 'Replay',
};

function SiteLayout() {
  return (
    <>
      <OfflineIndicator />
      <PWAPrompt />
      <header>
        <Link to="/" aria-label="Core Values home">
          Core Values
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/about">About</Link>
          <Link to="/howtouse">How to use</Link>
          <Link to="/history">History</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function HomePage() {
  return (
    <section>
      <h1>Core Values</h1>
      <p>Reflect on what matters to you.</p>
      <Link to="/exercise">Start an exercise</Link>
    </section>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section>
      <h1>{title}</h1>
      <p>This page is part of the personal Core Values app.</p>
    </section>
  );
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
      { index: true, element: <HomePage /> },
      ...Object.entries(routeTitles).map(([path, title]) => ({
        path,
        element: <PlaceholderPage title={title} />,
      })),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
