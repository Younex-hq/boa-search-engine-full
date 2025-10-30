import * as React from "react";
import { useAuthStore } from "@/store/auth";
import Cookies from "js-cookie";

/**
 * Custom hook to manage session timeout and warning.
 * @param warningTime - Time in seconds to show the warning message before expiration.
 * @param expirationTime - Time in seconds for the session to expire.
 * @returns An object with the session status and time left until expiration.
 */
export function useSessionTimer(warningTime: number, expirationTime: number) {
  const { logout } = useAuthStore();
  const [status, setStatus] = React.useState<"active" | "warning" | "expired">(
    "active",
  );
  const [timeLeft, setTimeLeft] = React.useState(expirationTime);

  React.useEffect(() => {
    const token = Cookies.get("auth_token");
    // If there is no token, the user is not logged in.
    // Set status to expired and do nothing else.
    if (!token) {
      setStatus("expired");
      return;
    }

    const loginTimestamp = localStorage.getItem("loginTimestamp");
    // If there is no login timestamp, we can't track the session time.
    // It's safer to log out and set the status to expired.
    if (!loginTimestamp) {
      logout();
      setStatus("expired");
      return;
    }

    const loginTime = parseInt(loginTimestamp, 10);

    // Set up an interval to check the session status every second.
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsed = (currentTime - loginTime) / 1000; // elapsed time in seconds

      // Check if the session has fully expired.
      if (elapsed >= expirationTime) {
        logout(); // Clear user data and token.
        setStatus("expired");
        clearInterval(interval); // Stop the interval.
        return;
      }

      // Check if the session is in the warning period.
      if (elapsed >= warningTime) {
        setStatus("warning");
        // Calculate the remaining time.
        setTimeLeft(Math.ceil(expirationTime - elapsed));
      } else {
        // If not in warning or expired, the session is active.
        setStatus("active");
      }
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    // or when the token changes (e.g., user logs out manually).
    return () => clearInterval(interval);
  }, [logout, warningTime, expirationTime]);

  return { status, timeLeft };
}