// src/components/Notifications/NotificationSetup.js
import { useEffect } from "react";
import { messaging, db, auth } from "../FIrestore/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";

const NotificationSetup = () => {
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          const token = await getToken(messaging, {
            vapidKey:
              "BEYA7MB2KjaX5P_5Tn3-kGpp5ML0YVaSEzf22rE5WiIi2C8huRMUKtSwGI_WcIwhcawWWIb_ngDNsz14D3mRwgU",
          });

          // Get current user UID
          const user = auth.currentUser;
          if (user && token) {
            // Update teamMembers/{uid} with fcmToken
            await updateDoc(doc(db, "teamMembers", user.uid), {
              fcmToken: token,
            });
          }
        } catch (err) {
          console.error("Error getting FCM token:", err);
        }
      }
    };

    requestPermission();

    // Foreground messages
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/alert-icon.png",
      });
    });
  }, []);

  return null;
};

export default NotificationSetup;
