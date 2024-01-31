import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBRipple,
} from "mdb-react-ui-kit";
import axios from "axios";
import styles from "./saved.module.css";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface DecodedToken extends JwtPayload {
  _id: string;
}
interface PostData {
  _id: string;
  title: string;
  description: string;
  imageURL: string;
  tags: string[];
  userId: string;
  hasLiked: boolean;
  isInspired: boolean;
  creationDate: string;
  userFirstName: string;
  userLastName: string;
}

const Saved = () => {
  const [dataList, setDataList] = useState<PostData[]>([]);
  const token = localStorage.getItem("token");
  const data: DecodedToken = jwtDecode(token!);
  const userId = data._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };
        const response = await axios.get(
          `https://seniordesignprojectbe.onrender.com/inspirations/${userId}`,
          config
        );

        setDataList(response.data);
        console.log("DATA: ", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);
  const handleShowMoreClick = (postId: string) => {
    console.log("MOJ ID: ", postId);
    navigate(`/post/${postId}`);
  };

  const handleRemove = async (postId: string) => {
    try {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      await axios.delete(
        `https://seniordesignprojectbe.onrender.com/inspirations/${userId}/${postId}`,
        config
      );
      setDataList((prevDataList) =>
        prevDataList.filter((post) => post._id !== postId)
      );
      console.log("MOJA DATA: ", dataList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div className={styles.boardWrapper}>
        {dataList.map((row: any) => (
          <MDBCard key={row.id} className={styles.cardWrapper}>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image hover-overlay"
            >
              <MDBCardImage
                src={row.imageURL}
                fluid
                alt="..."
                className={styles.cardImage}
              />
              <a href={row.imageURL}>
                <div
                  className="mask"
                  style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                ></div>
              </a>
            </MDBRipple>
            <MDBCardBody className={styles.cardBody}>
              <MDBCardTitle className={styles.cardTitle}>
                {row.title}
                {row.id}
              </MDBCardTitle>
              <MDBCardText className={styles.cardText}>
                {row.description}
              </MDBCardText>
              <Button
                onClick={() => handleShowMoreClick(row._id)}
                style={{
                  marginTop: "10px",
                  color: "black",
                  backgroundColor: "#abedd8",
                  textDecoration: "none",
                  marginRight: "10px",
                }}
              >
                Show More
              </Button>
              <Button
                style={{
                  marginTop: "10px",
                  color: "black",
                  backgroundColor: "#abedd8",
                  textDecoration: "none",
                }}
                onClick={() => handleRemove(row._id)}
              >
                Remove
              </Button>
            </MDBCardBody>
          </MDBCard>
        ))}
      </div>
    </div>
  );
};

export default Saved;
