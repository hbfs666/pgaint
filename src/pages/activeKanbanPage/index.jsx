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
import { getKanbanRecord } from "../../api/apiClientService";
import { useMutation } from "@tanstack/react-query";
import { useError } from "../../context/ErrorHandlerContext";
import ActiveKanbanHeader from "../activeKanbanPage/header";
import ActiveKanbanBody from "../activeKanbanPage/body";
import SkeletonCard from "../../components/SkeletonCard";
import SkeletonBody from "../../components/SkeletonBody";
import useWakeLock from "../../components/WakeLock";
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import { keyframes } from "@mui/system";
import FullscreenButton from "../../components/FullScreen";

const flash = keyframes`
  20%, 100% { opacity: 1;transform: scale(1); filter: blur(0); }
  50% { opacity: 0.5; transform: scale(1.2); filter: blur(0);}
`;

const ActiveKanban = ({ props }) => {
  const [wakeLockEnabled, setWakeLockEnabled] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const showMessage = useError();
  const [rawJson, setRawJson] = useState(null);
  const [showLoading, setLoading] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Toggle auto-refresh and wake-lock
  const toggleAutoRefreshAndWakeLock = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    setWakeLockEnabled(!wakeLockEnabled);
    if (autoRefreshEnabled) {
      showMessage("Auto Refresh Enabled", "success");
    } else {
      showMessage("Auto Refresh Disabled", "info");
    }
  };

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
    },
  });
  useEffect(() => {
    if (props.mapping_key) {
      getData.mutate();
    }

    const interval = setInterval(() => {
      if (props.mapping_key && autoRefreshEnabled) {
        setRawJson(null);
        getData.mutate();
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [props.mapping_key, autoRefreshEnabled]);

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
      <Tooltip title="Toggle Auto-Refresh and Wake-Lock" arrow>
        {downSM ? (
          <IconButton
            onClick={toggleAutoRefreshAndWakeLock}
            sx={{
              position: "absolute",
              top: downSM ? "1px" : "8px",
              left: downSM ? "-5px" : "8px",
              color: autoRefreshEnabled ? "green" : "red",
              animation: autoRefreshEnabled ? `${flash} 1s infinite` : "none",
            }}
          >
            <CircleIcon />
          </IconButton>
        ) : (
          <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "fixed",  // Ensures the switch stays in the fixed position
            top: 0,             // Aligns to the top
            left: 0,            // Aligns to the left
            //margin: "1px",     // Adds some margin from the edges for better visibility
            //zIndex: 9999,       // Makes sure it's always on top of other elements
            marginLeft: "8px",
          }}
          >
            <Typography
              sx={{
                color: "white",
                marginRight: "8px",
                fontWeight: 1000,
              }}
            >
              Auto Refresh
              <Switch
              checked={autoRefreshEnabled}
              onChange={toggleAutoRefreshAndWakeLock}
              sx={{
                "& .MuiSwitch-thumb": {
                  backgroundColor: autoRefreshEnabled ? "lightgreen" : "red",
                  //animation: autoRefreshEnabled ? `${flash} 1s infinite` : "none",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: autoRefreshEnabled
                    ? "lightgreen"
                    : "lightcoral",
                },
              }}
            />
            </Typography>
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
