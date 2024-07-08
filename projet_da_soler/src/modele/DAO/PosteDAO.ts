import { Poste } from "../class/Poste";
import { Connexion } from "../../modele/DAO/Connexion";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  Firestore,
  addDoc,
  updateDoc,
} from "firebase/firestore";

export class PosteDAO {
  private collection: string;
  private db: Firestore;
  private connexion: Connexion;

  constructor() {
    this.collection = "Poste";
    this.connexion = Connexion.getInstance();
    this.db = this.connexion.getDatabaseInstance();
  }

  public async getAll(): Promise<Array<Poste>> {
    try {
      const querySnapshot = await getDocs(collection(this.db, this.collection));
      const postes: Poste[] = [];

      querySnapshot.forEach((doc) => {
        const id_poste = doc.id;
        postes.push({ id_poste, ...doc.data() } as Poste);
      });
      return postes;
    } catch (error: any) {
      throw new Error(
        `Erreur lors de la récupération des postes : ${error.message}`
      );
    }
  }
  async getById(id: string): Promise<Poste> {
    const docRef = doc(this.db, this.collection, id);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const id_poste = docSnap.id;
        return { id_poste, ...docSnap.data() } as Poste;
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
  async existe(id_poste: string): Promise<boolean> {
    const docRef = doc(this.db, this.collection, id_poste);

    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  async add(poste: Poste): Promise<any> {
    const posteData = {
      libelle: poste.libelle,
      missions: poste.missions,
      competences: poste.competences,
      type: poste.type,
      lieu: poste.lieu,
      datePublication: new Date().toLocaleDateString(),
    };

    const doc = await addDoc(collection(this.db, this.collection), posteData);
    return doc.id;
  }

  async supprimer(id: string): Promise<any> {
    await deleteDoc(doc(this.db, this.collection, id));
  }

  async modifier(id_poste: string, data: Poste) {
    const ref = doc(this.db, this.collection, id_poste);

    await updateDoc(ref, {
      libelle: data.libelle,
      type: data.type,
      lieu: data.lieu,
      competences: data.competences,
      missions: data.missions,
    });
  }
}
