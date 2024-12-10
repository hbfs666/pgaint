import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { useTheme, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  MobileDatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const HistoryDatePicker = ({ isMobile, setChooseDate, setHistoryMode,isHistoryMode }) => {
  const theme = useTheme();
  const [historyButtonVisible, setHistoryButtonVisible] = useState(false);
  const [tempDate, setTempDate] = useState(dayjs().subtract(1, 'day'));
  const today = dayjs();

  // Reset the visibility of the button on component mount
  useEffect(() => {
    setHistoryButtonVisible(false);
    //setTempDate(dayjs().subtract(1, 'day'));
  }, []);

  const toggleVisible = () => {
    setHistoryButtonVisible(!historyButtonVisible);
    //setTempDate(dayjs().subtract(1, 'day'))
  };

  const handleDateChange = (date) => {
    setTempDate(date);
  };

  const handleDialogClose = (confirm) => {
    if (confirm) {
      const formattedDate = tempDate.format('YYYY-MM-DD');
      setChooseDate(formattedDate); // Call the parent callback with the formatted date
      setHistoryMode(true); // Set the history mode to true
    }else{
        setChooseDate('')
        setHistoryMode(false)
    }
    setHistoryButtonVisible(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button
        onClick={toggleVisible}
        variant="outlined"
        sx={{
            borderColor:isHistoryMode?"green":theme.palette.mode==="dark"?"white":"black" ,
          "&:hover": {
            borderColor: theme.palette.mode === "dark" ? "lightgreen" : "green",
            backgroundColor: theme.palette.mode === "dark" ? "black" : "white",
          },
        }}
      >
        <Typography sx={{ color: theme.palette.mode === "dark" ? "white" : "black",}}>
          History Mode
        </Typography>
      </Button>
      <Dialog open={historyButtonVisible} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Select a Date</DialogTitle>
        <DialogContent>
          {isMobile ? (
            <MobileDatePicker
              value={tempDate}
              onChange={handleDateChange}
              maxDate={today.subtract(1, 'day')}
              textField={(params) => <TextField {...params} />}
            />
          ) : (
            <DesktopDatePicker
              value={tempDate}
              onChange={handleDateChange}
              maxDate={today.subtract(1, 'day')}
              textField={(params) => <TextField {...params} />}
              slotProps={{ textField: { size: "small" } }}
              sx={{
                '& .MuiInputBase-root': {
                  height: '35px',
                  marginTop: '4px',
                },
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            <Typography sx={{ color: theme.palette.mode === "dark" ? "white" : "black" }}>
              Cancel
            </Typography>
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            <Typography sx={{ color: theme.palette.mode === "dark" ? "white" : "black" }}>
              OK
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

HistoryDatePicker.propTypes = {
  isMobile: PropTypes.bool,
  setHistoryMode: PropTypes.func,
  setChooseDate: PropTypes.func,
  isHistoryMode:PropTypes.bool,
};

export default HistoryDatePicker;
