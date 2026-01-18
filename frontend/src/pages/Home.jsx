import { useNavigate } from "react-router-dom";
import TypingAnimatedText from "../components/TypingAnimatedText.tsx";
import Navbar from "../components/navbar.tsx";
import Donate from "../components/ui/donor_card";
import RecentSales from "../components/RecentSales.tsx";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css"; // import CSS
import ItemizedBarcode from "../assets/images/ItemizedBarcode.jpg";
import ReceiptOverlay from "../assets/images/ItemizedBarcodeOverlay.jpg";


export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <TypingAnimatedText
        words={[
          "Charit.able: Empowering Giving",
          "Transparent Donations, Instant Impact",
          "Crypto-powered, Community-focused"
        ]}
      />

      <main className="flex flex-col items-center text-center mt-24 px-2">
        {/* Hero Section */}
        <h1 className="text-5xl font-extrabold text-gray-700 dark:text-white">
          Give with Confidence, Make a Difference
        </h1>

        <p className="mt-6 text-lg text-gray-400 dark:text-gray-300 max-w-2xl">
          Charit.able is a revolutionary platform that connects donors with causes
          that matter. Powered by blockchain technology, every donation is secure,
          transparent, and traceable. Experience the future of giving where
          generosity meets trust.
        </p>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition"
          >
            Join Now
          </button>

          <button
            onClick={() => navigate("/wallet_testing")}
            className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition"
          >
            Explore Wallet
          </button>
        </div>

        <div className="mt-20 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Donate Card */}
          <section className="flex-1 bg-black dark:bg-gray-200 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-gray-500 dark:text-white mb-6">
              Join the cause!
            </h2>
            <Donate />
          </section>

          {/* Recent Sales / Impact Section */}
          <section className="flex-1 bg-black dark:bg-gray-900 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-gray-500 dark:text-white mb-6">
              Recent Impact
            </h2>
            <div className="w-full">
              <RecentSales />
            </div>
          </section>
        </div>

        {/* Receipt Verif.
        <section className="mt-16 w-full flex justify-center">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl pt-16">
            <h2 className="text-2xl font-semibold mb-4">
              AI Receipt Scanner Preview
            </h2>
            <ReactBeforeSliderComponent
              firstImage={ItemizedBarcode}
              secondImage={ReceiptOverlay}
            />
          </div>
        </section> */}

        {/* Footer Blurb */}
        <p className="mt-24 mb-12 text-gray-500 dark:text-gray-400 max-w-2xl">
          Join thousands of contributors worldwide and help make the world a better
          place. Every donation, no matter the size, creates real impact — instantly
          visible on our platform.
        </p>
      </main>
    </>
  );
}
