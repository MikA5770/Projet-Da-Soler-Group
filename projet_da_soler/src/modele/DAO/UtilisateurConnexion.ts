import { Auth } from "firebase/auth";
import { Connexion } from "./Connexion";

export class UtilisateurConnexion {
  private connexion: Connexion;
  private auth: Auth;

  constructor() {
    this.connexion = Connexion.getInstance();
    this.auth = this.connexion.getAuth();
  }

  public closeConnection(): void {
    this.connexion.closeConnection();
  }

  getAuth(): Auth {
    return this.auth;
  }

  public deconnexion(): void {
    this.auth.signOut()
  }
}
