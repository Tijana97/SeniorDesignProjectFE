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

interface DecodedToken extends JwtPayload {
  _id: string;
}

const Board = () => {
  const [dataList, setDataList] = useState([]);
  const token = localStorage.getItem("token");
  const data: DecodedToken = jwtDecode(token!);
  console.log("TOKEN: ", data);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<Array<string>>([]);
  const [image, setImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [emptyFieldError, setEmptyFieldError] = useState<string>("");
  const [postError, setPostError] = useState<string>("");

  const userId = data._id;
  console.log("UserID: ", userId);
  console.log("DATA: ", data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        };

        const response = await axios.get(
          `http://localhost:8080/posts/user/${userId}`,
          config
        );

        setDataList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleCreatePost = async () => {
    // Check for empty fields
    if (title === "" || description === "" || image === null) {
      setEmptyFieldError("Please fill out all fields.");
      return;
    } else {
      setEmptyFieldError("");
    }

    try {
      const formData = new FormData();
      formData.append("profile-file", image!);
      formData.append("userId", userId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags.join(",")); // Assuming tags is an array of strings

      const response = await axios.post(
        "http://localhost:8080/profile-upload-single",
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
    } catch (error) {
      setPostError("The post could not be created, please try again.");
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
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
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
                <TextField
                  label="Tags"
                  variant="outlined"
                  fullWidth
                  value={tags}
                  onChange={(e) => setTags([e.target.value])}
                />
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
              }}
              onClick={handleCreatePost}
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
    </div>
  );
};

export default Board;
