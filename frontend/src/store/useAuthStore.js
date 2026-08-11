import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:3000";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? SOCKET_URL
    : "/";

export const useAuthStore = create(
  (set, get) => ({
    authUser: null,
    authError: null,

    isCheckingAuth: true,

    onlineUsers: [],

    socket: null,

    checkAuth: async (token) => {
      set({
        isCheckingAuth: true,
        authError: null,
      });

      try {
        if (!token) {
          throw new Error(
            "No Clerk token provided"
          );
        }

        const res =
          await axiosInstance.get(
            "/auth/check",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "Backend authentication successful"
        );

        set({
          authUser: res.data,
          authError: null,
        });

        get().connectSocket(res.data);
      } catch (error) {
        get().disconnectSocket();

        console.error(
          "Error in checkAuth:",
          error.response?.data ||
            error.message
        );

        set({
          authUser: null,
          authError:
            error.response?.data
              ?.message ||
            error.message,
        });
      } finally {
        set({
          isCheckingAuth: false,
        });
      }
    },

    clearAuth: () => {
      set({
        authUser: null,
        authError: null,
        isCheckingAuth: false,
        onlineUsers: [],
      });

      get().disconnectSocket();
    },

    connectSocket: (user) => {
      if (
        !user ||
        get().socket?.connected
      ) {
        return;
      }

      const socket = io(BASE_URL, {
        query: {
          userId: user._id,
        },
      });

      set({
        socket,
      });

      socket.on(
        "getOnlineUsers",
        (userIds) => {
          set({
            onlineUsers: userIds,
          });
        }
      );
    },

    disconnectSocket: () => {
      const socket =
        get().socket;

      if (socket?.connected) {
        socket.disconnect();
      }

      set({
        socket: null,
      });
    },
  })
);
