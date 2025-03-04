'use client'
import Link from 'next/link'
import Logout  from '../../../../../../public/assets/logout.svg'
import Profile from '../../../../../../public/assets/profilepic.svg'
import { sidebarLinks } from '@/app/constants'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { GetAuthUser, useLogout } from '@/app/lib/query'
import { useRouter } from 'next/navigation'
import cloudinaryLoader from '../../../../lib/cloudinary'

const LeftSideBar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { mutate: logout, isError, error, isSuccess, isPending } = useLogout()
  const {data:authUser} = GetAuthUser()
  console.log(authUser);
  

  // Handle error state
  if (isError) {
    return <p>Error: {error?.message}</p>
  }

  // Redirect on success
  if (isSuccess) {
    router.push('/signin')  // Redirects to the sign-in page
  }

  

  return (
    <div>
      <nav className="leftsidebar">
        <div className="flex flex-col gap-10">
          <Link href="/" className="flex gap-3 items-center">
            <div>
              <h1 className="font-Bakbak text-transparent text-[33px] font-semibold max-sm:text-[30px]">
                <span className="bg-gradient-to-r from-[#8A2BE2] via-[#6A0DAD] to-[#4B0082] bg-clip-text">TWIT-</span>
                <span className="text-white/80">FLASH ✨</span>
              </h1>
            </div>
          </Link>
          <Link href={`/`} className=" flex  items-center gap-3">
            <Image loader={cloudinaryLoader} src={authUser?.profileImg || Profile} alt="Profile_pic" className="w-14 h-14 rounded-full" width={14} height={14}/>
            <div className="flex flex-col">
              <p className="body-bold">{authUser?.fullname}</p>
              <p className="text-light-3 small-regular">@{authUser?.username}</p>
            </div>
          </Link>

          <ul className="flex flex-col gap-5">
            {sidebarLinks.map((link) => {
               const dynamicRoute = link.label === "Profile" && typeof link.route === 'function' ? link.route(authUser?.username) : link.route;
               const isActive = pathname === dynamicRoute;
              return (
                <li className={`leftsidebar-link group ${isActive && 'bg-purple-500'}`} key={link.label}>
                  <Link href={typeof dynamicRoute === 'string' ? dynamicRoute : '#'} className="flex gap-4 items-center p-4">
                    <Image src={link.imgURL} alt="" className={`group-hover:invert-white ${isActive && 'invert-white'} w-6 h-6`} width={6} height={6}/>
                    <p className="font-medium text-[18px] font-Asul">{link.label}</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Logout button */}
        <button className="shad-button_ghost text-center" onClick={() => logout()}>
          <Image src={Logout} alt="" />
          <p className="sm:medium lg:base:medium font-medium text-[15px]">
            {isPending ? 'Logging out...' : 'Logout'}
          </p>
        </button>
      </nav>
    </div>
  )
}

export default LeftSideBar
