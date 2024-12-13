import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);

  // List of important lines to display automatically
  const importantLines = [
    "Invest in your future with confidence.",
    "Grow your wealth, one step at a time.",
    "Financial freedom starts with Swan-Investment.",
    "Your trusted partner in wealth management.",
    "Start your investment journey today!"
  ];

  // Function to cycle through lines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prevLine) => (prevLine + 1) % importantLines.length);
    }, 3000); // Change line every 3 seconds
    return () => clearInterval(interval);
  }, [importantLines.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 text-center">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-4">Welcome to Swan-Investment</h1>
      <p className="text-lg font-medium text-gray-700">
        {importantLines[currentLine]}
      </p>
      <p className="mt-6 text-gray-600 text-md max-w-2xl">
        At Swan-Investment, we are committed to helping you achieve your financial goals. Whether you're a seasoned investor or just starting, our platform provides the tools and insights you need to make informed decisions. Join us today and take the first step towards a brighter financial future.
      </p>

      {/* Buttons */}
      <div className="mt-10 space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700"
        >
          Signup
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-16 max-w-4xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Why Choose Swan-Investment?</h2>
        <ul className="list-disc text-left text-gray-700 space-y-4 px-10">
          <li>Simple and intuitive platform for managing your investments.</li>
          <li>Real-time market insights to keep you ahead.</li>
          <li>Secure and transparent processes for peace of mind.</li>
          <li>Dedicated support team to assist you at every step.</li>
          <li>Access to a wide range of investment opportunities.</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
