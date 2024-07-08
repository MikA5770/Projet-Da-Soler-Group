import { useEffect, useRef, useState } from "react";
import { ActualiteDAO } from "../../modele/DAO/ActualiteDAO";
import { Actualite } from "../../modele/class/Actualite";
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
import { useNavigate } from "react-router-dom";

function AdminActualite() {
  const actuDAO = new ActualiteDAO();

  const [article, setArticle] = useState<Actualite[]>([]);
  const nav = useNavigate();

  const refreshDelete = (id: React.Key) => {
    const newData = article.filter((item: any) => item.id_actu !== id);
    setArticle(newData);
  };

  useEffect(() => {
    const getActus = async () => {
      const articles = await actuDAO.getAll();
      setArticle(articles);
    };

    getActus();
  }, []);

  type DataIndex = keyof Actualite;

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
  ): TableColumnType<Actualite> => ({
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

  const columns: TableProps["columns"] = [
    {
      title: "Titre",
      dataIndex: "titre",
      key: "titre",
      ...getColumnSearchProps("titre"),
      sorter: (a, b) => a.titre.localeCompare(b.libelle),
    },
    {
      title: "Date de publication",
      dataIndex: "datePublication",
      key: "datePublication",
      ...getColumnSearchProps("datePublication"),
      sorter: (a, b) => a.datePublication.localeCompare(b.datePublication),
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
                onClick={() => nav(`/actualite/${record.id_actu}`)}
              />
            </a>
            <a>
              <DeleteOutlined
                onClick={() => showDeleteConfirm(record.id_actu)}
              />
            </a>

            <a>
              <EditOutlined
                onClick={() => nav(`/actualite/modifier/${record.id_actu}`)}
              />
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

  const showDeleteConfirm = (id_actu: string) => {
    confirm({
      title: "Etes-vous sûr de supprimer l'article ?",
      icon: <ExclamationCircleFilled />,
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        suppActualite(id_actu);
      },
    });
  };
  const suppActualite = async (id: string) => {
    try {
      await actuDAO.supprimer(id);
      success("Actualite supprimé avec succès !");
      refreshDelete(id);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
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
            onClick={() => nav("/actualite/ajout")}
          >
            <PlusCircleOutlined style={{ fontSize: "20px" }} />
            <span>Ajouter un article</span>
          </Button>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={article}
            rowKey={(record) => record.id_actu}
            locale={label}
            pagination={{ position: ["bottomCenter"] }}
          />
        </div>
      </div>
    </>
  );
}

export default AdminActualite;
