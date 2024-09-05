import React,{useRef,useEffect} from "react";
import { Box, TableContainer, Paper,Typography } from "@mui/material";
import Header from "../../components/header";
import KanbanSettingHeader from "../../components/kanbanSettingHeader"


const TestPage = ({props}) => {
   
  return (
    <Box>
      <Box m="20px">
        <Header title="Welcome to dev" subtitle={props.kanban_name} />
        <KanbanSettingHeader/>
      </Box>
      <Box height="50vh" width="60vw" ml={10}></Box>
    </Box>
  );
};

export default TestPage
