import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
    const navigate=useNavigate();
    const{setAuthUser}=useAuth()
    const[loading,setLoading]=useState(false)
    const [inputData,setInputData]=useState({});
    const handleInput=async(e)=>{
    setInputData({
        ...inputData,[e.target.id]:e.target.value
    })
    }
    const selectGender=(selectGender)=>{
        setInputData((prev)=>({
            ...prev,gender:selectGender===inputData.gender?'':selectGender
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(inputData.password!==inputData.confpassword){
            setLoading(false);
            return toast.error('Password does not match')
        }
        try {
          const register = await axios.post("/api/auth/register", inputData);
          const data = register.data;
    
          if (!data.success) {
            setLoading(false);
            toast.error(data.message || "Registration failed!");
            return;
          }
    
          toast.success(data.message || "Registration successful!");
          localStorage.setItem("chatapp", JSON.stringify(data));
          setAuthUser(data);
          setLoading(false);
          navigate("/login");
        } catch (error) {
          setLoading(false);
          console.error(error);
          toast.error(error.response?.data?.message || "Something went wrong!");
        }
      };
  return (
    <div className="flex flex-col justify-center items-center gap-1 max-w-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-clip-padding bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-20">
      <h1 className="text-3xl text-gray-950 font-bold text-center">
          Register <span className="text-gray-300">Chatters</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
        <div>
            <label className="label p-2">
              <span className="font-bold text-gray-50 text-xl label-text">
                Fullname:
              </span>
            </label>
            <input
              id="Fullname"
              onChange={handleInput}
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="Enter Your Full Name"
              required
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-50 text-xl label-text">
                Username:
              </span>
            </label>
            <input
              id="username"
              onChange={handleInput}
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="Enter Your User Name"
              required
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-50 text-xl label-text">
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
              <span className="font-bold text-gray-50 text-xl label-text">
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
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-50 text-xl label-text">
                Confirm Password:
              </span>
            </label>
            <input
              id="confpassword"
              onChange={handleInput}
              className="w-full input input-bordered h-10"
              type="password"
              placeholder="Enter Confirm Password"
              required
            />
          </div>
          <div className='flex gap-2 mt-1' id='gender'>
            <label className='cursor-pointer label flex gap-2'>
                <span className='label-text text-xl text-gray-50'>Male</span>
                <input onChange={()=>selectGender('male')}
                 checked={inputData.gender==='male'} type='checkbox' className='checkbox checkbox-info'/>
            </label>
            <label className='cursor-pointer label flex gap-2'>
                <span className='label-text text-xl text-gray-50'>Female</span>
                <input onChange={()=>selectGender('female')}
                checked={inputData.gender==='female'} type='checkbox' className='checkbox checkbox-info'/>
            </label>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className="bg-cyan-600 text-gray-950 cursor-pointer hover:bg-white text-xl px-6 py-2 rounded-lg shadow-md transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </div>
        </form>
        <div className="pt-2">
                  <p className="text-sm text-center font-semibold text-gray-100">
                    Already have an Account?{" "}
                    <Link to={"/login"}>
                      <span className="text-green-500 cursor-pointer font-semibold hover:underline">
                        Login
                      </span>
                    </Link>
                  </p>
                </div>
      </div>
      </div>
  )
}

export default Register