import { App } from 'vue'

export default {
  install: (app: App) => {
    const firebaseConfig = {
      apiKey: "AIzaSyCKnbL0V_rH_zlHwmR9UTFdu2XxZ4bVwd0",
      authDomain: "bspace-mobile-app.firebaseapp.com",
      databaseURL: "https://bspace-mobile-app.firebaseio.com",
      projectId: "bspace-mobile-app",
      storageBucket: "bspace-mobile-app.appspot.com",
      messagingSenderId: "806813054688",
      appId: "1:806813054688:web:3c074490b8070e3d2f4285",
      measurementId: "G-Y0V36YVGKR"
    };

    // Initialize Firebase
    // const firebaseApp = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(firebaseApp);

    // app.config.globalProperties.$config = Object.freeze(Object.assign({}, analytics))
  },
}
