import { useEffect, useRef } from "react";
import video from "../../../../public/vid/nos_eng.mov";
import "../../../style/NosEngagements.scss";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import objectifCO2 from "../../../../public/assets/objectifCO2.png";
import iso from "../../../../public/assets/iso9001.jpg";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const NosEngagements = () => {
  const header = useRef(null);
  const { t } = useTranslation();

  const nav = useNavigate();

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    gsap.fromTo(
      header.current,
      {
        y: "-18vh",
      },
      {
        y: 0,
        scrollTrigger: {
          trigger: header.current,
          start: "100% top",
          end: "105% top",
          scrub: false,
          toggleActions: "play play play complete",
        },
        duration: 0.5,
      }
    );
  }, []);
  return (
    <>
      <Helmet>
        <title>{t("nos_eng.titre")}</title>
        <meta
          name="keywords"
          content="da soler, dsl, divers services logistiques, astre, logistique, transport"
        />
      </Helmet>

      <div className="header" ref={header}>
        <NavBar />
      </div>

      <div className="container_video">
        <video playsInline autoPlay muted loop className="myVideo">
          <source src={video} type="video/mp4" />
        </video>
        <div className="box_titre_engagements">
          <div className="titre_engagements">
            <div className="qsn" onClick={() => nav("/quisommesnous")}>
              {t("qsn.titre")} &gt;{" "}
            </div>
            <div>{t("nos_eng.titre")}</div>
          </div>
        </div>
      </div>

      <div className="container_infos_engagements">
        <div className="container_objectifCO2">
          <div className="objectif_CO2">
            <div className="image_objectifCO2">
              <img src={objectifCO2} alt="" />
            </div>
            <div className="texte_objectifCO2">
              <p>
                {t("nos_eng.txt1")}
                <br />
                {t("nos_eng.txt2")}
              </p>
              <ul>
                <li>
                  <span>{t("nos_eng.1.titre")}</span>
                  <p>{t("nos_eng.1.txt")}</p>
                </li>

                <li>
                  <span>{t("nos_eng.2.titre")}</span>
                  <p>{t("nos_eng.2.txt")}</p>
                </li>

                <li>
                  <span>{t("nos_eng.3.titre")}</span>
                  <p>{t("nos_eng.3.txt")}</p>
                </li>

                <li>
                  <span>{t("nos_eng.4.titre")}</span>
                  <p>{t("nos_eng.4.txt")}</p>
                </li>
              </ul>
              {t("nos_eng.fin")}
            </div>
          </div>
        </div>

        <div className="container_iso">
          <div className="iso">
            <div className="image_iso">
              <img src={iso} alt="" />
            </div>
            <div className="texte_iso">{t("nos_eng.iso")}</div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NosEngagements;
