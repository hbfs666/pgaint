import React from "react";
import { Box, IconButton, Typography, Switch, Tooltip } from "@mui/material";
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import CloseIcon from "@mui/icons-material/Close";

const KanbanToolbar = ({
  autoRefreshEnabled,
  toggleAutoRefreshAndWakeLock,
  downSM,
  historyMode,
  setHistoryMode,
  setHistoryDate,
  zoomRatio,
  theme,
  HistoryDatePicker,
  handleCloseFromHistory,
  FullscreenButton,
  flash
}) => (
  <Tooltip arrow>
    {downSM ? (
      <IconButton
        onClick={toggleAutoRefreshAndWakeLock}
        sx={{
          position: "fixed",
          top: downSM ? "1px" : "8px",
          left: downSM ? "-5px" : "8px",
          color: autoRefreshEnabled ? "green" : "red",
          animation: autoRefreshEnabled && flash ? `${flash} 1s infinite` : "none",
          zIndex: 9999,
          width: "56px",
          height: "56px",
          padding: "50px",
          background: "transparent",
        }}
      >
        <CircleIcon sx={{ fontSize: 40 }} />
      </IconButton>
    ) : (
      <Box
        sx={{
          display: "flex",
          height: `${50 * (1 / zoomRatio)}px`,
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          top: 0,
          left: 0,
          width: "100%",
          padding: "8px",
          marginTop: `${16 * (1 / zoomRatio)}px`,
          background: "transparent",
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{
              color: theme.palette.mode === "dark" ? "white" : "black",
              marginRight: "8px",
              fontWeight: 1000,
              fontSize: `${25 * (1 / zoomRatio)}px`,
            }}
          >
            {`Auto Refresh`}
            
          </Typography>
          <Box
              sx={{
                transform: `scale(${2 * (1 / zoomRatio)})`,
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
                  marginTop: `${1 * (1 / zoomRatio)}px`,
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
          <HistoryDatePicker
            isMobile={false}
            setChooseDate={setHistoryDate}
            setHistoryMode={setHistoryMode}
            isHistoryMode={historyMode}
          />
          {historyMode ? (
            <IconButton onClick={handleCloseFromHistory}>
              <CloseIcon
                sx={{
                  height: `${30 * (1 / zoomRatio)}px`,
                  width: `${30 * (1 / zoomRatio)}px`,
                  marginLeft: `${10 * (1 / zoomRatio)}px`,
                  marginRight: `${10 * (1 / zoomRatio)}px`,
                  fill: theme.palette.mode === "dark" ? "white" : "black",
                }}
              />
            </IconButton>
          ) : null}
        </Box>
        <FullscreenButton />
      </Box>
    )}
  </Tooltip>
);

export default KanbanToolbar;
