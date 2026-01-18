import { Routes, Route } from "react-router-dom";
import "./App.css";
import CompanyGrid from "./pages/CompanyGrid.jsx";
import Home from "./pages/Home.jsx";
import WalletTesting from "./pages/wallet_testing.jsx";
import Signup from "./pages/Signup.jsx";
import CompanyDashboard from "./pages/CompanyDashboard";
import ReceiptSliderDemo from "./pages/ReceiptSlider";
import CharityPage from "./pages/CharityPage.jsx";

function App() {
<<<<<<< HEAD
  return (
    <>
      {/* App Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<CompanyGrid />} />
        <Route path="/wallet_testing" element={<WalletTesting />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/companydashboard" element={<CompanyDashboard />} />
        <Route path="/receipt-demo" element={<ReceiptSliderDemo />} />
        <Route path="/charity/:slug" element={<CharityPage />} />
      </Routes>
    </>
  );
=======
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<CompanyGrid />} />
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/wallet_testing" element={<WalletTesting />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/receipt-demo" element={<ReceiptSliderDemo />} />
        </Routes>
    );
>>>>>>> f7dcbad1f2ff11fa00f985d3835d7908f6bef8d8
}


export default App;
