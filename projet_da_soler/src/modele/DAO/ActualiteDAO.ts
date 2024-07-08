import { Actualite } from "../class/Actualite";
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
import {
  FirebaseStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

export class ActualiteDAO {
  private collection: string;
  private db: Firestore;
  private storage: FirebaseStorage;
  private connexion: Connexion;

  constructor() {
    this.collection = "Actualite";
    this.connexion = Connexion.getInstance();
    this.storage = this.connexion.getStorageInstance();
    this.db = this.connexion.getDatabaseInstance();
  }

  async addInStorage(img: File, id_actu:string) {
    const storageRefImg = ref(
      this.storage,
      `actualite/${id_actu}/${img.name}`
    );

    await uploadBytes(storageRefImg, img);
  }

  public async getAll(): Promise<Array<Actualite>> {
    try {
      const querySnapshot = await getDocs(collection(this.db, this.collection));
      const actus: Actualite[] = [];

      querySnapshot.forEach(async (doc) => {
        const id_actu = doc.id;
        actus.push({ id_actu, ...doc.data() } as Actualite);
      });
      return actus;
    } catch (error: any) {
      throw new Error(
        `Erreur lors de la récupération des actus : ${error.message}`
      );
    }
  }
  async getById(id: string): Promise<Actualite> {
    const docRef = doc(this.db, this.collection, id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const id_actu = docSnap.id;
        return { id_actu, ...docSnap.data() } as Actualite;
      } else {
        throw new Error("Document not found");
      }
    } catch (error) {
      console.log("Error fetching document:", error);
      throw error;
    }
  }
  async existe(id_actu: string): Promise<boolean> {
    const docRef = doc(this.db, this.collection, id_actu);

    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  async add(actu: Actualite): Promise<any> {

    const actuData = {
      titre: actu.titre,
      resume: actu.resume,
      contenu: actu.contenu,
      datePublication: new Date().toLocaleDateString(),
    };

    const doc = await addDoc(collection(this.db, this.collection), actuData);
    return doc.id;
  }

  async supprimer(id: string): Promise<any> {
    await deleteDoc(doc(this.db, this.collection, id));
  }

  async modifier(id_actu: string, data: Actualite) {
    const ref = doc(this.db, this.collection, id_actu);

    await updateDoc(ref, {
      titre: data.titre,
      resume: data.resume,
      contenu: data.contenu,
    });
  }
}
