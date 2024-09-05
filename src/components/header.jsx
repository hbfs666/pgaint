import React, { useState } from 'react';
import { Typography, Box, useTheme, useMediaQuery} from "@mui/material";
import { tokens } from "../theme/theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box mb="5px">
      {!isMatch?<><Typography
        variant="h1"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
        textAlign="center"
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]} textAlign="center">
        {subtitle}
      </Typography></>:<><Typography
        variant="h3"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
        textAlign="center"
      >
        {title}
      </Typography>
      <Typography variant="h6" color={colors.greenAccent[400]}textAlign="center">
        {subtitle}
      </Typography></>}
    </Box>
  );
};

export default Header;