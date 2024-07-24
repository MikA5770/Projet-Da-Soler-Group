import { Helmet } from "react-helmet";
import NavBar from "../NavBar";
import Footer from "../Footer";
import "../../../style/PolitiqueConf.scss";

const PolitiqueConf = () => {
  return (
    <>
      <Helmet>
        <title>Politique de confidentialité</title>
      </Helmet>
      <NavBar />
      <div className="politique_titre">
        <h1>Politique de confidentialité</h1>
      </div>
      <h2 className="politique_soustitre">Collecte des données personnelles</h2>
      <div className="politique_texte">
        D'une manière générale, il est possible de visiter et naviguer sur le
        site sans transmettre de données personnelles. Cela n'est pas
        obligatoire. Cependant, certaines parties du site requiert la complétion
        d'un formulaire pouvant collecter ces données : nom, prénom, âge,
        e-mail, numéro de téléphone, CV, lettre de motivation. Dans le cas où
        les formulaires ne sont pas complétés, le visiteur ne pourra pas
        bénéficier de certaines fonctionnalités du site.
      </div>
      <h2 className="politique_soustitre">Traitement des données</h2>
      <div className="politique_texte">
        <ul>
          Les formulaires vont servir à collecter ces données afin de répondre
          aux attentes. Le site gère ces données afin de faciliter le
          traitement du : <li>recrutement</li>
          <li>contact avec le visiteur</li>
        </ul>
        Les données sont utilisées pour un usage interne et sont conservées jusqu'au traitement de la demande. Le
        visiteur a la possibilité de supprimer ses données personnelles depuis
        la page de gestion de son compte.
      </div>
      <Footer />
    </>
  );
};

export default PolitiqueConf;
