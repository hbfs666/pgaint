import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Drawer, Button, IconButton, Box, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerHeader from "./DrawerHeader";
import DrawerFooter from "./DrawerFooter";
import DrawerContent from "./DrawerContent";
import { tokens } from "../../../theme/theme";

// ==============================|| MAIN DRAWER ||============================== //

export default function MainDrawer({ window }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (event.clientX < 50) {
        setIsButtonVisible(true);
      } else {
        setIsButtonVisible(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const drawerHeader = useMemo(
    () => <DrawerHeader open={!!isDrawerOpen} />,
    [isDrawerOpen]
  );
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerFooter = useMemo(() => <DrawerFooter />, []);

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <div>
      {isButtonVisible && (
        <IconButton
          onClick={toggleDrawer(true)}
          sx={{
            position: "fixed",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: colors.primary,
            color: colors.primary,
            borderRadius: "0 4px 4px 0",
            zIndex: 1, // Ensure it stays on top
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        container={container}
        variant="temporary"
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: "block",
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 260,
            borderRight: "1px solid",
            borderRightColor: "divider",
            backgroundImage: "none",
            boxShadow: "inherit",
          },
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(5px)",
          backgroundAttachment: "fixed",
        }}
      >
        <Box>{drawerHeader}</Box>
        <Box sx={{ overflowY: "auto",height:'100%'}}>{drawerContent}</Box>
        <Box >{drawerFooter}</Box>
      </Drawer>
    </div>
  );
}
MainDrawer.propTypes = { window: PropTypes.func };
