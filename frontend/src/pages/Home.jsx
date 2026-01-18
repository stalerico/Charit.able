import { useNavigate } from "react-router-dom";
import TypingAnimatedText from "../components/TypingAnimatedText.tsx";
import Navbar from "../components/navbar.tsx";
import RecentSales from "../components/RecentSales.tsx";
import FloatingCircles from "../components/floatingcircles.tsx";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <FloatingCircles />
      <Navbar />

      <TypingAnimatedText
        words={[
          "Charit.able: Transparency Meets Compassion",
          "Every Donation Tracked on Blockchain",
          "Give with Purpose. Change the World.",
        ]}
      />

      <main className="flex flex-col items-center text-center mt-12 px-4 space-y-12">
        {/* Hero Section */}
        <div className="max-w-3xl">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Trust-First Giving Powered by Blockchain
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Charit.able revolutionizes charitable giving through blockchain transparency. 
            Every donation is immutably recorded, verified, and tracked in real-time. 
            Give with confidence knowing exactly where your impact goes.
          </p>
        </div>

        {/* Key Stats/Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400 mb-2">100%</div>
            <p className="text-sm text-gray-300">Transparent Impact Tracking</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-400 mb-2">2.5%</div>
            <p className="text-sm text-gray-300">Charity Commission Fee</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400 mb-2">10M+</div>
            <p className="text-sm text-gray-300">Verified Donations</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/SignUp")}
            className="px-9 py-4 rounded-full bg-green-500 text-black font-extrabold hover:bg-green-400 transition shadow-lg shadow-green-500/30"
          >
            Donate Now
          </button>

          <button
            onClick={() => navigate("/faq")}
            className="px-9 py-4 rounded-full border-2 border-green-500 text-green-400 font-extrabold hover:bg-green-500/10 transition"
          >
            Learn More
          </button>
        </div>

        {/* Donor Card + Recent Donations */}
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-10">
          {/* Donate CTA */}
          <div className="flex-1">
            <div className="rounded-2xl border border-white/10 bg-[#0E131F] p-8 shadow-2xl text-left space-y-4">
              <h3 className="text-2xl font-bold text-white">Ready to give?</h3>
              <p className="text-white/70">Head to our charities page to pick a cause and start a secure, on-chain donation.</p>
              <button
                onClick={() => navigate("/donate")}
                className="inline-flex items-center justify-center rounded-xl bg-green-500 px-5 py-3 font-semibold text-black hover:bg-green-400 transition"
              >
                Go to Charities
              </button>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="flex-1">
            <RecentSales />
          </div>
        </div>

        {/* Footer Blurb */}
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto pb-10">
          Join thousands of contributors worldwide and help make the world a better
          place. Every donation, no matter the size, creates real impact — instantly
          visible on our platform.
        </p>
      </main>
    </>
  );
}
