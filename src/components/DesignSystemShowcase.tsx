import React from 'react';
import { 
  Search, 
  Plus, 
  Settings, 
  User, 
  Bell, 
  ChevronDown,
  Grid,
  List,
  MapPin,
  Users,
  Truck,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info
} from 'lucide-react';

// Design System Showcase Component
export const DesignSystemShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Design System Showcase</h1>
          <p className="text-xl text-gray-600">Modern Business Application UI Components</p>
        </div>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Color Palette</h2>
          
          {/* Primary Colors */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Primary Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-500 h-20 rounded-lg flex items-center justify-center text-white font-medium">Blue-500</div>
              <div className="bg-emerald-500 h-20 rounded-lg flex items-center justify-center text-white font-medium">Emerald-500</div>
              <div className="bg-purple-500 h-20 rounded-lg flex items-center justify-center text-white font-medium">Purple-500</div>
              <div className="bg-orange-500 h-20 rounded-lg flex items-center justify-center text-white font-medium">Orange-500</div>
            </div>
          </div>

          {/* Status Colors */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Status Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-center font-medium">Success</div>
              <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-center font-medium">Warning</div>
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center font-medium">Error</div>
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-center font-medium">Info</div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Typography</h2>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Heading 1 - 4xl Bold</h1>
            <h2 className="text-3xl font-semibold text-gray-900">Heading 2 - 3xl Semibold</h2>
            <h3 className="text-2xl font-medium text-gray-900">Heading 3 - 2xl Medium</h3>
            <h4 className="text-xl font-medium text-gray-900">Heading 4 - xl Medium</h4>
            <p className="text-lg text-gray-700">Body Large - lg Regular</p>
            <p className="text-base text-gray-700">Body - base Regular</p>
            <p className="text-sm text-gray-600">Small - sm Regular</p>
            <p className="text-xs text-gray-500">Caption - xs Regular</p>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Buttons</h2>
          
          {/* Button Variants */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Button Variants</h3>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                Primary
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Secondary
              </button>
              <button className="text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Ghost
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                Destructive
              </button>
            </div>
          </div>

          {/* Button Sizes */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium">
                Small
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
                Medium
              </button>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium">
                Large
              </button>
            </div>
          </div>

          {/* Icon Buttons */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Icon Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="text-blue-500 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Form Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Input Fields</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Select & Dropdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Select & Dropdown</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select className="w-full px-3 py-2 pr-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">View Mode</label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-900 shadow-sm">
                    <Grid className="w-4 h-4 mr-2" />
                    Grid
                  </button>
                  <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    <List className="w-4 h-4 mr-2" />
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-medium text-gray-900 flex-1 pr-2">
                  Downtown Office Complex
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    VIN-001
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    WIP
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-500 mb-3">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">Seattle, WA</span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <div className="flex items-center -space-x-1">
                    <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700">
                      AJ
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700">
                      BS
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                      +2
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <Truck className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="text-sm truncate max-w-24">Trailer-A</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <span className="text-sm text-gray-500">2 weeks</span>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">24</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">+12%</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>

            {/* Alert Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Attention Required</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Project "Retail Storefront" is approaching deadline.
                  </p>
                  <button className="text-sm text-blue-600 font-medium mt-2 hover:text-blue-700">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status Badges */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Status Badges</h2>
          
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
              PV90
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              UB
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
              WB
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              WIP
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              Completed
            </span>
          </div>
        </section>

        {/* Navigation Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Navigation</h2>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
                <p className="text-sm text-gray-500">24 Projects</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select className="px-3 py-2 pr-7 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button className="p-2 rounded-md bg-white text-gray-900 shadow-sm">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-md text-gray-600 hover:text-gray-900">
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  New Project
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing Scale */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Spacing Scale</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-gray-600">4px</div>
              <div className="w-1 h-4 bg-blue-500"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-gray-600">8px</div>
              <div className="w-2 h-4 bg-blue-500"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-gray-600">12px</div>
              <div className="w-3 h-4 bg-blue-500"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-gray-600">16px</div>
              <div className="w-4 h-4 bg-blue-500"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-gray-600">24px</div>
              <div className="w-6 h-4 bg-blue-500"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-gray-600">32px</div>
              <div className="w-8 h-4 bg-blue-500"></div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
