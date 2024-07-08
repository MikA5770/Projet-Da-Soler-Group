import { deleteApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

export class Connexion {
  private static instance: Connexion | null = null;
  private app;
  private db: Firestore;
  private storage: FirebaseStorage;
  private auth: Auth;

  private constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyAta5BYgVTeE71YDZjPcdVj-ffCdUNDk40",
      authDomain: "da-soler-projet.firebaseapp.com",
      projectId: "da-soler-projet",
      storageBucket: "da-soler-projet.appspot.com",
      messagingSenderId: "1085344652015",
      appId: "1:1085344652015:web:8a1259490949899653191a",
      measurementId: "G-L6XCMMJCVT",
    };

    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  public static getInstance(): Connexion {
    if (!Connexion.instance) {
      Connexion.instance = new Connexion();
    }

    return Connexion.instance;
  }

  public getDatabaseInstance(): Firestore {
    return this.db;
  }

  public getStorageInstance(): FirebaseStorage {
    return this.storage;
  }

  public getAuth(): Auth {
    return this.auth;
  }

  public closeConnection(): void {
    deleteApp(this.app);
  }
}
