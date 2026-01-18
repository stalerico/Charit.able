import React, { useState } from "react";
import Navbar from "../components/navbar.tsx";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is Charit.able?",
      answer:
        "Charit.able is a revolutionary donation platform that uses blockchain technology to ensure transparency, security, and traceability of every donation. We connect donors with verified charitable causes and provide real-time impact tracking.",
    },
    {
      question: "How does the blockchain make donations more secure?",
      answer:
        "Blockchain technology creates an immutable record of every transaction. This means all donations are cryptographically verified, cannot be altered, and create a permanent, transparent audit trail that both donors and charities can verify.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We support both traditional fiat currency (USD) and cryptocurrency payments. Fiat donations are processed through secure payment partners, while crypto donations are handled directly through blockchain networks.",
    },
    {
      question: "How can I start donating?",
      answer:
        "Simply click 'Join Now' or 'Donate Now' on our website, create an account, and select the charity or cause you want to support. We'll guide you through the secure payment process to complete your donation.",
    },
    {
      question: "Are my donations tax-deductible?",
      answer:
        "Tax deductibility depends on your location and the charity's status. We provide detailed donation receipts for all transactions, which you can use for tax purposes. Consult with your tax advisor for specific guidance.",
    },
    {
      question: "How do you verify charities?",
      answer:
        "We conduct thorough verification of all charities before they join our platform, checking their registration status, mission alignment, and impact metrics. Our blockchain system also allows donors to independently verify where their donations go.",
    },
    {
      question: "What fees does Charit.able charge?",
      answer:
        "We maintain transparency in our fee structure. A small processing fee is applied to each donation to cover payment processing and platform maintenance. You can see the exact fee before confirming your donation.",
    },
    {
      question: "Can I track where my donation goes?",
      answer:
        "Yes! One of Charit.able's key features is donation tracking. Every donation is recorded on the blockchain, and you receive a receipt that allows you to track its impact in real-time through our dashboard.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "We employ enterprise-grade encryption and security measures to protect your personal data. Your payment information is never stored on our servers, and we comply with all data protection regulations including GDPR and CCPA.",
    },
    {
      question: "What can companies do with the Company Dashboard?",
      answer:
        "Companies can use our dashboard to set up corporate giving programs, track team donations, view impact reports, manage matched giving campaigns, and generate compliance documentation for corporate social responsibility initiatives.",
    },
    {
      question: "How do I create a corporate giving program?",
      answer:
        "Navigate to the Company Dashboard, sign up for a corporate account, and our team will guide you through setting up donation matching, team giving pools, and custom charity selections for your organization.",
    },
    {
      question: "Can I donate anonymously?",
      answer:
        "Yes, Charit.able supports anonymous donations. When creating a donation, you can choose to hide your name from the charity. However, we still maintain a record for tax and verification purposes.",
    },
    {
      question: "What happens if I need to dispute a transaction?",
      answer:
        "We have a comprehensive dispute resolution process. Contact our support team within 30 days of your transaction, and we'll investigate and work to resolve the issue. Blockchain records help us verify all transaction details.",
    },
    {
      question: "Do you support recurring donations?",
      answer:
        "Yes! You can set up monthly, quarterly, or annual recurring donations to your favorite causes. Manage your subscriptions anytime through your account settings.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team through the contact form on our website, email support, or live chat during business hours. We aim to respond to all inquiries within 24 hours.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-12 pb-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-300">
            Find answers to common questions about Charit.able, our platform, and
            how we're revolutionizing charitable giving through blockchain technology.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg overflow-hidden bg-black/50 hover:border-green-500/30 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <h3 className="text-left text-lg font-semibold text-white">
                  {faq.question}
                </h3>
                <div
                  className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                >
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
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </button>

              {activeIndex === index && (
                <div className="px-6 py-4 border-t border-gray-700 bg-white/2 animate-fade">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
          <div className="border border-green-500/20 rounded-lg bg-green-500/5 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? Our support team is here to
              help.
            </p>
            <button className="px-8 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition">
              Contact Support
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
