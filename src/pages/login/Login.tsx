import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  CssBaseline,
  Box,
  Typography,
  Container,
  Link,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../images/CreationCloudLogo.png";

const Login: React.FC = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emptyFieldError, setEmptyFielderror] = useState<string>("");
  const [incorrectCredentialsError, setIncorrectCredentialsError] =
    useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setIncorrectCredentialsError("");
      setEmptyFielderror(
        "Please fill our both your email address and password"
      );
      console.log(incorrectCredentialsError);
    } else {
      setEmptyFielderror("");
      try {
        const response = await axios.post(
          "https://seniordesignprojectbe.onrender.com/users/login",
          {
            email,
            password,
          }
        );

        console.log("Login successful!", response.data);

        const token = response.data.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
        navigate("/home");
        navigate(0);
      } catch (error: any) {
        setIncorrectCredentialsError(
          "Login failed. Username or password are incorrect. Please provide correct credentials or sign up."
        );
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#009696",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          <Grid container>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: `url(${LogoImage})`,
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" sx={{ mt: 1 }}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <div>
                    <p style={{ color: "#FF0000" }}>
                      {emptyFieldError !== ""
                        ? emptyFieldError
                        : incorrectCredentialsError}
                    </p>
                  </div>
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          backgroundColor: "#ABEDD8",
                          color: "#111111",
                          ":hover": { backgroundColor: "#009696" },
                        }}
                        onClick={handleLogin}
                      >
                        Log In
                      </Button>

                      <div>
                        <Link
                          href="/register"
                          sx={{
                            color: "#111111",
                            textDecorationColor: "#111111",
                          }}
                        >
                          Don't have an account? Sign up.
                        </Link>
                      </div>
                    </div>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
