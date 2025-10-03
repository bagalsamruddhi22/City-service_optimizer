import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TestAPI from "./pages/TestAPI";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreateReport from "./pages/CreateReport";

// Import new Suggestion components
import SuggestionForm from "./components/SuggestionForm";
import SuggestionsList from "./components/SuggestionsList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-report"
          element={
            <ProtectedRoute>
              <CreateReport />
            </ProtectedRoute>
          }
        />

        {/* New Suggestion Routes */}
        <Route
          path="/create-suggestion"
          element={
            <ProtectedRoute>
              <SuggestionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggestions"
          element={
            <ProtectedRoute>
              <SuggestionsList />
            </ProtectedRoute>
          }
        />

        {/* Public test page */}
        <Route path="/" element={<TestAPI />} />
      </Routes>
    </Router>
  );
}

export default App;
