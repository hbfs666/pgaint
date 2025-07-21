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

  const [zoomRatio, setZoomRatio] = useState(window.devicePixelRatio);
    useEffect(() => {
      const handleZoom = () => {
        setZoomRatio(window.devicePixelRatio);
      };
      window.addEventListener("resize", handleZoom);
      return () => window.removeEventListener("resize", handleZoom);
    }, []);

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

  return(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button
        onClick={toggleVisible}
        variant="outlined"
        sx={{
            marginTop: "-5px",
            height: `${50 * (1 / zoomRatio)}px`,
            minWidth: `${100 * (1 / zoomRatio)}px`,
            borderColor: isHistoryMode ? "green": theme.palette.mode === "dark"?"white":"black",
          "&:hover": {
            borderColor: theme.palette.mode === "dark" ? "lightgreen" : "green",
            backgroundColor: theme.palette.mode === "dark" ? "black" : "white",
          },
        }}
      >
        <Typography sx={{ fontSize: `${25 * (1 / zoomRatio)}px`, color: theme.palette.mode === "dark" ? "white" : "black",}}>
          History
        </Typography>
      </Button>
      <Dialog open={historyButtonVisible} onClose={() => handleDialogClose(false)}
        PaperProps={{
          sx:{
            minWidth:`${500 * (1 / zoomRatio)}px`,
            minHeight: `${300 * (1 / zoomRatio)}px`,
            padding: `${20 * (1 / zoomRatio)}px`,
          },
        }}
      >
        <DialogTitle sx={{ fontSize: `${35 * (1 / zoomRatio)}px` }}>
        Select a Date
        </DialogTitle>
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
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx:{
                    '& .MuiInputAdornment-root .MuiIconButton-root': {
                      fontSize: `${30 * (1 / zoomRatio)}px`,
                      padding: `${12 * (1 / zoomRatio)}px`,
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: `${30 * (1 / zoomRatio)}px`,
                    },
                    '& .input': {
                      fontSize: `${30 * (1 / zoomRatio)}px`,
                      padding: `${10 * (1 / zoomRatio)}px`,
                      width: '100%',
                      minWidth: `${180 * (1 / zoomRatio)}px`,
                      boxSizing: 'border-box',
                    },
                    '& .MuiInputBase-root': {
                      width: '100%',
                      minWidth: `${200 * (1 / zoomRatio)}px`,
                      height: `${65 * (1 / zoomRatio)}px`,
                      marginTop: `${25 * (1 / zoomRatio)}px`,
                      padding: `${20 * (1 / zoomRatio)}px`,
                      fontSize: `${30 * (1 / zoomRatio)}px`,
                      boxSizing: 'border-box',
                    },
                  },
                },
                // popper: {
                //   sx: {
                //     '& .MuiPaper-root': {
                //       minWidth: `${400 * (1 / zoomRatio)}px`,
                //       minHeight: `${400 * (1 / zoomRatio)}px`,
                //       overflow: 'visible',
                //     },
                //     '& .MuiPickersCalendarHeader-label': {
                //       fontSize: `${20 * (1 / zoomRatio)}px`,
                //       marginBottom: `${12 * (1 / zoomRatio)}px`,
                //       display: 'block',
                //     },
                //     '& .MuiPickersCalendarHeader-root':{
                //       fontSize: `${50 * (1 / zoomRatio)}px`,
                //       padding:`${30 * (1 / zoomRatio)}px`,
                //     },
                //     '& .MuiDayCalendar-weekDayLabel': {
                //       minWidth: `${50 * (1 / zoomRatio)}px`,
                //       maxWidth: `${50 * (1 / zoomRatio)}px`,
                //       width: `${50 * (1 / zoomRatio)}px`,
                //       fontSize: `${20 * (1 / zoomRatio)}px`,
                //       textAlign: 'center',
                //       boxSizing: 'border-box',
                //       display: 'table-cell',
                //       verticalAlign: 'middle',
                //       margin: 5,
                //       padding: 5,
                //     },
                //     '& .MuiDayCalendar-day': {
                //       minWidth: `${50 * (1 / zoomRatio)}px`,
                //       minHeight: `${50 * (1 / zoomRatio)}px`,
                //       width: `${50 * (1 / zoomRatio)}px`,
                //       height: `${50 * (1 / zoomRatio)}px`,
                //       fontSize: `${20 * (1 / zoomRatio)}px`,
                //       textAlign: 'center',
                //       boxSizing: 'border-box',
                //       display: 'table-cell',
                //       verticalAlign: 'middle',
                //       margin: '0',
                //       padding: '0',
                //     },
                //     '& .MuiSvgIcon-root':{
                //       fontSize: `${20 * (1 / zoomRatio)}px`,
                //       minWidth: `${50 * (1 / zoomRatio)}px`,
                //       minHeight: `${50 * (1 / zoomRatio)}px`,
                //       overflow: 'visible',
                //     },
                //     '& .MuiYearCalendar-root':{
                //       minWidth: `${400 * (1 / zoomRatio)}px`,
                //       minHeight: `${370 * (1 / zoomRatio)}px`,
                //       paddingLeft: `${20 * (1 / zoomRatio)}px`,
                //       paddingRight: `${20 * (1 / zoomRatio)}px`,
                //     },
                //     '& .MuiPickersYear-root': {
                //       fontSize: `${32 * (1 / zoomRatio)}px !important`,
                //       minWidth: `${60 * (1 / zoomRatio)}px`,
                //       minHeight: `${60 * (1 / zoomRatio)}px`,
                //       padding: `${10 * (1 / zoomRatio)}px`,
                //       display: 'flex',
                //       alignItems: 'center',
                //       justifyContent: 'center',
                //     },
                //     '& .MuiPickersYear-root button': {
                //       fontSize: `${32 * (1 / zoomRatio)}px !important`,
                //       minWidth: `${60 * (1 / zoomRatio)}px`,
                //       minHeight: `${60 * (1 / zoomRatio)}px`,
                //       padding: `${10 * (1 / zoomRatio)}px`,
                //       textAlign: 'center',
                //       boxSizing: 'border-box',
                //       display: 'flex',
                //       alignItems: 'center',
                //       justifyContent: 'center',
                //     },
                //     '& .MuiPickersYear-root button span': {
                //       fontSize: `${32 * (1 / zoomRatio)}px !important`,
                //       textAlign: 'center',
                //       width: '100%',
                //       display: 'inline-block',
                //     },
                //     '& .MuiDayCalendar-root': {
                //       display: 'table',
                //       width: 'auto',
                //       minWidth: `${350 * (1 / zoomRatio)}px`,
                //       boxSizing: 'border-box',
                //       padding: '0',
                //       margin: '0',
                //     },
                //     '& .MuiDayCalendar-weekContainer': {
                //       display: 'table-row',
                //     },
                //     '& .MuiDayCalendar-weekDayLabel': {
                //       display: 'table-cell',
                //       minWidth: `${50 * (1 / zoomRatio)}px`,
                //       maxWidth: `${50 * (1 / zoomRatio)}px`,
                //       width: `${50 * (1 / zoomRatio)}px`,
                //       fontSize: `${20 * (1 / zoomRatio)}px`,
                //       textAlign: 'center',
                //       boxSizing: 'border-box',
                //       verticalAlign: 'middle',
                //       margin: '0',
                //       padding: '0',
                //     },
                //     '& .MuiDayCalendar-day': {
                //       display: 'table-cell',
                //       minWidth: `${50 * (1 / zoomRatio)}px`,
                //       minHeight: `${50 * (1 / zoomRatio)}px`,
                //       width: `${50 * (1 / zoomRatio)}px`,
                //       height: `${50 * (1 / zoomRatio)}px`,
                //       fontSize: `${20 * (1 / zoomRatio)}px`,
                //       textAlign: 'center',
                //       boxSizing: 'border-box',
                //       verticalAlign: 'middle',
                //       margin: '0',
                //       padding: '0',
                //     },
                //     '& .MuiSvgIcon-root':{
                //       fontSize: `${20 * (1 / zoomRatio)}px`,
                //       minWidth: `${50 * (1 / zoomRatio)}px`,
                //       minHeight: `${50 * (1 / zoomRatio)}px`,
                //       overflow: 'visible',
                //     },
                //     '& .MuiYearCalendar-root':{
                //       minWidth: `${400 * (1 / zoomRatio)}px`,
                //       minHeight: `${370 * (1 / zoomRatio)}px`,
                //       paddingLeft: `${20 * (1 / zoomRatio)}px`,
                //       paddingRight: `${20 * (1 / zoomRatio)}px`,
                //     },
                //     '& .MuiPickersYear-root': {
                //       fontSize: `${32 * (1 / zoomRatio)}px !important`,
                //       minWidth: `${60 * (1 / zoomRatio)}px`,
                //       minHeight: `${60 * (1 / zoomRatio)}px`,
                //       padding: `${10 * (1 / zoomRatio)}px`,
                //       display: 'flex',
                //       alignItems: 'center',
                //       justifyContent: 'center',
                //     },
                //     '& .MuiPickersYear-root button': {
                //       fontSize: `${32 * (1 / zoomRatio)}px !important`,
                //       minWidth: `${60 * (1 / zoomRatio)}px`,
                //       minHeight: `${60 * (1 / zoomRatio)}px`,
                //       padding: `${10 * (1 / zoomRatio)}px`,
                //       textAlign: 'center',
                //       boxSizing: 'border-box',
                //       display: 'flex',
                //       alignItems: 'center',
                //       justifyContent: 'center',
                //     },
                //     '& .MuiPickersYear-root button span': {
                //       fontSize: `${32 * (1 / zoomRatio)}px !important`,
                //       textAlign: 'center',
                //       width: '100%',
                //       display: 'inline-block',
                //     },
                //     '& .MuiDayCalendar-root': {
                //       display: 'flex',
                //       flexWrap: 'wrap',
                //       justifyContent: 'flex-start',
                //       alignItems: 'flex-start',
                //       minWidth: `${400 * (1 / zoomRatio)}px`,
                //       minHeight: `${400 * (1 / zoomRatio)}px`,
                //       overflow: 'visible',
                //       boxSizing: 'border-box',
                //       padding: '0',
                //       margin: '0',
                //     },
                //     '& .MuiPickersSlideTransition-root':{
                //       minWidth: `${400 * (1 / zoomRatio)}px`,
                //       minHeight: `${400 * (1 / zoomRatio)}px`,
                //       overflow: 'visible',
                //     },
                //     '& .MuiDateCalendar-root': {
                //       minWidth: `${400 * (1 / zoomRatio)}px`,
                //       minHeight: `${400 * (1 / zoomRatio)}px`,
                //       //overflow: 'visible',
                //       padding: '2'
                //     },
                //     '& .MuiButtonBase-root': {
                //       fontSize: `${20 * (1 / zoomRatio)}px`,
                //       minWidth: `${50 * (1 / zoomRatio)}px`,
                //       minHeight: `${50 * (1 / zoomRatio)}px`,
                //       //overflow: 'visible',
                //     },
                //     '& .MuiDayCalendar-day': {
                //       minWidth: `${50 * (1 / zoomRatio)}px`,
                //       minHeight: `${50 * (1 / zoomRatio)}px`,
                //       width: `${50 * (1 / zoomRatio)}px`,
                //       height: `${50 * (1 / zoomRatio)}px`,
                //       fontSize: `${20 * (1 / zoomRatio)}px`,
                //       textAlign: 'center',
                //       boxSizing: 'border-box',
                //       margin: '0',
                //       padding: '0',
                //       display: 'inline-flex',
                //       alignItems: 'center',
                //       justifyContent: 'center',
                //     },
                //     '& .MuiDayCalendar-weekDayLabel:first-of-type': {
                //       paddingLeft: `${15 * (1 / zoomRatio)}px`, 
                //     },
                //     '& .MuiDayCalendar-weekContainer:first-of-type': {
                //       display: 'flex',
                //       justifyContent: 'flex-end',
                //       paddingRight: `${15 * (1 / zoomRatio)}px`,
                //     },
                //   }
                // },
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            <Typography sx={{
              fontSize: `${30 * (1 / zoomRatio)}px`,
              color: theme.palette.mode === "dark" ? "white" : "black",
              }}>
              Cancel
            </Typography>
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            <Typography sx={{
            marginLeft: `${30 * (1 / zoomRatio)}px`,
            marginRight: `${30 * (1 / zoomRatio)}px`,
            fontSize: `${30 * (1 / zoomRatio)}px`, color: theme.palette.mode === "dark" ? "white" : "black"
            }}>
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
