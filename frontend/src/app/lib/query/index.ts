'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IloginUser, INewPost, INewUser, IUpdateUser } from "../../types";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "../enum/index";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";


const BASE_URL = "http://localhost:5000";
let socket: Socket | null = null;

export const connectUser = (userId: string) => {
    if (!socket) {
        socket = io(BASE_URL, {
            query: { userId },
        });

        socket.on("connect", () => {
            console.log("Socket connected for user:", userId);
            socket?.emit("userConnected", { userId });
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
    }
};

export const disconnectUser = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("Socket manually disconnected");
    }
};


  export const useOnlineUsers = () => {
    return useQuery({
        queryKey: ["online-users"],
        queryFn: async () => {
            const res = await fetch("http://localhost:5000/online-users");
            const data = await res.json();
            return data.onlineUsers;
        },
        refetchInterval: 5000, 
    });
};

export const CreateUserAccount = () => {
    const router = useRouter();
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
                router.push('/signin');
                // Connect user to socket after signup
                if (data._id) connectUser(data._id)
                return data;
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to create user');
                } else {
                    toast.error('Failed to create user');
                }
                throw error;
            }
        }
    });
};


export const SignInAccount = () => {
    const router = useRouter();
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
                 router.push('/');
                // Connect user to socket after login
                if (data._id) connectUser(data._id)
                return data;
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to Login');
                } else {
                    toast.error('Failed to create user');
                }
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
                disconnectUser();
                return data;
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to Logout');
                } else {
                    toast.error('Failed to create user');
                }
            
                throw error;
            }
        }
    })
}

export const GetAuthUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                if (data?._id) connectUser(data._id);
                return data;
            }catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to get user');
                } else {
                    toast.error('Failed to create user');
                }
            
                throw error;
            }

        },

        retry: false,

    })
}


export const GetAllPost = (type: string) => {
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to get post');
                } else {
                    toast.error('Failed to create user');
                }
            
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to delete post');
                } else {
                    toast.error('Failed to create user');
                }
            
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
        mutationFn: async ({ tags, caption, img }: INewPost) => {
            try {
                const res = await fetch('/api/post/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tags, caption, img }),
                });
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log("pOST DATA  ", data);
                return data;
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to create post');
                } else {
                    toast.error('Failed to create user');
                }
            
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

            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to get suggested user');
                } else {
                    toast.error('Failed to create user');
                }
            
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to follow user');
                } else {
                    toast.error('Failed to create user');
                }
            
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to Like post');
                } else {
                    toast.error('Failed to create user');
                }
            
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to add comment');
                } else {
                    toast.error('Failed to create user');
                }
            
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to get notification');
                } else {
                    toast.error('Failed to create user');
                }
            
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to delete all notification');
                } else {
                    toast.error('Failed to create user');
                }
            
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to get profile');
                } else {
                    toast.error('Failed to create user');
                }
            
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to update details');
                } else {
                    toast.error('Failed to create user');
                }
            
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
            } catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to update details');
                } else {
                    toast.error('Failed to create user');
                }
            
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
        mutationFn: async ({ postId, caption, tags, img }: { postId: string, caption: string, tags: string, img?: string }) => {
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
            } catch (error: unknown) {
                console.error(error);
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to update post');
                } else {
                    toast.error('Failed to create user');
                }
            
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
            toast.success('Post Updated Successfully');
        },
    });
};

export const useGetAllUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALLUSERS],
        queryFn: async () => {
            try {
                const res = await fetch('/api/user/allusers');
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) throw new Error(data.error);
                console.log(data);
                return data;
            }catch (error: unknown) {
                console.error(error);
            
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to get user');
                } else {
                    toast.error('Failed to create user');
                }
                throw error;
            }
        },
        retry: false,
    })
}

// export const useGetMessages = (mid: string) => {
//     return useQuery({
//       queryKey: [QUERY_KEYS.GET_MESSAGES, mid], // Ensure uniqueness per user
//       queryFn: async () => {
//         if (!mid) return null; // Prevent unnecessary requests
  
//         try {
//           const res = await fetch(`/api/message/${mid}`);
//           const data = await res.json();
//           if (!res.ok) throw new Error(data.error || "Failed to fetch messages");
//           return data;
//         } catch (error: unknown) {
//           console.error(error);
//           toast.error(error instanceof Error ? error.message : "Failed to get messages");
//           throw error;
//         }
//       },
//       enabled: !!mid, // Only run query if mid exists
//       retry: false,

      
//     });
//   };

export const useGetMessages = (mid: string) => {
    const queryClient = useQueryClient();
  
    const query = useQuery({
      queryKey: [QUERY_KEYS.GET_MESSAGES, mid], // Ensure uniqueness per user
      queryFn: async () => {
        if (!mid) return null; // Prevent unnecessary requests
  
        try {
          const res = await fetch(`/api/message/${mid}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to fetch messages");
          return data;
        } catch (error: unknown) {
          console.error(error);
          toast.error(error instanceof Error ? error.message : "Failed to get messages");
          throw error;
        }
      },
      enabled: !!mid, // Only run query if mid exists
      retry: true,
    });


  
    // Ensure the socket listener is set up only once
//     ✅ Prevents duplicate event listeners (hasListeners)
// ✅ Listens for new messages (socket.on("NewMessage"))

    if (!socket?.hasListeners("NewMessage")) {
      socket?.on("NewMessage", (newMessage:string) => {
        queryClient.setQueryData([QUERY_KEYS.GET_MESSAGES, mid], (oldMessages: string) => {
          return oldMessages ? [...oldMessages, newMessage] : [newMessage];
        });
    });
}


    return query;
  };

  export const useCreateMessage = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ text, image, rid }: { text: string; image: string; rid: string }) => {
        try {
          const res = await fetch(`/api/message/send/${rid}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, image }),
          });
  
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
  
          // Emit message in real-time
        //   Sends the message to the WebSocket server for real-time updates.
          socket?.emit("NewMessage", data);
  
          return data;
        } catch (error: unknown) {
          console.error(error);
          toast.error(error instanceof Error ? error.message : "Failed to send message");
          throw error;
        }
      },
      onSuccess: (data, variables) => {
        // Update the local cache to show the new message
        queryClient.setQueryData([QUERY_KEYS.GET_MESSAGES, variables.rid], (oldMessages: string) => {
          return oldMessages ? [...oldMessages, data] : [data];
        });
  
        // Ensure the UI updates with the new message
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MESSAGES, variables.rid] });
      },
    });
  };