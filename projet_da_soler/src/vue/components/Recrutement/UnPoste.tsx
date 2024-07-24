import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PosteDAO } from "../../../modele/DAO/PosteDAO";
import { Poste } from "../../../modele/class/Poste";
import { Candidature } from "../../../modele/class/Candidature";
import { CandidatureDAO } from "../../../modele/DAO/CandidatureDAO";
import "../../../style/UnPoste.scss";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { useAuth } from "../AuthContext";
import { Helmet } from "react-helmet";
import { Checkbox } from "antd";
import { useCustomNav } from "../../../utils/useCustomNav";

function UnPoste() {
  const { id } = useParams();

  const nav = useNavigate();

  const { showMessageAndRedirect, contextHolder } = useCustomNav();

  const posteDAO = new PosteDAO();
  const candidatureDAO = new CandidatureDAO();

  const [exist, setExist] = useState<boolean | null>(null);
  const [data, setData] = useState<Poste>();
  const [cv, setCv] = useState<File | null>(null);
  const [checkbox, setCheckbox] = useState(false);
  const [error, setError] = useState(false);
  const [errorSize, setErrorSize] = useState(false);
  const [errorType, setErrorType] = useState(false);
  const [errorCheckbox, setErrorCheckbox] = useState(false);
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

  const [disabled, setDisabled] = useState(false);

  async function handleAdd(id_poste: string, id_user: string) {
    const candidature = new Candidature(id_poste, id_user);
    setErrorCheckbox(false);
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
    else if (!checkbox) setErrorCheckbox(true);
    else {
      try {
        setDisabled(true);
        const docId = await candidatureDAO.add(candidature);
        await candidatureDAO.addInStorage(cv, lettre, docId);
        showMessageAndRedirect(
          "success",
          "Votre candidature a été envoyée",
          "Votre candidature a été envoyée",
          2,
          "/recrutement"
        );
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
        {contextHolder}
        <Helmet>
          <title>Poste - {data.libelle}</title>
        </Helmet>

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

                  <div className="politique_conf">
                    <Checkbox onChange={() => setCheckbox(!checkbox)}>
                      <div className="politique">
                        J'ai lu et j'accepte la{" "}
                        <span
                          className="politique"
                          style={{ textDecoration: "underline" }}
                          onClick={() => nav("politique-de-confidentialite")}
                        >
                          Politique de confidentialité
                        </span>
                        .
                      </div>
                    </Checkbox>
                  </div>

                  <div
                    className="container_message"
                    style={{ margin: "40px 0" }}
                  >
                    <button
                      disabled={disabled}
                      type="submit"
                      className="bouton_postuler"
                      onClick={() => handleAdd(data.libelle, currentUser.uid)}
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
                    {errorCheckbox ? (
                      <div>Veuillez cocher la case afin de continuer</div>
                    ) : (
                      ""
                    )}
                  </div>
                </section>
              ) : (
                <div className="needConnexion">Vous devez être connecté</div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
}

export default UnPoste;
