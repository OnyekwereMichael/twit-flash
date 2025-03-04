'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logout from '../../../../../../public/assets/logout.svg';
import Profile from '../../../../../../public/assets/profilepic.svg';
import { sidebarLinksMobile } from '@/app/constants';
import { GetAuthUser, useLogout } from '@/app/lib/query';
import { usePathname } from 'next/navigation';
import { IoMenu, IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import cloudinaryLoader from '@/app/lib/cloudinary';

const TopBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout, isError, error, isSuccess } = useLogout();
  const { data: authUser } = GetAuthUser();

  if (isSuccess) {
    router.push('/signin');
  }

  if (isError) {
    console.log('Error', error);
  }

  const menuVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeInOut' } },
    exit: { y: -10, opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i:number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.15, duration: 0.4, ease: 'easeOut' },
    }),
  };

  return (
    <section className="topbar relative">
      <div className="flex-between py-4 px-3">
        <Link href="/" className="flex gap-3 items-center">
          <h1 className="font-Bakbak text-transparent text-[25px] font-medium">
            <span className="bg-gradient-to-r from-[#8A2BE2] via-[#6A0DAD] to-[#4B0082] bg-clip-text">
              TWIT-
            </span>
            <span className="text-white/80">FLASH ✨</span>
          </h1>
        </Link>

        <div className="flex gap-4 items-center">
         
          <Link href={`/`} className="flex-center gap-3">
            <Image
              loader={cloudinaryLoader}
              src={authUser?.profileImg || Profile}
              alt="Profile_pic"
              className="w-10 h-10 rounded-full border-2 border-gray-300"
              width={40}
              height={40}
            />
          </Link>
          <button className="shad-button_ghost">
            <Image src={Logout} alt="Logout" onClick={() => logout()} />
          </button>
          <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            {menuOpen ? <IoClose size={28} /> : <IoMenu size={28} className='text-purple-500'/>}
          </button>
        </div>
      </div>
        </div>

       

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="absolute top-16 left-0 w-full bg-dark-3 rounded-lg shadow-lg p-6 backdrop-blur-md"
          >
            <div className="flex flex-col gap-5">
              {sidebarLinksMobile.map((link, index) => {
                const dynamicRoute =
                  link.label === 'Profile' && typeof link.route === 'function'
                    ? link.route(authUser?.username)
                    : link.route;
                const isActive = pathname === dynamicRoute;

                return (
                  <motion.div
                    key={link.label}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={linkVariants}
                  >
                    <Link
                      href={typeof dynamicRoute === 'string' ? dynamicRoute : '#'}
                      className={`flex items-center gap-4 p-4 rounded-md transition-all duration-300 ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Image src={link.imgURL} alt={link.label} className="w-6 h-6" />
                      <p className="font-medium text-[18px]">{link.label}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TopBar;
