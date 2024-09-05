import React, { useEffect, useRef } from 'react';
import { Typography, Box, useTheme, useMediaQuery} from "@mui/material";
import { tokens } from "../theme/theme";
import {useQuery} from "@tanstack/react-query"
import {getKanbanInfo} from '../api/apiClientService'

const KanbanSettingHeader = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
//   const {isPending,error,data}=useQuery({
//     queryKey:['--workable'],
//     queryFn:()=>getKanbanInfo("test","L11","110","PRO")
//     ,
// })
    //use useRef to store the previous value of isPending
    //const prevData = useRef(data);
    //useEffect to check if the value of isPending has changed
    // useEffect(() => {
    //     if (prevData.current !== data) {
    //         prevData.current = data;
    //     }
    //     console.log(prevData.current)
    // }, [isPending]);


  return (
    <Box mb="5px">
      <Typography>ok</Typography>
    </Box>
  );
};

export default KanbanSettingHeader;