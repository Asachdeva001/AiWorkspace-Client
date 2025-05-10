import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          WorkspaceProject
        </h1>
        <p className="mb-8 text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
          The ultimate platform for <span className="text-blue-600 font-semibold">collaboration</span> and <span className="text-pink-600 font-semibold">productivity</span>. Create, manage, and join workspaces with ease.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link to="/signup" className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition">Get Started</Link>
          <Link to="/signin" className="px-8 py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold text-lg shadow hover:bg-blue-50 transition">Sign In</Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16 px-4 border-t border-b">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">About WorkspaceProject</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            WorkspaceProject is a modern, scalable platform designed to streamline team collaboration and workspace management for businesses, startups, and remote teams. With a focus on security, flexibility, and user experience, WorkspaceProject empowers organizations to:
          </p>
          <ul className="text-left text-gray-700 text-base max-w-2xl mx-auto mb-6 list-disc list-inside">
            <li>Organize projects and teams into dedicated workspaces for better focus and productivity.</li>
            <li>Invite and manage team members with role-based access and permissions.</li>
            <li>Integrate with popular OAuth providers for seamless and secure authentication.</li>
            <li>Track workspace activity and changes with centralized logging and audit trails.</li>
            <li>Access your workspaces from any device with a responsive, modern UI.</li>
            <li>Enjoy peace of mind with robust security features, including JWT-based authentication and email verification.</li>
          </ul>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Whether you're a small team or a growing enterprise, WorkspaceProject adapts to your needs, helping you collaborate efficiently and securely.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gradient-to-r from-blue-50 to-pink-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2 text-blue-700">Authentication</h3>
              <ul className="list-disc list-inside text-gray-700 text-base">
                <li>User registration, login, and email verification</li>
                <li>Password reset functionality</li>
                <li>OAuth (Google, LinkedIn, Facebook)</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2 text-pink-700">Workspace Management</h3>
              <ul className="list-disc list-inside text-gray-700 text-base">
                <li>Create, update, and delete workspaces</li>
                <li>Workspace membership management</li>
                <li>View workspace details</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2 text-yellow-700">Security & Logging</h3>
              <ul className="list-disc list-inside text-gray-700 text-base">
                <li>JWT-based authentication</li>
                <li>Centralized logging with Winston</li>
                <li>Modern, responsive UI</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 