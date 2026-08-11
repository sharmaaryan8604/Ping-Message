import { WallpaperProvider } from "./context/WallpaperContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "@clerk/react";
import PageLoader from "./components/PageLoader";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { axiosInstance } from "./lib/axios";

function App() {
  const {
    isSignedIn,
    isLoaded,
    getToken,
  } = useAuth();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth
  );

  const authUser = useAuthStore(
    (state) => state.authUser
  );

  const checkAuth = useAuthStore(
    (state) => state.checkAuth
  );

  const isCheckingAuth = useAuthStore(
    (state) => state.isCheckingAuth
  );

  /*
   * Attach a fresh Clerk token to EVERY API request.
   */
  useEffect(() => {
    if (!isLoaded) return;

    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (!isSignedIn) {
          return config;
        }

        try {
          const token = await getToken();

          if (token) {
            config.headers = config.headers || {};

            config.headers.Authorization =
              `Bearer ${token}`;
          }
        } catch (error) {
          console.error(
            "Failed to get Clerk token:",
            error
          );
        }

        return config;
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(
        interceptor
      );
    };
  }, [isLoaded, isSignedIn, getToken]);

  /*
   * Check authentication with backend.
   */
  useEffect(() => {
    if (!isLoaded) return;

    const authenticate = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();

          if (!token) {
            console.log(
              "No Clerk token available"
            );
            return;
          }

          console.log(
            "Clerk token received"
          );

          // Debug token payload only.
          try {
            const payload = JSON.parse(
              atob(token.split(".")[1])
            );

            console.log(
              "CLERK TOKEN DEBUG:",
              {
                iss: payload.iss,
                sub: payload.sub,
                sid: payload.sid,
                azp: payload.azp,
                exp: payload.exp,
              }
            );
          } catch (error) {
            console.error(
              "Could not decode Clerk token:",
              error
            );
          }

          await checkAuth(token);
        } catch (error) {
          console.error(
            "Authentication error:",
            error.response?.data ||
              error.message
          );
        }
      } else {
        clearAuth();
      }
    };

    authenticate();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
    checkAuth,
    clearAuth,
  ]);

  if (
    !isLoaded ||
    (isSignedIn && isCheckingAuth)
  ) {
    return <PageLoader />;
  }

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route
            path="/"
            element={
              isSignedIn && authUser ? (
                <ChatPage />
              ) : (
                <Navigate
                  to="/auth"
                  replace
                />
              )
            }
          />

          <Route
            path="/auth"
            element={
              !isSignedIn || !authUser ? (
                <AuthPage />
              ) : (
                <Navigate
                  to="/"
                  replace
                />
              )
            }
          />
        </Routes>

        <Toaster />
      </WallpaperProvider>
    </ThemeProvider>
  );
}

export default App;
