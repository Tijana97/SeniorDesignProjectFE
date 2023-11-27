import { ReactNode, useEffect } from "react";
import styles from "./layout.module.css";
import Navbar, { currentPageName } from "../navbar/Navbar";
import React from "react";
import { useRecoilState } from "recoil";
import { appState } from "../../recoil/atom/general";

interface ChildrenNode {
  children: ReactNode;
}

const Layout: React.FC<ChildrenNode> = ({ children }) => {
  console.log("I AM HERE");
  const [title, setTitle] = useRecoilState(appState);

  useEffect(() => {
    setTitle(currentPageName());
  }, [setTitle]);

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.topnavWrapper}>
        <Navbar />
      </div>
      <div className={styles.mainWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.titleWrapper}>{title}</div>
          <div> {children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
