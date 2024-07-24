import Carousel from "./CarouselDSL";

import img1 from "../../../../public/assets/Image1.png";
import img2 from "../../../../public/assets/Image2.png";
import img3 from "../../../../public/assets/Image3.png";
import img4 from "../../../../public/assets/Image4.png";
import img45 from "../../../../public/assets/Image45.jpg";
import img46 from "../../../../public/assets/Image46.png";

import img5 from "../../../../public/assets/Image6.png";
import img6 from "../../../../public/assets/Image7.png";
import img7 from "../../../../public/assets/Image8.png";
import img8 from "../../../../public/assets/Image9.png";
import img101 from "../../../../public/assets/Image101.png";

import img9 from "../../../../public/assets/Image11.png";
import img10 from "../../../../public/assets/Image12.png";
import img11 from "../../../../public/assets/Image13.png";
import img12 from "../../../../public/assets/Image14.png";
import img123 from "../../../../public/assets/Image100.png";


import img13 from "../../../../public/assets/Image15.png";
import img14 from "../../../../public/assets/Image16.png";
import img15 from "../../../../public/assets/Image17.png";
import img16 from "../../../../public/assets/Image18.png";

import img17 from "../../../../public/assets/Image19.png";
import img18 from "../../../../public/assets/Image20.png";
import img19 from "../../../../public/assets/Image21.png";
import img20 from "../../../../public/assets/Image22.png";

import img21 from "../../../../public/assets/Image23.png";
import img22 from "../../../../public/assets/Image24.png";
import img23 from "../../../../public/assets/Image25.png";
import img24 from "../../../../public/assets/Image26.png";

import "../../../style/DepotDSL.scss";
import NavBar from "../NavBar";
import Footer from "../Footer";
import video from "../../../../public/vid/depots.mov";
import { DownCircleOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { Helmet } from "react-helmet";

export const DepotDSL = () => {
  const saintavold = [img46, img45, img1, img2, img3, img4];
  const dsTPS = [img123, img5, img6, img7, img8];
  const dsl1 = [img101, img9, img10, img11, img12];
  const stiring = [img13, img14, img15, img16];
  const weser = [img17, img18, img19, img20];
  const sncf = [img21, img22, img23, img24];

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToCarousel = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Nos dépôts</title>
      </Helmet>

      <NavBar />
      <div className="container_video_depots">
        <video
          className="video_presentation"
          controls
          autoPlay
          loop
          playsInline
        >
          <source src={video} type="video/mp4" />
        </video>
        <div className="bouton_redirect" onClick={scrollToCarousel}>
          <DownCircleOutlined />
        </div>
      </div>

      <div ref={carouselRef} className="carousel">
        <div className="coordonnees">
          <span className="titre_coordonnees">
            1. Dépôt ATOUT Logistique - 8000m² <br />
            Dépôt LSN - 7400m²
          </span>
          <br />
          <span style={{ textDecoration: "underline" }}>Adresse :</span> Zone de
          l’Europort 57500 SAINT-AVOLD <br />
          <span style={{ textDecoration: "underline" }}>
            Coordonnées GPS :
          </span>{" "}
          49°08'25.6"N 6°41'18.5"E
        </div>
        <Carousel images={saintavold} />
      </div>
      <div className="carousel">
        <div className="coordonnees">
          <span className="titre_coordonnees">
            2. Dépôt DA SOLER TPS - 1300m²
          </span>
          <br />
          <span style={{ textDecoration: "underline" }}>Adresse :</span>
          Technopôle Forbach SUD rue Descartes 57600 GAUBIVING <br />
          <span style={{ textDecoration: "underline" }}>
            Coordonnées GPS :
          </span>{" "}
          49°09'49.9"N 6°55'37.6"E
        </div>
        <Carousel images={dsTPS} />
      </div>
      <div className="carousel">
        <div className="coordonnees">
          <span className="titre_coordonnees">3. Dépôt DSL - 4600m²</span>
          <br />
          <span style={{ textDecoration: "underline" }}>Adresse :</span>
          Technopôle Forbach Sud rue Joseph Louis Gay Lussac, 57460
          Behren-lès-Forbach <br />
          <span style={{ textDecoration: "underline" }}>
            Coordonnées GPS :
          </span>{" "}
          N 49°9' 53.694'' E 6°55' 54.6708''
        </div>
        <Carousel images={dsl1} />
      </div>
      <div className="carousel">
        <div className="coordonnees">
          <span className="titre_coordonnees">4. Dépôt HEID - 3600m²</span>
          <br />
          <span style={{ textDecoration: "underline" }}>Adresse :</span> Z.I du
          Heid rue Robert Schuman 57350 STIRING-WENDEL <br />
          <span style={{ textDecoration: "underline" }}>
            Coordonnées GPS :
          </span>{" "}
          N 49°11' 37.6578'' E 6°55' 38.9964''
        </div>
        <Carousel images={stiring} />
      </div>
      <div className="carousel">
        <div className="coordonnees">
          <span className="titre_coordonnees">5. Dépôt WESER - 3400m²</span>
          <br />
          <span style={{ textDecoration: "underline" }}>Adresse :</span>
          Technopole Forbach SUD rue Bunsen 57600 GAUBIVING
          <br />
          <span style={{ textDecoration: "underline" }}>
            Coordonnées GPS :
          </span>{" "}
          N 49°9' 50.6232'' E 6°55' 27.2274''
        </div>
        <Carousel images={weser} />
      </div>
      <div className="carousel">
        <div className="coordonnees">
          <span className="titre_coordonnees">6. Dépôt SNCF - 5000 m²</span>
          <br />
          <span style={{ textDecoration: "underline" }}>Adresse :</span> rue
          Jacques Prévert 57600 Forbach <br />
          <span style={{ textDecoration: "underline" }}>
            Coordonnées GPS :
          </span>{" "}
          N 49°11' 28.7844'' E 6°54' 28.8966
        </div>
        <Carousel images={sncf} />
      </div>
      <Footer />
    </>
  );
};

export default DepotDSL;
