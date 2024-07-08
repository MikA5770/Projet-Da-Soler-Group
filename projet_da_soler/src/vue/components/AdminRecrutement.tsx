import { useEffect, useRef, useState } from "react";
import { PosteDAO } from "../../modele/DAO/PosteDAO";
import { Poste } from "../../modele/class/Poste";
import {
  Button,
  Empty,
  Input,
  InputRef,
  message,
  Modal,
  Space,
  Table,
  TableColumnType,
  TableProps,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import TextArea from "antd/es/input/TextArea";

function AdminRecrutement() {
  const posteDAO = new PosteDAO();

  const [annonce, setAnnonce] = useState<Poste[]>([]);

  const refreshDelete = (id: React.Key) => {
    const newData = annonce.filter((item: any) => item.id_poste !== id);
    setAnnonce(newData);
  };

  const refreshAdd = async (newItem: Poste) => {
    setAnnonce((prevAnnonce) => [...prevAnnonce, newItem]);
  };

  const refreshEdit = (editedItem: Poste) => {
    const index = annonce.findIndex((item) => {
      return item.id_poste === editedItem.id_poste;
    });
    if (index !== -1) {
      const newData = [...annonce];
      newData[index] = editedItem;
      setAnnonce(newData);
    }
  };

  useEffect(() => {
    const getPoste = async () => {
      const postes = await posteDAO.getAll();
      setAnnonce(postes);
    };

    getPoste();
  }, []);

  type DataIndex = keyof Poste;

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
    dataIndex: DataIndex
  ): TableColumnType<Poste> => ({
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
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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

  const [messageApi, contextHolder] = message.useMessage();

  const success = (content: string) => {
    messageApi.open({
      type: "success",
      content: content,
    });
  };

  const info = (id_poste: string) => {
    const posteSelected = annonce.find((poste) => poste.id_poste === id_poste);
    {
      posteSelected
        ? Modal.info({
            title: `Informations sur le poste : ${posteSelected.libelle}`,
            width: "80vw",
            content: (
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: "1" }}>
                    <p>Libellé :</p>
                    <Input
                      placeholder="Titre du poste"
                      style={{ color: "grey", cursor: "default" }}
                      defaultValue={posteSelected.libelle}
                      disabled={true}
                    />
                  </div>
                  <div style={{ flex: "1", margin: "0 20px" }}>
                    <p>Type :</p>
                    <Input
                      placeholder="CDI, Alternance..."
                      style={{ color: "grey", cursor: "default" }}
                      defaultValue={posteSelected.type}
                      disabled={true}
                    />
                  </div>
                  <div style={{ flex: "1" }}>
                    <p>Lieu :</p>
                    <Input
                      placeholder="Lieu du poste"
                      style={{ color: "grey", cursor: "default" }}
                      defaultValue={posteSelected.lieu}
                      disabled={true}
                    />
                  </div>
                </div>
                <p>Missions :sfqsfd</p>
                <TextArea
                  style={{
                    whiteSpace: "pre-wrap",
                    color: "grey",
                    cursor: "default",
                    overflow: "auto",
                    resize: "none",
                    height: "200px",
                  }}
                  defaultValue={posteSelected.missions}
                  disabled={true}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
                <p>Compétences :</p>
                <TextArea
                  style={{
                    whiteSpace: "pre-wrap",
                    color: "grey",
                    cursor: "default",
                  }}
                  defaultValue={posteSelected.competences}
                  disabled={true}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </div>
            ),
            okText: "Fermer",
            onOk() {},
          })
        : "";
    }
  };

  const columns: TableProps["columns"] = [
    {
      title: "Titre",
      dataIndex: "libelle",
      key: "libelle",
      ...getColumnSearchProps("libelle"),
      sorter: (a, b) => a.libelle.localeCompare(b.libelle),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      showSorterTooltip: { target: "full-header" },
      onFilter: (value, record) => record.type.indexOf(value as string) === 0,
      sortDirections: ["descend"],
      filters: [
        {
          text: "CDI",
          value: "CDI",
        },
        {
          text: "CDD",
          value: "CDD",
        },
        {
          text: "Interim",
          value: "Interim",
        },
        {
          text: "Alternance",
          value: "Alternance",
        },
        {
          text: "Stage",
          value: "Stage",
        },
      ],
    },
    {
      title: "Date de publication",
      dataIndex: "datePublication",
      key: "datePublication",
      ...getColumnSearchProps("datePublication"),
      sorter: (a, b) => a.datePublication.localeCompare(b.datePublication),
      responsive: ["md"],
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
              <InfoCircleOutlined onClick={() => info(record.id_poste)} />
            </a>
            <a>
              <DeleteOutlined
                onClick={() => showDeleteConfirm(record.id_poste)}
              />
            </a>

            <a>
              <EditOutlined onClick={() => showEdit(record.id_poste)} />
            </a>
          </Space>
        </div>
      ),
    },
  ];

  const label = {
    triggerAsc: "Trier par ordre croissant",
    triggerDesc: "Trier par ordre décroissant",
    cancelSort: "Annuler le tri ",
    emptyText: (
      <Empty
        description="Aucune donnée trouvée"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    ),
  };
  const { confirm } = Modal;

  const addPoste = async (
    libelle: string,
    type: string,
    lieu: string,
    missions: string,
    competences: string
  ) => {
    try {
      const poste = new Poste();
      poste.libelle = libelle;
      poste.type = type;
      poste.lieu = lieu;
      poste.missions = missions;
      poste.competences = competences;
      poste.datePublication = new Date().toLocaleDateString();
      const id = await posteDAO.add(poste);
      poste.id_poste = id;
      success("Poste ajouté avec succès !");
      refreshAdd(poste);
    } catch (error) {
      console.error("Erreur lors de l'ajout du poste:", error);
    }
  };

  const showAdd = () => {
    let libelle: string;
    let type: string;
    let lieu: string;
    let competences: string;
    let missions: string;
    Modal.confirm({
      title: "Ajouter un poste",
      content: (
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: "1" }}>
              <p>Libellé :</p>
              <Input
                placeholder="Titre du poste"
                onChange={(e) => (libelle = e.target.value)}
              />
            </div>
            <div style={{ flex: "1", margin: "0 20px" }}>
              <p>Type :</p>
              <Input
                placeholder="CDI, Alternance..."
                onChange={(e) => (type = e.target.value)}
              />
            </div>
            <div style={{ flex: "1" }}>
              <p>Lieu :</p>
              <Input
                placeholder="Lieu du poste"
                onChange={(e) => (lieu = e.target.value)}
              />
            </div>
          </div>
          <p>Missions :</p>
          <TextArea
            style={{ whiteSpace: "pre-wrap" }}
            onChange={(e) => (missions = e.target.value)}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
          <p>Compétences :</p>
          <TextArea
            style={{ whiteSpace: "pre-wrap" }}
            onChange={(e) => (competences = e.target.value)}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </div>
      ),
      okText: "Ajouter",
      cancelText: "Annuler",
      width: "80vw",
      onOk() {
        addPoste(libelle, type, lieu, missions, competences);
      },
      onCancel() {},
    });
  };

  const showEdit = (id_poste: string) => {
    const posteSelected = annonce.find((poste) => poste.id_poste === id_poste);
    if (posteSelected) {
      let {
        id_poste,
        libelle,
        type,
        lieu,
        missions,
        competences,
        datePublication,
      } = posteSelected;

      Modal.confirm({
        title: `Modifier le poste : ${libelle}`,
        content: (
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1" }}>
                <p>Libellé :</p>
                <Input
                  placeholder="Titre du poste"
                  defaultValue={libelle}
                  onChange={(e) => (libelle = e.target.value)}
                />
              </div>
              <div style={{ flex: "1", margin: "0 20px" }}>
                <p>Type :</p>
                <Input
                  placeholder="CDI, Alternance..."
                  defaultValue={type}
                  onChange={(e) => (type = e.target.value)}
                />
              </div>
              <div style={{ flex: "1" }}>
                <p>Lieu :</p>
                <Input
                  placeholder="Lieu du poste"
                  defaultValue={lieu}
                  onChange={(e) => (lieu = e.target.value)}
                />
              </div>
            </div>
            <p>Missions :</p>
            <TextArea
              style={{ whiteSpace: "pre-wrap" }}
              defaultValue={missions}
              onChange={(e) => (missions = e.target.value)}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
            <p>Compétences :</p>
            <TextArea
              style={{ whiteSpace: "pre-wrap" }}
              defaultValue={competences}
              onChange={(e) => (competences = e.target.value)}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </div>
        ),
        okText: "Modifier",
        cancelText: "Annuler",
        width: "80vw",
        onOk() {
          handleEdit(
            id_poste,
            libelle,
            type,
            lieu,
            missions,
            competences,
            datePublication
          );
        },
        onCancel() {},
      });
    }
  };

  const handleEdit = async (
    id_poste: string,
    libelle: string,
    type: string,
    lieu: string,
    missions: string,
    competences: string,
    datePublication: string
  ) => {
    try {
      let poste = new Poste();
      poste.id_poste = id_poste;
      poste.libelle = libelle;
      poste.type = type;
      poste.lieu = lieu;
      poste.missions = missions;
      poste.competences = competences;
      poste.datePublication = datePublication;
      await posteDAO.modifier(id_poste, poste);
      success("Poste modifié avec succès !");

      refreshEdit(poste);
    } catch (e: any) {
      console.log(e);
    }
  };
  const showDeleteConfirm = (id_poste: string) => {
    confirm({
      title: "Etes-vous sûr de supprimer le poste ?",
      icon: <ExclamationCircleFilled />,
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        suppPoste(id_poste);
      },
    });
  };
  const suppPoste = async (id: string) => {
    try {
      await posteDAO.supprimer(id);
      success("Poste supprimé avec succès !");

      refreshDelete(id);
    } catch (error) {
      console.error("Erreur lors de la suppression du poste:", error);
    }
  };

  return (
    <>
      <div>
        {contextHolder}

        <div style={{ marginBottom: "30px" }}>
          <Button
            size="large"
            style={{
              display: "flex",
              alignItems: "center",
            }}
            type="primary"
            onClick={showAdd}
          >
            <PlusCircleOutlined style={{ fontSize: "20px" }} />
            <span>Ajouter un poste</span>
          </Button>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={annonce}
            rowKey={(record) => record.id_poste}
            locale={label}
            pagination={{ position: ["bottomCenter"] }}
          />
        </div>
      </div>
    </>
  );
}

export default AdminRecrutement;
