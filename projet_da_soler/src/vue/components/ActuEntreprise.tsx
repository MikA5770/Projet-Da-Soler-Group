import { useEffect, useState } from "react";
import { Actualite } from "../../modele/class/Actualite";
import { ActualiteDAO } from "../../modele/DAO/ActualiteDAO";
import Footer from "./Footer";
import NavBar from "./NavBar";
import "../../style/ActuEntreprise.scss";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

const ActuEntreprise = () => {
  const actuDAO = new ActualiteDAO();
  const [news, setNews] = useState<Actualite[]>([]);
  const [imageURLs, setImageURLs] = useState<Record<string, string>>({});
  const nav = useNavigate();

  useEffect(() => {
    const getActus = async () => {
      const actus = await actuDAO.getAll();
      const updatedActus = await Promise.all(
        actus.map(async (newsItem) => {
          const storage = getStorage();
          const storageRef = ref(storage, `actualite/${newsItem.id_actu}`);
          try {
            const imagesRef = await listAll(storageRef);
            const imageUrls = await getImageURLs(imagesRef);
            setImageURLs((prevURLs) => ({
              ...prevURLs,
              [newsItem.id_actu]: imageUrls[0], 
            }));
          } catch (error) {
            console.error(
              `Error getting images for ${newsItem.id_actu}:`,
              error
            );
          }
          return newsItem;
        })
      );
      setNews(updatedActus);
    };
    getActus();
  }, []);
  const getImageURLs = async (imagesRef: any) => {
    const imageUrls = await Promise.all(
      imagesRef.items.map(async (itemRef: any) => {
        return getDownloadURL(itemRef);
      })
    );
    return imageUrls;
  };
  return (
    <>
      <NavBar />
      <div className="container_article">
        <h2>Actualité</h2>
        {news.map((newsItem) => (
          <div
            key={newsItem.id_actu}
            className="item_article"
            onClick={() => nav(`/actualite/${newsItem.id_actu}`)}
          >
            <div className="cover">
              <img
                src={imageURLs[newsItem.id_actu]}
                alt=""
                className="img_cover"
              />
            </div>
            <div className="infos_article">
              <h1 className="titre_article">{newsItem.titre}</h1>
              <div className="date_article">{newsItem.datePublication}</div>
              <p className="resume_article">{newsItem.resume}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default ActuEntreprise;
