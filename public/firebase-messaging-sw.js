// public/firebase-messaging-sw.js

// Listen for push events
self.addEventListener("push", function (event) {
  const payload = event.data ? event.data.json() : {};
  const title = payload.notification?.title || "New Notification";
  const options = {
    body: payload.notification?.body || "",
    // icon: "/alert-icon.png", // optional icon
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
