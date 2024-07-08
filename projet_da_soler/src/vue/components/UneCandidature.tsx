import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PosteDAO } from "../../modele/DAO/PosteDAO";
import { Poste } from "../../modele/class/Poste";
import { Candidature } from "../../modele/class/Candidature";
import { CandidatureDAO } from "../../modele/DAO/CandidatureDAO";
import "../../style/UneCandidature.scss";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useAuth } from "./AuthContext";

function UneCandidature() {
  const { id } = useParams();

  const nav = useNavigate();

  const posteDAO = new PosteDAO();
  const candidatureDAO = new CandidatureDAO();

  const [exist, setExist] = useState<boolean | null>(null);
  const [data, setData] = useState<Poste>();
  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState(false);
  const [errorSize, setErrorSize] = useState(false);
  const [errorType, setErrorType] = useState(false);
  const [lettre, setLettre] = useState<File | null>(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    const checkExistence = async () => {
      if (id) {
        const existence = await posteDAO.existe(id);
        setExist(existence);
      }
    };

    const fetchPoste = async () => {
      if (id) {
        const poste = await posteDAO.getById(id);
        setData(poste);
      }
    };

    checkExistence();
    fetchPoste();
  }, []);

  async function handleAdd(id_poste: string, id_user: string) {
    const candidature = new Candidature(id_poste, id_user);
    setError(false);
    setErrorSize(false);
    setErrorType(false);
    if (cv === null || lettre === null) setError(true);
    else if (cv.size / 1024 > 2000 || lettre.size / 1024 > 2000)
      setErrorSize(true);
    else if (
      (cv.type !== "application/pdf" && cv.type !== "image/jpeg") ||
      (lettre.type !== "application/pdf" && lettre.type !== "image/jpeg")
    )
      setErrorType(true);
    else {
      try {
        const docId = await candidatureDAO.add(candidature);
        await candidatureDAO.addInStorage(cv, lettre, docId);
        nav("/recrutement");
      } catch (error) {
        console.error(
          "Erreur lors de l'ajout de la candidature et du fichier :",
          error
        );
      }
    }
  }
  if (exist === null) {
    return <div>Chargement...</div>;
  }

  if (!exist) {
    return <div>Erreur : Candidature non trouvée</div>;
  }

  if (data && id)
    return (
      <>
        <NavBar />
        <div className="container_uneCandidature">
          <div className="info_uneCandidature">
            <div className="recrutement_uneCandidature">Recrutement</div>
            <div className="libelle">
              {data.libelle} - {data.type}
            </div>
            <div className="publication">
              Offre publiée le {data.datePublication}
            </div>
            <div className="titre">Missions du poste</div>
            <div className="contenu">{data.missions}</div>
            <div className="titre">Compétences</div>
            <div className="contenu">{data.competences}</div>

            <div className="postuler">
              <div className="titre">Je postule</div>
              {currentUser ? (
                <section>
                  <div className="container_cvInput">
                    <div className="titre_postulation">CV *</div>
                    <label htmlFor="cvInput" className="labelCv">
                      <span>Choisir un fichier</span>
                    </label>
                    <input
                      type="file"
                      className="cv"
                      id="cvInput"
                      onChange={(e: any) => {
                        setCv(e.target.files[0]);
                      }}
                    />
                    <span>{cv?.name}</span>
                  </div>

                  <div className="container_lettreInput">
                    <div className="titre_postulation">
                      Lettre de motivation *
                    </div>

                    <label htmlFor="lettreInput" className="labelLettre">
                      <span>Choisir un fichier</span>
                    </label>
                    <input
                      type="file"
                      className="lettre"
                      id="lettreInput"
                      onChange={(e: any) => {
                        setLettre(e.target.files[0]);
                      }}
                    />
                    <span>{lettre?.name}</span>
                  </div>

                  <div
                    className="container_message"
                    style={{ margin: "40px 0" }}
                  >
                    {/* <div className="titre_postulation">Message (optionnel)</div>
                    <textarea></textarea> <br /> */}
                    <button
                      type="submit"
                      className="bouton_postuler"
                      onClick={() => handleAdd(id, currentUser.uid)}
                    >
                      Envoyer sa candidature
                    </button>
                    {error ? (
                      <div>
                        Veuillez renseignez un CV et une lettre de motivation
                      </div>
                    ) : (
                      ""
                    )}
                    {errorSize ? (
                      <div>
                        La taille des fichiers ne doivent pas dépasser 2 Mo.
                      </div>
                    ) : (
                      ""
                    )}
                    {errorType ? (
                      <div>Seuls les fichiers PDF et JPG sont acceptés.</div>
                    ) : (
                      ""
                    )}
                  </div>
                </section>
              ) : (
                <div>Vous devez être connecté</div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
}

export default UneCandidature;
