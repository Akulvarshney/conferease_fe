import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/loginSignup/Login";
import RegistrationUserForm from "./pages/loginSignup/RegistrationUserForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import ConferenceDetails from "./pages/conferenceDetail/ConferenceDetail";
import CreateNewSubmission from "./pages/conferenceDetail/CreateNewSubmission";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  if (!token) {
    // Redirect them to the / page if not logged in and trying to access a protected route
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;
};

function App() {
  const token = localStorage.getItem("authToken");
  console.log(token);
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registerUser" element={<RegistrationUserForm />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/conferenceDetail/:confId"
            element={<ProtectedRoute element={<ConferenceDetails />} />}
          />
          <Route
            path="/createSubmission"
            element={<ProtectedRoute element={<CreateNewSubmission />} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
