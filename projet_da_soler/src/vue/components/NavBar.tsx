import "../../style/NavBar.scss";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DaSolerLogo from "../../../public/assets/DA-SOLER.png";
import UserPNG from "../../../public/assets/user.png";
import ArrowPNG from "../../../public/assets/arrow.png";
import { UtilisateurConnexion } from "../../modele/DAO/UtilisateurConnexion";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";

const NavBar = () => {
  const { currentUser, admin, prenom } = useAuth();
  const [open, setOpen] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);

  const nav = useNavigate();
  const { t } = useTranslation();

  const { i18n } = useTranslation();
  const [en, setEn] = useState(false);

  const   changeLanguage = () => {
    const newLang = en ? "fr" : "en";
    i18n.changeLanguage(newLang);
    setEn(!en);
  };
  const utilisateur = new UtilisateurConnexion();

  let menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let handler = (e: any) => {
      if (!menuRef.current!.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);
  const handleBurger = () => {
    setBurgerOpen(!burgerOpen);
  };

  return (
    <div className="navbar">
      <div className="left">
        <div className="logo">
          <img src={DaSolerLogo} alt="da_soler.png" onClick={() => nav("/")} />
        </div>
        <div className="links">
          <Link to={"/quisommesnous"}>{t("navbar.qsn")}</Link>
          <Link to={"/actualite"}>{t("navbar.actualite")}</Link>
          <Link to={"/recrutement"}>{t("navbar.recrutement")}</Link>
          <div onClick={changeLanguage} style={{ cursor: "pointer" }}>
            {en ? "FR" : "EN"}
          </div>
        </div>
      </div>
      <div className="right" ref={menuRef}>
        <div className="bjr">
          {t("navbar.bjr")} {currentUser ? prenom : ""} !
        </div>

        <div
          className="pic"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <div className="user">
            <img src={UserPNG} alt="user.png" />
          </div>

          <div className="arrow_user">
            <img src={ArrowPNG} alt="arrow.png" />
          </div>
        </div>

        <div className={`menu ${open ? "active" : "inactive"}`}>
          <ul>
            {currentUser ? (
              <li onClick={() => nav("/moncompte")}>
                {t("navbar.menu.moncompte")}
              </li>
            ) : (
              ""
            )}

            {admin && currentUser ? (
              <li onClick={() => nav("/administration")}>
                {t("navbar.menu.administration")}
              </li>
            ) : (
              ""
            )}
            {currentUser ? (
              <li onClick={() => utilisateur.deconnexion()}>
                {t("navbar.menu.deconnexion")}
              </li>
            ) : (
              <li onClick={() => nav("/connexion")}>
                {t("navbar.menu.connexion")}
              </li>
            )}
          </ul>
        </div>
      </div>
      {!burgerOpen ? (
        <div className="burger_menu_icon" onClick={handleBurger}>
          <MenuOutlined style={{ color: "white", fontSize: "40px" }} />
        </div>
      ) : (
        ""
      )}
      <div className={`burger_menu ${burgerOpen ? "open" : ""}`}>
        {burgerOpen ? (
          <>
            <div className="close_icon" onClick={() => setBurgerOpen(false)}>
              <CloseOutlined />
            </div>
            <div className="links_burger_menu">
              {currentUser ? (
                <div
                  className="liens_burger"
                  onClick={() => utilisateur.deconnexion()}
                >
                  {t("navbar.menu.deconnexion")}
                </div>
              ) : (
                <div className="liens_burger" onClick={() => nav("/connexion")}>
                  {t("navbar.menu.connexion")}
                </div>
              )}
              <div
                className="liens_burger"
                onClick={() => nav("/quisommesnous")}
              >
                {t("navbar.qsn")}
              </div>
              <div className="liens_burger" onClick={() => nav("/recrutement")}>
                {t("navbar.recrutement")}
              </div>
              <div className="liens_burger" onClick={() => nav("/actualite")}>
                {t("navbar.actualite")}
              </div>
              {currentUser && (
                <div className="liens_burger" onClick={() => nav("/moncompte")}>
                  {t("navbar.menu.moncompte")}
                </div>
              )}
              {currentUser && admin && (
                <div
                  className="liens_burger"
                  onClick={() => nav("/administration")}
                >
                  {t("navbar.menu.administration")}
                </div>
              )}
              <div
                className="liens_burger"
                onClick={changeLanguage}
                style={{ cursor: "pointer" }}
              >
                {en ? "FR" : "EN"}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default NavBar;
