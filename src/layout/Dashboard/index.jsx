import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Drawer from './Drawer'
import Toolbar from '@mui/material/Toolbar';
import { Typography, Box, useTheme, useMediaQuery} from "@mui/material";


export default function DashboardLayout() {
  

    const theme = useTheme();
    const downXL = useMediaQuery(theme.breakpoints.down("xl"));
  
    return (
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Drawer/>
        <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          {/* <Toolbar /> */}
       
          <Outlet />
        </Box>
      </Box>
    );
  }