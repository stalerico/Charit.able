import { useNavigate } from "react-router-dom";
import TypingAnimatedText from "../components/TypingAnimatedText.tsx";
import Navbar from "../components/navbar.tsx"

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <TypingAnimatedText />
      <main className="flex flex-col items-center text-center mt-24 px-6">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>

        <p className="mt-4 text-lg text-gray-600 max-w-xl">
          This is the main landing page of the application.
        </p>

        <div className="mt-6 flex gap-4">
          <button onClick={() => navigate("/test")}>
            Click me woof woof
          </button>

          <button onClick={() => navigate("/wallet_testing")}>
            jesus is cooking
          </button>
        </div>
      </main>
    </>
  );
}
