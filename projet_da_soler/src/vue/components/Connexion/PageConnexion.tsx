import "../../../style/Connexion.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UtilisateurConnexion } from "../../../modele/DAO/UtilisateurConnexion";
import { Link } from "react-router-dom";
import { UtilisateurDAO } from "../../../modele/DAO/UtilisateurDAO";
import { useCustomNav } from "../../../utils/useCustomNav";
import { checkEmail } from "../../../utils/validation";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { Helmet } from "react-helmet";

function PageConnexion() {
  const u = new UtilisateurConnexion();
  const auth = u.getAuth();

  const navigate = useNavigate();

  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");

  const userDAO = new UtilisateurDAO();
  const { showError, showMessageAndRedirect, contextHolder } = useCustomNav();

  const handleRedirect = async () => {
    await showMessageAndRedirect(
      "success",
      "Connexion réussie",
      "Vous êtes maintenant connecté",
      1,
      "/"
    );
  };

  const connexion = () => {
    if (!logEmail || !logPassword) {
      showError("L'e-mail ou le mot de passe ne peuvent pas être vides");
      return;
    } else if (checkEmail(logEmail)) {
      showError("Format de l'e-mail incorrect");

      return;
    } else {
      signInWithEmailAndPassword(auth, logEmail, logPassword)
        .then(async (userCredential) => {
          const data = await userDAO.getById(userCredential.user.uid);
          if (data.email !== logEmail) {
            await userDAO.modifierEmail(userCredential.user.uid, logEmail);
          }
          handleRedirect();
        })
        .catch((e) => {
          showError("E-mail ou mot de passe incorrect");
          console.log(e);
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion</title>
      </Helmet>

      <NavBar />
      <div className="connexion">
        {contextHolder}

        <div className="box">
          <h1 className="title">Connexion</h1>
          <div className="email_container">
            <div className="label">E-mail *</div>
            <input
              className="email"
              type="text"
              placeholder="Entrez votre e-mail"
              onChange={(e) => {
                setLogEmail(e.target.value);
              }}
            />
          </div>
          <div className="password_container">
            <div className="label">Mot de passe *</div>

            <input
              className="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              onChange={(e) => {
                setLogPassword(e.target.value);
              }}
            />
            <div
              className="forgotpassword"
              onClick={() => navigate("/forgotpassword")}
            >
              Mot de passe oublié ?
            </div>
          </div>
          <div className="message">
            Vous n'avez pas de compte ?{" "}
            <Link to="/inscription">Inscrivez-vous !</Link>
          </div>
          <div className="button" onClick={connexion}>
            Se connecter
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PageConnexion;
