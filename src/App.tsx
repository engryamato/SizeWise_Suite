import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { testFunction } from '@/test-alias';
import ThemeToggle from '@/components/ThemeToggle';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ToolLoader from '@/components/ToolLoader';
import ToolDashboard from '@/components/ToolDashboard';
import ToolRegistry from '@/core/toolRegistrar';

const Home = lazy(() => import('@/pages/Home'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  useEffect(() => {
    console.log(testFunction());
    // Initialize tool registry when app loads
    const initToolRegistry = async () => {
      try {
        const registry = ToolRegistry.getInstance();
        await registry.initialize();
      } catch (error) {
        console.error('Failed to initialize tool registry:', error);
      }
    };
    
    initToolRegistry();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link to="/" className="text-xl font-bold text-gray-800">
                      SizeWise Suite
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
                    <Link
                      to="/"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium rounded-md"
                    >
                      Home
                    </Link>
                    <Link
                      to="/tools"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium rounded-md"
                    >
                      Tools
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-6">
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tools" element={<ToolDashboard />} />
                <Route path="/:toolId" element={<ToolLoader />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;
