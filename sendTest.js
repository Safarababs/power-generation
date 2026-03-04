const { JWT } = require("google-auth-library");

const serviceAccount = require("./service-account.json"); // path to your downloaded key

const PROJECT_ID = "nas-pg"; // from Firebase console
const FCM_TOKEN =
  "c_JuASHdHBkYSmlceYD4yr:APA91bEAmipQU8r9n5POj-AL8vK_zfayMKZuVZvVnWWgkNf0-ltoAZHkfrBAiISzXwTX7PlfhKPHW9CGSXc2GJ6fLkDkHPRMWWNX8fSwkEMxbzSq7Sv1Mg4";

async function getAccessToken() {
  const client = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });
  const tokens = await client.authorize();
  return tokens.access_token;
}

async function sendMessage() {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token: FCM_TOKEN,
          notification: {
            title: "Test Notification",
            body: "This is a test push via HTTP v1",
          },
        },
      }),
    },
  );

  const data = await response.json();
  console.log("FCM response:", data);
}

sendMessage().catch(console.error);
