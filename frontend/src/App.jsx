import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import useAuth from "./store/useAuthStore.js";
import NotFound from "./pages/NotFound.jsx";
import Jobs from "./pages/Jobs/Jobs.jsx";

function App() {
  const authUser = useAuth((state) => state.authUser);

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <Navigate to={"/dashboard"} />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={authUser ? <Dashboard /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/jobs"
          element={authUser ? <Jobs /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to={"/dashboard"} /> : <Signup />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to={"/dashboard"} /> : <Login />}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
