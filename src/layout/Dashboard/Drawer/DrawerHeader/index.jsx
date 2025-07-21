import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
// project import
import { Typography,Chip } from "@mui/material";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const DrawerHeaderStyled = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.mixins.toolbar,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius,
  borderBottom: '1px',
  justifyContent: open ? 'flex-start' : 'center',
  paddingLeft: theme.spacing(open ? 3 : 0),
  minHeight: 72, // Increased header height for better fit
  width: '100%', // Make background span full drawer width
  boxSizing: 'border-box',
}));


// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();
  const [zoomRatio, setZoomRatio] = useState(window.devicePixelRatio);

  useEffect(() => {
  const handleZoom = () => {
    setZoomRatio(window.devicePixelRatio);
  };

  window.addEventListener("resize", handleZoom);
  return () => window.removeEventListener("resize", handleZoom);
  }, []);
    
  return (
    <DrawerHeaderStyled theme={theme} open={!!open} >
        {open?<Typography sx={{ width: open ? 'auto' : 30, height: `${100 * (1 / zoomRatio)}px`, fontSize: `${50 *(1 / zoomRatio)}px`}}  fontWeight={"500"} align="center" >Kanban Sys</Typography>:null}
        {open?<Chip
          label={process.env.REACT_APP_RMA_SITE||"Error"}
          variant="outlined"
          size="large"
          color={process.env.REACT_APP_RMA_SITE?"secondary":"error"}
          sx={{ mt: 0.5, ml: 0.5, fontSize: `${25 *(1 / zoomRatio)}px`, height: `${35 *(1 / zoomRatio)}px`, '& .MuiChip-label': { px: `${5 *(1 / zoomRatio)}px` } }}
        />:null}
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };