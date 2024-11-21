import React,{useRef,useEffect} from "react";
import { Box, TableContainer, Paper,Typography } from "@mui/material";
import Header from "../../components/header";


const LandingPage = () => {

  return (
    <Box>
      <Box m="20px">
        <Header title="Welcome Kanban Sys" />
      </Box>
      <Box height="50vh" width="60vw" ml={10}></Box>
    </Box>
  );
};

export default LandingPage