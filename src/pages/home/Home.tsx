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
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import { Button, TextField } from "@mui/material";

const Home = () => {
  const [search, setSearch] = useState<string>("");
  const [tags, setTags] = useState<Array<string>>([]);
  const [dataList, setDataList] = useState([]);
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
          `https://seniordesignprojectbe.onrender.com/posts`,
          config
        );

        setDataList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTags = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((e) => e !== tag));
    } else {
      setTags((previous) => [...previous, tag]);
    }
    console.log("tags: ", tags);
  };

  const handleQuery = () => {
    var query = "?";
    for (const tag of tags) {
      query += "tags=" + tag + "&";
    }
    query = query.slice(0, -1);
    return query;
  };
  useEffect(() => {
    handleFilters();
  }, [tags]);

  const handleFilters = async () => {
    if (tags.length === 0 && search === "") {
      try {
        let config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };

        const response = await axios.get(
          `https://seniordesignprojectbe.onrender.com/posts`,
          config
        );

        setDataList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (tags.length > 0 && search === "") {
      const tagQuery = handleQuery();
      try {
        let config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };

        const response = await axios.get(
          `https://seniordesignprojectbe.onrender.com/posts/tags${tagQuery}`,
          config
        );

        setDataList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (tags.length === 0 && search !== "") {
      try {
        let config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };

        const response = await axios.get(
          `https://seniordesignprojectbe.onrender.com/posts/search/${search}`,
          config
        );

        setDataList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      const tagQuery = handleQuery();
      try {
        let config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };
        const response = await axios.get(
          `https://seniordesignprojectbe.onrender.com/posts/filter/${search}${tagQuery}`,
          config
        );
        setDataList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const defaultButtonStyle = {
    backgroundColor: "#e0e0e0", // Default color
    color: "#000000", // Default text color
    padding: "5px",
    margin: "5px",
  };

  const selectedButtonStyle = {
    backgroundColor: "#abedd8", // Selected color
    color: "#000000", // Selected text color
    padding: "5px",
    margin: "5px",
  };

  const handleShowMoreClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.searchWrapper}>
        <TextField
          label="Search for inspiration"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button style={selectedButtonStyle} onClick={() => handleFilters()}>
          SEARCH
        </Button>
      </div>
      <div className={styles.outerWrapper}>
        <div>
          <h4 className={styles.filterName}>Choose your interests</h4>
          <div className={styles.tagWrapper}>
            <Button
              style={
                tags.includes("Aesthetic")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Aesthetic")}
            >
              Aesthetic
            </Button>
            <Button
              style={
                tags.includes("Art") ? selectedButtonStyle : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Art")}
            >
              Art
            </Button>
            <Button
              style={
                tags.includes("Baking")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Baking")}
            >
              Baking
            </Button>
            <Button
              fullWidth
              style={
                tags.includes("Cooking")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              onClick={() => handleTags("Cooking")}
            >
              Cooking
            </Button>
            <Button
              style={
                tags.includes("DIY") ? selectedButtonStyle : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("DIY")}
            >
              DIY
            </Button>
            <Button
              style={
                tags.includes("Drawing")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Drawing")}
            >
              Drawing
            </Button>
            <Button
              style={
                tags.includes("Exterior Design")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Exterior Design")}
            >
              Exterior Design
            </Button>
            <Button
              style={
                tags.includes("Fashion")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Fashion")}
            >
              Fashion
            </Button>
            <Button
              style={
                tags.includes("Fitness")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Fitness")}
            >
              Fitness
            </Button>
            <Button
              style={
                tags.includes("Health")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Health")}
            >
              Health
            </Button>
            <Button
              style={
                tags.includes("Home Decor")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Home Decor")}
            >
              Home Decor
            </Button>
            <Button
              style={
                tags.includes("Interior Design")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Interior Design")}
            >
              Interior Design
            </Button>
            <Button
              style={
                tags.includes("Makeup")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Makeup")}
            >
              Makeup
            </Button>
            <Button
              style={
                tags.includes("Music")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Music")}
            >
              Music
            </Button>
            <Button
              style={
                tags.includes("Nature")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Nature")}
            >
              Nature
            </Button>
            <Button
              style={
                tags.includes("Painting")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Painting")}
            >
              Painting
            </Button>
            <Button
              style={
                tags.includes("Photography")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Photography")}
            >
              Photography
            </Button>
            <Button
              style={
                tags.includes("Recipes")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Recipes")}
            >
              Recipes
            </Button>
            <Button
              style={
                tags.includes("Style")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Style")}
            >
              Style
            </Button>
            <Button
              style={
                tags.includes("Writing")
                  ? selectedButtonStyle
                  : defaultButtonStyle
              }
              fullWidth
              onClick={() => handleTags("Writing")}
            >
              Writing
            </Button>
          </div>
        </div>
        <div className={styles.homeWrapper}>
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
              </MDBRipple>
              <MDBCardBody className={styles.cardBody}>
                <MDBCardTitle className={styles.cardTitle}>
                  {row.title}
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
                  }}
                >
                  Show More
                </Button>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
