import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UtilisateurDAO } from "../../modele/DAO/UtilisateurDAO";
import { useAuthState } from "react-firebase-hooks/auth";
import { UtilisateurConnexion } from "../../modele/DAO/UtilisateurConnexion";
import { User } from "firebase/auth";

interface AuthContextType {
  admin: boolean;
  prenom: string | undefined;
  currentUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const utilisateur = new UtilisateurConnexion();
  const [user] = useAuthState(utilisateur.getAuth());
  const [admin, setAdmin] = useState(false);
  const [prenom, setPrenom] = useState<string | undefined>("");

  useEffect(() => {
    const userDAO = new UtilisateurDAO();

    async function administrateur() {
      if (user?.uid) {
        const estAdmin = await userDAO.estAdmin(user.uid);
        setAdmin(estAdmin);
      }
    }
    async function fetchData() {
      if (user) {
        const info = await userDAO.getById(user.uid);
        setPrenom(info?.prenom);
      }
    }
    if (user) {
      administrateur();
      fetchData();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ admin, prenom, currentUser: user ?? null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
