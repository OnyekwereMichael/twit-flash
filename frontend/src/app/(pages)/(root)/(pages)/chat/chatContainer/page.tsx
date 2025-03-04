'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatHeader from './chatHeader/page'
import MessageInput from './messageInput/page'
import MessageContainer from './messageContainer/page'

const ChatContainer = () => {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  )
}

const ChatContent = () => {
  const searchParams = useSearchParams()
  const user = searchParams.get('user') ? JSON.parse(decodeURIComponent(searchParams.get('user') as string)) : null

  return (
    <div className='post-car w-[52vw] max-sm:w-full max-h-[630px] overflow-y-auto '>
      <style jsx>{`
        .post-car::-webkit-scrollbar {
          display: none;
        }
        .post-car {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

      <ChatHeader user={user} />
      <MessageContainer user={user} />
      <MessageInput user={user} />
    </div>
  )
}

export default ChatContainer
