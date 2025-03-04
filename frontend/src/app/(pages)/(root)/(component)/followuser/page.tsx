'use client'
import Image from "next/image";
import { useFollowUser, useGetSuggestedUser } from "@/app/lib/query";
import cloudinaryLoader from "@/app/lib/cloudinary";
import Profile from '../../../../../../public/assets/profilepic.svg'

interface RigthPanelUserMobile {
	_id: string;
	fullname: string;
	username: string;
	profileImg: string;
}
const FollowCard = () => {
    const { data: getSuggestedUser, isLoading, isError, error } = useGetSuggestedUser();
    const { mutate: follow, isPending, isError: isErrorFollowing, error: iserrorFollowing } = useFollowUser();

    if(isLoading) return  <p>Loading...</p>;
    if (isError) {
        console.log('Error', error.message);
    }

    if (isErrorFollowing) {
        console.log('Error', iserrorFollowing);
    }

    return (
        <div className="bg-dark-3 shadow-md rounded-lg px-3 py-1 max-w-sm w-full">
            {getSuggestedUser?.map((user:RigthPanelUserMobile) => (
                <div 
                    key={user._id} 
                    className="flex items-center justify-between gap-3 p-3 "
                >
                    <div className="flex items-center gap-3">
                    <div className="avatar">
										<div className="rounded-full  w-12 h-12 overflow-hidden">
											<Image
												src={user.profileImg || Profile}
												alt={`${user.fullname}'s profile`}
												className="object-cover w-12 h-12 "
												width={10}
												height={10}
												loader={cloudinaryLoader}
											/>
										</div>
									</div>
                        <div>
                            <h3 className="text-white font-semibold text-sm">{user.fullname}</h3>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                    </div>
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
            ))}
        </div>
    );
};

export default FollowCard;
