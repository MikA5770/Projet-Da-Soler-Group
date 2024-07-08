import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Actualite } from "../../modele/class/Actualite";
import { ActualiteDAO } from "../../modele/DAO/ActualiteDAO";
import { Button, Input, message, Upload, UploadProps } from "antd";
import "../../style/AjoutActu.scss";
import Quill from "quill";
import ImageCompress from "quill-image-compress";
import { UploadOutlined } from "@ant-design/icons";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useParams } from "react-router-dom";

const ModifActu = () => {
  <NavBar />;

  const [titre, setTitre] = useState("");
  const [resume, setResume] = useState("");
  const [contenu, setContent] = useState("");
  const [article, setArticle] = useState<Actualite>();

  const { id_actu } = useParams();
  const actuDAO = new ActualiteDAO();
  const editorRef = useRef<HTMLDivElement>(null);
  // const [error, setError] = useState(false);
  // const [errorSize, setErrorSize] = useState(false);
  // const [errorType, setErrorType] = useState(false);

  useEffect(() => {
    const getArticle = async () => {
      if (id_actu) {
        const actu = await actuDAO.getById(id_actu);
        setArticle(actu);
      }
    };

    getArticle();

    if (editorRef.current) {
      Quill.register("modules/imageCompress", ImageCompress);

      const quill = new Quill(editorRef.current, {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote"],
            ["link"],
            ["image", "video"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
          ],
          imageCompress: {
            quality: 0.8,
            maxWidth: 600,
            imageType: "image/png" || "image/jpeg",
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
        // setErrorType(true);
        message.error(`${file.name} n'est pas de type png / jpg`);
        return true;
      }
      if (file.size / 1024 > 4000) {
        // setErrorSize(true);
        message.error(`${file.name} dépasse la taille limite de 4MB.`);
        return true;
      }
      // setErrorType(false);
      // setErrorSize(false);
      setCover(file);
      return false;
    },
    onChange(info) {
      if (info.file.status === "error") {
        message.error(`Erreur d'ajout du fichier ${info.file.name}.`);
      }
    },
  };

  async function handleAdd() {
    const actu = new Actualite();

    actu.titre = titre;
    actu.resume = resume;
    actu.contenu = contenu;
    actu.datePublication = new Date().toLocaleDateString();
    if (cover)
      try {
        const docId = await actuDAO.add(actu);
        await actuDAO.addInStorage(cover, docId);
        alert("Article ajouté");
      } catch (error) {
        console.error(
          "Erreur lors de l'ajout de l'actualité et du fichier :",
          error
        );
      }
  }
  if (article)
    return (
      <>
        <NavBar />
        <div className="container_actu">
          <h2>Modifier un article</h2>

          <div className="input_actu">
            <Input
              placeholder="Titre"
              defaultValue={article.titre}
              onChange={(e) => setTitre(e.target.value)}
            />
          </div>
          <div className="input_actu">
            <Input
              placeholder="Résumé"
              defaultValue={article.resume}
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
          <div className="container_content_actu">
            <div className="content_actu" ref={editorRef}>
              <ReactQuill
                modules={{ toolbar: true }}
                theme="snow"
                defaultValue={article.contenu}
                onChange={setContent}
              />
            </div>
          </div>
          <Button type="primary" onClick={handleAdd}>
            Modifier l'article
          </Button>
        </div>
        <Footer />
      </>
    );
};

export default ModifActu;
