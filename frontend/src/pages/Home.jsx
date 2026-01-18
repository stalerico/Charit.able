import TypingAnimatedText from "../components/TypingAnimatedText";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>This is the main landing page of the application.</p>
            <button onClick={() => navigate("/test")}>
                Click me woof woof
            </button>

            <TypingAnimatedText />
        </div>
    );
}
