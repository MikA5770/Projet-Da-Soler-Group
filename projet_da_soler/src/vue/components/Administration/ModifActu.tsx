import { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Actualite } from "../../../modele/class/Actualite";
import { ActualiteDAO } from "../../../modele/DAO/ActualiteDAO";
import { Button, Input, Upload, UploadProps } from "antd";
import "../../../style/AjoutModifActu.scss";
import { UploadOutlined } from "@ant-design/icons";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { useParams } from "react-router-dom";
import { useCustomNav } from "../../../utils/useCustomNav";
import ImageCompress from "quill-image-compress";
import { Helmet } from "react-helmet";
import { useAuth } from "../AuthContext";

if (!Quill.import("modules/imageCompress")) {
  Quill.register("modules/imageCompress", ImageCompress);
}
const ModifActu = () => {
  const [titre, setTitre] = useState("");
  const [resume, setResume] = useState("");
  const [contenu, setContenu] = useState("");
  const { showSuccess, showError, contextHolder } = useCustomNav();

  const editor = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const { id_actu } = useParams();
  const actuDAO = new ActualiteDAO();

  const [coverIMG, setCoverIMG] = useState<string>("");

  const { currentUser, admin } = useAuth();

  useEffect(() => {
    const getArticle = async () => {
      if (id_actu) {
        const actu = await actuDAO.getById(id_actu);
        setTitre(actu.titre);
        setResume(actu.resume);
        setContenu(actu.contenu);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = actu.contenu;
        }
      }
    };

    const getCover = async () => {
      if (id_actu) {
        const coverURL = await actuDAO.getCover(id_actu);
        if (coverURL !== "") setCoverIMG(coverURL);
      }
    };
    getArticle();
    getCover();
  }, []);

  useEffect(() => {
    if (editor.current && !quillRef.current) {
      quillRef.current = new Quill(editor.current, {
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

      quillRef.current.on("text-change", () => {
        setContenu(quillRef.current?.root.innerHTML || "");
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
        showError(`${file.name} n'est pas de type png / jpg`);
        return false;
      }
      if (file.size / 1024 > 4000) {
        showError(`${file.name} dépasse la taille limite de 4MB.`);
        return false;
      }
      setCover(file);
      return false;
    },
    onChange(info) {
      if (info.file.status === "error") {
        info.file.error.message = "Erreur lors du téléchargement";
        showError(`Erreur de modification du fichier ${info.file.name}.`);
      }
    },
    defaultFileList: [
      {
        uid: "1",
        name: "Image de présentation",
        status: "done",
        url: coverIMG,
      },
    ],
  };

  async function handleEdit() {
    const actu = new Actualite();
    actu.titre = titre;
    actu.resume = resume;
    actu.contenu = contenu;

    if (id_actu)
      try {
        await actuDAO.modifier(id_actu, actu);
        if (cover) {
          await actuDAO.suppCover(id_actu);
          await actuDAO.addInStorage(cover, id_actu);
        }
        showSuccess("Article modifié");
      } catch (error) {
        console.error(
          "Erreur lors de la modification de l'actualité et du fichier :",
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
          <title>Modifier une actualité</title>
        </Helmet>

        <NavBar />
        {contextHolder}
        <div className="container_actu">
          <h2>Modifier un article</h2>
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
          {coverIMG !== "" && (
            <div>
              <Upload {...props} listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>
                  Choisir une image de présentation
                </Button>
              </Upload>
            </div>
          )}
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
                ref={editor}
                style={{
                  minHeight: "100%",
                  height: "auto",
                  paddingTop: "50px",
                }}
              ></div>
            </div>
          </div>
          <Button type="primary" onClick={handleEdit}>
            Modifier l'article
          </Button>
        </div>
        <Footer />
      </>
    );
};
export default ModifActu;
