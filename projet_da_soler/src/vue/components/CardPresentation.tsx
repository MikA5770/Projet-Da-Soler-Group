import "../../style/CardPresentation.scss";
import { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  ToolOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export interface CardPres {
  titre: string;
  contenu: string;
  logo: string;
}


const CardPresentation = (infos: CardPres) => {
  const nav = useNavigate();
  const [logo, setLogo] = useState<JSX.Element | null>(null);

  useEffect(() => {
    switch (infos.logo) {
      case "truck": {
        setLogo(<TruckOutlined />);
        break;
      }
      case "log": {
        setLogo(<AppstoreOutlined />);
        break;
      }
      case "tool": {
        setLogo(<ToolOutlined />);
        break;
      }
    }
  }, [infos.logo]);
  return (
    <>
      <div className="container_presentation">
        <div className="presentation">
          <div className="pres_titre">
            {infos.titre} - {logo}
            <div className="underline"></div>
          </div>
          <div className="pres_contenu"> {infos.contenu}</div>
          <div onClick={() => nav("/quisommesnous")} className="en_savoir_plus">
            <div>En savoir plus</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPresentation;
