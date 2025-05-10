import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default function UpgradePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      const token = getCookie('token');
      try {
        const res = await fetch(`${API_BASE_URL}/subscription/plans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch plans');
        setPlans(data.data.plans);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    // Redirect to payment gateway (to be implemented)
    // For now, just show an alert and redirect to dashboard
    alert(`You selected the ${plan.name} plan. Payment gateway coming soon!`);
    navigate('/workspaces');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upgrade Your Subscription</h1>
        {loading ? (
          <div className="text-gray-500">Loading plans...</div>
        ) : error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map(plan => (
              <div key={plan.name} className="border rounded-lg p-6 flex flex-col items-center shadow-sm">
                <div className="text-xl font-semibold text-blue-700 mb-2 capitalize">{plan.name}</div>
                <div className="text-gray-700 mb-4">{plan.description}</div>
                <div className="text-2xl font-bold text-green-700 mb-4">${plan.price}/mo</div>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 