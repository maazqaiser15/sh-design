import React, { useState } from 'react';
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
  Info,
  Home,
  BarChart3,
  Package,
  ShoppingCart,
  Users2,
  Shield,
  Menu,
  X
} from 'lucide-react';

// Design System Library Component
export const DesignSystemLibrary: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('typography');

  const tabs = [
    { id: 'typography', label: 'Typography', icon: 'Aa' },
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'components', label: 'Components', icon: '🧩' },
    { id: 'layout', label: 'Layout', icon: '📐' },
    { id: 'forms', label: 'Forms', icon: '📝' },
    { id: 'navigation', label: 'Navigation', icon: '🧭' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Design System Library</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search components..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4 mr-2 inline" />
              Add Component
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative md:translate-x-0 z-30 w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Components</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'typography' && <TypographySection />}
          {activeTab === 'colors' && <ColorsSection />}
          {activeTab === 'components' && <ComponentsSection />}
          {activeTab === 'layout' && <LayoutSection />}
          {activeTab === 'forms' && <FormsSection />}
          {activeTab === 'navigation' && <NavigationSection />}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Typography Section
const TypographySection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Typography</h2>
      <p className="text-lg text-gray-600">Font families, sizes, weights, and text styling utilities.</p>
    </div>

    {/* Display Text */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Display Text</h3>
      <div className="space-y-4">
        <div className="text-display-2xl text-gray-900">Display 2XL</div>
        <div className="text-display-xl text-gray-900">Display XL</div>
        <div className="text-display-lg text-gray-900">Display Large</div>
      </div>
    </section>

    {/* Headings */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Headings</h3>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Heading 1 - 4xl Bold</h1>
        <h2 className="text-3xl font-semibold text-gray-900">Heading 2 - 3xl Semibold</h2>
        <h3 className="text-2xl font-medium text-gray-900">Heading 3 - 2xl Medium</h3>
        <h4 className="text-xl font-medium text-gray-900">Heading 4 - xl Medium</h4>
        <h5 className="text-lg font-medium text-gray-900">Heading 5 - lg Medium</h5>
      </div>
    </section>

    {/* Body Text */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Body Text</h3>
      <div className="space-y-3">
        <p className="text-lg text-gray-700">Large body text - lg Regular</p>
        <p className="text-base text-gray-700">Regular body text - base Regular</p>
        <p className="text-sm text-gray-600">Small body text - sm Regular</p>
        <p className="text-xs text-gray-500">Extra small text - xs Regular</p>
      </div>
    </section>

    {/* Text Colors */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Text Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-primary font-medium">Primary</div>
        <div className="text-secondary font-medium">Secondary</div>
        <div className="text-muted font-medium">Muted</div>
        <div className="text-success font-medium">Success</div>
        <div className="text-warning font-medium">Warning</div>
        <div className="text-error font-medium">Error</div>
        <div className="text-info font-medium">Info</div>
        <div className="text-gradient font-bold">Gradient</div>
      </div>
    </section>

    {/* Text Effects */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Text Effects</h3>
      <div className="space-y-3">
        <p className="text-uppercase text-gray-700">Uppercase Text</p>
        <p className="text-lowercase text-gray-700">Lowercase Text</p>
        <p className="text-capitalize text-gray-700">capitalize text</p>
        <p className="text-shadow text-gray-700">Text with shadow</p>
      </div>
    </section>
  </div>
);

// Colors Section
const ColorsSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Colors</h2>
      <p className="text-lg text-gray-600">Color palette and semantic color system.</p>
    </div>

    {/* Primary Colors */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-500 h-20 rounded-lg flex items-center justify-center text-white font-medium">Blue-500</div>
        <div className="bg-blue-600 h-20 rounded-lg flex items-center justify-center text-white font-medium">Blue-600</div>
        <div className="bg-blue-700 h-20 rounded-lg flex items-center justify-center text-white font-medium">Blue-700</div>
        <div className="bg-blue-800 h-20 rounded-lg flex items-center justify-center text-white font-medium">Blue-800</div>
      </div>
    </section>

    {/* Semantic Colors */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Semantic Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-100 text-emerald-700 px-4 py-3 rounded-lg text-center font-medium">Success</div>
        <div className="bg-amber-100 text-amber-700 px-4 py-3 rounded-lg text-center font-medium">Warning</div>
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-center font-medium">Error</div>
        <div className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-center font-medium">Info</div>
      </div>
    </section>

    {/* Gray Scale */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Gray Scale</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-100 h-16 rounded-lg flex items-center justify-center text-gray-800 font-medium">100</div>
        <div className="bg-gray-200 h-16 rounded-lg flex items-center justify-center text-gray-800 font-medium">200</div>
        <div className="bg-gray-300 h-16 rounded-lg flex items-center justify-center text-gray-800 font-medium">300</div>
        <div className="bg-gray-400 h-16 rounded-lg flex items-center justify-center text-white font-medium">400</div>
        <div className="bg-gray-500 h-16 rounded-lg flex items-center justify-center text-white font-medium">500</div>
        <div className="bg-gray-600 h-16 rounded-lg flex items-center justify-center text-white font-medium">600</div>
        <div className="bg-gray-700 h-16 rounded-lg flex items-center justify-center text-white font-medium">700</div>
        <div className="bg-gray-800 h-16 rounded-lg flex items-center justify-center text-white font-medium">800</div>
        <div className="bg-gray-900 h-16 rounded-lg flex items-center justify-center text-white font-medium">900</div>
      </div>
    </section>
  </div>
);

// Components Section
const ComponentsSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Components</h2>
      <p className="text-lg text-gray-600">Reusable UI components and patterns.</p>
    </div>

    {/* Buttons */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Buttons</h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-3">Button Variants</h4>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-destructive">Destructive</button>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-3">Button Sizes</h4>
          <div className="flex flex-wrap items-center gap-4">
            <button className="btn btn-primary text-sm px-3 py-1.5">Small</button>
            <button className="btn btn-primary">Medium</button>
            <button className="btn btn-primary text-lg px-6 py-3">Large</button>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-3">Icon Buttons</h4>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary p-2">
              <Plus className="w-4 h-4" />
            </button>
            <button className="btn btn-secondary p-2">
              <Settings className="w-4 h-4" />
            </button>
            <button className="btn btn-ghost p-2">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Badges */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Badges</h3>
      <div className="flex flex-wrap gap-4">
        <span className="badge badge-primary">Primary</span>
        <span className="badge badge-secondary">Secondary</span>
        <span className="badge badge-success">Success</span>
        <span className="badge badge-warning">Warning</span>
        <span className="badge badge-error">Error</span>
      </div>
    </section>

    {/* Cards */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Cards</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h4 className="text-lg font-semibold text-gray-900">Basic Card</h4>
          </div>
          <div className="card-content">
            <p className="text-gray-600">This is a basic card with header and content.</p>
          </div>
        </div>
        <div className="card card-elevated">
          <div className="card-header">
            <h4 className="text-lg font-semibold text-gray-900">Elevated Card</h4>
          </div>
          <div className="card-content">
            <p className="text-gray-600">This card has elevated shadow.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h4 className="text-lg font-semibold text-gray-900">Card with Footer</h4>
          </div>
          <div className="card-content">
            <p className="text-gray-600">This card includes a footer section.</p>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary">Action</button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// Layout Section
const LayoutSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Layout</h2>
      <p className="text-lg text-gray-600">Grid system, flexbox utilities, and spacing.</p>
    </div>

    {/* Grid System */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">12-Column Grid</h3>
      <div className="grid-12">
        <div className="col-span-4 bg-blue-100 p-4 rounded-lg text-center">4 columns</div>
        <div className="col-span-4 bg-green-100 p-4 rounded-lg text-center">4 columns</div>
        <div className="col-span-4 bg-purple-100 p-4 rounded-lg text-center">4 columns</div>
        <div className="col-span-6 bg-yellow-100 p-4 rounded-lg text-center">6 columns</div>
        <div className="col-span-6 bg-red-100 p-4 rounded-lg text-center">6 columns</div>
        <div className="col-span-12 bg-gray-100 p-4 rounded-lg text-center">12 columns</div>
      </div>
    </section>

    {/* Flexbox Utilities */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Flexbox Utilities</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
          <span>Justify Between</span>
          <span>Items Center</span>
        </div>
        <div className="flex justify-center items-center p-4 bg-gray-100 rounded-lg">
          <span>Justify Center</span>
        </div>
        <div className="flex justify-end items-center p-4 bg-gray-100 rounded-lg">
          <span>Justify End</span>
        </div>
      </div>
    </section>

    {/* Spacing Scale */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Spacing Scale</h3>
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
);

// Forms Section
const FormsSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Forms</h2>
      <p className="text-lg text-gray-600">Form components and input styling.</p>
    </div>

    <div className="form-container">
      <form className="space-y-6">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" placeholder="Enter your full name" />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" placeholder="Enter your email" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-input" placeholder="Phone number" />
          </div>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input type="text" className="form-input" placeholder="Company name" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Country</label>
          <select className="select">
            <option>Select a country</option>
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea 
            className="form-input" 
            rows={4} 
            placeholder="Enter your message"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  </div>
);

// Navigation Section
const NavigationSection: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Navigation</h2>
      <p className="text-lg text-gray-600">Navigation components and patterns.</p>
    </div>

    {/* Sidebar Navigation */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Sidebar Navigation</h3>
      <div className="w-64 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="sidebar-header">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">App Name</h4>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>
        <div className="sidebar-content">
          <nav className="space-y-1">
            <a href="#" className="nav-item active">
              <Home className="nav-icon" />
              Dashboard
            </a>
            <a href="#" className="nav-item">
              <BarChart3 className="nav-icon" />
              Analytics
            </a>
            <a href="#" className="nav-item">
              <Package className="nav-icon" />
              Products
            </a>
            <a href="#" className="nav-item">
              <ShoppingCart className="nav-icon" />
              Orders
            </a>
            <a href="#" className="nav-item">
              <Users2 className="nav-icon" />
              Customers
            </a>
            <a href="#" className="nav-item">
              <Shield className="nav-icon" />
              Settings
            </a>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </section>

    {/* Breadcrumbs */}
    <section>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Breadcrumbs</h3>
      <nav className="flex items-center space-x-2 text-sm">
        <a href="#" className="text-blue-600 hover:text-blue-800">Home</a>
        <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
        <a href="#" className="text-blue-600 hover:text-blue-800">Products</a>
        <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
        <span className="text-gray-500">Current Page</span>
      </nav>
    </section>
  </div>
);

export default DesignSystemLibrary;
