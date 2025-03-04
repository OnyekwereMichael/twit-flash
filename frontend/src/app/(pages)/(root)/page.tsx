'use client'
import React, { useState } from 'react'
import PostCard from './(component)/postcard/Postcard'

const Page = () => {
  const [isComment, setIsComment] = useState(false);
  return (
    <div className="w-full md:flex gap-3 justify-between items-center mt-6">
      <PostCard type="all"  isComment={isComment} setIsComment={setIsComment} />
</div>
  )
}

export default Page