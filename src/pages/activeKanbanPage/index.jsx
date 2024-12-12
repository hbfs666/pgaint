import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  TableContainer,
  Paper,
  Typography,
  Grid,
  Tooltip,
  IconButton,
  Switch,
} from "@mui/material";
import {
  getKanbanRecord,
  getKanbanHistoryRecord,
} from "../../api/apiClientService";
import { useMutation } from "@tanstack/react-query";
import { useError } from "../../context/ErrorHandlerContext";
import ActiveKanbanHeader from "../activeKanbanPage/header";
import ActiveKanbanBody from "../activeKanbanPage/body";
import SkeletonCard from "../../components/SkeletonCard";
import SkeletonBody from "../../components/SkeletonBody";
import useWakeLock from "../../components/WakeLock";
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import CloseIcon from "@mui/icons-material/Close";
import { keyframes } from "@mui/system";
import FullscreenButton from "../../components/FullScreen";
import HistoryDatePicker from "../../components/HistoryDatePicker";

const flash = keyframes`
  20%, 100% { opacity: 1;transform: scale(1); filter: blur(0); }
  50% { opacity: 0.5; transform: scale(1.2); filter: blur(0);}
`;

const ActiveKanban = ({ props }) => {
  const [wakeLockEnabled, setWakeLockEnabled] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const showMessage = useError();
  const [rawJson, setRawJson] = useState(null);
  const [currentMappingKey, setCurrentMappingKey] = useState(null);
  const [refreshLock, setRefreshLock] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const [historyMode, setHistoryMode] = useState(false);
  const [historyDate, setHistoryDate] = useState("");

  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Toggle auto-refresh and wake-lock
  const toggleAutoRefreshAndWakeLock = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    setWakeLockEnabled(!wakeLockEnabled);
    if (!autoRefreshEnabled) {
      setRefreshLock(false);
      showMessage("Auto Refresh Enabled", "success");
    } else {
      setRefreshLock(true);
      showMessage("Auto Refresh Disabled", "info");
    }
  };

  const handleCloseFromHistory = ()=>{
    setHistoryMode(false)
    setHistoryDate('')
    const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
      setCurrentDate(formattedDate);
      getData.mutate();
  }

  useEffect(() => {
    if (historyMode == true) {
      setAutoRefreshEnabled(false);
      setWakeLockEnabled(false);
      setRefreshLock(true);
      setCurrentDate(historyDate);
      getHistoryData.mutate()
    }
  }, [historyMode,historyDate]);

  // Handle wake-lock
  useWakeLock(wakeLockEnabled);

  const getData = useMutation({
    mutationFn: () => getKanbanRecord(props.mapping_key),
    onMutate: () => {},
    onError: (error) => {
      showMessage("Error getting kanban : " + error.message, "error");
      setRawJson(null);
    },
    onSuccess: (data) => {
      setRawJson(data);
      showMessage("Kanban fetched successfully", "success");
      setLastRefreshTime(new Date().toLocaleTimeString());
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
      setCurrentDate(formattedDate);
    },
  });

  const getHistoryData=useMutation({
    mutationFn:()=>getKanbanHistoryRecord(props.mapping_key,historyDate),
    onError: (error) => {
        showMessage("Error getting kanban history: " + error.message, "error");
        setRawJson(null);
      },
      onSuccess: (data) => {
        setRawJson(data);
        showMessage("Kanban history fetched successfully", "success");
        setLastRefreshTime(data.historyUpdateTime);
      },
  })

  useEffect(() => {
    if (currentMappingKey != null && !refreshLock) {
        setHistoryMode(false)
      getData.mutate();
    }

    const interval = setInterval(() => {
      if (props.mapping_key && autoRefreshEnabled) {
        setRawJson(null);
        getData.mutate();
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [currentMappingKey, autoRefreshEnabled]);

  useEffect(() => {
    if (props.mapping_key && props.mapping_key !== currentMappingKey) {
      setRefreshLock(false);
      setCurrentMappingKey(props.mapping_key);
    }
  }, [props.mapping_key]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  return (
    <Box sx={{ padding: downSM ? "8px" : "16px" }}>
      <Tooltip arrow>
        {downSM ? (
          <IconButton
            onClick={toggleAutoRefreshAndWakeLock}
            sx={{
              position: "fixed",
              top: downSM ? "1px" : "8px",
              left: downSM ? "-5px" : "8px",
              color: autoRefreshEnabled ? "green" : "red",
              animation: autoRefreshEnabled ? `${flash} 1s infinite` : "none",
              zIndex: 9999,
            }}
          >
            <CircleIcon />
          </IconButton>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Ensures the space between items
              position: "fixed", // Ensures the switch stays in the fixed position
              top: -10, // Aligns to the top
              left: 0, // Aligns to the left
              width: "100%", // Makes the box take full width
              padding: "8px", // Adds some padding for better visibility
              backgroundColor:
                theme.palette.mode === "dark" ? "black" : "white", // Semi-transparent background for better visibility
              zIndex: 1000, // Ensures the switch stays on top
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.mode === "dark" ? "white" : "black",
                  marginRight: "8px",
                  fontWeight: 1000,
                }}
              >
                {`Auto Refresh`}
                <Switch
                  checked={autoRefreshEnabled}
                  onChange={toggleAutoRefreshAndWakeLock}
                  sx={{
                    "& .MuiSwitch-thumb": {
                      backgroundColor: autoRefreshEnabled
                        ? "lightgreen"
                        : "red",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: autoRefreshEnabled ? "green" : "red",
                    },
                  }}
                />
              </Typography>
              <HistoryDatePicker
                isMobile={false}
                setChooseDate={setHistoryDate}
                setHistoryMode={setHistoryMode}
                isHistoryMode={historyMode}
              />
              {historyMode ? (
                <IconButton onClick={handleCloseFromHistory}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null}
            </Box>
            <FullscreenButton />
          </Box>
        )}
      </Tooltip>
      <Grid
        container
        direction="column"
        spacing={0.2}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item width="100%">
          {rawJson && rawJson.header ? (
            <ActiveKanbanHeader
              HeaderJson={rawJson.header}
              KanbanName={props.kanban_name}
              CurrentWorkingDay={currentDate}
              LastRefreshTime={lastRefreshTime}
              isHistory={historyMode}
            />
          ) : (
            <SkeletonCard />
          )}
        </Grid>
        <Grid item width="100%" maxHeight="80vh">
          {rawJson && rawJson.body ? (
            <ActiveKanbanBody BodyJson={rawJson.body} />
          ) : (
            <SkeletonBody />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActiveKanban;
