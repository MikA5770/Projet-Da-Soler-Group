import { useEffect, useRef, useState } from "react";
import { CandidatureDAO } from "../../modele/DAO/CandidatureDAO";
import {
  Button,
  Empty,
  Input,
  InputRef,
  Modal,
  Space,
  Table,
  TableColumnType,
  TableProps,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import {
  DownloadOutlined,
  FileOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { UtilisateurDAO } from "../../modele/DAO/UtilisateurDAO";
import { PosteDAO } from "../../modele/DAO/PosteDAO";

const AdminCandidature = () => {
  const [loading, setLoading] = useState(true);
  const candidatureDAO = new CandidatureDAO();
  const posteDAO = new PosteDAO();
  const utilisateurDAO = new UtilisateurDAO();
  const [libellePoste, setLibellePoste] = useState<string[]>([]);

  useEffect(() => {
    const fetchCandidatures = async () => {
      const lesCandidatures = await candidatureDAO.getAllCandidature();
      const infoCandidatures = await Promise.all(
        lesCandidatures.map(async (candidature) => {
          const poste = await posteDAO.getById(candidature.id_poste);
          setLibellePoste((prevLibellePoste) => [
            ...prevLibellePoste,
            poste.libelle,
          ]);
          const utilisateur = await utilisateurDAO.getById(candidature.id_user);
          return {
            id_cand: candidature.id_cand,
            id_user: candidature.id_user,
            id_poste: candidature.id_poste,
            libelle_poste: poste.libelle,
            nomComplet: utilisateur.nom + " " + utilisateur.prenom,
            telephone: utilisateur.telephone,
            email: utilisateur.email,
            dateCandidature: candidature.dateCandidature,
            fichiers: await getFiles(candidature.id_cand),
          };
        })
      );
      setDataCandidature(infoCandidatures);
      setLoading(false);
    };
    fetchCandidatures();
  }, []);

  const getFiles = async (id_cand: string) => {
    const files = await candidatureDAO.getFichiersByIdCandidature(id_cand);
    return files;
  };

  type DataIndex = keyof DataCand;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    colonne: string
  ): TableColumnType<DataCand> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={
            colonne === "date" ? "Rechercher par date" : "Rechercher par nom"
          }
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Chercher
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Réinitialiser
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Fermer
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableProps["columns"] = [
    {
      title: "Nom du poste",
      dataIndex: "libelle_poste",
      key: "libelle_poste",
      filters: libellePoste.map((poste) => {
        return { text: poste, value: poste };
      }),
      onFilter: (value, record) =>
        record.libelle_poste.startsWith(value as string),
      filterSearch: true,
    },
    {
      title: "Nom complet",
      dataIndex: "nomComplet",
      key: "nomComplet",
      ...getColumnSearchProps("nomComplet", "nom"),
    },
    {
      title: "Date de candidature",
      dataIndex: "dateCandidature",
      key: "dateCandidature",
      ...getColumnSearchProps("dateCandidature", "date"),
      responsive:["md"]
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div>
          <Space
            size="middle"
            style={{ fontSize: "1.3rem", cursor: "pointer" }}
          >
            <a>
              <InfoCircleOutlined
                onClick={() => infoCandidature(record.id_cand)}
              />
            </a>
            <a>
              <FileOutlined onClick={() => files(record.id_cand)} />
            </a>
          </Space>
        </div>
      ),
    },
  ];

  const files = (id_cand: string) => {
    const candidatureSelected = dataCandidatures.find(
      (candidature) => candidature.id_cand === id_cand
    );
    const cv = candidatureSelected?.fichiers[0];
    const lm = candidatureSelected?.fichiers[1];

    {
      candidatureSelected
        ? Modal.info({
            width: 1000,
            centered: true,
            content: (
              <div>
                <div>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      marginBottom: "10px",
                    }}
                  >
                    <div>Informations sur le CV :</div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1rem",
                        marginBottom: "5px",
                        width: "50%",
                      }}
                    >
                      <div
                        style={{
                          textDecoration: "underline",
                          fontSize: "0.8rem",
                        }}
                      >
                        Nom du fichier :
                      </div>
                      <a href={cv.fichier}>
                        {cv.nom} <DownloadOutlined />
                      </a>
                    </div>

                    <div
                      style={{
                        fontSize: "1rem",
                        marginBottom: "5px",
                        width: "20%",
                      }}
                    >
                      <div
                        style={{
                          textDecoration: "underline",
                          fontSize: "0.8rem",
                        }}
                      >
                        Type de fichier :
                      </div>
                      {cv.type}
                    </div>

                    <div
                      style={{
                        fontSize: "1rem",
                        marginBottom: "5px",
                        width: "20%",
                      }}
                    >
                      <div
                        style={{
                          textDecoration: "underline",
                          fontSize: "0.8rem",
                        }}
                      >
                        Date de mise en ligne :
                      </div>
                      {cv.datePostulation} à {cv.heurePostulation}
                    </div>

                    <div
                      style={{
                        fontSize: "1rem",
                        marginBottom: "5px",
                        width: "20%",
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          textDecoration: "underline",
                          fontSize: "0.8rem",
                        }}
                      >
                        Taille du fichier :
                      </div>
                      {cv.taille < 1
                        ? `${Math.round(cv.taille * 1000)} Ko`
                        : `${Math.round(cv.taille * 100) / 100} Mo`}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "1rem",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        textDecoration: "underline",
                        fontSize: "0.8rem",
                      }}
                    >
                      Chemin dans la base de données :
                    </div>
                    {cv.chemin}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      margin: "40px 0 10px 0",
                    }}
                  >
                    <div>Informations sur la lettre de motivation :</div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1rem",
                        marginBottom: "5px",
                        width: "50%",
                      }}
                    >
                      <div
                        style={{
                          textDecoration: "underline",
                          fontSize: "0.8rem",
                        }}
                      >
                        Nom du fichier :
                      </div>
                      <a href={lm.fichier}>
                        {lm.nom} <DownloadOutlined />
                      </a>
                    </div>

                    <div
                      style={{
                        fontSize: "1rem",
                        marginBottom: "5px",
                        width: "20%",
                      }}
                    >
                      <div
                        style={{
                          textDecoration: "underline",
                          fontSize: "0.8rem",
                        }}
                      >
                        Type de fichier :
                      </div>
                      {lm.type}
                    </div>

                    <div
                      style={{
                        fontSize: "1rem",
                        marginBottom: "5px",
                        width: "20%",
                      }}
                    >
                      <div
                        style={{
                          textDecoration: "underline",
                          fontSize: "0.8rem",
                        }}
                      >
                        Date de mise en ligne :
                      </div>
                      {lm.datePostulation} à {lm.heurePostulation}
                    </div>

                    <div
                      style={{
                        fontSize: "1rem",
                        marginBottom: "5px",
                        width: "20%",
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          textDecoration: "underline",
                          fontSize: "0.8rem",
                        }}
                      >
                        Taille du fichier :
                      </div>
                      {lm.taille < 1
                        ? `${Math.round(lm.taille * 1000)} Ko`
                        : `${Math.round(lm.taille * 100) / 100} Mo`}
                    </div>
                  </div>

                  <div style={{ fontSize: "1rem", marginTop: "10px" }}>
                    <div
                      style={{
                        textDecoration: "underline",
                        fontSize: "0.8rem",
                      }}
                    >
                      Chemin dans la base de données :
                    </div>
                    {lm.chemin}
                  </div>
                </div>
              </div>
            ),
            okText: "Fermer",
            onOk() {},
          })
        : "";
    }
  };

  const infoCandidature = (id_cand: string) => {
    const candidatureSelected = dataCandidatures.find(
      (candidature) => candidature.id_cand === id_cand
    );
    {
      candidatureSelected
        ? Modal.info({
            title: `Informations sur la candidature de ${candidatureSelected.nomComplet} pour le poste de ${candidatureSelected.libelle_poste}`,
            content: (
              <div>
                <p>
                  Référence de la candidature : {candidatureSelected.id_cand}
                </p>
                <p>Postulant : {candidatureSelected.nomComplet}</p>
                <p>
                  Date de postulation : {candidatureSelected.dateCandidature}
                </p>
                <p>Email : {candidatureSelected.email}</p>
                <p>Téléphone : {candidatureSelected.telephone}</p>
              </div>
            ),
            okText: "Fermer",
            onOk() {},
          })
        : "";
    }
  };

  const [dataCandidatures, setDataCandidature] = useState<DataCand[]>([]);

  interface DataCand {
    id_cand: string;
    id_poste: string;
    id_user: string;
    libelle_poste: string;
    nomComplet: string;
    telephone: string;
    email: string;
    dateCandidature: string;
    fichiers: Array<any>;
  }

  if (loading) {
    return <div>CHARGEMENT</div>;
  }

  return (
    <>
      <div>
        <Table
          columns={columns}
          dataSource={dataCandidatures}
          rowKey={(record) => record.id_cand}
          pagination={{ position: ["bottomCenter"] }}
          locale={{
            emptyText: (
              <Empty
                description="Aucune donnée trouvée"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
            filterSearchPlaceholder: "Rechercher un poste",
            filterConfirm: "Rechercher",
            filterReset: "Réinitialiser",
          }}
        />
      </div>
    </>
  );
};

export default AdminCandidature;
