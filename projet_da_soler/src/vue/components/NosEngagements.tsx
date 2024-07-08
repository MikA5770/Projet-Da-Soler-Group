import { useEffect, useRef } from "react";
import video from "../../../public/vid/plan_cercle.mp4";
import "../../style/NosEngagements.scss";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import objectifCO2 from "../../../public/assets/objectifCO2-zSIsfdvV.png";
import iso from "../../../public/assets/iso9001-fRLMiwKR.jpg";

const NosEngagements = () => {
  const header = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    gsap.fromTo(
      header.current,
      {
        y: "-18vh",
      },
      {
        y: 0,
        scrollTrigger: {
          trigger: header.current,
          start: "100% top",
          end: "105% top",
          scrub: false,
          toggleActions: "play play play complete",
        },
        duration: 0.5,
      }
    );
  }, []);
  return (
    <>
      <div className="header" ref={header}>
        <NavBar />
      </div>

      <div className="container_video">
        <video autoPlay muted loop className="myVideo">
          <source src={video} type="video/mp4" />
        </video>
        <div className="box_titre_engagements">
          <div className="titre_engagements">Nos engagements</div>
        </div>
      </div>

      <div className="container_infos_engagements">
        <div className="container_objectifCO2">
          <div className="objectif_CO2">
            <div className="image_objectifCO2">
              <img src={objectifCO2} alt="" />
            </div>
            <div className="texte_objectifCO2">
              <p>
                Le groupe Da Soler s'engage à améliorer sa performance
                environnementale. Cela se traduit par notre adhésion au
                dispositif Objectif CO₂. En effet, l'un des enjeux majoritaires
                du secteur du transport routier concerne l'impact
                environnemental. <br />
                Conscient des riques liés à l'environnement, notre société est
                déterminé à optimiser son efficacité énergétique. Cet engagement
                se définit par de nombreuses actions et de mesures mises en
                place dans le but de répondre aux attentes d'une transition
                énergétique :
              </p>
              <ul>
                <li>
                  <span>- La décarbonation de notre flotte de véhicules :</span>
                  <p>
                    Le programme Objectif CO₂ met à disposition une multitude de
                    moyens techniques permettant de suivre l'évaluation de nos
                    émissions de CO₂, les gains de CO₂ potentiels, l'état
                    d'avancement de nos objectifs.
                  </p>
                </li>

                <li>
                  <span>- Une conduite éco-responsable des conducteurs :</span>
                  <p>
                    Il est essentiel d'avoir des conducteurs sensibilisés aux
                    risques et aux conséquences de leur état de conduite. Afin
                    de pallier à ce besoin, des formations sont mises en place
                    pour nos routiers et nous faisons le nécessaire pour limiter
                    la conduite des véhicules à vide.
                  </p>
                </li>

                <li>
                  <span>
                    - Des diagnostics CO₂ visant à réduire notre impact
                    environnemental :
                  </span>
                  <p>
                    La réalisation de diagnostics CO₂ vise à évaluer les
                    émissions de gaz à effet de serre émises par la flotte de
                    véhicule. Cela permettra ensuite de définir un plan
                    d'actions sur-mesure afin de réduire les émissions.
                  </p>
                </li>

                <li>
                  <span>- L'utilisation de carburants alternatifs :</span>
                  <p>
                    En plus de remplacer nos véhicules les plus anciens par de
                    nouveaux, l'utilisation du carburant B100 est nécessaire à
                    l'atteinte de nos objectifs. Notre parc est déjà constitué
                    de 10 véhicules fonctionnant à ce carburant et 10 de plus
                    sont prévus d'ici 2025.
                  </p>
                </li>
              </ul>
              D'une part, ces démarches nous permettent, et nous à déjà permis
              de réduire nos émissions de gaz à effet de serre. D'autre part, le
              but est d'obtenir la charte Objectif CO₂ ainsi que d'être labellisé en
              tant que "Transporteur éco-responsable".
            </div>
          </div>
        </div>

        <div className="container_iso">
          <div className="iso">
            <div className="image_iso">
              <img src={iso} alt="" />
            </div>
            <div className="texte_iso">
              L'un de nos objectifs majeurs est la qualité. La société Da Soler
              est propriétaire de la norme de management de la qualité ISO 9001.
              Nous garantissons fournir constamment les services et les
              solutions de qualité que l'on dispose, que ce soit en matière de
              transport ou de logistique.
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NosEngagements;
