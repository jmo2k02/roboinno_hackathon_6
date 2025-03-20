import { createFileRoute, Link} from '@tanstack/react-router'

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
                <h2 className="text-lg font-medium mb-4">Welcome to Our Drawing Robot Arm Dashboard!</h2>
                <p className="text-gray-600 mb-4">
                Our goal is to simplify the process of controlling your robot arm for drawing tasks. You no longer need any technical knowledge or expertise in robotics to convert your ideas into actions. With our platform, you can easily upload SVG files, and we'll automatically translate them into commands for the robot arm to execute.

You can also create and generate SVG drawings using text or speech input, making the process even more accessible. Want to modify the drawing? No problem! You can edit the generated SVGs directly within the platform, ensuring you have full control over your designs.

Enjoy a seamless experience from concept to creation, without worrying about the technicalities!
                </p>
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
                    <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                    <Link to='/editor'>
                      Generate from text
                    </Link>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                    <Link to='/text'>
                      Control yourself
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
