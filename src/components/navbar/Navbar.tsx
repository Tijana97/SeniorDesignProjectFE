import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import styles from "./navbar.module.css";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { appState } from "../../recoil/atom/general";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface DecodedToken extends JwtPayload {
  username: string;
}

export const currentPageName = () => {
  switch (window.location.pathname) {
    case "/home":
      return "Home";
    case "/board":
      return "My Board";
    case "/saved":
      return "My Inspiration";
    default:
      return "Home";
  }
};

function Navbar() {
  const token = localStorage.getItem("token");
  const data: DecodedToken = jwtDecode(token!);
  console.log("TOKEN: ", data);
  const user = data.username;
  const [page, setPage] = useRecoilState(appState);

  return (
    <div className={styles.navbarWrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.appTitle}>CreationCloud</div>
      </div>
      <div className={styles.listWrapper}>
        <Link
          className={
            currentPageName() === "Home"
              ? styles.linkStyleActive
              : styles.linkStyleInactive
          }
          to="/home"
          onClick={(e) => {
            setPage("Home");
          }}
        >
          Home
        </Link>
      </div>
      <div className={styles.listWrapper}>
        <Link
          className={
            currentPageName() === "My Board"
              ? styles.linkStyleActive
              : styles.linkStyleInactive
          }
          to="/board"
          onClick={(e) => {
            setPage("My Board");
          }}
        >
          Board
        </Link>
      </div>
      <div className={styles.listWrapper}>
        <Link
          className={
            currentPageName() === "My Inspiration"
              ? styles.linkStyleActive
              : styles.linkStyleInactive
          }
          to="/saved"
          onClick={(e) => {
            console.log("testbest Sidebar 1", page);
            setPage("My Inspiration");
          }}
        >
          Inspiration
        </Link>
      </div>
      <div className={styles.listWrapper}>
        <div className={styles.linkStyleInactive}>{user}</div>
        <Button>
          <LogoutIcon
            style={{ color: "black" }}
            onClick={() => {
              localStorage.removeItem("token");
              console.log("HERE");
              window.location.href = "/login";
            }}
          />
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
