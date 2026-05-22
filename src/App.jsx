import ContentAnalyzer from "./components/ContentAnalyzer";
import axios from "axios";

function App() {

  const testBackend = async () => {
    try {
      const res = await axios.get("http://localhost:5000");
      console.log(res.data);

      alert("Backend Connected Successfully");
    } catch (error) {
      console.log(error);

      alert("Backend Connection Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">

      {/* This is a Backend Test Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={testBackend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition duration-300"
        >
          Test Backend
        </button>
      </div>

      {/* Main Resume Analyzer Component */}
      <ContentAnalyzer />
    </div>
  );
}

export default App;