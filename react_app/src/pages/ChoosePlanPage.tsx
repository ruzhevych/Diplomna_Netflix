import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register } from '../services/authService';

const plans = ['Basic', 'Standard', 'Premium'];

const ChoosePlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fullName, email, password } = location.state || {};
  const [selectedPlan, setSelectedPlan] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedPlan) {
      setError('Оберіть план підписки');
      return;
    }

    try {
      await register({ fullName, email, password, plan: selectedPlan });
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">Оберіть план</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mb-6">
        {plans.map((plan) => (
          <div
            key={plan}
            onClick={() => setSelectedPlan(plan)}
            className={`cursor-pointer border p-6 rounded-md hover:border-red-500 ${
              selectedPlan === plan ? 'border-red-600 bg-zinc-800' : 'border-zinc-700'
            }`}
          >
            <h3 className="text-xl font-bold">{plan}</h3>
            <p className="text-sm text-gray-400 mt-2">
              {plan === 'Basic' && '1 пристрій, HD'}
              {plan === 'Standard' && '2 пристрої, Full HD'}
              {plan === 'Premium' && '4 пристрої, Ultra HD'}
            </p>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleSubmit}
        className="bg-red-600 px-6 py-3 rounded hover:bg-red-700"
      >
        Зареєструватися
      </button>
    </div>
  );
};

export default ChoosePlanPage;
