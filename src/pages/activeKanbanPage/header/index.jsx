import React, { useMemo, useEffect, useState, lazy } from "react";
import {
  Box,
  TableContainer,
  Paper,
  Avatar,
  Grid,
  Menu,
  MenuItem,
  useTheme,
  Typography,
  Button,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useError } from "../../../context/ErrorHandlerContext";
import SkeletonCard from "../../../components/SkeletonCard";
import MainCard from "../../../components/MainCard";
import DelayedRender from "../../../components/DelayedRender";

const getQtyForGroup = (headerData, groupName) => {
  const group = headerData.find((group) => group.group_name === groupName);
  if (group) {
    if (group.record.length === 1) {
      return group.record.length === 1 ? group.record[0].qty : 0;
    }
    if (group.record.length > 1) {
      return group.record.map(({ category_name, qty }) => ({
        category_name,
        qty,
      }));
    }
  }
  return 0;
  //return group && group.record.length > 0 ? group.record[0].qty : 0;
};

const ActiveKanbanHeader = ({
  HeaderJson,
  KanbanName,
  CurrentWorkingDay,
  LastRefreshTime,
  isHistory,
}) => {
  const showMessage = useError();
  const showBigMessage = (msg, type) => {
    setBigMessage({ msg, type });
    setTimeout(() => setBigMessage(null), 1800);
  };
  const [bigMessage, setBigMessage] = useState(null);
  const [inputQty, setInputQty] = useState(0);
  const [wipQty, setWipQty] = useState(0);
  const [outputQty, setOutputQty] = useState(0);
  const theme = useTheme();
  const downXL = useMediaQuery(theme.breakpoints.down("xl"));
  const downSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [zoomRatio, setZoomRatio] = useState(window.devicePixelRatio);

  useEffect(() => {
  const handleZoom = () => {
    setZoomRatio(window.devicePixelRatio);
  };

  window.addEventListener("resize", handleZoom);
  return () => window.removeEventListener("resize", handleZoom);
  }, []);

  useEffect(() => {
    if (HeaderJson == null || HeaderJson == undefined) {
      showBigMessage("error reading header data", "error");
      return;
    }
    setInputQty(getQtyForGroup(HeaderJson, "INPUT"));
    setWipQty(getQtyForGroup(HeaderJson, "WIP"));
    setOutputQty(getQtyForGroup(HeaderJson, "OUTPUT"));
  }, [HeaderJson]);
  return (
    <DelayedRender Skeleton={SkeletonCard}>
      <MainCard
        border={false}
        content={false}
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "black" : "white",
          color: "#fff",
          boxShadow: 3, 
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: '100%',
          minHeight: 200,
          
          "&:after": {
            content: '""',
            position: "absolute",
            width: 120, 
            height: 70, 
            background: theme.palette.secondary[800],
            borderRadius: "50%",
            top: { xs: -60, sm: -40 }, 
            right: { xs: -100, sm: -70 }, 
            pointerEvents: 'none', 
          },
          "&:before": {
            content: '""',
            position: "absolute",
            width: 120,
            height: 120,
            background: theme.palette.secondary[800],
            borderRadius: "50%",
            top: { xs: -110, sm: -90 },
            right: { xs: -30, sm: 30 },
            opacity: 0.5,
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            p: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent={downSM ? "center" : "space-between"}
            sx={{ mb: 0.5 }}
          >
            {downSM ? null : (
              <Grid item>
                <Grid container direction="row" alignItems="start">
                  <Grid item>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        marginRight: 3,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        fontSize: `${14 *(1 / zoomRatio)}px`
                      }}
                    >
                      {isHistory?`History`:`Working Day`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        fontSize: `${14 *(1 / zoomRatio)}px`
                      }}
                    >
                      {CurrentWorkingDay}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid item>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: theme.palette.mode === "dark" ? "white" : "black",
                  fontSize: `${16 *(1 / zoomRatio)}px`
                }}
              >
                {KanbanName}
              </Typography>
            </Grid>
            {downSM ? null : (
              <Grid item>
                <Grid container direction="row" alignItems="end">
                  <Grid item>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        marginRight: 3,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        fontSize: `${14 *(1 / zoomRatio)}px`,
                      }}
                    >
                      {`Last Update`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        fontSize: `${14 *(1 / zoomRatio)}px`
                      }}
                    >
                      {LastRefreshTime}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>

          <Divider
            orientation="horizontal"
            flexItem
            sx={{ borderBottomWidth: 5, my: 1.5 }}
          />
          <Grid container direction="row" justifyContent="space-between" mt={1.5} sx={{ minHeight: `${90 * (1 / zoomRatio)}px`, alignItems: 'center' }}>
            <Grid item>
              <Grid
                container
                alignItems="center"
                direction="row"
                justifyContent="center"
              >
                <Grid item>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.mode === "dark" ? "white" : "black",
                      fontSize: `${45 *(1 / zoomRatio)}px`,
                      marginRight: 5,
                    }}
                  >
                    WIP
                  </Typography>
                </Grid>
                <Grid item>
                  {Array.isArray(wipQty) ? (
                    <Grid container direction="column" alignItems="stretch"
                    >
                      {wipQty.map((item, index) => (
                        <Grid item key={index}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={0.5}
                          >
                            {item.category_name?<Grid item>
                              <Typography
                                sx={{
                                  fontSize: `${26 *(1 / zoomRatio)}px`,
                                  fontWeight: 400,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {item.category_name}
                              </Typography>
                            </Grid>:null}
                            <Grid item>
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                  textAlign: "left",
                                  fontSize: `${45 *(1 / zoomRatio)}px`,
                                  minHeight: `${42 * (1 / zoomRatio)}px`,  
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {item.qty <= 0 ? "\u00A0" : item.qty}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      sx={{
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        fontWeight: 500,
                        fontSize: `${85 *(1 / zoomRatio)}px`,
                        minHeight: `${42 * (1 / zoomRatio)}px`, 
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {wipQty <= 0 ? "\u00A0" : wipQty}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                alignItems="center"
                direction="row"
                justifyContent="center"
              >
                <Grid item>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "darkorange",
                      fontSize: `${45 *(1 / zoomRatio)}px`,
                      marginRight: 5,
                    }}
                  >
                    INPUT
                  </Typography>
                </Grid>
                <Grid item>
                  {Array.isArray(inputQty) ? (
                    <Grid container direction="column" alignItems="stretch" >
                      {inputQty.map((item, index) => (
                        <Grid item key={index}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={0.5}
                          >
                            {item.category_name?<Grid item>
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                    fontSize: `${26 *(1 / zoomRatio)}px`
                                }}
                              >
                                {item.category_name}
                              </Typography>
                            </Grid>:null}
                            <Grid item>
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                  textAlign: "left",
                                  fontSize: `${45 *(1 / zoomRatio)}px`,
                                  minHeight: `${42 * (1 / zoomRatio)}px`,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {item.qty <= 0 ? "\u00A0" : item.qty}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        fontSize: `${85 *(1 / zoomRatio)}px`,
                        minHeight: `${42 * (1 / zoomRatio)}px`,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {inputQty <= 0 ? "\u00A0" : inputQty}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                alignItems="center"
                direction="row"
                justifyContent="center"
                sx={{ minHeight: `${30 * (1 / zoomRatio)}px` }} 
              >
                <Grid item sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "darkorange",
                      fontSize: `${45 *(1 / zoomRatio)}px`,
                      marginRight: 5,
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    OUTPUT
                  </Typography>
                </Grid>
                <Grid item>
                  {Array.isArray(outputQty) ? (
                    <Grid container direction="column" alignItems="stretch">
                      {outputQty.map((item, index) => (
                        <Grid item key={index}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={0.5}
                          >
                            {item.category_name?<Grid item>
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                  fontSize: `${26 *(1 / zoomRatio)}px`
                                }}
                              >
                                {item.category_name}
                              </Typography>
                            </Grid>:null}
                            <Grid item>
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                  textAlign: "left",
                                  fontSize: `${45 *(1 / zoomRatio)}px`,
                                  minHeight: `${42 * (1 / zoomRatio)}px`,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {item.qty <= 0 ? "\u00A0" : item.qty}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        fontSize: `${85 *(1 / zoomRatio)}px`,
                        minHeight: `${42 * (1 / zoomRatio)}px`,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {outputQty <= 0 ? null : outputQty}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </MainCard>
    </DelayedRender>
  );
};

export default ActiveKanbanHeader;
