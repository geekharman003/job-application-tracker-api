import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosClient } from "../axios/axiosClient";
import { Loader } from "lucide-react";
import useAuth from "../store/useAuthStore";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const setAuthUser = useAuth((state) => state.setAuthUser);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);

    try {
      const response = await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
      });

      setAuthUser(response.data);
      toast.success("Signup Successfully");
    } catch (e) {
      toast.error("Something went wrong!");
    } finally {
      setIsSigningUp(false);
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <form
    onSubmit={(e) => handleSignup(e)}
      id="signup-form"
      className="flex justify-center items-center h-screen bg-slate-200"
    >
      <div id="signup" className="p-5 bg-white rounded-xl w-[350px]">
        <p className="font-semibold text-2xl text-center">
          Sign Up
          <br />
          <span className="text-sm font-light text-slate-500">
            Create a free account to continue
          </span>
        </p>
        <div>
          <div className="mt-4">
            <label htmlFor="name">Full Name</label>
            <br />
            <input
              type="text"
              id="name"
              className="border-2 rounded-xl p-2  text-sm w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>
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
              required={true}
            />
          </div>
        </div>
        <button
          type="submit"
          className="flex justify-center bg-blue-600 text-white w-full mt-2 rounded-xl p-2"
        >
          {isSigningUp ? <Loader /> : "SIGN UP"}
        </button>
        <p className="text-center mt-1">
          Already have a account?{" "}
          <Link to={"/login"} className="hover:text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}

export default Signup;
