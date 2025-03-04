'use client'
import { useGetAllUsers, useOnlineUsers } from '@/app/lib/query'
import Image from 'next/image'
import React, { useState } from 'react'
import Profile from '../../../../../../public/assets/profilepic.svg'
import cloudinaryLoader from '@/app/lib/cloudinary'
import Loader from '../../(component)/loader/page'
import { useRouter } from 'next/navigation'

interface Chat {
  _id: string
  username: string
  profileImg: string
  fullname: string
}

const Chat = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const router = useRouter()
  const { data: allUsers, isLoading } = useGetAllUsers()
  const { data: OnlineUsers } = useOnlineUsers()
  console.log('OnlineUser', OnlineUsers);
  
  

  if (isLoading) return <Loader />

    // Filter users based on checkbox state
    const filteredUsers = showOnlineOnly
    ? allUsers?.filter((user: Chat) => OnlineUsers.includes(user._id))
    : allUsers

  return (
    <div className='mt-4'>
         <div className="mb-4 flex items-center gap-2 max-sm:px-3">
        <input 
          type="checkbox" 
          id="showOnline" 
          checked={showOnlineOnly} 
          onChange={() => setShowOnlineOnly(prev => !prev)}
          className="w-4 h-4 cursor-pointer"
        />
        <label htmlFor="showOnline" className="text-gray-300 cursor-pointer">
          Show Online Users Only
        </label>
      </div>
    <div className="post-car grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-[51vw]  max-h-[630px] overflow-y-auto max-sm:w-full max-sm:px-3 max-sm:gap-4">
      <style jsx>{`
        .post-car::-webkit-scrollbar {
          display: none;
        }
        .post-car {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {filteredUsers?.map((user:Chat) => {
        return (
          <div 
            key={user._id} 
            className="relative flex flex-col items-center bg-[#1E1E1E] border border-gray-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 "
          >
            {/* Show Online Badge Dynamically */}
            {OnlineUsers.includes(user._id) ? (
                <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-green-400 text-xs font-medium">Online</p>
              </div>
            ): (
              <div className="absolute top-2 left-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-red -500 rounded-full animate-pulse"></span>
              <p className="text-red text-xs font-medium">Offline</p>
            </div>
            )}

            {/* Profile Image & Name */}
            <div className="flex flex-col items-center">
              <Image 
                loader={cloudinaryLoader} 
                src={user?.profileImg || Profile} 
                alt={user?.username || 'User'} 
                width={50} 
                height={50} 
                className="rounded-full w-14 h-14 border border-gray-600 shadow-sm"
              />
              <p className="text-gray-200 text-sm font-medium mt-2">{user.username}</p>
            </div>

            {/* Chat Button */}
            <button 
              onClick={() => router.push(`/chat/chatContainer?user=${encodeURIComponent(JSON.stringify(user))}`)} 
              className="mt-4 bg-gray-800 text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-gray-700"
            >
              Message
            </button>
          </div>
        )
      })}

      {filteredUsers.length === 0 && (
        <p className="text-gray-400 text-center mt-4">No Online users found at the moment 😢.</p>
      )}
    </div>
    </div>
  )
}

export default Chat
