import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

export default function NavItem({ item, level = 1 }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  // Determine if the item is selected based on the current path
  const isSelected = !!matchPath({ path: item.url, end: false }, pathname);

  // Define the list item props based on the item's properties
  const itemTarget = item.target ? '_blank' : '_self';
  const listItemProps = item.external
    ? { component: 'a', href: item.url, target: itemTarget }
    : { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };

  // Get the icon component if available
  const Icon = item.icon;
  const itemIcon = Icon ? <Icon style={{ fontSize: '1rem' }} /> : null;

  // Handle selected styles
  //const textColor = theme.palette.mode == "dark" && isSelected?'black':'text.primary';
  const textColor = isSelected
  ? theme.palette.mode === 'dark'
    ? 'primary.contrastText'
    : 'primary.main'
  : 'text.primary';
  const iconColor = item.iconColor || (isSelected ? 'green' : 'inherit')
  
 // Define styles for the ListItemButton
 const listItemButtonStyles = {
  zIndex: 1201,
  pl: `${level * 28}px`,
  py: level === 1 ? 1.25 : 1,
  bgcolor: isSelected
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 128, 0, 0.1)'
    : 'inherit',
  '&:hover': {
    bgcolor: isSelected
      ? theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 128, 0, 0.2)'
      : theme.palette.mode === 'dark'
      ? 'primary.dark'
      : 'primary.lighter',
  },
  '&.Mui-selected': {
    bgcolor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'lightgreen',
    borderRight: `2px solid green`,
    color: iconColor,
    '&:hover': {
      color: iconColor,
      bgcolor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 128, 0, 0.2)',
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
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      bgcolor: 'secondary.lighter'
    },
    ...(isSelected && {
      bgcolor: 'primary.lighter',
      '&:hover': {
        bgcolor: 'primary.lighter'
      }
    })
  };

  useEffect(() => {
    // Perform actions when the pathname changes
    if (pathname === item.url) return;
  }, [pathname, item.url]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      selected={isSelected}
      sx={listItemButtonStyles}
    >
      {itemIcon && (
        <ListItemIcon sx={listItemIconStyles}>
          {itemIcon}
        </ListItemIcon>
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
    })
  }).isRequired,
  level: PropTypes.number
};
