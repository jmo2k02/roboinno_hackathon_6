import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { useState } from 'react';
import { Bell,  Home, Menu, MessageSquare, MicVocal, PencilRuler, UserCircle } from 'lucide-react';
import { useLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/_root_layout')({
  component: RootLayout
})

function RootLayout ()  {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };




  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-md transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b">
          {isSidebarOpen && <h2 className="text-xl font-bold text-blue-600">RoboControl</h2>}
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100">
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 pt-4">
          <div 
            className={`flex items-center px-4 py-3 ${location.pathname === '/' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}
          >
            <Home size={20} />
            {isSidebarOpen && <Link to='/' className="ml-3">Dashboard</Link>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${location.pathname === '/editor' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}
          >
            <PencilRuler size={20} />
            {isSidebarOpen && <Link to='/editor' className="ml-3">SVG editor</Link>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${location.pathname === '/voice' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}
          >
            <MicVocal size={20} />
            {isSidebarOpen && <Link to='/voice' className="ml-3">Voice recognition</Link>}
          </div>
        </nav>
        
        <div className="mt-auto border-t p-4">
          <div className="flex items-center text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md cursor-pointer">
            <UserCircle size={20} />
            {isSidebarOpen && <span className="ml-3">Profile</span>}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm flex items-center justify-between p-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {location.pathname === 'dashboard' && 'Dashboard'}
              {location.pathname === 'controls' && 'Robot Controls'}
              {location.pathname === 'settings' && 'Settings'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MessageSquare size={20} className="text-gray-600" />
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              JD
            </div>
          </div>
        </header>
        
        <Outlet/>
      </div>
    </div>
  );
}