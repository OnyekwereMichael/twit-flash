'use client'
import Link from 'next/link'
import Logout  from '../../../../../../public/assets/logout.svg'
import Profile from '../../../../../../public/assets/profilepic.svg'
import Image from 'next/image'



const TopBar = () => {

  return (
    <section className="topbar">
       <div className="flex-between py-4 px-5">
           <Link href='/' className="flex gap-3 items-center">
           <h1 className="font-Bakbak text-transparent text-[25px] font-medium ">
  <span className='bg-gradient-to-r from-[#8A2BE2] via-[#6A0DAD] to-[#4B0082] bg-clip-text'>TWIT-</span><span className='text-white/80'>FLASH ✨</span>
</h1>
           </Link>

           <div className="flex gap-4">
              <button className="shad-button_ghost"   >
              <Image src={Logout} alt=""/>
              </button>
              <Link href={`/`} className="flex-center gap-3">
               <Image src={ Profile} alt="Profile_pic" className="w-8 h-8 rounded-full"/>
              </Link>
           </div>
       </div>
    </section>
  )
}

export default TopBar
