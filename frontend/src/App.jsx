import { Routes, Route } from "react-router-dom";
import "./App.css";
import Test from "./pages/Test.jsx";
import Home from "./pages/Home.jsx";
import WalletTesting from "./pages/wallet_testing.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Test />} />
            <Route path="/wallet_testing" element={<WalletTesting />} />
        </Routes>
    );
}

export default App;
