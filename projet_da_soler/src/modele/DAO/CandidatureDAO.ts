import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { Connexion } from "../../modele/DAO/Connexion";
import {
  FirebaseStorage,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Candidature } from "../class/Candidature";

export class CandidatureDAO {
  private ref: string;
  private collection: string;
  private db: Firestore;
  private storage: FirebaseStorage;
  private connexion: Connexion;

  constructor() {
    this.ref = "candidature";
    this.collection = "Candidature";
    this.connexion = Connexion.getInstance();
    this.storage = this.connexion.getStorageInstance();
    this.db = this.connexion.getDatabaseInstance();
  }

  async getAll(): Promise<any[]> {
    const refCand = ref(this.storage, this.ref);
    const result = await listAll(refCand);

    const allData: any[] = [];

    result.prefixes.forEach((folderRef) => {
      allData.push(folderRef);
    });
    return allData;
  }

  async addInStorage(cv: File, lettre: File, id_cand: string) {
    const storageRefCV = ref(
      this.storage,
      `candidature/${id_cand}/CV_DS_${cv.name}`
    );
    const storageRefLettre = ref(
      this.storage,
      `candidature/${id_cand}/LM_DS_${lettre.name}`
    );

    await uploadBytes(storageRefCV, cv);
    await uploadBytes(storageRefLettre, lettre);
  }

  async add(candidature: Candidature): Promise<string> {
    const candidatureData = {
      id_poste: candidature.id_poste,
      id_user: candidature.id_user,
      dateCandidature: new Date().toLocaleDateString().split("/").join("-"),
    };

    const docCandidature = await addDoc(
      collection(this.db, this.collection),
      candidatureData
    );

    return docCandidature.id;
  }

  async getAllCandidature(): Promise<Candidature[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, this.collection));
      const postes: Candidature[] = [];
      querySnapshot.forEach((doc) => {
        const id_cand = doc.id;
        postes.push({ id_cand, ...doc.data() } as Candidature);
      });
      return postes;
    } catch (error: any) {
      throw new Error(
        `Erreur lors de la récupération des candidatures : ${error.message}`
      );
    }
  }

  async getById(id: string) {
    const docRef = doc(this.db, this.collection, id);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const id_cand = docSnap.id;
        return { id_cand, ...docSnap.data() };
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCandidaturesByUserId(uid: string): Promise<Candidature[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, this.collection));
      const postes: Candidature[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.id_user === uid) {
          const id_cand = doc.id;
          postes.push({ id_cand, ...data } as Candidature);
        }
      });

      return postes;
    } catch (error: any) {
      throw new Error(
        `Erreur lors de la récupération des candidatures pour ${uid} : ${error.message}`
      );
    }
  }

  async getFichiersByIdCandidature(id_cand: string) {
    const listRef = ref(this.storage, `${this.ref}/${id_cand}`);

    try {
      const res = await listAll(listRef);
      const fichierPromises = res.items.map(async (itemRef) => {
        console.log(itemRef)
        const objRef = ref(this.storage, itemRef.fullPath);
        const metadata = await getMetadata(objRef);

        const file = await getDownloadURL(itemRef);

        const size = metadata.size / 1000000;
        const date = new Date(metadata.timeCreated).toLocaleDateString();
        const heure = new Date(metadata.timeCreated).toLocaleTimeString();

        return {
          nom: metadata.name,
          type: metadata.contentType,
          heurePostulation: heure,
          datePostulation: date,
          taille: size,
          chemin: metadata.fullPath,
          fichier: file,
        };
      });

      return await Promise.all(fichierPromises);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des fichiers :",
        error
      );
      throw error;
    }
  }
}
