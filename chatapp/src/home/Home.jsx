import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MessageContainer from '../components/MessageContainer';

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Ensure sidebar is visible initially
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false); // Hide Sidebar when a user is selected
  };

  const handleShowSidebar = () => {
    setSelectedUser(null);
    setIsSidebarVisible(true); // Show Sidebar when going back
  };

  return (
    <div className='flex justify-between min-w-full md:min-w-[550px] md:max-w-[75%] 
      px-2 h-[95%] md:h-full rounded-xl shadow-lg bg-clip-padding 
      backdrop-filter backdrop-blur-lg bg-opacity-0'>

      {/* Sidebar - Only visible on small screens when no user is selected */}
      <div className={`w-full py-2 ${selectedUser ? 'hidden' : 'flex'} md:flex`}>
        <Sidebar onSelectUser={handleUserSelect} />
      </div>

      {/* Divider - Only shown on medium (md) and larger screens */}
      <div className={`divider divider-horizontal px-3 hidden md:flex ${selectedUser ? 'block' : 'hidden'}`}>
      </div>

      {/* MessageContainer - Visible when a user is selected (Replaces Sidebar on small screens) */}
      <div className={`flex-auto ${selectedUser ? 'flex' : 'hidden'} md:flex`}>
        <MessageContainer onBackUser={handleShowSidebar} />
      </div>
    </div>
  );
};

export default Home;
