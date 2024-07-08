import { useEffect, useState } from "react";
import { PosteDAO } from "../../modele/DAO/PosteDAO";
import "../../style/Recrutement.scss";
import { useNavigate } from "react-router-dom";
import { Poste } from "../../modele/class/Poste";
import NavBar from "./NavBar";
import Footer from "./Footer";

function Recrutement() {
  const posteDAO = new PosteDAO();
  const [annonce, setAnnonce] = useState<Poste[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const getPoste = async () => {
      const postes = await posteDAO.getAll();
      setAnnonce(postes);
    };
    getPoste();
  }, []);

  return (
    <>
      <NavBar />
      <div>
        <div className="container">
          <div className="nb_poste">
            Nous avons actuellement
            {annonce.length > 1
              ? ` ${annonce.length} postes `
              : ` ${annonce.length} poste `}
            à pourvoir
          </div>
          {annonce.map(({ id_poste, libelle, type, lieu }) => (
            <div key={id_poste} className="ligne">
              <div className="gauche">
                <div className="libelle">{libelle}</div>
              </div>
              <div className="droite">
                <div className="infos">
                  <div className="type">{type}</div>
                  <div className="lieu">{lieu}</div>
                </div>
                <div
                  className="voir_offre"
                  onClick={() => nav(`/recrutement/${id_poste}`)}
                >
                  <div className="plus">+</div>
                  <div className="link_offre">Voir l'offre</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Recrutement;
