import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBRipple,
} from "mdb-react-ui-kit";
import axios from "axios";
import styles from "./board.module.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface DecodedToken extends JwtPayload {
  _id: string;
}

const Board = () => {
  const [dataList, setDataList] = useState<PostData[]>([]);
  const token = localStorage.getItem("token");
  const data: DecodedToken = jwtDecode(token!);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<Array<string>>([]);
  const [image, setImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [emptyFieldError, setEmptyFieldError] = useState<string>("");
  const [postError, setPostError] = useState<string>("");
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = data._id;

  interface PostData {
    _id: string;
    title: string;
    description: string;
    imageURL: string;
    tags: string[];
    userId: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };
        const response = await axios.get(
          `https://seniordesignprojectbe.onrender.com/posts/user/${userId}`,
          config
        );

        setDataList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const defaultButtonStyle = {
    backgroundColor: "#e0e0e0", // Default color
    color: "#000000", // Default text color
  };

  const selectedButtonStyle = {
    backgroundColor: "#abedd8", // Selected color
    color: "#000000", // Selected text color
  };

  const handleTags = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((e) => e !== tag));
      if (counter > 0) {
        setCounter(counter - 1);
      }
    } else {
      setTags((previous) => [...previous, tag]);
      setCounter(counter + 1);
    }
    console.log("tags: ", tags);
    console.log("counter: ", counter);
  };
  const handleShowMoreClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleDelete = async (postId: string) => {
    try {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      await axios.delete(
        `https://seniordesignprojectbe.onrender.com/posts/${postId}`,
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

  const handleCreatePost = async () => {
    // Check for empty fields
    if (title === "" || description === "" || image === null) {
      setEmptyFieldError("Please fill out all fields.");
      return;
    } else {
      setEmptyFieldError("");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile-file", image!);
      formData.append("userId", userId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags.join(",")); // Assuming tags is an array of strings

      const response = await axios.post(
        "https://seniordesignprojectbe.onrender.com/profile-upload-single",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle the response as needed (e.g., show a success message)
      console.log("Post created successfully:", response.data);

      // Close the dialog or reset form fields, if needed
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setTags([]);
      setImage(null);

      window.location.reload();
      setLoading(false);
    } catch (error) {
      setPostError("The post could not be created, please try again.");
      setLoading(false);
      console.error("Error creating post:", error);
      // Handle the error (e.g., show an error message)
    }
  };

  return (
    <div>
      <div>
        <Button
          onClick={() => setIsOpen(true)}
          style={{
            marginTop: "10px",
            color: "black",
            backgroundColor: "#abedd8",
            textDecoration: "none",
          }}
        >
          New Post
        </Button>
        <Dialog
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setTags([]);
            setCounter(0);
            setImage(null);
            setTitle("");
            setDescription("");
          }}
        >
          <DialogTitle>New Post</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                Choose the tags (up to three):
                <div className={styles.tagModule}>
                  <Button
                    style={
                      tags.includes("Aesthetic")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Aesthetic")}
                    disabled={tags.length === 3 && !tags.includes("Aesthetic")}
                  >
                    Aesthetic
                  </Button>
                  <Button
                    style={
                      tags.includes("Art")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Art")}
                    disabled={tags.length === 3 && !tags.includes("Art")}
                  >
                    Art
                  </Button>
                  <Button
                    style={
                      tags.includes("Baking")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Baking")}
                    disabled={tags.length === 3 && !tags.includes("Baking")}
                  >
                    Baking
                  </Button>
                  <Button
                    style={
                      tags.includes("Cooking")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Cooking")}
                    disabled={tags.length === 3 && !tags.includes("Cooking")}
                  >
                    Cooking
                  </Button>
                  <Button
                    style={
                      tags.includes("DIY")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("DIY")}
                    disabled={tags.length === 3 && !tags.includes("DIY")}
                  >
                    DIY
                  </Button>
                  <Button
                    style={
                      tags.includes("Drawing")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Drawing")}
                    disabled={tags.length === 3 && !tags.includes("Drawing")}
                  >
                    Drawing
                  </Button>
                  <Button
                    style={
                      tags.includes("Exterior Design")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Exterior Design")}
                    disabled={
                      tags.length === 3 && !tags.includes("Exterior Design")
                    }
                  >
                    Exterior Design
                  </Button>
                  <Button
                    style={
                      tags.includes("Fashion")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Fashion")}
                    disabled={tags.length === 3 && !tags.includes("Fashion")}
                  >
                    Fashion
                  </Button>
                  <Button
                    style={
                      tags.includes("Fitness")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Fitness")}
                    disabled={tags.length === 3 && !tags.includes("Fitness")}
                  >
                    Fitness
                  </Button>
                  <Button
                    style={
                      tags.includes("Health")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Health")}
                    disabled={tags.length === 3 && !tags.includes("Health")}
                  >
                    Health
                  </Button>
                  <Button
                    style={
                      tags.includes("Home Decor")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Home Decor")}
                    disabled={tags.length === 3 && !tags.includes("Home Decor")}
                  >
                    Home Decor
                  </Button>
                  <Button
                    style={
                      tags.includes("Interior Design")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Interior Design")}
                    disabled={
                      tags.length === 3 && !tags.includes("Interior Design")
                    }
                  >
                    Interior Design
                  </Button>
                  <Button
                    style={
                      tags.includes("Makeup")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Makeup")}
                    disabled={tags.length === 3 && !tags.includes("Makeup")}
                  >
                    Makeup
                  </Button>
                  <Button
                    style={
                      tags.includes("Music")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Music")}
                    disabled={tags.length === 3 && !tags.includes("Music")}
                  >
                    Music
                  </Button>
                  <Button
                    style={
                      tags.includes("Nature")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Nature")}
                    disabled={tags.length === 3 && !tags.includes("Nature")}
                  >
                    Nature
                  </Button>
                  <Button
                    style={
                      tags.includes("Painting")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Painting")}
                    disabled={tags.length === 3 && !tags.includes("Painting")}
                  >
                    Painting
                  </Button>
                  <Button
                    style={
                      tags.includes("Photography")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Photography")}
                    disabled={
                      tags.length === 3 && !tags.includes("Photography")
                    }
                  >
                    Photography
                  </Button>
                  <Button
                    style={
                      tags.includes("Recipes")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Recipes")}
                    disabled={tags.length === 3 && !tags.includes("Recipes")}
                  >
                    Recipes
                  </Button>
                  <Button
                    style={
                      tags.includes("Style")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Style")}
                    disabled={tags.length === 3 && !tags.includes("Style")}
                  >
                    Style
                  </Button>
                  <Button
                    style={
                      tags.includes("Writing")
                        ? selectedButtonStyle
                        : defaultButtonStyle
                    }
                    onClick={() => handleTags("Writing")}
                    disabled={tags.length === 3 && !tags.includes("Writing")}
                  >
                    Writing
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12}>
                <h2>Add Image:</h2>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </Grid>
              <Grid item xs={12}>
                <p style={{ color: "#FF0000" }}>
                  {emptyFieldError !== "" ? emptyFieldError : postError}
                </p>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Button
              style={{
                marginTop: "10px",
                color: "black",
                backgroundColor: "#abedd8",
                textDecoration: "none",
                opacity: loading ? 0.7 : 1, // Adjust opacity when loading
                pointerEvents: loading ? "none" : "auto", // Disable pointer events when loading
              }}
              onClick={handleCreatePost}
              disabled={loading}
            >
              Save Post
            </Button>
          </DialogActions>
        </Dialog>
      </div>

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
                onClick={() => handleDelete(row._id)}
              >
                Delete
              </Button>
            </MDBCardBody>
          </MDBCard>
        ))}
      </div>
    </div>
  );
};

export default Board;
