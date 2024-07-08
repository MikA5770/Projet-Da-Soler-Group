import { sendPasswordResetEmail } from "firebase/auth";
import { UtilisateurConnexion } from "../../modele/DAO/UtilisateurConnexion";
import { useState } from "react";
import { UtilisateurDAO } from "../../modele/DAO/UtilisateurDAO";
import { CSSTransition } from "react-transition-group";
import "../../style/ForgotPassword.scss";
import { checkEmail } from "../../utils/validation";
import { useCustomNav } from "../../utils/useCustomNav";
import NavBar from "./NavBar";
import Footer from "./Footer";

function ForgotPassword() {
  const [activeMenu, setActiveMenu] = useState("main");

  const utilisateur = new UtilisateurConnexion();
  const auth = utilisateur.getAuth();
  const utilisateurDAO = new UtilisateurDAO();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(false);
  const [disable, setDisable] = useState(false);

  const { showError, contextHolder } = useCustomNav();

  const ifExists = async (): Promise<boolean> => {
    if (await utilisateurDAO.checkEmailExists(email)) {
      return true;
    } else {
      return false;
    }
  };

  const suivant = async () => {
    if (!checkEmail(email)) {
      const exists = await ifExists();
      if (exists) {
        setActiveMenu("message");
      } else {
        showError("Aucun compte n'est associé à cet email");
      }
    } else {
      showError("Veuillez saisir un format d'email valide");
    }
  };

  const resetPassword = async () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage(true);
        setDisable(true);
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };
  return (
    <>
      {contextHolder}
      <NavBar />
      <div className="slide">
        <div className="container_forgotpassword">
          <CSSTransition
            in={activeMenu === "main"}
            unmountOnExit
            timeout={500}
            classNames="email-primary"
          >
            <div className="email_forgotpassword">
              <div className="label_forgot_password">
                Entrez votre e-mail :{" "}
              </div>
              <input
                type="string"
                placeholder="Entrez votre e-mail"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={suivant} className="button_forgot_password">
                Envoyer
              </button>
            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "message"}
            unmountOnExit
            timeout={500}
            classNames="email-secondary"
          >
            <div className="email_forgotpassword">
              <div>
                Après avoir cliqué sur "Envoyer", vous recevrez un mail
                permettant de changer votre mot de passe. Regardez vos spams si
                vous ne le recevez pas.
              </div>
              <button onClick={resetPassword} disabled={disable}>
                Envoyer
              </button>
              <button
                className="button_forgot_password"
                onClick={() => setActiveMenu("main")}
              >
                Retour
              </button>
              <div>{message ? "Email de réinitialisation envoyé !" : ""}</div>
            </div>
          </CSSTransition>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;
