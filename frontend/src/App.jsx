import { Routes, Route } from "react-router-dom";
import "./App.css";
import CompanyGrid from "./pages/CompanyGrid.jsx";
import Home from "./pages/Home.jsx";
import WalletTesting from "./pages/wallet_testing.jsx";
import Signup from "./pages/Signup.jsx";
import CompanyDashboard from "./pages/CompanyDashboard";
import ReceiptSliderDemo from "./pages/ReceiptSlider";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<CompanyGrid />} />
            <Route path="/wallet_testing" element={<WalletTesting />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/receipt-demo" element={<ReceiptSliderDemo />} />
        </Routes>
    );
}

export default App;
