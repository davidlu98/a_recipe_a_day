import React from "react";
import { useState } from "react";

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const fryingPan = "/frying_pan.png";

export default function Navbar({ user, logout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#edc7b7" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex" }}>
            <img
              src={fryingPan}
              alt="spatula"
              style={{
                width: "20px",
                height: "20px",
                margin: "2px",
                paddingTop: "4px",
                paddingRight: "4px",
                pointerEvents: "none",
              }}
            />
            <Typography variant="h6">
              <Link
                to="/"
                style={{
                  color: "black",
                  textDecoration: "none",
                }}
              >
                A Recipe A Day
              </Link>
            </Typography>
          </Box>
          <>
            {user ? (
              <Box>
                <Button
                  component={Link}
                  to="/account"
                  sx={{
                    m: "4px",
                    textTransform: "none",
                    color: "black",
                    border: "1px solid #AC3B61",
                  }}
                >
                  Account
                </Button>
                <Button
                  sx={{
                    m: "4px",
                    textTransform: "none",
                    color: "black",
                    border: "1px solid #AC3B61",
                  }}
                  onClick={() => {
                    logout();
                  }}
                >
                  Sign Out
                </Button>
              </Box>
            ) : (
              <Box>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    m: "4px",
                    textTransform: "none",
                    color: "black",
                    border: "1px solid #AC3B61",
                  }}
                >
                  Log In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  sx={{
                    m: "4px",
                    textTransform: "none",
                    color: "black",
                    border: "1px solid #AC3B61",
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
