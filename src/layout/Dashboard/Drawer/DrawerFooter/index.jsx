import React, { useContext , useState, useEffect} from "react";
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
  const [zoomRatio, setZoomRatio] = useState(window.devicePixelRatio);
    
      useEffect(() => {
      const handleZoom = () => {
        setZoomRatio(window.devicePixelRatio);
      };
    
      window.addEventListener("resize", handleZoom);
      return () => window.removeEventListener("resize", handleZoom);
      }, []);

  return (
    <DrawerFooterStyled>
      <Box display="flex" alignItems="center" width={"100%"}>
        <Button
          component={Link}
          to="/addKanban"
          variant="contained"
          disabled={process.env.REACT_APP_MASTER_MODE=="false"?true:false}
          startIcon={process.env.REACT_APP_MASTER_MODE=="false"?null:<AddCircleOutlineIcon sx={{ fontSize: `${40 * (1 / zoomRatio)}px` }} />}
          sx={{
            mb: 1,
            backgroundColor: theme.palette.mode === "dark" ? "#8bc34a" : "#1976d2",
            color: "#fff",
            borderRadius: "8px",
            padding: `${18 * (1 / zoomRatio)}px ${32 * (1 / zoomRatio)}px`,
            width: "100%",
            fontSize: `${28 * (1 / zoomRatio)}px`,
            fontWeight: 700,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#7cb342" : "#1565c0",
            },
          }}
        >
          {process.env.REACT_APP_MASTER_MODE=="false"?"View Only Mode":"Add New Kanban"}
        </Button>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" width="30%" sx={{ mt: 2, mb: 2 }}>
        <IconButton onClick={colorMode.toggleColorMode} sx={{ mr: 1 }}>
          {theme.palette.mode === "light" ? (
            <Brightness7Icon sx={{ color: "orange", fontSize: `${36 * (1 / zoomRatio)}px` }} />
          ) : (
            <Brightness4Icon sx={{ color: "#1976d2", fontSize: `${36 * (1 / zoomRatio)}px` }} />
          )}
        </IconButton>
        <Switch
          edge="end"
          onChange={colorMode.toggleColorMode}
          checked={theme.palette.mode === "dark"}
          sx={{
            transform: `scale(${1.5 * (1 / zoomRatio)})`,
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: theme.palette.mode === "dark" ? "#8bc34a" : "#1976d2",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#8bc34a" : "#1976d2",
            },
          }}
        />
      </Box>
      <Divider sx={{ width: "100%", mb: 1, height: 3 }} />
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: `${22 * (1 / zoomRatio)}px`, fontWeight: 600 }}>
        &copy; {new Date().getFullYear()} Pegatron Inc
      </Typography>
    </DrawerFooterStyled>
  );
}

DrawerFooter.propTypes = { open: PropTypes.bool };
