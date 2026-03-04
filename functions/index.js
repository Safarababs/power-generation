const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {JWT} = require("google-auth-library");

admin.initializeApp();

const serviceAccount = require("./service-account.json");
const PROJECT_ID = "nas-pg"; // replace with actual Firebase Project ID

/**
 * Get an OAuth2 access token for Firebase Cloud Messaging.
 * @return {Promise<string>} Access token
 */
async function getAccessToken() {
  const client = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });
  const tokens = await client.authorize();
  return tokens.access_token;
}

/**
 * Send a push notification via FCM HTTP v1 API.
 * @param {string} token - FCM device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @return {Promise<object>} FCM API response
 */
async function sendFCMMessage(token, title, body) {
  const accessToken = await getAccessToken();

  const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            token,
            notification: {title, body},
          },
        }),
      },
  );

  const data = await response.json();
  console.log("FCM response:", data);
  return data;
}

/**
 * Cloud Function: Notify all managers when a new alert is created.
 */
exports.notifyManagers = functions.firestore
    .document("alerts/{alertId}")
    .onCreate(async (snap, context) => {
      const alert = snap.data();

      const managersSnapshot = await admin
          .firestore()
          .collection("teamMembers")
          .where("role", "==", "manager")
          .get();

      const promises = [];
      managersSnapshot.forEach((doc) => {
        const manager = doc.data();
        if (manager.fcmToken) {
          promises.push(
              sendFCMMessage(
                  manager.fcmToken,
                  "New Alert",
                  `Alert: ${alert.message}`,
              ),
          );
        }
      });

      await Promise.all(promises);
      console.log("Notifications sent to managers.");
    });
