import { useEffect, useState } from "react";
import Aos from "aos";

import AdminRoutes from "./app/containers/admin/AdminRoutes";
import "./main.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./app/containers/parents/Home";
import Nav from "./app/components/Parent/Nav";
import Login from "./app/containers/parents/Login";
import Register from "./app/containers/parents/Register";
import Messages from "./app/containers/parents/Messages";
import NotFound from "./app/containers/NotFound";
import ParentPrivateRoutes from "./app/routes/ParentPrivateRoute";
import AuthContext from "./app/context/authContext";
import LiveLocation from "./app/containers/parents/LiveLocation";
import Profile from "./app/containers/parents/Profile";
import Footer from "./app/components/Parent/Footer";
import HowItWorks from "./app/containers/parents/HowItWorks";
import ParentNotifications from "./app/containers/parents/ParentNotifications";
import AttendanceRecord from "./app/containers/parents/AttendanceRecord";

const routes = [
  "/",
  "/login",
  "/register",
  "/messages",
  "/location",
  "/profile",
  "/how-it-works",
  "/route-not-found",
  "/notifications",
  "/attendance",
];

function App() {
  const location = useLocation();
  const [parent, setParent] = useState(null);

  const initScrollReveal = () => {
    Aos.init({
      tartEvent: "DOMContentLoaded",
      easing: "linear",
      initClassName: "aos-init",
      animatedClassName: "aos-animate",
      duration: 400,
      mirror: false,
      once: false,
    });
  };

  useEffect(() => {
    initScrollReveal();
  }, []);
  return (
    <>
      {!routes.includes(location.pathname) ? (
        <AdminRoutes />
      ) : (
        <>
          <AuthContext.Provider value={{ parent, setParent }}>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/messages"
                element={
                  <ParentPrivateRoutes>
                    <Messages />
                  </ParentPrivateRoutes>
                }
              />
              <Route
                path="/location"
                element={
                  <ParentPrivateRoutes>
                    <LiveLocation />
                  </ParentPrivateRoutes>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ParentPrivateRoutes>
                    {/* <LiveLocation /> */}
                    <ParentNotifications />
                  </ParentPrivateRoutes>
                }
              />
              <Route
                path="/profile"
                element={
                  <ParentPrivateRoutes>
                    <Profile />
                  </ParentPrivateRoutes>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ParentPrivateRoutes>
                    <AttendanceRecord />
                  </ParentPrivateRoutes>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/route-not-found" element={<NotFound />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route
                path="*"
                element={<Navigate to={"/route-not-found"} replace />}
              />
            </Routes>
            {location.pathname === "/how-it-works" ||
            location.pathname === "/" ? (
              <Footer />
            ) : null}
          </AuthContext.Provider>
        </>
      )}
    </>
  );
}

export default App;
