import { Utilisateur } from "../class/Utilisateur";
import { Connexion } from "./Connexion";
import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  Firestore,
  updateDoc,
} from "firebase/firestore";

export class UtilisateurDAO {
  private collection: string;
  private db: Firestore;
  private connexion: Connexion;

  constructor() {
    this.connexion = Connexion.getInstance();
    this.db = this.connexion.getDatabaseInstance();
    this.collection = "Utilisateur";
  }

  async getAll(): Promise<Array<Utilisateur>> {
    const query = await getDocs(collection(this.db, this.collection));
    const utilisateurs: Utilisateur[] = [];

    query.forEach((doc) => {
      const id_user = doc.id;
      utilisateurs.push({ id_user, ...doc.data() } as Utilisateur);
    });
    return utilisateurs;
  }
  catch(error: any) {
    throw new Error(
      `Erreur lors de la récupération des utilisateurs : ${error.message}`
    );
  }

  public async getById(id: string): Promise<Utilisateur> {
    const docRef = doc(this.db, this.collection, id);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const id_user = docSnap.id;
        return { id_user, ...docSnap.data() } as Utilisateur;
      } else {
        // Le document n'existe pas, générer une erreur
        throw new Error("Document not found");
      }
    } catch (error) {
      // Gérer les erreurs d'accès à Firestore
      console.log("Error fetching document:", error);
      throw error;
    }
  }

  async add(user: Utilisateur, id: string) {
    const userData = {
      nom: user.nom,
      prenom: user.prenom,
      age: user.age,
      telephone: user.telephone,
      email: user.email,
      dateInscription: new Date().toLocaleDateString().split("/").join("-"),
      estAdmin: user.estAdmin,
    };

    await setDoc(doc(this.db, this.collection, id), userData);
  }

  async supprimer(id: string) {
    await deleteDoc(doc(this.db, this.collection, id));
  }

  async modifier(id: string, data: Utilisateur) {
    const ref = doc(this.db, this.collection, id);

    await updateDoc(ref, {
      nom: data.nom,
      prenom: data.prenom,
      age: data.age,
      telephone: data.telephone,
    });
  }

  async toAdmin(id: string) {
    const ref = doc(this.db, this.collection, id);
    await updateDoc(ref, {
      estAdmin: true,
    });
  }
  async removeAdmin(id: string) {
    const ref = doc(this.db, this.collection, id);
    await updateDoc(ref, {
      estAdmin: false,
    });
  }

  async modifierEmail(id: string, email: string) {
    const ref = doc(this.db, this.collection, id);

    await updateDoc(ref, {
      email: email,
    });
  }

async checkEmailExists(email: string): Promise<boolean> {
  try {
    const query = await getDocs(collection(this.db, this.collection));
    for (const doc of query.docs) {
      if (doc.data().email === email) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking email existence: ", error);
    return false;
  }
}

  public async estAdmin(idPersonne: string): Promise<boolean> {
    try {
      const docRef = doc(this.db, this.collection, idPersonne);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
       
        if (data && data.estAdmin !== undefined) {
          return data.estAdmin;
        } else {
         
          return false;
        }
      } else {
       
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      return false;
    }
  }
}
