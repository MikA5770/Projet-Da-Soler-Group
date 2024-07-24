import PageConnexion from "./vue/components/Connexion/PageConnexion";
import Recrutement from "./vue/components/Recrutement/Recrutement";
import "./i18n";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageInscription from "./vue/components/Connexion/PageInscription";
import Lenis from "lenis";
import { useEffect } from "react";
import UneCandidature from "./vue/components/Recrutement/UnPoste";
import MonCompte from "./vue/components/MonCompte";
import ForgotPassword from "./vue/components/Connexion/ForgotPassword";
import DepotDSL from "./vue/components/InfosEntreprise/DepotDSL";
import InfosEntreprise from "./vue/components/InfosEntreprise/NosEngagements";
import { AuthProvider } from "./vue/components/AuthContext";
import Administration from "./vue/components/Administration/Administration";
import QuiSommesNous from "./vue/components/InfosEntreprise/QuiSommesNous";
import NosEngagements from "./vue/components/InfosEntreprise/NosEngagements";
import UneActu from "./vue/components/Actualite/UneActu";
import ActuEntreprise from "./vue/components/Actualite/ActuEntreprise";
import AjoutActu from "./vue/components/Administration/AjoutActu";
import ModifActu from "./vue/components/Administration/ModifActu";
import "./style/App.scss";
import Accueil from "./vue/components/Accueil";
import ScrollToTop from "./vue/components/ScrollToTop";
import MentionsLegales from "./vue/components/InfosEntreprise/MentionsLegales";
import PolitiqueConf from "./vue/components/InfosEntreprise/PolitiqueConf";

function App() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/connexion" element={<PageConnexion />} />
            <Route path="/inscription" element={<PageInscription />} />
            <Route path="/recrutement" element={<Recrutement />} />
            <Route path="/recrutement/:id" element={<UneCandidature />} />
            <Route path="/moncompte" element={<MonCompte />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/depots" element={<DepotDSL />} />
            <Route path="/presentation" element={<InfosEntreprise />} />
            <Route path="/quisommesnous" element={<QuiSommesNous />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="/nosengagements" element={<NosEngagements />} />
            <Route path="/actualite" element={<ActuEntreprise />} />
            <Route path="/actualite/:id_actu" element={<UneActu />} />
            <Route path="/actualite/ajout" element={<AjoutActu />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route
              path="/politique-de-confidentialite"
              element={<PolitiqueConf />}
            />
            <Route
              path="/actualite/modifier/:id_actu"
              element={<ModifActu />}
            />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
