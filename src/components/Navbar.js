import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function removeCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [isLoggedIn, setIsLoggedIn] = useState(!!getCookie('token'));

  useEffect(() => {
    setIsLoggedIn(!!getCookie('token'));
  }, [location]);

  const handleSignOut = () => {
    removeCookie('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="font-bold text-xl text-blue-700">
        <Link to="/">WorkspaceProject</Link>
      </div>
      <div className="space-x-4">
        {isHome ? (
          <>
            <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
          </>
        ) : (
          <>
            <Link to="/#about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link to="/#features" className="text-gray-700 hover:text-blue-600">Features</Link>
          </>
        )}
        <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
        {isLoggedIn ? (
          <button onClick={handleSignOut} className="text-red-600 hover:text-red-800 font-semibold">Sign Out</button>
        ) : (
          <>
            <Link to="/signin" className="text-green-700 hover:text-green-900">Sign In</Link>
            <Link to="/signup" className="text-green-700 hover:text-green-900">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
