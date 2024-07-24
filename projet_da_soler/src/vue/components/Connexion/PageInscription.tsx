import { createUserWithEmailAndPassword } from "firebase/auth";
import { UtilisateurConnexion } from "../../../modele/DAO/UtilisateurConnexion";
import { useState } from "react";
import { UtilisateurDAO } from "../../../modele/DAO/UtilisateurDAO";
import { Utilisateur } from "../../../modele/class/Utilisateur";
import "../../../style/PageInscription.scss";
import { ErrorsState } from "../../../utils/ErrorsState";
import {
  checkNom,
  checkPrenom,
  checkAge,
  checkTelephone,
  checkPasswordIssues,
  checkEmail,
  checkPasswordsMatch,
  getAge,
  checkBox,
} from "../../../utils/validation";
import { useCustomNav } from "../../../utils/useCustomNav";
import Footer from "../Footer";
import Navbar from "../NavBar";
import { Helmet } from "react-helmet";
import { Checkbox } from "antd";
import { useNavigate } from "react-router";

function PageInscription() {
  const user = new UtilisateurConnexion();
  const auth = user.getAuth();
  const { showMessageAndRedirect, showError, contextHolder } = useCustomNav();
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ErrorsState>();
  const nav = useNavigate();

  const [checkbox, setCheckBox] = useState(false);
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
        showMessageAndRedirect(
          "success",
          "Inscription réussie",
          "Vous êtes maintenant inscrit",
          2.5,
          "/"
        );
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
  ): boolean => {
    const passwordErrors = checkPasswordIssues(ps);
    const emailError = checkEmail(utilisateur.email);
    const telephoneError = checkTelephone(utilisateur.telephone);
    const passwordMatchError = checkPasswordsMatch(ps, confirm_password);
    const nomError = checkNom(utilisateur.nom);
    const prenomError = checkPrenom(utilisateur.prenom);
    const ageError = checkAge(utilisateur.age);
    const checkBoxError = checkBox(checkbox);

    setErrors({
      password: passwordErrors,
      email: emailError,
      telephone: telephoneError,
      passwordMatch: passwordMatchError,
      nom: nomError,
      prenom: prenomError,
      age: ageError,
      checkBox: checkBoxError,
    });

    if (
      (emailError ||
        telephoneError ||
        nomError ||
        prenomError ||
        passwordErrors.length > 0 ||
        passwordMatchError ||
        ageError ||
        checkBoxError) !== ""
    )
      return true;
    else return false;
  };

  const checkForm = async (ps: string, user: any, confirm_password: string) => {
    const hasErrors = displayErrors(ps, user, confirm_password);

    if (hasErrors) {
      showError("Veuillez corriger les champs erronés");
      return;
    }
    setDisabled(true)
    inscription();
  };
  const [disabled, setDisabled] = useState(false)

  return (
    <>
      <Helmet>
        <title>Inscription</title>
      </Helmet>

      <Navbar />
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

          <Checkbox onChange={() => setCheckBox(!checkbox)}>
            <div className="check">
              J'ai lu et j'accepte la{" "}
              <span
                className="check"
                style={{ textDecoration: "underline" }}
                onClick={() => nav("politique-de-confidentialite")}
              >
                Politique de confidentialité
              </span>
              .
            </div>
          </Checkbox>
          <div className="error_inscription">{errors?.checkBox}</div>

          <div className="button_inscription">
            <button
            disabled={disabled}
              onClick={() => {
                checkForm(signupPassword, utilisateur, confirmPassword);
              }}
            >
              S'inscrire
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PageInscription;
