import React, { useEffect, useState } from 'react';
import {FaSearch} from 'react-icons/fa';
import axios from 'axios'
import { IoArrowBackSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../Zustans/useConversation';
const Sidebar = () => {
const navigate=useNavigate()
const { authUser, setAuthUser } = useAuth();
const[searchInput,setSearchInput]=useState('')
const [loading,setLoading]=useState(false);
const[chatUser,setChatUser]=useState([])
const[searchUser,setSearchUser]=useState([]);
const[selectedUserId,setSelectedUserId]=useState(null)
const {message , setMessage, selectedConversation ,  setSelectedConversation} = userConversation();
useEffect(()=>{
    const chatUserHandler=async()=>{
        setLoading(true);
       try{
          const chatters=await axios.get(`/api/user/currentchatters`)
          const data=chatters.data;
          if(data.success===false){
            setLoading(false)
            console.log(data.message)
          }
          setLoading(false);
          setChatUser(data)
       }
       catch(error){
        setLoading(false)
        console.log(error)
       }
    }
    chatUserHandler()
},[])
console.log(chatUser);

const handleSearchback = () => {
  setSearchUser([]);
  setSearchInput('')
}
const handleSearchInput=async(e)=>{
   e.preventDefault()
   setLoading(true);
   try{
   const search=await axios.get(`/api/user/search?search=${searchInput}`)
   const data=search.data;
   if(data.success===false){
    setLoading(false);
    console.log(data.message)
   }
   setLoading(false);
   if(data.loading===0){
    toast.info("User Not Found")
   }
   else{
      setSearchUser(data)
   }
   }
   catch(error){
     setLoading(false);
     console.log(error)
   }
  }
  const handleUserClick=(user)=>{
      setSelectedConversation(user);
      setSelectedUserId(user._id);
        
}
  const handelLogOut=async()=>{
    const confirmLogout=window.prompt("type 'UserName' To LOGOUT");
    if(confirmLogout===authUser.username){
      setLoading(true)
      try{
       const logout=await axios.post('api/auth/logout')
       const data=logout.data;
       if(data?.success===false){
         setLoading(false)
         console.log(data?.message)
       }
       toast.info(data?.message)
       localStorage.removeItem('chatapp')
       setAuthUser(null)
       setLoading(false)
       navigate('/login')
      }
      catch(error){
       setLoading(false)
       console.log(error)
      }
    }
   else{
    toast.info('Logout Cancelled')
   }
   
   

  }
  return (
    <div className='h-full w-auto px-1'>
   <div className='flex justify-between gap-2'>
     <form onSubmit={handleSearchInput} className='w-auto flex items-center justify-between bg-white rounded-full'>
       <input value={searchInput} 
       onChange={(e)=>setSearchInput(e.target.value)} type='text' className='px-4 text-xl w-auto bg-transparent outline-none rounded-full' placeholder='Search User'/>
       <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
        <FaSearch/>
       </button>
     </form>
     <img onClick={()=>navigate(`/profile/${authUser?._id}`)} src={authUser?.profilepic || '/default-profile.png'}
       className='self-center h-12 w-12 hover:scale-110 cursor-pointer'/>
   </div>
   <div className='divider px-3'>
   </div>
   {searchUser.length > 0 ? (
    <>
    <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
    <div className='w-auto'>
    {searchUser.map((user,index)=>(
                <div key={user._id}>
                    <div
                    onClick={()=>handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                    ${selectedUserId===user?._id ? 'bg-sky-500':''}`}>
                        <div className='avatar'>
                            <div className='w-12 rounded-full'>
                           <img src={user.profilepic} alt='user.img'/>
                            </div>
                            </div>
                            <div className='flex flex-col flex-1' >
                               <p className='font-bold text-gray-950'> {user.username} </p> 
                            </div>
                        
                    </div>
                    <div className='divider divide-solid px-3 h-[1px]'></div>
                    </div>
            ))}
        </div>
        </div>
        <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={()=>handleSearchback()} className='bg-white rounded-full px-2 py-1 self-center'>
                            <IoArrowBackSharp size={25} />
                        </button>

                    </div>
    </>
   ):(<>
   <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
     <div className='w-auto'>
        {chatUser.length===0 ?(
            <>
        <div className='font-bold items-center flex flex-col text-xl text-yellow-500'>
            <h1>Looking to have a chat</h1>
            <h1>Search username to chat</h1>
        </div>
        </>):(
            <>
            {chatUser.map((user,index)=>(
                <div key={user._id}>
                    <div
                    onClick={()=>handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                    ${selectedUserId===user?._id ? 'bg-sky-500':''}`}>
                        <div className='avatar'>
                            <div className='w-12 rounded-full'>
                           <img src={user.profilepic} alt='user.img'/>
                            </div>
                            </div>
                            <div className='flex flex-col flex-1' >
                               <p className='font-bold text-gray-950'> {user.username} </p> 
                            </div>
                        
                    </div>
                    <div className='divider divide-solid px-3 h-[1px]'></div>
                </div>
            ))}
            </>
        )}
     </div>
   </div>
   <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={()=>handelLogOut()} className=' w-10 cursor-pointer hover:text-white rounded-lg'>
                            <BiLogOut className='bg-amber-300' size={25} />
                        </button>
                        <p className='text-sm text-amber-50 py-1'>Logout</p>
                    </div>
   </>)}
    </div>
  )
}

export default Sidebar