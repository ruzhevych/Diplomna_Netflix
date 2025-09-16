// src/pages/AdminDashboard.tsx
import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import HeaderAdmin from "../../components/Admin/HeaderAdmin";
import UsersTable from "../../components/Admin/UsersTable";
import SubscriptionsTable from "../../components/Admin/SubscriptoinsTable";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'subscriptions'>('users');

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white flex flex-col">
      <HeaderAdmin />
      <main className="flex-1 mt-14 max-w-7xl mx-auto w-full px-6 py-10">
        <h1 className="mb-10 text-3xl font-bold">Admin Panel</h1>

        <div className="flex space-x-3 mb-8 p-1 bg-gray-800/50 rounded-sm">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-4 py-2 rounded-sm font-semibold text-center transition-all duration-300 ${activeTab === 'users' ? 'bg-lime-600 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700/50'}`}
          >
            Користувачі
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 px-4 py-2 rounded-sm font-semibold text-center transition-all duration-300 ${activeTab === 'subscriptions' ? 'bg-lime-600 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700/50'}`}
          >
            Підписки
          </button>
        </div>

        {activeTab === 'users' && <UsersTable />}
        {activeTab === 'subscriptions' && <SubscriptionsTable />}
      </main>
      <Footer />
    </div>
  );
}