//Library
import "./App.css";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

//Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import GoogleCallback from "./pages/GoogleCallback";
import Error404 from "./pages/Error404";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Overview from "./pages/Overview";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/register/ProtectedRoute.tsx";
import Categories from "./pages/Categories";
import Recurrent from "./pages/Recurrent";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Profile from "./pages/Profile.tsx";
import Bills from "./pages/Bills.tsx";
import Taxes from "./pages/Taxes.tsx";
import LegalNotice from "./pages/LegalNotice.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import CookiesPolicy from "./pages/CookiesPolicy.tsx";

//Key used at localStorage to save last session activity
const SESSION_LAST_ACTIVITY_KEY = "session-last-activity";
//Max inactivity time
const INACTIVITY_LIMIT_MS = 2 * 60 * 60 * 1000;

function App() {
  //Redirect hook
  const navigate = useNavigate();
  //Route obtainer hook
  const location = useLocation();

  useEffect(() => {
    //Check if token exists
    const hasToken = Boolean(localStorage.getItem("token"));

    //No token = Delete activity register
    if (!hasToken) {
      localStorage.removeItem(SESSION_LAST_ACTIVITY_KEY);
      return;
    }

    //Saves the actual date as last activity
    const updateLastActivity = () => {
      localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(Date.now()));
    };

    //Function to close session if user excedes the inactivity time
    const logoutIfInactive = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      //Obtains last activity
      const lastActivity = Number(localStorage.getItem(SESSION_LAST_ACTIVITY_KEY) || 0);
      const now = Date.now();

      //No previous activity exist = Initialize
      if (!lastActivity) {
        updateLastActivity();
        return;
      }

      //Checks if the inactivity time exceds the time limit
      if (now - lastActivity >= INACTIVITY_LIMIT_MS) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem(SESSION_LAST_ACTIVITY_KEY);

        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    };

    //Initial activity
    updateLastActivity();

    //Events to prevent inactivity
    const activityEvents: Array<keyof WindowEventMap> = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart"
    ];

    //Listen all the defined events and updates activity
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, updateLastActivity, { passive: true });
    });

    //Checks inactivity every minute
    const intervalId = window.setInterval(logoutIfInactive, 60 * 1000);

    return () => {
      //Remove listeners
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, updateLastActivity);
      });
      window.clearInterval(intervalId);
    };
  }, [location.pathname, navigate]);

  return (
    <main className="bg-white dark:bg-[#040919] text-black dark:text-[#D8E0F9]">
      {/* Public Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/aviso-legal" element={<LegalNotice />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiesPolicy />} />

        {/* Private Routes -Dashboard- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Private SubRoutes -Dashboard- */}
          <Route path="" element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="bills" element={<Bills />} />
          <Route path="categories" element={<Categories />} />
          <Route path="recurrent" element={<Recurrent />} />
          <Route path="reports" element={<Reports />} />
          <Route path="goals" element={<Goals />} />
          <Route path="taxes" element={<Taxes />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </main>
  );
}

export default App;
