'use client';
import { FaUser, FaTrash } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import Link from "next/link";
import { useDeleteAllNotification, useGetNotification } from "@/app/lib/query";
import Image from "next/image";
import Profile from "../../../../../../public/assets/profilepic.svg";
import cloudinaryLoader from "@/app/lib/cloudinary";

interface Notification {
    _id: string;
    type: "follow" | "like";
    sender: {
        username: string;
        profileImg: string;
    };
}
const NotificationPage = () => {
    const { data: notificationData, isError, error, isLoading } = useGetNotification();
    const { mutate: deleteNotification } = useDeleteAllNotification();

    if (isError) {
        console.error("Error fetching notifications:", error.message);
    }

    const deleteNotifications = () => {
        deleteNotification();
    };

    return (
        <div className="w-[50vw] overflow-y-auto max-h-[650px] max-sm:w-full bg-dark-2 rounded-3xl border border-dark-4 p-5 lg:p-4 mt-4 text-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-lg">Notifications</h2>
				{notificationData?.notifications.length >= 1 && (		
                <div className="flex items-center gap-2 cursor-pointer" onClick={deleteNotifications}>
                    <FaTrash className="w-4 h-4 text-red" />
                    <p className="text-white text-right">Delete all notifications</p>
                </div>
				) }
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center text-gray-500 font-medium py-4">Loading notifications...</div>
            )}

            {/* No Notifications */}
            {!isLoading && notificationData?.length === 0 && (
                <div className="text-center text-gray-500 font-medium py-4">
                    No notifications to display 🤔
                </div>
            )}

            {/* Notifications List */}
            {!isLoading && notificationData?.notifications.length > 0 && (
                <div className="space-y-4 mt-4">
                    {notificationData?.notifications.map((notification:Notification) => (
                        <div
                            key={notification._id}
                            className="flex items-center bg-dark-4 shadow-sm p-4 rounded-lg hover:shadow-md transition"
                        >
                            {/* Notification Icon */}
                            <div className="flex-shrink-0">
                                {notification.type === "follow" && (
                                    <FaUser className="w-6 h-6 text-purple-500" />
                                )}
                                {notification.type === "like" && (
                                    <FaHeart className="w-6 h-6 text-red" />
                                )}
                            </div>

                            {/* Profile Info */}
                            <Link
                                href={`/profile/${notification.sender.username}`}
                                className="flex items-center gap-4 ml-4 flex-grow"
                            >
                                {/* Profile Image */}
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <Image
                                        src={notification?.sender.profileImg || Profile}
                                        loader={cloudinaryLoader}
                                        alt={`${notification.sender.username}'s profile`}
                                        className="object-cover w-full h-full"
                                        width={40}
                                        height={40}
                                    />
                                </div>

                                {/* Notification Details */}
                                <div>
                                    <p className="text-sm text-gray-300 flex gap-2">
                                        <span className="font-semibold text-white">
                                            @{notification.sender.username}
                                        </span>
                                        <span className="text-purple-500">
                                            {notification.type === "follow"
                                                ? "started following you"
                                                : "liked your post"}
                                        </span>
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

              {notificationData?.notifications.length === 0 && (
                        <div className="text-center text-gray-500 font-medium py-4">
                            No notifications to display 🤔
                        </div>
                    )}
        </div>
    );
};

export default NotificationPage;
