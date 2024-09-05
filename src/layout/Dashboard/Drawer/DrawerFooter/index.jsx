import React, { useContext } from "react";
import PropTypes from "prop-types";
// material-ui
import { ColorModeContext } from "../../../../theme/theme";
import { useTheme } from "@mui/material/styles";
import { Typography, Chip, Switch,IconButton,Divider,Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const DrawerFooterStyled = styled(Box)(({ theme }) => ({
  marginTop: "auto", // Pushes footer to the bottom
  display: "flex",
  flexDirection:"column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  //backgroundColor: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  //borderTop: "1px solid",
  borderTopColor: "divider",
}));

export default function DrawerFooter() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <DrawerFooterStyled>
    <Box display="flex" alignItems="center" width={"100%"}>
    <Button
        component={Link}
        to="/addKanban"
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          mb: 1,
          backgroundColor: theme.palette.mode === "dark" ? "#8bc34a" : "#1976d2",
          color: "#fff",
          borderRadius: "8px", // Rounded corners
          padding: "10px 20px", // Button padding
          width: "100%", // Full width
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#7cb342" : "#1565c0",
          },
        }}
      >
        Add New Kanban
      </Button>
    </Box>

     <Box display="flex" alignItems="center">
        <IconButton onClick={colorMode.toggleColorMode} sx={{ mr: 1 }}>
          {theme.palette.mode === "light" ? (
            <Brightness7Icon sx={{ color: "orange" }} /> // Sun icon for dark mode
          ) : (
            <Brightness4Icon sx={{ color: "#1976d2" }} /> // Moon icon for light mode
          )}
        </IconButton>
        <Switch
          edge="end"
          onChange={colorMode.toggleColorMode}
          checked={theme.palette.mode === "dark"}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: theme.palette.mode === "dark" ? "#8bc34a" : "#1976d2", // Light green in dark mode
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#8bc34a" : "#1976d2", // Light green track in dark mode
            },
          }}
        />
      </Box>
      <Divider sx={{ width: "100%",mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} Pegatron Inc
      </Typography>
    </DrawerFooterStyled>
  );
}

DrawerFooter.propTypes = { open: PropTypes.bool };
