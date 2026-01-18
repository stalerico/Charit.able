import "./Home.css";
import { useNavigate } from "react-router-dom";
import TypingAnimatedText from "../components/TypingAnimatedText";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-32 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Home Page</h1>
        <button
          onClick={() => navigate("/test")}
          className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Click me woof woof
        </button>

        <div className="mt-10">
          <TypingAnimatedText />
        </div>
      </div>
    </div>
  );
}
