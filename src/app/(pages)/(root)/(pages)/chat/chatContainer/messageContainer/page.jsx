'use client'
import { GetAuthUser, useGetMessages } from '@/app/lib/query'
import React, { useEffect, useRef } from 'react'
import Profile from '../../../../../../../../public/assets/profilepic.svg'
import Image from 'next/image'
import cloudinaryLoader from '@/app/lib/cloudinary'
import { formatMessageTime } from '@/app/lib/date'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'

// interface User {
//   user: {
//     _id:string
//   }
// }

// interface MessageContainerProps {
//     _id: string;
//     createdAt: string,
//     text: string,
//     image: string,
//     senderId: string
//     username: string;
//     profileImg: string;
// }
const MessageContainer = (user) => {
  const {data:getCurrentUser} = GetAuthUser()
  const {data:Messages} = useGetMessages(user._id)

  const messageRef = useRef(null)

useEffect(() => {
  if(messageRef.current && Messages){
    messageRef.current.scrollIntoView({behavior:'smooth'})
  }
},[Messages])

  return (
    <div className='post-car flex-1 overflow-y-auto p-4 space-y-4 max-h-[480px] '>
       <style jsx>{`
        .post-car::-webkit-scrollbar {
          display: none;
        }
        .post-car {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      

         {Messages?.map((message) => (
          <div key={message._id} className={`chat  ${message.senderId === getCurrentUser?._id ? 'chat-end' : 'chat-start'}`} ref={messageRef}>
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
               <Image loader={cloudinaryLoader} src={message.senderId === getCurrentUser?._id ? getCurrentUser?.profileImg : Profile} alt="Profile" width={40} height={40} className='rounded-full w-10 h-10' />
               </div>
            </div>
             <div className='chat-header mb-1'>
              <p className='text-xs opacity-50 ml-1'>{formatMessageTime(message.createdAt)}</p>
             </div>
             <div className="chat-bubble flex flex-col gap-2 p-3 bg-gray-800 rounded-xl max-w-[80%]">
  {message.image && (
    <Image
      loader={cloudinaryLoader}
      width={300}
      height={300}
      src={message.image}
      alt="Message Image"
      className="w-[300px] h-auto rounded-lg shadow-md"
    />
  )}
  {message.text && (
    <p className="text-white text-sm leading-relaxed break-words">
      {message.text}
    </p>
  )}
</div>

          </div>
        ))
      }

      
   {!Messages || Messages.length === 0 && (
 <div className="flex flex-col items-center justify-center text-gray-400 font-bold text-2xl text-center animate-pulse">
 <IoChatbubbleEllipsesOutline className="text-6xl mb-2 text-gray-500" /> {/* Chat icon */}
 <p>No messages yet. <br /> Start the conversation! 💬</p>
</div>
     )}
    </div>
  )
}

export default MessageContainer 
