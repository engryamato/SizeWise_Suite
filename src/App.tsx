import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { AirDuctSizerUI } from '@/tools/air-duct-sizer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-gray-800">
                    SizeWise Suite
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/air-duct-sizer"
                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Air Duct Sizer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/air-duct-sizer" element={<AirDuctSizerUI />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
