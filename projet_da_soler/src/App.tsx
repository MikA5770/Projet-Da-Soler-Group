import PageConnexion from "./vue/components/PageConnexion";
import Recrutement from "./vue/components/Recrutement";
import "./i18n";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageInscription from "./vue/components/PageInscription";
import Lenis from "lenis";
import { useEffect } from "react";
import UneCandidature from "./vue/components/UneCandidature";
import MonCompte from "./vue/components/MonCompte";
import ForgotPassword from "./vue/components/ForgotPassword";
import DepotDSL from "./vue/components/DepotDSL";
import InfosEntreprise from "./vue/components/NosEngagements";
import { AuthProvider } from "./vue/components/AuthContext";
import Administration from "./vue/components/Administration";
import QuiSommesNous from "./vue/components/QuiSommesNous";
import NosEngagements from "./vue/components/NosEngagements";
import UneActu from "./vue/components/UneActu";
import ActuEntreprise from "./vue/components/ActuEntreprise";
import AdministrationActualite from "./vue/components/AdminActualite";
import AjoutActu from "./vue/components/AjoutActu";
import ModifActu from "./vue/components/ModifActu";
import "./style/App.scss";
import Presentation from "./vue/components/Presentation";
import ScrollToTop from "./vue/components/ScrollToTop";

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
            <Route path="/" element={<Presentation />} />
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
            <Route path="/adminactu" element={<AdministrationActualite />} />
            <Route path="/actualite/ajout" element={<AjoutActu />} />
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
