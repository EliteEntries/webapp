import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, FacebookAuthProvider, getAuth, GoogleAuthProvider, signOut, TwitterAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Functions, getFunctions } from "firebase/functions";
import { getMessaging, Messaging } from "firebase/messaging";
import firebaseconfig from "../public/firebaseconfig";

export default class Firebase {
    
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    functions: Functions;
    fcm: Messaging | undefined;

    constructor(){
        this.app = initializeApp(firebaseconfig);
        this.auth = getAuth();
        this.db = getFirestore();
        this.functions = getFunctions();
    }

    logOut(callback?: ((value: void) => void | PromiseLike<void>) ) {
        signOut(this.auth).then(callback)
    }

    initFCM() {
        this.fcm = getMessaging();
        return this.fcm;
    }
    
    provider(p?: string) {
      const map = {
        google: GoogleAuthProvider,
        facebook: FacebookAuthProvider,
        twitter: TwitterAuthProvider
      }
      function findProvider() {
        if (p) {
          return new (map as any)[p]
        } else return new GoogleAuthProvider
      }
      const provider = findProvider()
      provider.setCustomParameters({
        prompt: 'select_account',
      })
      return provider
    }
}