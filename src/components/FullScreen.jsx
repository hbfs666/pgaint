import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material';
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Button
      onClick={toggleFullscreen}
      variant="outlined"
      sx={{
        borderColor: theme.palette.mode === "dark" ? "white" : "black",
        '&:hover': {
          borderColor: theme.palette.mode === "dark" ? "lightgreen" : "green",
          backgroundColor: theme.palette.mode === "dark" ? "black" : "white",
        },
      }}
    >
      {isFullscreen
        ? <CloseFullscreenIcon fontSize='small' sx={{ fill: theme.palette.mode === "dark" ? "white" : "black" }} />
        : <OpenInFullIcon fontSize='small' sx={{ fill: theme.palette.mode === "dark" ? "white" : "black" }} />
      }
    </Button>
  );
}

export default FullscreenButton;
