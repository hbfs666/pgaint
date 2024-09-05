import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  IconButton,
  Typography,
  Box,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const CategorySettingEditor = ({ open, onClose, rowData }) => {
  const theme = useTheme();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      TransitionComponent={Transition}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: 'lightgreen',
          color: theme.palette.primary.main,
        }}
      >
        {`Category Setting Editor`}
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="h6">Group Name: {rowData.group_name}</Typography>
          <Typography variant="h6">
            Group Condition: {rowData.group_condition}
          </Typography>
          <Typography variant="h6">
            Station List: {rowData.station_list}
          </Typography>
          <Typography variant="h6">
            Category Sequence: {rowData.category_sequence}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategorySettingEditor;
