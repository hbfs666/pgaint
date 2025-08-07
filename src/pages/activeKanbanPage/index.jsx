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
import KanbanToolbar from "../../components/KanbanToolbar";

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

  const getData = useMutation({
    mutationFn: () => {
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
  
  return (
      <Box
        sx={{
          height: 'calc(100vh - 32px)',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          margin: 0,
          boxSizing: 'border-box',
          paddingLeft: { xs: '30px', sm: '50px' },
          paddingRight: { xs: '30px', sm: '100px' },
        }}
      >
        <KanbanToolbar
          autoRefreshEnabled={autoRefreshEnabled}
          toggleAutoRefreshAndWakeLock={toggleAutoRefreshAndWakeLock}
          downSM={downSM}
          historyMode={historyMode}
          setHistoryMode={setHistoryMode}
          setHistoryDate={setHistoryDate}
          zoomRatio={zoomRatio}
          theme={theme}
          HistoryDatePicker={HistoryDatePicker}
          handleCloseFromHistory={handleCloseFromHistory}
          FullscreenButton={FullscreenButton}
          flash={flash}
          sx={{ mt: 0, pt: 0, mb: 0, pb: 0 }} 
        />     
        <Box sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>{rawJson && rawJson.header ? (
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
        </Box>

        {bigMessage && (
          <Box
            sx={{
              position: "absolute",
              top: downSM ? 80 : 40,
              left: "50%",
              transform: "translateX(-50%)",
              background: bigMessage.type === "error" ? "#ff8a80" : "#90ee90",
              color: bigMessage.type === "error" ? "#b71c1c" : "#00695c",
              fontSize: `${30}px`,
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

        <Box
          sx={{
            flex: '1 1 auto',
            minHeight: 0,
            height: 'calc(100vh - 56px - 66px)', 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {rawJson && rawJson.body ? (
            <ActiveKanbanBody
              BodyJson={rawJson.body}
            />
          ) : (
            <SkeletonBody />
          )}
        </Box>
      </Box>
  );
};

export default ActiveKanban;
