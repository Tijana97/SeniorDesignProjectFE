import { ReactNode, useEffect } from "react";
import styles from "./layout.module.css";
import Navbar, { currentPageName } from "../navbar/Navbar";
import React from "react";
import { useRecoilState } from "recoil";
import { appState } from "../../recoil/atom/general";
import { ScreenWrapper } from "../screenWrapper/ScreenWrapper";

interface ChildrenNode {
  children: ReactNode;
}

const Layout: React.FC<ChildrenNode> = ({ children }) => {
  const [title, setTitle] = useRecoilState(appState);

  useEffect(() => {
    setTitle(currentPageName());
  }, [setTitle]);

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.topnavWrapper}>
        <div style={{ flex: 1 }}></div>
        <Navbar />
      </div>
      <ScreenWrapper>
        <div className={styles.mainWrapper}>
          <div className={styles.contentWrapper}>
            <div> {children}</div>
          </div>
        </div>
      </ScreenWrapper>
    </div>
  );
};

export default Layout;
