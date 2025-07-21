import React, { useEffect, useState } from "react";
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
  const showBigMessage = (msg, type) => {
    setBigMessage({ msg, type });
    setTimeout(() => setBigMessage(null), 1800);
  };
  const [bigMessage, setBigMessage] = useState(null);
  const [rawJson, setRawJson] = useState(null);
  const [currentMappingKey, setCurrentMappingKey] = useState(null);
  const [refreshLock, setRefreshLock] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const [historyMode, setHistoryMode] = useState(false);
  const [historyDate, setHistoryDate] = useState("");

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [zoomRatio, setZoomRatio] = useState(window.devicePixelRatio);

  useEffect(() => {
    const handleZoom = () => {
      setZoomRatio(window.devicePixelRatio);
    };
    window.addEventListener("resize", handleZoom);
    return () => window.removeEventListener("resize", handleZoom);
  }, []);

  // Toggle auto-refresh and wake-lock
  const toggleAutoRefreshAndWakeLock = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    setWakeLockEnabled(!wakeLockEnabled);
    if (!autoRefreshEnabled) {
      setRefreshLock(false);
      showBigMessage("Auto Refresh Enabled", "success");
    } else {
      setRefreshLock(true);
      showBigMessage("Auto Refresh Disabled", "info");
    }
  };

  const handleCloseFromHistory = () => {
    setHistoryMode(false);
    setHistoryDate("");
    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);
    getData.mutate();
  };

  useEffect(() => {
    if (historyMode === true) {
      setAutoRefreshEnabled(false);
      setWakeLockEnabled(false);
      setRefreshLock(true);
      setCurrentDate(historyDate);
      getHistoryData.mutate();
    }
  }, [historyMode, historyDate]);

  // Handle wake-lock
  useWakeLock(wakeLockEnabled);

  const startProgressBar = () => {
    setShowProgress(true);
    setLoadingProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        setLoadingProgress(100);
        clearInterval(interval);
        setTimeout(() => setShowProgress(false), 400);
      } else {
        setLoadingProgress(progress);
      }
    }, 120);
  };

  // Trigger progress bar on data fetch
  const getData = useMutation({
    mutationFn: () => {
      startProgressBar();
      return getKanbanRecord(props.mapping_key);
    },
    onMutate: () => {},
    onError: (error) => {
      showBigMessage("Error getting kanban : " + error.message, "error");
      setRawJson(null);
    },
    onSuccess: (data) => {
      setRawJson(data);
      showBigMessage("Kanban fetched successfully", "success");
      setLastRefreshTime(new Date().toLocaleTimeString());
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
      setCurrentDate(formattedDate);
      //triggerEmoji();
    },
  });

  const getHistoryData = useMutation({
    mutationFn: () => getKanbanHistoryRecord(props.mapping_key, historyDate),
    onError: (error) => {
      showBigMessage("Error getting kanban history: " + error.message, "error");
      setRawJson(null);
    },
    onSuccess: (data) => {
      setRawJson(data);
      showBigMessage("Kanban history fetched successfully", "success");
      setLastRefreshTime(data.historyUpdateTime);
    },
  });

  useEffect(() => {
    if (currentMappingKey != null && !refreshLock) {
      setHistoryMode(false);
      getData.mutate();
    }

    const interval = setInterval(() => {
      if (props.mapping_key && autoRefreshEnabled) {
        setRawJson(null);
        getData.mutate();
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval);
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
  
  useEffect(() => {
    const today = new Date();
  })
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: downSM ? "8px" : "16px",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative", 
        paddingTop: "590px",
      }}
    >
      {showProgress && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "6px",
            background: theme.palette.mode === "dark" ? "#222" : "#eee",
            zIndex: 99999,
            transition: "opacity 0.4s",
            opacity: showProgress ? 1 : 0,
            pointerEvents: showProgress ? "auto" : "none",
          }}
        >
          <Box
            sx={{
              width: `${loadingProgress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #90ee90, #00bcd4)",
              transition: "width 0.2s",
            }}
          />
        </Box>
      )}
      {bigMessage && (
        <Box
          sx={{
            position: "absolute",
            top: downSM ? 80 : 40,
            left: "50%",
            transform: "translateX(-50%)",
            background: bigMessage.type === "error" ? "#ff8a80" : "#90ee90",
            color: bigMessage.type === "error" ? "#b71c1c" : "#00695c",
            fontSize: `${30 * (1 / zoomRatio)}px`,
            fontWeight: 900,
            px: 4,
            py: 2,
            borderRadius: 3,
            boxShadow: 3,
            zIndex: 100000,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {bigMessage.msg}
        </Box>
      )}
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
              width: "56px",
              height: "56px",
              padding: 0,
            }}
          >
            <CircleIcon sx={{ fontSize: 40 }} />
          </IconButton>
        ) : (
          <Box
            sx={{
              display: "fixed",
              height: `${50 * (1 / zoomRatio)}px`,
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              top: 0,
              left: 0,
              width: "100%",
              padding: "8px",
              backgroundColor:
                theme.palette.mode === "dark" ? "black" : "white",
              zIndex: 1,
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
                  fontSize: `${25 * (1 / zoomRatio)}px`,
                }}
              >
                {`Auto Refresh`}
                <Box
                  sx={{
                    transform: `scale(${ 2 * (1 / zoomRatio)})`,
                    transformOrigin: "left center",
                    display: "inline-block",
                  }}
                >
                  <Switch
                    checked={autoRefreshEnabled}
                    onChange={toggleAutoRefreshAndWakeLock}
                    sx={{
                      marginLeft: `${2 * (1 / zoomRatio)}px`,
                      marginRight: `${150 * (1 / zoomRatio)}px`,
                      marginTop: `${-5 * (1 / zoomRatio)}px`,
                      "& .MuiSwitch-thumb": {
                        backgroundColor: autoRefreshEnabled ? "lightgreen" : "red",
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: autoRefreshEnabled ? "#90ee90" : "#ff8a80",
                        opacity: 1,
                      },
                    }}
                  />
                </Box>
              </Typography>
              <HistoryDatePicker
                isMobile={false}
                setChooseDate={setHistoryDate}
                setHistoryMode={setHistoryMode}
                isHistoryMode={historyMode}
              />
              {historyMode ? (
                <IconButton
                  onClick={handleCloseFromHistory}
                >
                  <CloseIcon sx={{
                    height: `${30 * (1 / zoomRatio)}px`,
                    width: `${30 * (1 / zoomRatio)}px`,
                    marginLeft: `${10 * (1 / zoomRatio)}px`,
                    marginRight: `${10 * (1 / zoomRatio)}px`,
                    fill: theme.palette.mode === "dark" ? "white" : "black"
                  }}/>
                </IconButton>
              ) : null}
            </Box>
            <FullscreenButton />
          </Box>
        )}
      </Tooltip>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          marginTop: "8px",
          min: 0,
        }}
      >
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
          <Grid item width="100%">
            {rawJson && rawJson.body ? (
              <ActiveKanbanBody BodyJson={rawJson.body} />
            ) : (
              <SkeletonBody />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ActiveKanban;
