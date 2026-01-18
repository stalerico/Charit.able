import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.tsx";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Individual Donor",
      price: "Free",
      description: "Perfect for individuals who want to make a difference",
      features: [
        "Unlimited donations",
        "Blockchain-verified receipts",
        "Real-time impact tracking",
        "Tax-deductible documentation",
        "Donation history dashboard",
        "Anonymous giving option",
        "Email notifications",
      ],
      recommended: false,
      cta: "Start Donating",
      color: "green",
    },
    {
      name: "Corporate",
      price: "$299",
      period: "/month",
      description: "For companies building social impact programs",
      features: [
        "Everything in Individual",
        "Company donation dashboard",
        "Team giving pools",
        "Matching donation programs",
        "Custom branding",
        "Advanced analytics & reporting",
        "CSV export for compliance",
        "Dedicated account manager",
        "API access",
      ],
      recommended: true,
      cta: "Get Started",
      color: "blue",
    },
    {
      name: "Charity Partner",
      price: "2.5%",
      period: "per donation",
      description: "For verified charities receiving donations",
      features: [
        "Profile on platform",
        "Receive crypto & fiat donations",
        "Blockchain transaction records",
        "Donor engagement tools",
        "Campaign management",
        "Impact reporting dashboard",
        "Instant payouts",
        "Marketing support",
        "No setup fees",
      ],
      recommended: false,
      cta: "Apply Now",
      color: "purple",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-16 pb-20">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-4 text-center mb-16">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Transparent Pricing for Impact
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            No hidden fees, no surprises. Choose a plan that empowers your charitable goals.
            Charit.able's transparent pricing supports our mission to revolutionize giving.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border transition-all duration-300 p-8 hover:scale-105 ${
                plan.recommended
                  ? "border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/5 shadow-lg shadow-green-500/20"
                  : "border-gray-700 bg-black/50 hover:border-gray-600"
              }`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-black px-4 py-1 rounded-full text-sm font-extrabold">
                    Most Popular ⭐
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-extrabold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-green-400">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-400 font-medium">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => {
                  if (plan.name === "Individual Donor") {
                    navigate("/donate");
                  } else if (plan.name === "Corporate") {
                    navigate("/company-dashboard");
                  } else {
                    alert("Charity application coming soon!");
                  }
                }}
                className={`w-full py-3 rounded-full font-extrabold transition duration-300 ${
                  plan.recommended
                    ? "bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/30"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison Section */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <div className="border border-green-500/30 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 p-12">
            <h2 className="text-4xl font-extrabold text-white mb-12 text-center">
              All Plans Include
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.393 15.283c3.565 1.75 8.256 1.75 11.822 0M7.5 4.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S9.83 3 9 3s-1.5.67-1.5 1.5zm6 0c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S17.83 3 17 3s-1.5.67-1.5 1.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-extrabold mb-2">Blockchain-Secured</h4>
                  <p className="text-gray-400 text-sm">
                    All transactions cryptographically verified and immutable
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-extrabold mb-2">Full Transparency</h4>
                  <p className="text-gray-400 text-sm">
                    Track every donation from source to charitable impact
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-extrabold mb-2">Real-Time Analytics</h4>
                  <p className="text-gray-400 text-sm">
                    Live dashboards showing donation impact and metrics
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 011-1h5a1 1 0 011 1v1h1V3a1 1 0 011 1v1h1.5A1.5 1.5 0 0118 5.5v12a1.5 1.5 0 01-1.5 1.5H3.5A1.5 1.5 0 012 17.5v-12A1.5 1.5 0 013.5 4H5V3a1 1 0 011-1zm6.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm2 1a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-extrabold mb-2">Instant Processing</h4>
                  <p className="text-gray-400 text-sm">
                    Lightning-fast transactions powered by blockchain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-extrabold text-white mb-4">
            Have Questions?
          </h3>
          <p className="text-gray-300 mb-8">
            Explore our comprehensive FAQ or reach out to our team for custom enterprise solutions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/faq")}
              className="px-8 py-3 rounded-full bg-white/10 text-white font-extrabold hover:bg-white/20 border border-white/20 transition"
            >
              View FAQ
            </button>
            <button className="px-8 py-3 rounded-full bg-green-500 text-black font-extrabold hover:bg-green-400 transition shadow-lg shadow-green-500/30">
              Contact Us
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
