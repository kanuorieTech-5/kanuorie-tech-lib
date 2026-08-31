import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  /* =========================
      GLOBAL LOADING
  ========================= */

  const [loading, setLoading] = useState(false);

  /* =========================
      SIDEBAR
  ========================= */

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================
      SEARCH
  ========================= */

  const [search, setSearch] = useState("");

  /* =========================
      GLOBAL MODAL
  ========================= */

  const [modal, setModal] = useState({
    open: false,
    title: "",
    content: null,
  });

  /* =========================
      PAGE TITLE
  ========================= */

  const [pageTitle, setPageTitle] = useState("");

  /* =========================
      DRAWER
  ========================= */

  const openSidebar = () => setSidebarOpen(true);

  const closeSidebar = () => setSidebarOpen(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  /* =========================
      MODAL
  ========================= */

  const openModal = (title, content) => {
    setModal({
      open: true,
      title,
      content,
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      title: "",
      content: null,
    });
  };

  /* =========================
      MEMO
  ========================= */

  const value = useMemo(
    () => ({
      loading,
      setLoading,

      sidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,

      search,
      setSearch,

      modal,
      openModal,
      closeModal,

      pageTitle,
      setPageTitle,
    }),
    [loading, sidebarOpen, search, modal, pageTitle],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

export default AppContext;
