import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { axiosClient } from "../axios/axiosClient";
import useAuth from "../store/useAuthStore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const setAuthUser = useAuth((state) => state.setAuthUser);


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      setAuthUser(response.data);
      toast.success("Logged In successfully");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoggingIn(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <form
      onSubmit={(e) => handleLogin(e)}
      className="flex justify-center items-center h-screen bg-slate-200"
    >
      <div id="login" className="p-5 bg-white rounded-xl w-[350px]">
        <p className="font-semibold text-2xl text-center">
          Log in to your account
        </p>
        <div>
          <div className="mt-4">
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              id="email"
              className="border-2 rounded-xl p-2  text-sm w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password">Password</label>
            <br />
            <input
              type="password"
              id="password"
              className="border-2 rounded-xl p-2 text-sm w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="flex justify-center bg-blue-600 text-white w-full mt-2 rounded-xl p-2"
        >
          {isLoggingIn ? <Loader className="animate-spin" /> : "LOGIN"}
        </button>
        <p className="text-center mt-1">
          No account?{" "}
          <Link to={"/signup"} className="hover:text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}

export default Login;
