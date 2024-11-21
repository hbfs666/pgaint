import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useTheme,Typography } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const theme = useTheme();
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
//theme.palette.mode === "dark" ? "white" : "black"
  return (
    <Button onClick={toggleFullscreen} variant="outlined" sx={{borderColor: theme => theme.palette.mode === "dark" ? "white" : "black",'&:hover': {
            borderColor: theme => theme.palette.mode === "dark" ? "lightgreen" : "green", // Maintain the border color on hover
            backgroundColor: "transparent", // Ensure background remains transparent on hover
        }}}>
        {isFullscreen ?<CloseFullscreenIcon fontSize='small' sx={{fill:theme.palette.mode === "dark" ? "white" : "black"}}/>:<OpenInFullIcon fontSize='small' sx={{fill:theme.palette.mode === "dark" ? "white" : "black"}}/>} 
    </Button>
  );
}

export default FullscreenButton;