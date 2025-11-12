import React, { useState } from 'react';
import { Search, Filter, Bookmark, ChevronDown, ChevronRight, ExternalLink, FileText, User } from 'lucide-react';

const CompassWireframes = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [expandedCamp, setExpandedCamp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Home Screen
  const HomeScreen = () => (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Compass</h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Recent Searches</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-700 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
              AI and reskilling workers
            </div>
            <div className="text-sm text-gray-700 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
              Enterprise AI transformation
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Saved Searches</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-700 p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Future of knowledge work
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold mb-2 text-center">Find Your Position</h1>
          <p className="text-gray-600 mb-8 text-center">
            Validate your thesis and discover where you fit in the AI discourse
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Paste your thesis or search by keywords..."
                className="flex-1 text-lg outline-none"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
              </button>
              <button 
                onClick={() => setCurrentScreen('results')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>All Domains</option>
                    <option>Business</option>
                    <option>Society</option>
                    <option>Workers</option>
                    <option>Technology</option>
                    <option>Policy & Regulation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Camp/Position</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>All Camps</option>
                    <option>Optimistic Transformationalists</option>
                    <option>Automation Pessimists</option>
                    <option>Pragmatic Incrementalists</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Andrew Ng"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Last 12 months</option>
                    <option>Last 6 months</option>
                    <option>Last 3 months</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Topics */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">Suggested topics:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                AI impact on creative work
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                Enterprise AI adoption challenges
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                AI regulation frameworks
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Results Screen
  const ResultsScreen = () => (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Compass</h2>
        
        <button 
          onClick={() => setCurrentScreen('home')}
          className="text-sm text-blue-600 mb-4 hover:underline"
        >
          ← New Search
        </button>

        <div className="mb-4 p-3 bg-blue-50 rounded">
          <div className="text-xs text-gray-500 mb-1">Current Search</div>
          <div className="text-sm font-medium">AI will augment workers but requires reskilling</div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Recent Searches</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-700 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
              Enterprise AI transformation
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          {/* Search Bar at Top */}
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value="AI will augment workers but requires reskilling"
              className="flex-1 outline-none"
            />
            <button className="text-sm text-blue-600 hover:underline">Edit</button>
          </div>

          {/* Executive Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Positioning Snapshot</h2>
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                Save Search
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-700">12</div>
                <div className="text-sm text-gray-600">Strong Alignment</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-700">8</div>
                <div className="text-sm text-gray-600">Partial Alignment</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-700">5</div>
                <div className="text-sm text-gray-600">Challenge Your View</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-700">2</div>
                <div className="text-sm text-gray-600">Emerging Views</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold text-sm mb-2">💡 White Space Opportunities</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Most thinkers focus on tech sector - limited coverage of healthcare/education</li>
                <li>• Reskilling discussed theoretically - few practitioners sharing implementation</li>
              </ul>
            </div>
          </div>

          {/* Camps List */}
          <div className="space-y-4">
            {/* Camp 1 */}
            <div className="bg-white rounded-lg shadow">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => setExpandedCamp(expandedCamp === 1 ? null : 1)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {expandedCamp === 1 ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    <h3 className="font-bold text-lg">Optimistic Transformationalists</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Strong Alignment
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    AI will transform work positively with proper preparation and reskilling programs
                  </p>
                </div>
                <div className="text-sm text-gray-500">12 authors</div>
              </div>

              {expandedCamp === 1 && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  {/* Author Card */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg cursor-pointer hover:text-blue-600 flex items-center gap-2">
                          Andrew Ng
                          <User className="w-4 h-4" />
                        </h4>
                        <p className="text-sm text-gray-600">deeplearning.ai • Seminal Thinker</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Academic/Practitioner
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-500 mb-1">WHY IT MATTERS</div>
                      <p className="text-sm text-gray-700">
                        Directly supports your reskilling argument with specific program models and implementation frameworks
                      </p>
                    </div>

                    <div className="mb-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                      <div className="text-xs font-semibold text-gray-500 mb-1">KEY QUOTE</div>
                      <p className="text-sm italic">
                        "The solution isn't to slow AI, but to accelerate education and reskilling programs to match the pace of change."
                      </p>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-500 mb-2">3 CITATIONS</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="flex-1">AI Transformation Playbook (Blog, 2024)</span>
                          <ExternalLink className="w-4 h-4 text-blue-600 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="flex-1">Stanford Lecture Series (Video, 2024)</span>
                          <ExternalLink className="w-4 h-4 text-blue-600 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="flex-1">Workforce Development in AI Era (Paper, 2024)</span>
                          <ExternalLink className="w-4 h-4 text-blue-600 cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <button className="text-sm text-blue-600 hover:underline">
                      View all sources by Andrew Ng →
                    </button>
                  </div>

                  <div className="text-center py-2">
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Show 11 more authors in this camp
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Camp 2 - Collapsed */}
            <div className="bg-white rounded-lg shadow">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => setExpandedCamp(expandedCamp === 2 ? null : 2)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <ChevronRight className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Automation Pessimists</h3>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      Challenges Your View
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    AI will displace workers faster than reskilling programs can adapt
                  </p>
                </div>
                <div className="text-sm text-gray-500">5 authors</div>
              </div>
            </div>

            {/* Camp 3 - Collapsed */}
            <div className="bg-white rounded-lg shadow">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => setExpandedCamp(expandedCamp === 3 ? null : 3)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <ChevronRight className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Implementation Practitioners</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Emerging
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Doesn't fit existing camps - focuses on change management and execution challenges
                  </p>
                </div>
                <div className="text-sm text-gray-500">2 authors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Navigation */}
      <div className="bg-gray-800 text-white p-3 flex gap-4">
        <button 
          onClick={() => setCurrentScreen('home')}
          className={`px-3 py-1 rounded ${currentScreen === 'home' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentScreen('results')}
          className={`px-3 py-1 rounded ${currentScreen === 'results' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          Results
        </button>
      </div>

      {/* Render Current Screen */}
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'results' && <ResultsScreen />}
    </div>
  );
};

export default CompassWireframes;