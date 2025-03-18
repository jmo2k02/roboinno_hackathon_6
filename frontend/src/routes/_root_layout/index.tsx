import { createFileRoute, Link} from '@tanstack/react-router'
import { ChevronRight} from 'lucide-react';

export const Route = createFileRoute('/_root_layout/')({
  component: Index,
})

function Index() {

  return (
    <div className="flex h-screen w-full bg-gray-100">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {(
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Welcome to RoboControl</h2>
                <p className="text-gray-600 mb-4">
                  Your robot is ready to receive commands. Use the simple controls below to get started.
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                  Start Robot
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium mb-2">Quick Navigation</h3>
                  <p className="text-gray-600 text-sm mb-4">Select a common task to get started right away</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                    <Link to='/upload'>
                      Upload existing svg
                      </Link>
                      </div>
                    <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                    <Link to="/voice">
                      Use voice recognition
                      </Link>
                      </div>
                    <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                    <Link to='/editor'>
                      Draw svg
                    </Link>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium mb-2">Robot Status</h3>
                  <div className="flex items-center mb-4">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Online and Ready</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Battery</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm mt-4">
                      <span>Signal Strength</span>
                      <span className="font-medium">Excellent</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
