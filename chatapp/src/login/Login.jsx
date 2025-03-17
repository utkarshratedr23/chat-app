/* eslint-disable no-undef */
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const {setAuthUser}=useAuth();
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post("/api/auth/login", userInput);
      const data = login.data;

      if (data.success===false) {
        setLoading(false);
        await toast.error(data.message || "Login failed!");
        return;
      }

     await toast.success(data.message || "Login successful!");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.error(error);
      await toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-1 max-w-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-clip-padding bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-20">
        <h1 className="text-3xl text-gray-950 font-bold text-center">
          Login <span className="text-gray-300">Chatters</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">
                Email:
              </span>
            </label>
            <input
              id="email"
              onChange={handleInput}
              className="w-full input input-bordered h-10"
              type="email"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">
                Password:
              </span>
            </label>
            <input
              id="password"
              onChange={handleInput}
              className="w-full input input-bordered h-10"
              type="password"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className="bg-gray-950 text-gray-300 hover:bg-white text-xl px-6 py-2 rounded-lg shadow-md transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-950">
            If you don't have an account?{" "}
            <Link to={"/signup"}>
              <span className="text-green-500 cursor-pointer font-semibold hover:underline">
                Sign Up Now
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
