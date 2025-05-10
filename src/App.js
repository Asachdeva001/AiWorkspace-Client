import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import WorkspaceDashboard from './pages/dashboard/Dashboard';
import WorkspaceDetail from './pages/dashboard/Detail';
import Invitation from './pages/dashboard/Invitation';
import UpgradePlans from './pages/dashboard/UpgradePlans';
import OAuthSuccess from './pages/auth/OAuthSuccess';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReturnToTop from './components/ReturnToTop';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import ResetPassword from './pages/auth/ResetPassword';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/workspaces" element={<WorkspaceDashboard />} />
          <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
          <Route path="/accept-invitation" element={<Invitation />} />
          <Route path="/upgrade-plans" element={<UpgradePlans />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
        </Routes>
      </div>
      <Footer />
      <ReturnToTop />
    </>
  );
}

export default App;
