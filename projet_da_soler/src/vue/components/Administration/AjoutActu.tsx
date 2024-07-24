import { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Actualite } from "../../../modele/class/Actualite";
import { ActualiteDAO } from "../../../modele/DAO/ActualiteDAO";
import { Button, Input, Upload, UploadProps } from "antd";
import "../../../style/AjoutModifActu.scss";
import ImageCompress from "quill-image-compress";
import { UploadOutlined } from "@ant-design/icons";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { useCustomNav } from "../../../utils/useCustomNav";
import { Helmet } from "react-helmet";
import { useAuth } from "../AuthContext";

Quill.register("modules/imageCompress", ImageCompress);

const AjoutActu = () => {
  const [titre, setTitre] = useState("");
  const [resume, setResume] = useState("");
  const [contenu, setContent] = useState("");
  const { currentUser, admin } = useAuth();

  let tabError: string[] = [];
  const actuDAO = new ActualiteDAO();
  const editorRef = useRef<HTMLDivElement>(null);
  const { showSuccess, showError, showErrorArticle, contextHolder } =
    useCustomNav();

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        modules: {
          toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike"],
            ["image"],
            ["blockquote"],
            ["link"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
          ],
          imageCompress: {
            quality: 0.8,
            maxWidth: 600,
            imageType: "image/jpeg" || "image/png",
            debug: true,
            suppressErrorLogging: false,
            insertIntoEditor: undefined,
          },
        },
        theme: "snow",
      });
      quill.on("text-change", () => {
        setContent(editorRef.current!.children[0].innerHTML);
      });
    }
  }, []);

  const [cover, setCover] = useState<File | null>(null);

  const props: UploadProps = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      if (!isPNG && !isJPG) {
        showError(`${file.name} n'est pas de type png / jpg`, 3);
        return true;
      }
      if (file.size / 1024 > 4000) {
        showError(`${file.name} dépasse la taille limite de 4MB.`, 3);
        return true;
      }
      setCover(file);
      return false;
    },
    onChange(info) {
      if (info.file.status === "error") {
        info.file.error.message = "Erreur lors du téléchargement";
      }
    },
  };

  const isValidTitre = (): boolean => {
    if (!titre) {
      tabError.push("titre");
      return false;
    }
    return true;
  };
  const isValidResume = (): boolean => {
    if (!resume) {
      tabError.push("résumé");
      return false;
    }
    return true;
  };
  const isValidContenu = (): boolean => {
    if (!contenu) {
      tabError.push("contenu");
      return false;
    }
    return true;
  };
  async function handleAdd() {
    tabError = [];

    isValidTitre();
    isValidResume();
    isValidContenu();
    if (tabError.length > 0) {
      showErrorArticle(tabError);
      return;
    } else if (cover === null) {
      showError("Veuillez insérer une image de présentation valide");
      return;
    }

    const actu = new Actualite();
    actu.titre = titre;
    actu.resume = resume;
    actu.contenu = contenu;
    actu.datePublication = new Date().toLocaleDateString();
    if (cover)
      try {
        const docId = await actuDAO.add(actu);
        await actuDAO.addInStorage(cover, docId);
        showSuccess("Article ajouté");
      } catch (error) {
        console.error(
          "Erreur lors de l'ajout de l'actualité et du fichier :",
          error
        );
      }
  }
  const handleScroll = (e: any) => {
    e.stopPropagation();
  };
  if (currentUser && admin)
    return (
      <>
        <Helmet>
          <title>Ajouter une actualité</title>
          <meta
            name="keywords"
            content="da soler, dsl, divers services logistiques, astre, logistique, transport"
          />
        </Helmet>

        <NavBar />
        {contextHolder}
        <div className="container_actu">
          <h2>Ajouter un article</h2>

          <div className="input_actu">
            <Input
              placeholder="Titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
            />
          </div>
          <div className="input_actu">
            <Input
              placeholder="Résumé"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>
          <div>
            <Upload {...props} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>
                Choisir une image de présentation
              </Button>
            </Upload>
          </div>
          <div
            className="container_content_actu"
            style={{ position: "relative" }}
          >
            <div
              className="content_actu"
              style={{
                maxHeight: "600px",
                overflowY: "auto",
              }}
              onWheel={handleScroll}
            >
              <div
                ref={editorRef}
                style={{
                  minHeight: "100%",
                  height: "auto",
                  paddingTop: "50px",
                }}
              ></div>
            </div>
          </div>
          <Button type="primary" onClick={handleAdd}>
            Ajouter l'article
          </Button>
        </div>
        <Footer />
      </>
    );
};

export default AjoutActu;
