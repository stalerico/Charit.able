import TypingAnimatedText from "../components/TypingAnimatedText.tsx";
export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <CursorEffect />
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
     <button onClick={() => navigate("/test")}>Click me woof woof</button>
     
      <TypingAnimatedText />
    </div>
  );
}