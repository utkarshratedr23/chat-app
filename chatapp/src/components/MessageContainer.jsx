/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import userConversation from "../Zustans/useConversation";
import axios from "axios";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import { useSocketContext } from "../context/SocketContext";
import notify from '../assets/sound/notification.mp3';

const MessageContainer = ({ selectedUser }) => {
  const { authUser } = useAuth();
  const { messages, setSelectedConversation, setMessage, selectedConversation } = userConversation();
  const { socket } = useSocketContext();

  const [loading, setLoading] = useState(false);
  const [sendData, setSendData] = useState("");
  const [sending, setSending] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const lastMessageRef = useRef();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const showSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedConversation(null);
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessages) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage([...messages, newMessages]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessage, messages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation?._id}`, { messages: sendData });
      const data = await res.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      setSending(false);
      setSendData("");
      setMessage([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  const handleMessage = (e) => {
    const value = e.target.value;
    setSendData(value);

    // Emit typing event to receiver
    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: selectedConversation._id,
      username: authUser.username,
    });
  };

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(`/api/message/${selectedConversation?._id}`);
        const data = get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessage(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }, [messages]);

  // Typing Listener
  useEffect(() => {
    socket?.on("typing", ({ senderId, username }) => {
      if (selectedConversation?._id === senderId) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });

    return () => socket?.off("typing");
  }, [socket, selectedConversation]);

  return (
    <div className="md:min-w-[500px] h-[99%] flex flex-col py-2">
      {!selectedConversation ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl text-gray-200 font-semibold flex flex-col items-center gap-2">
            <p className="text-2xl">Welcome, {authUser.username}!</p>
            <p className="text-lg">Select a chat to start messaging</p>
            <TiMessages className="text-6xl text-center" />
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center bg-sky-600 p-2 rounded-lg h-12">
            {isMobileView && (
              <button onClick={showSidebar} className="bg-white rounded-full p-1">
                <IoArrowBackSharp size={25} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <img
                className="rounded-full w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                src={selectedConversation?.profilepic || "/default-profile.png"}
              />
              <span className="text-gray-950 text-lg font-bold">{selectedConversation?.username}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-2">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="loading loading-spinner"></div>
              </div>
            )}

            {!loading && messages?.length === 0 && (
              <p className="text-center text-gray-500">Send a message to start a conversation</p>
            )}

            {!loading &&
              messages?.length > 0 &&
              messages.map((message) => (
                <div
                  key={message._id}
                  ref={lastMessageRef}
                  className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                >
                  <div className={`chat-bubble ${message.senderId === authUser._id ? "bg-sky-400" : "bg-white"}`}>
                    {message?.message}
                  </div>
                </div>
              ))}

            {/* Typing Status */}
            {isTyping && (
           <div className="text-sm text-gray-500 px-4 py-1 flex items-center gap-2">
           <span>✍️</span>
           <span>{selectedConversation?.username} is typing...</span>
           </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="rounded-full text-black">
            <div className="w-full rounded-full flex items-center bg-white">
              <input
                value={sendData}
                onChange={handleMessage}
                required
                id="message"
                placeholder="Type a message..."
                className="w-full bg-transparent outline-none px-4 rounded-full"
                type="text"
              />
              <button type="submit">
                {sending ? (
                  <div className="loading loading-spinner"></div>
                ) : (
                  <IoSend size={25} className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1" />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
