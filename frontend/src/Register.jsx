import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Register({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const { data } = await axios.post(`${API_URL}/register`, {
        username,
        password,
        confirmedPassword,
      });

      window.localStorage.setItem("token", data);

      const response = await axios.get(`${API_URL}/account`, {
        headers: { authorization: data },
      });

      setUser(response.data);
      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data); // Display server error
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
      }}
    >
      <Paper
        sx={{
          bgcolor: "#edc7b7",
          padding: "20px",
          width: { xs: "100%", sm: "400px" },
          maxWidth: { xs: "350px", sm: "400px" },
          textAlign: "center",
          borderRadius: "12px",
          border: "1px solid #a0aec0",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "12px", color: "black" }}>
          Register
        </Typography>
        <form
          onSubmit={register}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            sx={{
              bgcolor: "#EEE2DC",
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#AC3B61" },
                "&:hover fieldset": { borderColor: "#AC3B61" },
                "&.Mui-focused fieldset": { borderColor: "#AC3B61" },
              },
              "& input": { color: "black" },
            }}
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => {
              const input = e.target.value;
              const regex = /^[a-zA-Z0-9]*$/;

              if (regex.test(input)) {
                setUsername(input);
              }
            }}
          />
          <TextField
            sx={{
              bgcolor: "#EEE2DC",
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#AC3B61" },
                "&:hover fieldset": { borderColor: "#AC3B61" },
                "&.Mui-focused fieldset": { borderColor: "#AC3B61" },
              },
              "& input": { color: "black" },
            }}
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            type={togglePassword ? "text" : "password"}
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            sx={{
              bgcolor: "#EEE2DC",
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#AC3B61" },
                "&:hover fieldset": { borderColor: "#AC3B61" },
                "&.Mui-focused fieldset": { borderColor: "#AC3B61" },
              },
              "& input": { color: "black" },
            }}
            label="Confirm"
            variant="outlined"
            fullWidth
            value={confirmedPassword}
            type={togglePassword ? "text" : "password"}
            onChange={(event) => setConfirmedPassword(event.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={togglePassword}
                onChange={(e) => setTogglePassword(e.target.checked)}
                sx={{
                  color: "#AC3B61",
                  "&.Mui-checked": { color: "#AC3B61" },
                }}
              />
            }
            label={
              <Typography variant="body1" sx={{ color: "black" }}>
                Show password
              </Typography>
            }
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#AC3B61", textTransform: "none" }}
            fullWidth
          >
            Register
          </Button>
        </form>
        <Typography
          variant="body2"
          style={{ marginTop: "16px", color: "black" }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1976d2" }}>
            Sign in here!
          </Link>
        </Typography>
      </Paper>
      <Box sx={{ mt: "10px" }}>
        <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
      </Box>
    </Box>
  );
}
