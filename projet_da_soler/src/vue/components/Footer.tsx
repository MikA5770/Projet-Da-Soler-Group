import "../../style/Footer.scss"
import DaSolerLogo from "../../../public/assets/DA-SOLER-Logo-Blanc-DgCs0BTA.png";
import DslLogo from "../../../public/assets/d-Cdgkgmmn.png";
import { UtilisateurConnexion } from "../../modele/DAO/UtilisateurConnexion";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { admin } = useAuth();

  const utilisateur = new UtilisateurConnexion();
  const [user] = useAuthState(utilisateur.getAuth());
  const { t } = useTranslation();
  const handleDeconnexion = () => {
    utilisateur.deconnexion();
  };

  return (
    <div className="footer">
      <div className="haut">
        <div className="container_barre">
          <div className="barre"></div>
        </div>

        <div className="logo_footer">
          <img src={DaSolerLogo} alt="da_soler" />
        </div>

        <div className="container_barre">
          <div className="barre"></div>
        </div>
      </div>

      <div className="milieu">
        <ul>
          <Link to={"/"}>{t("footer.accueil")}</Link>
          <Link to="/#contact-section">{t("footer.contact")}</Link>
          <Link to={"/recrutement"}>{t("footer.recrutement")}</Link>
          <Link to={"/"}>{t("footer.mentions_legales")}</Link>
          {user ? <Link to={"/moncompte"}>{t("footer.moncompte")}</Link> : ""}
          {user ? (
            <Links
              fonction={handleDeconnexion}
              libelle={t("footer.deconnexion")}
            />
          ) : (
            <Link to={"/connexion"}>{t("footer.connexion")}</Link>
          )}
          {user && admin ? (
            <Link to={"/administration"}>{t("footer.administration")}</Link>
          ) : (
            ""
          )}
        </ul>
        <div className="container_barre">
          <div className="barre"></div>
        </div>
      </div>

      <div className="bas">
        <div className="dsl">
          <img src={DslLogo} alt="dsl_logo.png" />
        </div>

        <div className="infos">
          <div className="position">
            <EnvironmentOutlined style={{fontSize:"32px"}} />
            <span>Rue Descartes, Techopole Forbach Sud, 57600 Folkling </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Footer;

interface LinksProps {
  libelle: string;
  fonction?: () => void;
}

const Links: React.FC<LinksProps> = ({ libelle, fonction }) => {
  return <li onClick={fonction}>{libelle}</li>;
};
