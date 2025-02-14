'use client'
import React, { useState } from 'react'
import TopBar from './(component)/topbar/page'
import LeftSideBar from './(component)/leftsidebar/page'
import PostCard from './(component)/postcard/Postcard'
import RightSidebar from './(component)/rightsidebar/Rightsidebar'

const page = () => {
  const [isComment, setIsComment] = useState(false);
  return (
    <div className="w-full md:flex gap-3 justify-between items-center mt-6">
      <PostCard type="all"  isComment={isComment} setIsComment={setIsComment} />
</div>
  )
}

export default page