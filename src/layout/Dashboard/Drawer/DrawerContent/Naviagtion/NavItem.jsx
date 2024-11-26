import PropTypes from "prop-types";
import React, { useState, forwardRef, useEffect } from "react";
import { Link, useLocation, matchPath,useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useMutation } from "@tanstack/react-query";
import {useError} from "../../../../../context/ErrorHandlerContext";
import { useKanbanContext } from "../../../../../context/KanbanContext";
import {
  inActiveKanban,
  activeKanban,
  deleteKanban,
} from "../../../../../api/apiClientService";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function NavItem({ item, level = 1 }) {
  const {reloadContext}=useKanbanContext();
  const theme = useTheme();
  const { pathname } = useLocation();
  const showMessage = useError();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const history = useNavigate();
  // Determine if the item is selected based on the current path
  const isSelected = !!matchPath({ path: item.url, end: false }, pathname);

  // Define the list item props based on the item's properties
  const itemTarget = item.target ? "_blank" : "_self";
  const listItemProps = item.external
    ? { component: "a", href: item.url, target: itemTarget }
    : {
        component: forwardRef((props, ref) => (
          <Link ref={ref} {...props} to={item.url} target={itemTarget} />
        )),
      };

  // Get the icon component if available
  const Icon = item.icon;
  const itemIcon = Icon ? <Icon style={{ fontSize: "1rem" }} /> : null;

  // Handle selected styles
  //const textColor = theme.palette.mode == "dark" && isSelected?'black':'text.primary';
  const textColor = isSelected
    ? theme.palette.mode === "dark"
      ? "primary.contrastText"
      : "primary.main"
    : "text.primary";
  const iconColor = item.iconColor || (isSelected ? "green" : "inherit");

  // Define styles for the ListItemButton
  const listItemButtonStyles = {
    zIndex: 1201,
    pl: `${level * 28}px`,
    py: level === 1 ? 1.25 : 1,
    bgcolor: isSelected
      ? theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 128, 0, 0.1)"
      : "inherit",
    "&:hover": {
      bgcolor: isSelected
        ? theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 128, 0, 0.2)"
        : theme.palette.mode === "dark"
        ? "primary.dark"
        : "primary.lighter",
    },
    "&.Mui-selected": {
      bgcolor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "lightgreen",
      borderRight: `2px solid green`,
      color: iconColor,
      "&:hover": {
        color: iconColor,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(0, 128, 0, 0.2)",
      },
    },
  };

  // Define styles for the ListItemIcon
  const listItemIconStyles = {
    minWidth: 28,
    color: iconColor,
    borderRadius: 1.5,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      bgcolor: "secondary.lighter",
    },
    ...(isSelected && {
      bgcolor: "primary.lighter",
      "&:hover": {
        bgcolor: "primary.lighter",
      },
    }),
  };

  // useEffect(() => {
  //   // Perform actions when the pathname changes
  //   if (pathname === item.url) return;
  // }, [pathname, item.url]);

  const activateKanbanfunc =useMutation({
    mutationFn:(mappingKey)=>activeKanban(mappingKey),
    onError: (error)=>{
        showMessage("Error in activate kanban: "+ error.message,"error");
    },
    onSuccess:async ()=>{
        showMessage("Activate Kanban Successful redirecting...","success")
        await sleep(450)
        reloadContext()
    }
  })

  const inActivateKanbanfunc =useMutation({
    mutationFn:(mappingKey)=>inActiveKanban(mappingKey),
    onError: (error)=>{
        showMessage("Error in inactivate kanban: "+ error.message,"error");
    },
    onSuccess:async()=>{
        showMessage("Inactivate Kanban Successful redirecting...","success")
        await sleep(450)
        reloadContext()
    }
  })

  const deleteKanbanfunc =useMutation({
    mutationFn:(mappingKey)=>deleteKanban(mappingKey),
    onError: (error)=>{
        showMessage("Error in delete kanban: "+ error.message,"error");
    },
    onSuccess:async()=>{
        showMessage("Delete Kanban Successful redirecting...","success")
        await sleep(450)
        reloadContext()
        history("/")
    }
  })
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      selected={isSelected}
      sx={listItemButtonStyles}
    >
      {itemIcon && (
        <ListItemIcon sx={listItemIconStyles}>{itemIcon}</ListItemIcon>
      )}
      <ListItemText
        primary={
          <Typography variant="h6" sx={{ color: textColor }}>
            {item.title}
          </Typography>
        }
      />
      {level !== 1 && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>

    {isSelected && (
        <IconButton
          sx={{
            position: "absolute",
            right: 8,
            zIndex: 1202,
          }}
          aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={process.env.REACT_APP_MASTER_MODE=="false"?true:false}
        >
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
          sx: {
            //bgcolor:'transparent',
            padding:"0px",
            //border: '1px inset',
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {item.iconColor=="red"?<MenuItem
          onClick={() => {
            activateKanbanfunc.mutate(item.id);
          }}
          sx={{
            bgcolor: 'rgba(76, 175, 80, 0.5)', // Vibrant Green for Active
            '&:hover': {
              bgcolor: 'rgba(76, 175, 80, 0.7)', // Darker Green on hover
            },
            justifyContent:"center",
            '&:focus': {
              outline: 'none', // Remove outline on focus
            },
          }}
        >
          Active
        </MenuItem>:null}
        {item.iconColor=="green"?<MenuItem
          onClick={() => {
            inActivateKanbanfunc.mutate(item.id);
           
          }}
          sx={{
            bgcolor: 'rgba(255, 152, 0, 0.5)', // Warm Orange for Inactive
            '&:hover': {
              bgcolor: 'rgba(255, 152, 0, 0.7)', // Darker Orange on hover
            },
            //border: 'none', // Remove border
            //boxShadow: 'none', // Remove shadow
            //border: '1px solid',
            '&:focus': {
              outline: 'none', // Remove outline on focus
            },
            justifyContent:"center",
          }}
        >
          Deactivate
        </MenuItem>:null}
        <MenuItem
          onClick={() => {
            deleteKanbanfunc.mutate(item.id);
            handleClose();
          }}
          sx={{
            bgcolor: 'rgba(244, 67, 54, 0.5)', // Strong Red for Delete
            '&:hover': {
              bgcolor: 'rgba(244, 67, 54, 0.7)', // Darker Red on hover
            },
            //border: 'none', // Remove border
            //boxShadow: 'none', // Remove shadow
            //border: '1px solid',
            '&:focus': {
              outline: 'none', // Remove outline on focus
            },
            justifyContent:"center"
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}

NavItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    iconColor: PropTypes.string,
    target: PropTypes.bool,
    external: PropTypes.bool,
    disabled: PropTypes.bool,
    chip: PropTypes.shape({
      color: PropTypes.string,
      variant: PropTypes.string,
      size: PropTypes.string,
      label: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
  level: PropTypes.number,
};
