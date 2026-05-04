import "./App.css";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Error404 from "./pages/Error404";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Overview from "./pages/Overview";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./components/register/ProtectedRoute.tsx";
import Categories from "./pages/Categories";
import Recurrent from "./pages/Recurrent";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Profile from "./pages/Profile.tsx";
import Bills from "./pages/Bills.tsx";

const SESSION_LAST_ACTIVITY_KEY = "session-last-activity";
const INACTIVITY_LIMIT_MS = 2 * 60 * 60 * 1000;

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("token"));

    if (!hasToken) {
      localStorage.removeItem(SESSION_LAST_ACTIVITY_KEY);
      return;
    }

    const updateLastActivity = () => {
      localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(Date.now()));
    };

    const logoutIfInactive = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const lastActivity = Number(localStorage.getItem(SESSION_LAST_ACTIVITY_KEY) || 0);
      const now = Date.now();

      if (!lastActivity) {
        updateLastActivity();
        return;
      }

      if (now - lastActivity >= INACTIVITY_LIMIT_MS) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem(SESSION_LAST_ACTIVITY_KEY);

        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    };

    updateLastActivity();

    const activityEvents: Array<keyof WindowEventMap> = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart"
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, updateLastActivity, { passive: true });
    });

    const intervalId = window.setInterval(logoutIfInactive, 60 * 1000);

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, updateLastActivity);
      });
      window.clearInterval(intervalId);
    };
  }, [location.pathname, navigate]);

  return (
    <main className="bg-white dark:bg-[#040919] text-black dark:text-[#D8E0F9]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="bills" element={<Bills />} />
          <Route path="categories" element={<Categories />} />
          <Route path="recurrent" element={<Recurrent />} />
          <Route path="reports" element={<Reports />} />
          <Route path="goals" element={<Goals />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </main>
  );
}

export default App;
