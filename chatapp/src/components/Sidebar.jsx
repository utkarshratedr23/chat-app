import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { IoArrowBackSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../Zustans/useConversation';
import MessageContainer from './MessageContainer';
import { useSocketContext } from '../context/SocketContext';

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatUser, setChatUser] = useState([]);
  const [newMessageUsers, setNewMessageUsers] = useState('');
  const [searchUser, setSearchUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [allUsers, setAllUsers] = useState([]); // NEW

  const { message, setMessage, selectedConversation, setSelectedConversation } = userConversation();
  const { onlineUser, socket } = useSocketContext();

  const isOnline = (userId) => onlineUser.includes(userId);

  useEffect(() => {
    socket?.on("newMessage", (newMessagee) => {
      setNewMessageUsers(newMessagee);
    });
    return () => socket?.off("newMessage");
  }, [socket, message]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch chat users
  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;
        setLoading(false);
        if (data.success === false) {
          console.log(data.message);
        } else {
          setChatUser(data);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);

  // Fetch all users if no chat yet
  useEffect(() => {
    if (chatUser.length === 0) {
      const fetchAllUsers = async () => {
        try {
          const res = await axios.get("/api/user/allusers");
          setAllUsers(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchAllUsers();
    }
  }, [chatUser]);

  const handleSearchback = () => {
    setSearchUser([]);
    setSearchInput('');
  };

  const handleSearchInput = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      setLoading(false);
      if (data.success === false) {
        console.log(data.message);
      } else if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers('');
  };

  const handelLogOut = async () => {
    const confirmLogout = window.prompt("type 'UserName' To LOGOUT");
    if (confirmLogout === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post('api/auth/logout');
        const data = logout.data;
        if (data?.success === false) {
          setLoading(false);
          console.log(data?.message);
        }
        toast.info(data?.message);
        localStorage.removeItem('chatapp');
        setAuthUser(null);
        setLoading(false);
        navigate('/login');
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info('Logout Cancelled');
    }
  };

  const renderUserList = (users) => (
    users.map((user) => (
      <div key={user._id} onClick={() => handleUserClick(user)}
        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>
        <div className="avatar relative">
          <div className="w-12 rounded-full">
            <img src={user.profilepic || "/default-profile.png"} alt="user.img" />
          </div>
          {isOnline(user._id) && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-bold text-gray-50">{user.username}</p>
        </div>
        <div>
          {
            newMessageUsers.receiverId === authUser._id && newMessageUsers.senderId === user?._id ?
            <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-green-700 text-sm text-white px-2">
            +1
          </div>
           : <div></div>
          }
        </div>
      </div>
    ))
  );

  return (
    <div className="h-full w-auto px-1">
      {isMobileView && selectedConversation ? (
        <MessageContainer selectedUser={selectedConversation} onBack={() => setSelectedConversation(null)} />
      ) : (
        <>
          <div className="flex justify-between gap-2">
            <form onSubmit={handleSearchInput} className="w-auto flex items-center justify-between bg-white rounded-full">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                className="px-4 text-xl w-auto bg-transparent outline-none rounded-full"
                placeholder="Search User"
              />
              <button className="btn btn-circle bg-sky-700 hover:bg-gray-950">
                <FaSearch />
              </button>
            </form>
          </div>

          <div className="divider px-3"></div>

          {searchUser.length > 0 ? (
            <>
              <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
                {renderUserList(searchUser)}
              </div>
              <button onClick={handleSearchback} className="bg-white rounded-full px-2 py-1 self-center">
                <IoArrowBackSharp size={25} />
              </button>
            </>
          ) : (
            <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
              {(chatUser.length > 0 ? renderUserList(chatUser) : renderUserList(allUsers))}
            </div>
          )}
        </>
      )}
      <div className='mt-auto px-1 py-1 flex'>
        <button onClick={() => handelLogOut()} className=' w-10 cursor-pointer hover:text-white rounded-lg'>
          <BiLogOut className='bg-amber-300' size={25} />
        </button>
        <p className='text-sm text-amber-50 py-1'>Logout</p>
      </div>
    </div>
  );
};

export default Sidebar;
