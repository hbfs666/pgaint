import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NavItem from './NavItem';


// project import


export default function NavGroup({ item,toggleDrawerFunc }) {
const [zoomRatio, setZoomRatio] = useState(window.devicePixelRatio);

useEffect(() => {
  const handleZoom = () => {
    setZoomRatio(window.devicePixelRatio);
  };

  window.addEventListener("resize", handleZoom);
  return () => window.removeEventListener("resize", handleZoom);
}, []);

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return (
          <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
          
          </Typography>
        );
      case 'item':
        return <NavItem  sx={{ fontSize: `${500 *(1 / zoomRatio)}px`}} key={menuItem.id} item={menuItem} level={1} toggleDrawerFunc={toggleDrawerFunc} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: `${25 *(1 / zoomRatio)}px`, fontWeight: 700 }}>
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb:  1.5, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.object };
