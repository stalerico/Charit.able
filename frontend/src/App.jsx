import { Routes, Route } from "react-router-dom";
import "./App.css";
<<<<<<< HEAD

=======
import CompanyGrid from "./pages/CompanyGrid.jsx";
>>>>>>> 1697e6169e98e46fd025414d47838f0e2dce3e84
import Home from "./pages/Home.jsx";
import CompanyGrid from "./pages/CompanyGrid.jsx";
import CompanyDashboard from "./pages/CompanyDashboard.tsx";
import WalletTesting from "./pages/wallet_testing.jsx";
import Signup from "./pages/Signup.jsx";
import ReceiptSliderDemo from "./pages/ReceiptSlider.tsx";
import CharityPage from "./pages/CharityPage.jsx";
import FAQ from "./pages/FAQ.jsx";
import Pricing from "./pages/Pricing.jsx";
import FloatingCircles from "./components/floatingcircles.tsx";

function App() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Floating background */}
      <FloatingCircles />

      {/* Your routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<CompanyGrid />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/wallet-testing" element={<WalletTesting />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/receipt-demo" element={<ReceiptSliderDemo />} />
        <Route path="/charity/:slug" element={<CharityPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </div>
  );
}

export default App;
