import { initializeApp } from "firebase/app";
// @ts-ignore: getReactNativePersistence may not be exported in some typedefs of firebase 11
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyB_EoiyS_Vs53WsKwgben4iA2tOpC2DP44",
  authDomain: "movie-ticket-app-85ab6.firebaseapp.com",
  projectId: "movie-ticket-app-85ab6",
  storageBucket: "movie-ticket-app-85ab6.firebasestorage.app",
  messagingSenderId: "214827198377",
  appId: "1:214827198377:web:b41df152368f5909dd06b8",
  measurementId: "G-DNHDZJMWCY"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage for React Native to persist login sessions
let auth: ReturnType<typeof getAuth>;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

const db = getFirestore(app);

export { app, auth, db };
