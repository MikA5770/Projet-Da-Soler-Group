import { useEffect, useRef, useState } from "react";
import { UtilisateurDAO } from "../../../modele/DAO/UtilisateurDAO";
import {
  Button,
  Empty,
  Input,
  InputRef,
  Modal,
  Space,
  Spin,
  Table,
  TableColumnType,
  TableProps,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  UserAddOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
  SearchOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import { Utilisateur } from "../../../modele/class/Utilisateur";
import { useCustomNav } from "../../../utils/useCustomNav";

export const AdminUtilisateur = () => {
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const userDAO = new UtilisateurDAO();
  const { showSuccess, contextHolder } = useCustomNav();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const info = await userDAO.getAll();
      setUsers(info);
      setLoading(false);
    }
    fetchData();
  }, []);

  const { confirm } = Modal;

  const updateUserRole = (id: string, isAdmin: boolean) => {
    setUsers(
      (prevUsers) =>
        prevUsers.map((user) =>
          user.id_user === id ? { ...user, estAdmin: isAdmin } : user
        ) as Utilisateur[]
    );
  };
  const giveAdmin = (id: string) => {
    userDAO.toAdmin(id).then(() => {
      showSuccess("Le rôle d'administrateur a été attribué");
      updateUserRole(id, true);
    });
  };
  const removeAdmin = (id: string) => {
    userDAO.removeAdmin(id).then(() => {
      showSuccess("Le rôle d'administrateur a été retiré");
      updateUserRole(id, false);
    });
  };

  const showConfirm = (id: string) => {
    confirm({
      title:
        "Etes-vous sûr de vouloir attribuer les permissions d'administrateur à cet utilisateur ?",
      icon: <ExclamationCircleFilled />,
      okText: "Attribuer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        giveAdmin(id);
      },
    });
  };
  const showRemove = (id: string) => {
    confirm({
      title:
        "Etes-vous sûr de vouloir enlever les permissions d'administrateur à cet utilisateur ?",
      icon: <ExclamationCircleFilled />,
      okText: "Enlever",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        removeAdmin(id);
      },
    });
  };

  type DataIndex = keyof Utilisateur;

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

  const info = (id_user: string) => {
    const userSelected = users.find((user) => user.id_user === id_user);
    {
      userSelected
        ? Modal.info({
            title: `Informations sur ${userSelected.nom} ${userSelected.prenom}`,
            content: (
              <div>
                <p>ID : {id_user}</p>
                <p>
                  Nom complet : {userSelected.nom} {userSelected.prenom}
                </p>
                <p>Age : {userSelected.age}</p>
                <p>Email : {userSelected.email}</p>
                <p>Téléphone : {userSelected.telephone}</p>
                <p>Date d'inscription : {userSelected.dateInscription}</p>
              </div>
            ),
            okText: "Fermer",
            onOk() {},
          })
        : "";
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<Utilisateur> => ({
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
          placeholder={`Rechercher`}
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
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      ...getColumnSearchProps("nom"),
      sorter: (a, b) => a.nom.length - b.nom.length,
    },
    {
      title: "Prénom",
      dataIndex: "prenom",
      key: "prenom",
      ...getColumnSearchProps("prenom"),
      sorter: (a, b) => a.prenom.length - b.prenom.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.length - b.email.length,
      responsive: ["md"],
    },
    {
      title: "Administrateur",
      dataIndex: "estAdmin",
      key: "estAdmin",
      render: (isAdmin) => (isAdmin ? "Administrateur" : "Visiteur"),
      responsive: ["lg"],

      filters: [
        {
          text: "Administrateur",
          value: true,
        },
        {
          text: "Visiteur",
          value: false,
        },
      ],
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const user = users.find((user) => user.id_user === record.id_user);

        return (
          <Space size="middle" style={{ fontSize: "1.5rem" }}>
            <a>
              <InfoCircleOutlined onClick={() => info(record.id_user)} />
            </a>
            <a>
              {!user || user.estAdmin ? (
                <UserDeleteOutlined
                  onClick={() => showRemove(record.id_user)}
                />
              ) : (
                <UserAddOutlined onClick={() => showConfirm(record.id_user)} />
              )}
            </a>
          </Space>
        );
      },
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

  if (loading) {
    return (
      <div className="loading">
        <Spin tip="Chargement" size="large">
          <div></div>
        </Spin>
      </div>
    );
  }

  return (
    <div>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record.id_user}
        locale={label}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
};
