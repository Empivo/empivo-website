import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { firebaseApp } from "../utils/firebaseConfig";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState("");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          const messaging = getMessaging(firebaseApp);

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          // Check if permission is granted before retrieving the token
          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey: "BEM5hSiGeLpiMxh3_61NICdYaeQf7eZ9WSSfm2O-9wR6UvzwVY7Tm0PczhuG8X0Gikz32HzOj8wB5_l2-YSPc3w",
            });
            console.log("currentToken", currentToken);
            if (currentToken) {
              setToken(currentToken);
              localStorage.setItem("fcm", currentToken);
            } else {
              console.log("No registration token available. Request permission to generate one.");
            }
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
