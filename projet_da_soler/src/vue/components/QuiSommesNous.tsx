import camion_s from "../../../public/assets/camion_s2-CmWHhlR3.jpg";
import dasoler from "../../../public/assets/DA-SOLER-Logo-Blanc-DgCs0BTA.png";
import dsl from "../../../public/assets/d-Cdgkgmmn.png";
import astre from "../../../public/assets/astre-B0KfpN88.jpg";
import "../../style/QuiSommesNous.scss";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const QuiSommesNous = () => {
  const nav = useNavigate();

  return (
    <>
      <NavBar />
      <div className="img_deb">
        <img src={camion_s} alt="" />
        <div className="box_titre">
          <div className="titre_quisommesnous">Qui sommes-nous ?</div>
        </div>
      </div>

      <div className="container_infos">
        <div className="premiere">
          <div className="text_qsn">
            Le groupe Da Soler a été créé en 1975. Depuis plus de 40 ans, notre
            entreprise performe dans ses différentes fonctions dont le
            transport et la logsitique. Notre avantage géographique nous permet
            d'être aussi proche de nos clients que de la majeure partie de
            l'Europe.
          </div>
        </div>

        <div className="deuxieme">
          <div className="text_qsn">
            Da Soler s'occupe du transport au niveau régional, national et
            international. Il s'effectue dans de nombreux pays tels que
            l'Allemagne, la Belgique, le Luxembourg, la Suisse, l'Espagne, le
            Portugal, l'Italie, la Hollande.
          </div>
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
          <div className="text_qsn">
            Divers Services Logistique est notre secteur spécialisé dans la
            logistique et le stockage de marchandises. Nos nombreux dépôts nous
            donne la possibilité de s'étendre sur une large zone et de stocker
            toujours plus de produits des clients.
          </div>
          <div className="decouvrir_depots" onClick={() => nav("/depots")}>
            Découvrez nos dépôts
          </div>
        </div>
        <div className="deuxieme">
          <div className="text_qsn">
            Nous stockons 2 types de produits : les produits finis et
            semi-finis. L'acheminement de la marchandise varie en fonction de
            son type. Les produits semi-finis, tels que les boîtiers vides et
            les capuchons, sont d'abord stockés dans les dépôts avant d'être
            envoyés chez nos clients.
          </div>
        </div>
      </div>
      <div className="container_infos3">
        <div className="premiere">
          <div className="text_qsn">
            Nous sommes fiers de faire partie de l'association des transporteurs
            européens (ASTRE), réunissant de nombreuse PME spécialisées dans la
            logistique ainsi que le transport de marchandises telle que Da
            Soler. Nous utilions Palet System, la solution de transport
            palettisé garantissant la traçabilité des expéditions de
            l'enlèvement jusqu'à la livraison.
          </div>
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
