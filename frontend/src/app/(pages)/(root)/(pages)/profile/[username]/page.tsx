"use client";
import { ChangeEvent, useRef, useState } from "react";
// import Posts from "../../components/common/Posts";
// import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
// import EditProfileModal from "./EditProfileModal";
import Profile from "../../../../../../../public/assets/profilepic.svg";
import Cover from "../../../../../../../public/assets/side-img.svg";
// import PostCard from "../../../(component)/postcard/Postcard";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import {
  GetAuthUser,
  useFollowUser,
  useGetProfile,
  useUpdateProfileImg,
} from "@/app/lib/query";
import { formatMemberSinceDate } from "@/app/lib/date";
import Loader from "../../../(component)/loader/page";
import Profilepost from "../../../(component)/postcard/profilePost/page";
import Profilelikes from "../../../(component)/postcard/profileLikes/page";
import toast from "react-hot-toast";
import cloudinaryLoader from "@/app/lib/cloudinary";

const ProfilePage: React.FC = () => {
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [coverImg, setCoverImg] = useState<string | null>(null);

  // Refs for file input elements
  const profileImgRef = useRef<HTMLInputElement>(null);
  const coverImgRef = useRef<HTMLInputElement>(null);
  const [feedType, setFeedType] = useState("posts");

  const { data: user, isLoading, isError, error } = useGetProfile();
  const {
    mutate: follow,
    isPending,
    isError: isErrorFollowing,
    error: iserrorFollowing,
  } = useFollowUser();
  const { data: authUser } = GetAuthUser();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileImg();
  if (isErrorFollowing) {
    console.log("Error", iserrorFollowing);
  }

  if (isError) {
    console.log("Error", error);
  }

  const memberSinceDate = formatMemberSinceDate;

  if (isLoading) return <Loader />;

  const isMyProfile = authUser?._id === user?._id;
  const amiFollowing = authUser?.following.includes(user?._id);

  const handleImgChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "cover") {
          setCoverImg(reader.result as string);
        } else if (type === "profile") {
          setProfileImg(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    if (!profileImg && !coverImg) {
      toast.error("Please select an image to update.");
      return;
    }
    updateProfile({ coverImg, profileImg });
  };

  console.log("The user", user);

  console.log(user?.coverImg);

  return (
    <>
      <div className="post-car w-[52vw]  border-r border-gray-700 min-h-screen max-sm:w-full max-h-[600px]  overflow-y-auto">
        <style jsx>{`
          .post-car::-webkit-scrollbar {
            display: none;
          }
          .post-car {
            -ms-overflow-style: none; /* Internet Explorer 10+ */
            scrollbar-width: none; /* Firefox */
          }
        `}</style>
        {/* {isLoading && <ProfileHeaderSkeleton />} */}
        {!isLoading && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center mt-2">
                <Link href="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullname}</p>
                  {/* <span className='text-sm text-slate-500'>{POSTS?.length} posts</span> */}
                </div>
              </div>

              {/* COVER IMAGE */}
              <div className="relative group/cover mt-2">
                <Image
                  width={52}
                  height={52}
                  src={coverImg || user?.coverImg || Cover}
                  loader={cloudinaryLoader}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />

                {isMyProfile && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={coverImgRef}
                      className="hidden"
                      onChange={(e) => handleImgChange(e, "cover")}
                    />
                    <div
                      className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                      onClick={() => coverImgRef.current?.click()}
                    >
                      <MdEdit className="w-5 h-5 text-white" />
                    </div>
                  </>
                )}

                {/* PROFILE IMAGE */}
                <div className="avata absolute -bottom-16 left-4">
                  <div className=" rounded-full relative group/avata">
                    <Image
                      src={profileImg || user?.profileImg || Profile}
                      loader={cloudinaryLoader}
                      alt="Profile Image"
                      className="rounded-full w-32 h-[7.8rem]"
                      width={52}
                      height={52}
                    />

                    {isMyProfile && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          ref={profileImgRef}
                          className="hidden"
                          onChange={(e) => handleImgChange(e, "profile")}
                        />
                        <div
                          className="absolute top-5 right-3 p-1 bg-primary rounded-full opacity-0 group-hover/avata:opacity-100 cursor-pointer"
                          onClick={() => profileImgRef.current?.click()}
                        >
                          <MdEdit className="w-4 h-4 text-white" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {/* {isMyProfile && <EditProfileModal />} */}
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-full px-5 py-2 text-sm shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => follow(user?._id)}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2  justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
                    </div>
                  ) : !isPending && amiFollowing ? (
                    "unFollow"
                  ) : isMyProfile ? (
                    <Link
                      href="/profile/editprofile"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p>Edit Profile</p>
                    </Link>
                  ) : (
                    <p>Follow</p>
                  )}

                  {/* {isMyProfile && <div>Edit Profile</div> } */}
                </button>
                {(profileImg || coverImg) && (
                  <button
                    className="border border-purple-500 text-white text-sm font-medium rounded-full px-5 py-2 hover:bg-purple-600 ml-2 transition"
                    onClick={handleUpdateProfile}
                  >
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-8 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg ">{user?.fullname}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href="https://youtube.com/@asaprogrammer_"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {memberSinceDate(user?.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-purple-500 hover:text-white transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-purple-500  hover:text-white transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </>
          )}
          {/* DISPLAY POSTS OR LIKES */}
          {feedType === "posts" ? <Profilepost /> : <Profilelikes />}
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
