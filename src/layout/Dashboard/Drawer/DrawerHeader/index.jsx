import React from "react";
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
  paddingLeft: theme.spacing(open ? 3 : 0)
}));


// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();
  return (
    <DrawerHeaderStyled theme={theme} open={!!open} >
        {open?<Typography sx={{ width: open ? 'auto' : 35, height: 50 }} fontSize={'2rem'} fontWeight={"500"} >Kanban Sys</Typography>:null}
        {open?<Chip
          label={process.env.REACT_APP_RMA_SITE||"Error"}
          variant="outlined"
          size="small"
          color={process.env.REACT_APP_RMA_SITE?"secondary":"error"}
          sx={{ mt: 0.5, ml: 0.5, fontSize: '1rem', height: 20, '& .MuiChip-label': { px: 0.5 } }}
        />:null}
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };