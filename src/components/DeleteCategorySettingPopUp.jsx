import React,{useState,useEffect} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useTheme,
    Box,
    Divider
  } from "@mui/material";

const DeleteConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    id,
    onRow,
  }) => {
    const theme = useTheme();
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle
        color="red"
        fontWeight="600"
      >{`Confirm Deletion`}
      <Divider  sx={{borderBottomWidth:2}}/>
      </DialogTitle>
        <DialogContent>
        <Typography>
            {`Are you sure you want to `}
            <Typography component="span" color={"red"}>{`DELETE`}</Typography>
            {` this `}
            <Typography
              component="span"
              color={"green"}
              fontWeight="600"
            >{`category setting`}</Typography>
            {` ?`}
          </Typography>
          <Box width="100%" display="flex" justifyContent="center" flexDirection="column">
          {/* <Typography>
            {`From Station: ${onRow.from} To Station: ${onRow.to} Exclude: ${onRow.exclude}`}
          </Typography> */}

          <Typography align="center">
            <Typography component="span" color="green">
              {`From Station: `}
              <Typography component="span" color="red" fontWeight="600">
                {onRow.from}
              </Typography>
            </Typography>
            <Divider flexItem variant="middle"/>
            <Typography component="span" color="green">
              {`To Station: `}
              <Typography component="span" color="red" fontWeight="600">
                {onRow.to}
              </Typography>
            </Typography>
            <Divider flexItem variant="middle"/>
            <Typography component="span" color="green">
              {`Exclude: `}
              <Typography component="span" color="red" fontWeight="600">
                {onRow.exclude?"YES":"NO"}
              </Typography>
            </Typography>
          </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{color:theme.palette.mode==="dark"?"white":"black"}}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(id)}
            sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#f44336" : "#f44336", // Button color based on mode
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#d32f2f" : "#d32f2f", // Button hover color based on mode
                  boxShadow: `0px 4px 6px ${theme.palette.primary.main}`, // Button shadow on hover
                },
              }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  export default DeleteConfirmationDialog;