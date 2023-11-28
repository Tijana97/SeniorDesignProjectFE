import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBRipple,
} from "mdb-react-ui-kit";
import axios from "axios";
import styles from "./home.module.css";
import { Button } from "@mui/material";

const Home = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };

        const response = await axios.get(`http://localhost:8080/posts`, config);

        setDataList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.homeWrapper}>
      {dataList.map((row: any) => (
        <MDBCard key={row.id} className={styles.cardWrapper}>
          <MDBRipple
            rippleColor="light"
            rippleTag="div"
            className="bg-image hover-overlay"
          >
            <MDBCardImage
              src={"http://127.0.0.1:8081/" + row.imageURL.slice(57)}
              fluid
              alt="..."
              className={styles.cardImage}
            />
            <a href={"http://127.0.0.1:8081/" + row.imageURL.slice(57)}>
              <div
                className="mask"
                style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
              ></div>
            </a>
          </MDBRipple>
          <MDBCardBody className={styles.cardBody}>
            <MDBCardTitle className={styles.cardTitle}>
              {row.title}
            </MDBCardTitle>
            <MDBCardText className={styles.cardText}>
              {row.description}
            </MDBCardText>
            <Button
              href={"http://127.0.0.1:8081/" + row.imageURL.slice(57)}
              style={{
                marginTop: "10px",
                color: "black",
                backgroundColor: "#abedd8",
                textDecoration: "none",
              }}
            >
              Show More
            </Button>
          </MDBCardBody>
        </MDBCard>
      ))}
    </div>
  );
};

export default Home;
