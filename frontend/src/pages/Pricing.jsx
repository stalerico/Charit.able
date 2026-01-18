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
      <main className="min-h-screen bg-black pt-12 pb-20">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-4 text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Choose the plan that works for you. No hidden fees, no surprises.
            Just transparent pricing that supports our mission to revolutionize
            charitable giving.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border ${
                plan.recommended
                  ? "border-blue-500/50 bg-blue-500/5"
                  : "border-gray-700 bg-black/50"
              } p-8 hover:border-${plan.color}-500/30 transition-all hover:transform hover:scale-105`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className={`w-5 h-5 text-${plan.color}-400 mr-3 flex-shrink-0 mt-0.5`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => {
                  if (plan.name === "Individual Donor") {
                    navigate("/signup");
                  } else if (plan.name === "Corporate") {
                    navigate("/company-dashboard");
                  } else {
                    alert("Charity application coming soon!");
                  }
                }}
                className={`w-full py-3 rounded-full font-semibold transition ${
                  plan.recommended
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : plan.color === "green"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="max-w-4xl mx-auto px-4 mt-20">
          <div className="border border-gray-700 rounded-2xl bg-black/50 p-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              All Plans Include
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-green-500/10 p-3 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Blockchain Security
                  </h4>
                  <p className="text-gray-400 text-sm">
                    All transactions secured with cryptographic verification
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-500/10 p-3 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Full Transparency
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Track every donation from source to impact
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-500/10 p-3 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">24/7 Support</h4>
                  <p className="text-gray-400 text-sm">
                    Our team is always here to help you succeed
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-500/10 p-3 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Instant Processing
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Fast, reliable transaction processing powered by blockchain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Callout */}
        <div className="max-w-3xl mx-auto px-4 mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Questions about pricing?
          </h3>
          <p className="text-gray-300 mb-6">
            Check out our FAQ for detailed information or contact our team for
            custom enterprise solutions.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/faq")}
              className="px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition"
            >
              View FAQ
            </button>
            <button className="px-6 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
