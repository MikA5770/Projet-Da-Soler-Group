import camion_s from "../../../../public/assets/i.jpg";
import dasoler from "../../../../public/assets/DA-SOLER.png";
import dsl from "../../../../public/assets/dsl.png";
import astre from "../../../../public/assets/astre.jpg";
import "../../../style/QuiSommesNous.scss";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const QuiSommesNous = () => {
  const nav = useNavigate();
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>{t("qsn.titre")}</title>
        <meta
          name="keywords"
          content="da soler, dsl, divers services logistiques, astre, logistique, transport"
        />
      </Helmet>

      <NavBar />
      <div className="img_deb">
        <img src={camion_s} alt="" />
        <div className="box_titre">
          <div className="titre_quisommesnous">{t("qsn.titre")}</div>
        </div>
      </div>

      <div className="container_infos">
        <div className="premiere">
          <div className="text_qsn">{t("qsn.container_infos1.premiere")} </div>
        </div>

        <div className="deuxieme">
          <div className="text_qsn">{t("qsn.container_infos1.deuxieme")}</div>
        </div>
      </div>

      <div className="img_logos">
        <div className="dasoler_logo">
          <img src={dasoler} alt="" />
        </div>
        <div className="dsl_logo">
          <img src={dsl} alt="" />
        </div>
      </div>

      <div className="container_infos2">
        <div className="premiere">
          <div className="text_qsn">{t("qsn.container_infos2.premiere")} </div>
          <div
            className="decouvrir_engagements"
            onClick={() => nav("/nosengagements")}
          >
            {t("qsn.container_infos1.bouton")}{" "}
          </div>
        </div>
        <div className="deuxieme">
          <div className="text_qsn">{t("qsn.container_infos2.deuxieme")} </div>
          <div className="decouvrir_depots" onClick={() => nav("/depots")}>
            {t("qsn.container_infos2.bouton")}{" "}
          </div>
        </div>
      </div>
      <div className="container_infos3">
        <div className="premiere">
          <div className="text_qsn">{t("qsn.container_infos3")} </div>
        </div>
        <div className="deuxieme">
          <div className="img_astre">
            <img src={astre} alt="" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default QuiSommesNous;
