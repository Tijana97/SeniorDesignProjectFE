import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./post.module.css";
import { Button, TextField } from "@mui/material";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface PostData {
  title: string;
  description: string;
  tags: string[];
  imageURL: string;
  userFirstName: string;
  userLastName: string;
  creationDate: string;
  hasLiked: boolean;
  isInspired: boolean;
}

interface Comments {
  userFirstName: string;
  userLastName: string;
  content: string;
}

interface DecodedToken extends JwtPayload {
  _id: string;
}

const Post = () => {
  const { postId } = useParams();
  const [currentPost, setCurrentPost] = useState<PostData | null>(null);
  const [commentData, setCommentData] = useState<Comments[]>([]);
  const [comment, setComment] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const data: DecodedToken = jwtDecode(token!!);
  const userId = data._id;

  const getPost = async () => {
    setIsDisabled(true);
    try {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };

      const response = await axios.get(
        `http://localhost:8080/posts/post/${postId}`,
        config
      );

      setCurrentPost(response.data);
      setIsDisabled(false);
      console.log("CURRENT: ", response.data);
    } catch (error) {
      setIsDisabled(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const getPostComments = async () => {
    setIsDisabled(true);

    try {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };

      const response = await axios.get(
        `http://localhost:8080/comments/${postId}`,
        config
      );
      setCommentData(response.data);
      setIsDisabled(false);
    } catch (error) {
      setIsDisabled(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currentPost) {
      getPostComments();
    }
  }, [currentPost]);

  if (!currentPost) {
    // If data is still loading, you can render a loading message or spinner
    return <div>Loading...</div>;
  }

  const commentOnPost = async () => {
    setIsDisabled(true);

    const dataToSend = {
      data: {
        userId: userId,
        postId: postId,
        content: comment,
      },
    };
    try {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };

      const response = await axios.post(
        `http://localhost:8080/comments/new`,
        dataToSend,
        config
      );

      if (response.data) {
        setIsDisabled(false);
        getPostComments();
      }
    } catch (error) {
      setIsDisabled(false);
      console.error("Error fetching data:", error);
    }
  };

  const deleteLike = async () => {
    setIsDisabled(true);

    try {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };

      const response = await axios.delete(
        `http://localhost:8080/likes/delete/${postId}/${userId}`,
        config
      );

      if (response.data) {
        setIsDisabled(false);
        getPost();
      }
    } catch (error) {
      setIsDisabled(false);
      console.error("Error fetching data:", error);
    }
  };

  const createLike = async () => {
    const dataToSend = {
      data: {
        userId: userId,
        postId: postId,
      },
    };
    try {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };

      const response = await axios.post(
        `http://localhost:8080/likes/new`,
        dataToSend,
        config
      );

      if (response.data) {
        getPost();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const inspireYourself = async () => {
    const dataToSend = {
      data: {
        userId: userId,
        postId: postId,
      },
    };
    try {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };

      const response = await axios.post(
        `http://localhost:8080/inspirations/new`,
        dataToSend,
        config
      );

      if (response.data) {
        getPost();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      style={{
        padding: "12px",
        display: "flex",
        flexDirection: "row",
        gap: "42px",
      }}
    >
      <div className={styles.cardWrapper}>
        <img
          src={currentPost.imageURL}
          alt="..."
          className={styles.cardImage}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              wordWrap: "break-word",
              display: "flex",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {currentPost.title}
          </div>
          <div style={{ boxSizing: "border-box", wordWrap: "break-word" }}>
            {currentPost.description}
          </div>
          <div
            style={{
              boxSizing: "border-box",
              wordWrap: "break-word",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: "1rem", fontWeight: "bold" }}>Tags:</div>
            {currentPost.tags.map((tag, key) => (
              <div key={key} style={{ fontSize: "1rem" }}>
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              boxSizing: "border-box",
              wordWrap: "break-word",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
              Posted by:
            </div>
            <div
              style={{ fontSize: "1rem" }}
            >{`${currentPost.userFirstName} ${currentPost.userLastName}`}</div>
          </div>
          <div
            style={{
              boxSizing: "border-box",
              wordWrap: "break-word",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
              Post date:
            </div>
            <div style={{ fontSize: "1rem" }}>
              {new Date(currentPost.creationDate).toLocaleDateString("en-GB")}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "50vw",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            width: "100%",
          }}
        >
          <TextField
            label={"Write a comment"}
            variant="outlined"
            fullWidth
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <Button
            variant={"contained"}
            onClick={() => commentOnPost()}
            disabled={comment === "" ? true : false}
            style={{ backgroundColor: "#abedd8", color: "#000000" }}
          >
            SEND
          </Button>
        </div>
        <div
          style={{
            width: "100%",
            height: "500px",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            padding: "8px",
            wordWrap: "break-word",
            boxSizing: "border-box",
            overflow: "scroll",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            backgroundColor: "#abedd8",
          }}
        >
          {commentData.length > 0 ? (
            commentData.map((comment) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  width: "100%",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  padding: "8px",
                  boxSizing: "border-box",
                  borderRadius: "8px",
                  backgroundColor: "white",
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 400 }}>
                  {`${comment.userFirstName} ${comment.userLastName}`}
                </div>
                <div style={{ height: "1px", backgroundColor: "black" }}></div>
                <div style={{ fontSize: "1rem", fontWeight: 400 }}>
                  {comment.content}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              No comments on this post...
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            width: "100%",
          }}
        >
          {currentPost.hasLiked ? (
            <Button
              variant={"contained"}
              onClick={() => deleteLike()}
              style={{ backgroundColor: "#a9a9a9", color: "#000000" }}
              disabled={isDisabled}
            >
              Unlike
            </Button>
          ) : (
            <Button
              variant={"contained"}
              onClick={() => createLike()}
              style={{ backgroundColor: "#db7093", color: "#000000" }}
              disabled={isDisabled}
            >
              Like
            </Button>
          )}
          {!currentPost.isInspired && (
            <Button
              variant={"contained"}
              onClick={() => inspireYourself()}
              disabled={isDisabled}
              style={{ backgroundColor: "#abedd8", color: "#000000" }}
            >
              Save post
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
