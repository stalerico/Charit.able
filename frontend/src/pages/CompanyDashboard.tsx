import React, { useState } from "react";
import Navbar from "../components/navbar";

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 1,
    title: "Clean Water Initiative",
    description: "Providing clean drinking water to rural communities",
    raised: 45000,
    goal: 75000,
    donors: 234,
    daysLeft: 18,
    image: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=400",
  },
  {
    id: 2,
    title: "Education for All",
    description: "Building schools in underserved areas",
    raised: 28500,
    goal: 50000,
    donors: 156,
    daysLeft: 25,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
  },
];

// Mock recent donations
const mockDonations = [
  { id: 1, donor: "Alex M.", amount: 500, campaign: "Clean Water Initiative", time: "2 min ago", txHash: "0x8f2e...3a1b", avatar: "A" },
  { id: 2, donor: "Sarah K.", amount: 150, campaign: "Education for All", time: "15 min ago", txHash: "0x3c4d...9e2f", avatar: "S" },
  { id: 3, donor: "Anonymous", amount: 1000, campaign: "Clean Water Initiative", time: "1 hour ago", txHash: "0x7b8a...4c5d", avatar: "?" },
  { id: 4, donor: "Michael R.", amount: 75, campaign: "Clean Water Initiative", time: "2 hours ago", txHash: "0x2d3e...8f9a", avatar: "M" },
  { id: 5, donor: "Emma L.", amount: 250, campaign: "Education for All", time: "3 hours ago", txHash: "0x9a1b...2c3d", avatar: "E" },
  { id: 6, donor: "James P.", amount: 100, campaign: "Clean Water Initiative", time: "5 hours ago", txHash: "0x4e5f...6a7b", avatar: "J" },
];

function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalRaised = mockCampaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalDonors = mockCampaigns.reduce((sum, c) => sum + c.donors, 0);
  const activeCampaigns = mockCampaigns.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-fuchsia-500/15 to-rose-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-73px)] bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 p-6 sticky top-[73px] hidden lg:block">
          {/* Organization Info */}
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4">
              <span className="text-2xl font-bold text-white">HF</span>
            </div>
            <h2 className="font-bold text-white">Hope Foundation</h2>
            <p className="text-sm text-slate-400">Verified Organization</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {[
              { key: "overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Overview" },
              { key: "campaigns", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", label: "Campaigns" },
              { key: "donations", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Donations" },
              { key: "withdraw", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z", label: "Withdraw" },
              { key: "settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", label: "Settings" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.key
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                Welcome back! Here's your fundraising overview.
              </p>
            </div>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transform transition-all duration-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Campaign
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[
              { label: "Total Raised", value: `$${totalRaised.toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
              { label: "Total Donors", value: totalDonors.toLocaleString(), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", gradient: "from-violet-500 to-fuchsia-500", shadow: "shadow-violet-500/20" },
              { label: "Active Campaigns", value: activeCampaigns, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
              { label: "Available to Withdraw", value: "$12,450", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", gradient: "from-sky-500 to-blue-500", shadow: "shadow-sky-500/20" },
            ].map((stat, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500`}></div>
                <div className="relative bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-xl h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                      <p className="text-2xl lg:text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Campaigns Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white-800 dark:text-white">Your Campaigns</h2>
                <button className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline">View All</button>
              </div>

              {mockCampaigns.map((campaign) => {
  const progress = (campaign.raised / campaign.goal) * 100;

  return (
    <div key={campaign.id} className="bg-gray-300 rounded-2xl shadow-xl overflow-hidden hover:bg-gray-400 transition-colors">
      <div className="flex flex-col md:flex-row">
        {/* Campaign Image */}
        <div className="md:w-48 h-48 md:h-auto bg-gray-400 flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-14 h-14 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Campaign Info */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                {campaign.title}
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                {campaign.description}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              Active
            </span>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-white">
                ${campaign.raised.toLocaleString()} raised
              </span>
              <span className="text-gray-700">
                of ${campaign.goal.toLocaleString()}
              </span>
            </div>

            <div className="h-2 bg-gray-400 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {campaign.donors} donors
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {campaign.daysLeft} days left
            </div>

            <div className="flex items-center gap-2 text-emerald-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {Math.round(progress)}% funded
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})}
            </div>

            {/* Recent Donations */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Donations</h2>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium">Live</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gray-300 rounded-2xl shadow-xl overflow-hidden">
                    <div className="divide-y divide-gray-400 max-h-[500px] overflow-y-auto">
                      {mockDonations.map((donation) => (
                        <div
                          key={donation.id}
                          className="p-4 hover:bg-gray-400 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {donation.avatar}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white truncate">
                                  {donation.donor}
                                </span>
                                <span className="text-emerald-400 font-bold">
                                  ${donation.amount}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 truncate">
                                {donation.campaign}
                              </p>
                            </div>

                            {/* Time */}
                            <span className="text-xs text-gray-700 flex-shrink-0">
                              {donation.time}
                            </span>
                          </div>

                          {/* Transaction Hash */}
                          <div className="mt-2 flex items-center gap-2">
                            <svg
                              className="w-3 h-3 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                            <span className="text-xs font-mono text-gray-700">
                              {donation.txHash}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Link */}
                    <div className="p-4 border-t border-gray-400 bg-gray-300">
                      <button className="w-full text-center text-sm text-white font-medium hover:underline">
                        View All Transactions
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Withdraw Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 rounded-2xl opacity-30 blur-xl"></div>
                <div className="relative bg-gray-300 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-700 text-sm">Available Balance</p>
                      <p className="text-3xl font-bold text-white">$12,450</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-400 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gray-400 text-white font-semibold hover:bg-gray-500 transition-colors">
                    Withdraw Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CompanyDashboard;
