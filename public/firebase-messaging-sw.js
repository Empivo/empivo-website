// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyCPRnXD8qm9o4RNttnXTKa60vda9AJOUxU",
  authDomain: "skillmatics-b50bb.firebaseapp.com",
  projectId: "skillmatics-b50bb",
  storageBucket: "skillmatics-b50bb.appspot.com",
  messagingSenderId: "143431333896",
  appId: "1:143431333896:web:2c27a8290c0d75b18139bd",
  measurementId: "G-QHVC5LS073",
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: '/logo.svg'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);

  self.addEventListener("notificationclick", function (event) {
    console.log("event", event);
    event.waitUntil(clients.openWindow(`/assign-task-request`));
    // if (payload?.data?.type === 'sendMessage') {
    //   event.waitUntil(
    //     clients.openWindow(`/pages/chat/${payload?.data?.userId}`)
    //   )
    //   event.notification.close() // Close the notification
    // } else if (payload?.data?.type === 'groupSendMessage') {
    //   event.waitUntil(
    //     clients.openWindow(`/pages/group-chat/${payload?.data?.groupId}`)
    //   )
    //   event.notification.close() // Close the notification
    // } else {
    //   console.log('other condition')
    //   event.notification.close() // Close the notification
    // }
    // Perform any action you want when the notification is clicked
    // For example, you can open a new window
  });
});
