import { useEffect, useState } from "react";
import { ActualiteDAO } from "../../../modele/DAO/ActualiteDAO";
import { Actualite } from "../../../modele/class/Actualite";
import "../../../style/UneActu.scss";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { Helmet } from "react-helmet";

const UneActu = () => {
  const actuDAO = new ActualiteDAO();
  const [actu, setActu] = useState<Actualite>();
  const { id_actu } = useParams();
  const [imageURLs, setImageURLs] = useState<string>();

  const [exist, setExist] = useState<boolean | null>(null);

  useEffect(() => {
    const getImage = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, `actualite/${id_actu}`);
      try {
        const imagesRef = await listAll(storageRef);
        const imageUrls = await getImageURLs(imagesRef);
        setImageURLs(imageUrls[0]);
      } catch (error) {
        console.error(`Error getting images for ${id_actu}:`, error);
      }
    };

    getImage();
  }, []);

  const getImageURLs = async (imagesRef: any) => {
    const imageUrls = await Promise.all(
      imagesRef.items.map(async (itemRef: any) => {
        return getDownloadURL(itemRef);
      })
    );
    return imageUrls;
  };

  useEffect(() => {
    const checkExistence = async () => {
      if (id_actu) {
        const existence = await actuDAO.existe(id_actu);
        setExist(existence);
      }
    };

    const getArticle = async () => {
      if (id_actu) {
        const article = await actuDAO.getById(id_actu);
        setActu(article);
      }
    };
    checkExistence();
    getArticle();
  }, []);

  if (exist === null) {
    return <div>Chargement...</div>;
  }

  if (!exist) {
    return <div>Erreur : Article non trouvée</div>;
  }

  if (actu && id_actu)
    return (
      <>
        <Helmet>
          <title>{actu.titre}</title>
        </Helmet>

        <NavBar />
        <div className="container_uneActu">
          <div className="titre_uneActu">{actu.titre}</div>
          <div className="resume_uneActu">{actu.resume}</div>
          <div className="date_uneActu">{actu.datePublication}</div>
          <div className="image_uneActu">
            <img src={imageURLs} alt="" />
          </div>
          <div key={actu.id_actu} className="contenu_uneActu">
            <div dangerouslySetInnerHTML={{ __html: actu.contenu }}></div>
          </div>
        </div>
        <Footer />
      </>
    );
};

export default UneActu;
