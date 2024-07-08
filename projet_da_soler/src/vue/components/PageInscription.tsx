import { createUserWithEmailAndPassword } from "firebase/auth";
import { UtilisateurConnexion } from "../../modele/DAO/UtilisateurConnexion";
import { useState } from "react";
import { UtilisateurDAO } from "../../modele/DAO/UtilisateurDAO";
import { Utilisateur } from "../../modele/class/Utilisateur";
import "../../style/PageInscription.scss";
import { ErrorsState } from "../../utils/ErrorsState";
import {
  checkNom,
  checkPrenom,
  checkAge,
  checkTelephone,
  checkPasswordIssues,
  checkEmail,
  checkPasswordsMatch,
  getAge,
} from "../../utils/validation";
import { useCustomNav } from "../../utils/useCustomNav";

function PageInscription() {
  const user = new UtilisateurConnexion();
  const auth = user.getAuth();
  const { showMessageAndRedirect, showError, contextHolder } = useCustomNav();
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ErrorsState>();

  const [utilisateur, setUtilisateur] = useState({
    id_user: "",
    nom: "",
    prenom: "",
    age: 0,
    pseudo: "",
    telephone: "",
    email: "",
    dateInscription: "",
    estAdmin: false,
  });

  const inscription = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        utilisateur.email,
        signupPassword
      ).then((u) => {
        const personneDAO = new UtilisateurDAO();
        const personne = new Utilisateur();
        personne.nom = utilisateur!.nom;
        personne.prenom = utilisateur!.prenom;
        personne.age = utilisateur!.age;
        (personne.telephone = utilisateur!.telephone),
          (personne.email = utilisateur!.email),
          (personne.dateInscription = utilisateur!.dateInscription),
          (personne.estAdmin = utilisateur!.estAdmin);

        personneDAO.add(personne, u.user.uid);
        showMessageAndRedirect("success", "Inscription réussie", 2.5, "/");
      });
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        showError(
          "Un compte est déjà existant pour ce compte. Veuillez vous identifier sur la page de connexion"
        );
      } else {
        showError("Erreur lors de l'inscription : " + e.message);
      }
    }
  };

  const data = (e: any) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "nom") {
      value = value.toUpperCase().trim();
    } else if (name === "prenom") {
      value =
        value.trim()[0].toUpperCase() + value.trim().slice(1).toLowerCase();
    } else if (name === "telephone") {
      value = value.trim().replace(/\s/g, "");
    } else if (name === "email") {
      value = value.trim();
    } else if (name === "age") {
      value = getAge(value);
    }

    setUtilisateur({ ...utilisateur, [name]: value });
  };

  const displayErrors = (
    ps: string,
    utilisateur: any,
    confirm_password: string
  ) => {
    const passwordErrors = checkPasswordIssues(ps);
    const emailError = checkEmail(utilisateur.email);
    const telephoneError = checkTelephone(utilisateur.telephone);
    const passwordMatchError = checkPasswordsMatch(ps, confirm_password);
    const nomError = checkNom(utilisateur.nom);
    const prenomError = checkPrenom(utilisateur.prenom);
    const ageError = checkAge(utilisateur.age);

    setErrors({
      password: passwordErrors,
      email: emailError,
      telephone: telephoneError,
      passwordMatch: passwordMatchError,
      nom: nomError,
      prenom: prenomError,
      age: ageError,
    });
  };

  const checkForm = async (ps: string, user: any, confirm_password: string) => {
    displayErrors(ps, user, confirm_password);
    if (
      !errors ||
      (!errors.password?.length &&
        !errors.email &&
        !errors.telephone &&
        !errors.passwordMatch &&
        !errors.nom &&
        !errors.prenom &&
        !errors.age)
    ) {
      inscription();
    } else {
      console.log("passe pas");
    }
  };
  return (
    <div className="container_inscription">
      {contextHolder}
      <div className="container_form">
        <h1>S'inscrire</h1>
        <span className="label">Email</span>
        <input className="email" type="text" name="email" onChange={data} />
        <div className="error_inscription">{errors?.email}</div>

        <span className="label">Mot de passe </span>
        <input
          className="password"
          type="password"
          onChange={(e) => {
            setSignupPassword(e.target.value);
          }}
        />
        <div className="error_inscription">
          {errors?.password?.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </div>
        <span className="label">Confirmer le mot de passe</span>
        <input
          className="confirm_password"
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
        <div className="error_inscription">{errors?.passwordMatch}</div>

        <span className="label">Nom</span>
        <input className="nom" type="text" name="nom" onChange={data} />
        <div className="error_inscription">{errors?.nom}</div>

        <span className="label">Prénom</span>
        <input className="prenom" type="text" name="prenom" onChange={data} />
        <div className="error_inscription">{errors?.prenom}</div>

        <span className="label">Date de naissance</span>
        <input className="age" type="date" name="age" onChange={data} />
        <div className="error_inscription">{errors?.age}</div>

        <span className="label">Téléphone</span>
        <input
          className="telephone"
          type="text"
          name="telephone"
          onChange={data}
        />
        <div className="error_inscription">{errors?.telephone}</div>

        <div className="button_inscription">
          <button
            onClick={() => {
              checkForm(signupPassword, utilisateur, confirmPassword);
            }}
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageInscription;
