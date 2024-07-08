import type { MenuProps } from "antd";
import "../../style/Administration.scss";
import { Button, Menu } from "antd";
import Footer from "./Footer";
import NavBar from "./NavBar";
import {
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { AdminUtilisateur } from "./AdminUtilisateur";
import AdminRecrutement from "./AdminRecrutement";
import AdminCandidature from "./AdminCandidature";
import AdministrationActualite from "./AdminActualite";

const Administration = () => {
  type MenuItem = Required<MenuProps>["items"][number];

  const [collapsed, setCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("1");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items: MenuItem[] = [
    {
      label: (
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{ marginBottom: 16 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      ),
      type: "group",
      key: "admin",
      children: [
        { key: "1", icon: <UserOutlined />, label: "Utilisateurs" },
        { key: "2", icon: <FileTextOutlined />, label: "Recrutement" },
        { key: "3", icon: <SolutionOutlined />, label: "Candidatures" },
        { key: "4", icon: <ReadOutlined />, label: "Actualité" },
      ],
    },
  ];

  const getMenu: MenuProps["onClick"] = (e) => {
    setCurrentMenu(e.key);
  };

  const affichageContenu = () => {
    switch (currentMenu) {
      case "1":
        return <AdminUtilisateur />;
      case "2":
        return <AdminRecrutement />;
      case "3":
        return <AdminCandidature />;
      case "4":
        return <AdministrationActualite />;
      default:
        return null;
    }
  };

  return (
    <>
      <NavBar />
      <div className="container_administration">
        <div className="container_menu_admin">
          <Menu
            className="menu_admin"
            onClick={getMenu}
            defaultSelectedKeys={["1"]}
            mode="inline"
            inlineCollapsed={windowWidth >= 992 ? collapsed : true}
            items={items}
          />
        </div>
        <div className="container_administration_tableau">
          {affichageContenu()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Administration;
