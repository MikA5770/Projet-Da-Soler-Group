import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import "../../style/Accueil.scss";
import da_soler from "../../../public/assets/DA-SOLER.png";
import CardPresentation, { CardPres } from "./CardPresentation";
import emailjs from "@emailjs/browser";
import camion from "../../../public/assets/c.jpg";
import camion2 from "../../../public/assets/IMG_2535.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LinkedinFilled } from "@ant-design/icons";
import NavBar from "./NavBar";
import Footer from "./Footer";
import {
  checkNom,
  checkPrenom,
  checkTelephone,
  checkEmail,
  checkMessage,
  checkBox,
} from "../../utils/validation";
import { useCustomNav } from "../../utils/useCustomNav";
import { ErrorsState } from "../../utils/ErrorsState";
import { Checkbox } from "antd";
import video from "../../../public/vid/accueil_background.mov";

function Accueil() {
  const [checkbox, setCheckBox] = useState(false);

  const location = useLocation();
  const { t } = useTranslation();
  const { showError, contextHolder, showSuccess } = useCustomNav();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const dasoler: CardPres = {
    titre: t("presentation.cardDS.titre"),
    contenu: t("presentation.cardDS.texte"),
    logo: "truck",
  };

  const dsl: CardPres = {
    titre: t("presentation.cardDSL.titre"),
    contenu: t("presentation.cardDSL.texte"),
    logo: "log",
  };

  const aspl: CardPres = {
    titre: t("presentation.cardASPL.titre"),
    contenu: t("presentation.cardASPL.texte"),
    logo: "tool",
  };

  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [messageEmail, setMessageEmail] = useState("");

  const [errors, setErrors] = useState<ErrorsState>();
  const success = () => {
    showSuccess("Email envoyé avec succès !");
  };
  const error = (mess: string) => {
    showError(mess);
  };

  const form: any = useRef();
  const sendEmail = (e: any) => {
    e.preventDefault();

    emailjs
      .sendForm("service_nl3qup7", "template_jp63tlk", form.current, {
        publicKey: "LZFjiKj9vUf7xiK-q",
      })
      .then(
        () => {
          success();
        },
        (e) => {
          error(e.text);
        }
      );
  };
  const displayErrors = () => {
    const emailError = checkEmail(email);
    const telephoneError = checkTelephone(telephone);
    const nomError = checkNom(nom);
    const prenomError = checkPrenom(prenom);
    const messageEmailError = checkMessage(messageEmail);
    const checkBoxError = checkBox(checkbox);

    setErrors({
      email: emailError,
      telephone: telephoneError,
      nom: nomError,
      prenom: prenomError,
      messageEmail: messageEmailError,
      checkBox: checkBoxError,
    });

    return (
      emailError ||
      telephoneError ||
      nomError ||
      prenomError ||
      messageEmailError ||
      checkBoxError
    );
  };

  const checkForm = (e: any) => {
    e.preventDefault();

    const hasErrors = displayErrors();

    if (
      hasErrors ||
      !email ||
      !nom ||
      !prenom ||
      !telephone ||
      !messageEmail ||
      !checkbox
    ) {
      return;
    }

    sendEmail(e);
  };

  const nav = useNavigate();

  return (
    <>
      <Helmet>
        <title>Groupe Da Soler</title>
        <meta
          name="description"
          content="Le groupe Da Soler est composé de plusieurs sociétés, exerçant notamment dans le secteur du transport et de la logistique."
        />
        <meta
          name="keywords"
          content="da soler, dsl, divers services logistiques, astre, transport, logistique"
        />
      </Helmet>
      <div className="header">
        <NavBar />
      </div>
      {contextHolder}
      <div className="img_camion">
        <div className="imgFondContainer">
          <video playsInline autoPlay muted loop className="vid_accueil">
            <source src={video} type="video/mp4" />
          </video>
        </div>

        <div className="image_da_soler">
          <img src={da_soler} alt="Image Da Soler" />
        </div>

        <div className="container_slogan">
          <div className="titre_slogan">{t("presentation.titre")}</div>
          <div className="slogan">{t("presentation.slogan")} </div>
        </div>
      </div>

      <div className="container_titre_grpDS">
        <div className="trait"></div>
        <div className="titre_pres">{t("presentation.titre_section")}</div>
      </div>

      <div className="container_card">
        <CardPresentation
          titre={dasoler.titre}
          contenu={dasoler.contenu}
          logo={dasoler.logo}
        />
        <CardPresentation
          titre={dsl.titre}
          contenu={dsl.contenu}
          logo={dsl.logo}
        />
        <CardPresentation
          titre={aspl.titre}
          contenu={aspl.contenu}
          logo={aspl.logo}
        />
      </div>

      <div className="container_engagement">
        <div className="img_engagement">
          <img src={camion} alt="" />
        </div>
        <div className="space"></div>
        <div className="engagement_box">
          <div className="container_titre_engagement">
            <div className="trait"></div>
            <div className="titre_pres">
              {t("presentation.section_engagements.titre")}
            </div>
          </div>

          <div className="texte_engagement">
            {t("presentation.section_engagements.texte")}
          </div>
          <div className="decouvrir" onClick={() => nav("/nosengagements")}>
            <div> {t("presentation.section_engagements.bouton")}</div>
          </div>
        </div>
      </div>

      <div className="recrutement">
        <div className="recrutement_box">
          <div className="container_titre_recrutement">
            <div className="trait"></div>
            <div className="titre_pres">
              {t("presentation.section_recrutement.titre")}
            </div>
          </div>

          <div className="texte_recrutement">
            {t("presentation.section_recrutement.texte")}
          </div>
          <div className="decouvrir" onClick={() => nav("/recrutement")}>
            <div>{t("presentation.section_recrutement.bouton")}</div>
          </div>
        </div>
        <div className="space"></div>
        <div className="img_recrutement">
          <img src={camion2} alt="" />
        </div>
      </div>

      <div className="container_contact" id="contact-section">
        <div className="gauche">
          <div className="maps_infos">
            <div className="contact">
              <h1>{t("presentation.section_contact.contact.titre")}</h1>
              <div className="container_infos_contact">
                <div>
                  <h2>{t("presentation.section_contact.contact.adresse")}</h2>
                  <p>Rue Descartes, Techopole Forbach Sud, 57600 Folkling</p>
                </div>

                <div>
                  <h2>{t("presentation.section_contact.contact.numero")}</h2>
                  <p>03 87 29 32 32</p>
                </div>

                <div className="linkedin">
                  <h2>Linkedin</h2>
                  <a href="https://www.linkedin.com/company/transports-da-soler-et-compagnie/">
                    <span>{t("footer.linkedin")}</span>
                    <LinkedinFilled style={{ fontSize: "2rem" }} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <h1>{t("presentation.section_contact.contactez_nous.titre")}</h1>
          <form ref={form} onSubmit={checkForm} className="contact_email">
            <div className="input_contact">
              <label>
                {t("presentation.section_contact.contactez_nous.nom")}
              </label>
              <input
                type="text"
                onChange={(e) => setNom(e.target.value)}
                name="user_nom"
              />
              <div className="error_contact">{errors?.nom}</div>
            </div>
            <div className="input_contact">
              <label>
                {t("presentation.section_contact.contactez_nous.prenom")}
              </label>
              <input
                type="text"
                onChange={(e) => setPrenom(e.target.value)}
                name="user_prenom"
              />
              <div className="error_contact">{errors?.prenom}</div>
            </div>
            <div className="input_contact">
              <label>
                {t("presentation.section_contact.contactez_nous.email")}
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                name="user_email"
              />
              <div className="error_contact">{errors?.email}</div>
            </div>
            <div className="input_contact">
              <label>
                {t("presentation.section_contact.contactez_nous.telephone")}
              </label>
              <input
                type="text"
                onChange={(e) => setTelephone(e.target.value)}
                name="user_tel"
              />
              <div className="error_contact">{errors?.telephone}</div>
            </div>
            <div className="input_contact">
              <label>
                {t("presentation.section_contact.contactez_nous.message")}
              </label>
              <textarea
                onChange={(e) => setMessageEmail(e.target.value)}
                name="message"
              />
              <div className="error_contact">{errors?.messageEmail}</div>
            </div>

            <div className="input_contact">
              <Checkbox onChange={() => setCheckBox(!checkbox)}>
                <div className="politique">
                  {t("presentation.accepte")}{" "}
                  <span
                    className="politique"
                    style={{ textDecoration: "underline" }}
                    onClick={() => nav("politique-de-confidentialite")}
                  >
                    {t("footer.politique")}
                  </span>
                  .
                </div>
              </Checkbox>
              <div className="error_contact">{errors?.checkBox}</div>
            </div>

            <button type="submit" value="Send" className="button_contact">
              <span>
                {t("presentation.section_contact.contactez_nous.envoyer")}
              </span>
            </button>
          </form>
        </div>
        <div className="droite">
          <div className="google-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2608.925780740407!2d6.9241770759804036!3d49.16401697915068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47944cd3bd86a52f%3A0xe7d3503171d66c71!2sDa%20Soler!5e0!3m2!1sfr!2sfr!4v1718372832632!5m2!1sfr!2sfr"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Accueil;
