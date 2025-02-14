'use client'
import { USERS_FOR_RIGHT_PANEL } from "@/app/constants/dummy";
import RightPanelSkeleton from "./RightPanelSkeleton";
import Link from "next/link";
import Profile from '../../../../../../public/assets/profilepic.svg'
import { profile } from "console";
import Image from "next/image";
import { FiUserPlus } from "react-icons/fi";
import { MdPersonAdd } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi";
import { useFollowUser, useGetSuggestedUser } from "@/app/lib/query";
import cloudinaryLoader from "@/app/lib/cloudinary";

const RightPanel = () => {
	const {data:getSuggestedUser, isLoading, isError, error} = useGetSuggestedUser()
	const {mutate:follow, isPending,  isError:isErrorFollowing, error:iserrorFollowing} = useFollowUser()
	if (isError) {
		console.log('Error', error.message);	
	}

	if(isErrorFollowing) {
		console.log('Error', iserrorFollowing);
	}
	// const isLoading = false;

	return (
		<div className="rightsidebar">
			<div className="flex flex-col gap-6">
				<div className="flex gap-3 items-center">
				<p className="font-bold text-xl text-white">Who to follow</p>
				<HiUserAdd size={20} />
				</div>
				<div className="flex flex-col gap-6">
					{/* Skeleton loading */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{/* User list */}
					{!isLoading &&
						getSuggestedUser?.map((user:any) => (
							<Link
								href={`/profile/${user.username}`}
								className="flex items-center justify-between gap-4 p-3 rounded-lg transition"
								key={user._id}
							>
								{/* User info */}
								<div className="flex gap-3 items-center">
									<div className="avatar">
										<div className="rounded-full overflow-hidden">
											<Image
												src={user.profileImg || Profile}
												alt={`${user.fullname}'s profile`}
												className="object-cover w-10 h-10 "
												width={10}
												height={10}
												loader={cloudinaryLoader}
											/>
										</div>
									</div>
									<div className="flex flex-col">
										<span className="font-semibold text-white tracking-tight truncate w-28">
											{user.fullname}
										</span>
										<span className="text-light-3  small-regular">@{user.username}</span>
									</div>
								</div>
								{/* Follow button */}
								<div>
									<button
										className="bg-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-purple-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
										onClick={
											(e) => {
											e.preventDefault()
											follow(user?._id)
											}
										}
									>
										{isPending ? <div className="flex items-center gap-2  justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
                          </div> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};

export default RightPanel;
