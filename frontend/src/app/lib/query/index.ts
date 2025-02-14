'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IloginUser, INewPost, INewUser, IUpdateUser } from "../../types";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "../enum/index";
import { useParams } from "next/navigation";


export const createUserAccount = () => {
    return useMutation({
        mutationFn: async ({ email, username, fullname, password }: INewUser) => {
            try {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, username, fullname, password })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                console.log(data);


                if (data.error) throw new Error(data.error);

                toast.success('Account created successfully!');
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to create user');
                throw error;
            }
        }
    });
};


export const signInAccount = () => {
    return useMutation({
        mutationFn: async ({ username, password }: IloginUser) => {
            try {
                const res = await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                toast.success('Logged in successfully!');
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to login');
                throw error;
            }
        }
    })
}

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch('/api/auth/logout', {
                    method: 'POST',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                toast.success('Logged out successfully!');
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to logout');
                throw error;
            }
        }
    })
}

export const getAuthUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to get user');
                throw error;
            }

        },

        retry: false,

    })
}


export const getAllPost = (type: string) => {
    const { username, id } = useParams();
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POSTS, type, username, id], // Include type to differentiate queries
        queryFn: async () => {
            try {
                let endpoint = "";

                if (type === "all") {
                    endpoint = "all";
                } else if (type === "following") {
                    endpoint = "following";
                } else if (type === "user" && username) {
                    endpoint = `user/${username}`;
                } else if (type === 'likes' && id) {
                    endpoint = `likes/${id}`;
                } else {
                    throw new Error("Invalid post type");
                }

                const res = await fetch(`/api/post/${endpoint}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch posts");

                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || "Failed to get posts");
                throw error;
            }
        },
        retry: false,
        enabled: type === "all" || type === "following" || (type === "user" && !!username), // Ensure query runs only when necessary
    });
};


export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (pid: string) => {
            try {
                const res = await fetch(`/api/post/${pid}`, {
                    method: 'DELETE',
                });
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to delete post');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS, 'all'] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS, 'following'] });
            toast.success('Post deleted successfully!');
        },
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tags, caption }: INewPost) => {
            try {
                const res = await fetch('/api/post/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tags, caption }),
                });
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log("pOST DATA  ", data);
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to create post');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS, 'all'] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS, 'following'] });
            toast.success('Post created successfully!');
        },
    });
}

export const useGetSuggestedUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SUGGESTED_USER],
        queryFn: async () => {
            try {
                const res = await fetch('/api/user/suggested');
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log('This is the data', data);
                return data;

            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to get suggested users');
                throw error;
            }
        },
        retry: false,
    });
}

export const useFollowUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (uid: string) => {
            try {
                const res = await fetch(`/api/user/follow/${uid}`, {
                    method: 'POST',
                });
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to Follow user');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SUGGESTED_USER] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
            // toast.success('User Followed successfully!');
        },
    });
}

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (lid: string) => {
            try {
                const res = await fetch(`/api/post/like/${lid}`, {
                    method: 'POST',
                });
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to Like Post');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
            toast.success('Post Liked successfully!');
        },
    });
}

export const useComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ cid, text }: { cid: string; text: string }) => {
            try {
                const res = await fetch(`/api/post/comment/${cid}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text }),
                });
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to add comment');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
            toast.success('Comment successfully!');
        },
    });
}

export const useGetNotification = () => {
    // const queryClient = useQueryClient();
    return useQuery({
        queryKey: [QUERY_KEYS.GET_NOTIFICATION],
        queryFn: async () => {
            try {
                const res = await fetch('/api/notification');
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log('This is the data', data);
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to get notifications');
                throw error;
            }
        },
    });
}

export const useDeleteAllNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch('/api/notification', {
                    method: 'DELETE',
                });
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to delete all notifications');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_NOTIFICATION] });
            toast.success('All notifications deleted successfully!');
        },
    });
}

export const useGetProfile = () => {
    const { username } = useParams();

    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROFILE, username], // Include username in query key
        queryFn: async () => {
            try {
                const res = await fetch(`/api/user/profile/${username}`);
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);

                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || "Failed to get Profile");
                throw error;
            }
        },
        enabled: !!username, // Prevents query from running if username is undefined
    });
};

export const useUpdateProfileImg = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ coverImg, profileImg }: { coverImg?: string | null; profileImg?: string | null }) => {
            try {
                if (!coverImg && !profileImg) {
                    throw new Error("No images selected.");
                }

                const res = await fetch('/api/user/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ coverImg, profileImg }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to update profile");
                }

                const data = await res.json();
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to Update Details');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PROFILE] });
            toast.success('Profile Updated Successfully');
        },
    });
};
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ fullname, username, email, bio, link, currentPassword, newPassword }: IUpdateUser) => {
            try {
                if (!fullname && !username && !email && !bio && !link && !currentPassword && !newPassword) {
                    throw new Error("At least one field is required to update your profile.");
                }

                const res = await fetch('/api/user/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullname, username, email, bio, link, currentPassword, newPassword }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to update profile");
                }

                const data = await res.json();
                return data;
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to Update Details');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PROFILE] });
            toast.success('Profile Updated Successfully');
        },
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ postId, caption, tags, img }: { postId: any, caption: string, tags: string, img?: string }) => {
            try {
                if (!caption && !tags && !img) {
                    throw new Error("At least one field is required to update your post.");
                }

                const res = await fetch(`/api/post/update/${postId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ caption, tags, img }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to update post");
                }

                return await res.json();
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || 'Failed to update post');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
            toast.success('Post Updated Successfully');
        },
    });
};


