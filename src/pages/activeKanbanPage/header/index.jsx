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
  const [inputQty, setInputQty] = useState(0);
  const [wipQty, setWipQty] = useState(0);
  const [outputQty, setOutputQty] = useState(0);
  const theme = useTheme();
  const downXL = useMediaQuery(theme.breakpoints.down("xl"));
  const downSM = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    if (HeaderJson == null || HeaderJson == undefined) {
      showMessage("error reading header data", "error");
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
          overflow: "hidden",
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            width: 210,
            height: 210,
            background: theme.palette.secondary[800],
            borderRadius: "50%",
            top: { xs: -105, sm: -85 },
            right: { xs: -140, sm: -95 },
          },
          "&:before": {
            content: '""',
            position: "absolute",
            width: 210,
            height: 210,
            background: theme.palette.secondary[800],
            borderRadius: "50%",
            top: { xs: -155, sm: -125 },
            right: { xs: -70, sm: -15 },
            opacity: 0.5,
          },
        }}
      >
        <Box
          sx={{ p: 2 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Grid
            container
            direction="row"
            justifyContent={downSM ? "center" : "space-between"}
          >
            {downSM ? null : (
              <Grid item>
                <Grid container direction="column" alignItems="start">
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 400,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                      }}
                    >
                      {isHistory?`History`:`Working Day`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
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
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: theme.palette.mode === "dark" ? "white" : "black",
                }}
              >
                {KanbanName}
              </Typography>
            </Grid>
            {downSM ? null : (
              <Grid item>
                <Grid container direction="column" alignItems="end">
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 400,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                      }}
                    >
                      {`Last Update`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
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
            sx={{ borderBottomWidth: 3 }}
          />
          <Grid container direction="row" justifyContent="space-between" mt={1}>
            <Grid item>
              <Grid
                container
                alignItems="center"
                direction="column"
                justifyContent="center"
              >
                <Grid item>
                  <Typography
                    sx={{
                      fontSize: downSM ? "0.8rem" : "1.5rem",
                      fontWeight: 700,
                      color: theme.palette.mode === "dark" ? "white" : "black",
                    }}
                  >
                    WIP
                  </Typography>
                </Grid>
                <Grid item>
                  {Array.isArray(wipQty) ? (
                    <Grid container direction="column" alignItems="stretch">
                      {wipQty.map((item, index) => (
                        <Grid item key={index}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                          >
                            {item.category_name?<Grid item>
                              <Typography
                                sx={{
                                  fontSize: downSM ? "0.5rem" : "1.2rem",
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
                                  fontSize: downSM ? "1.5rem" : "2.3rem",
                                  fontWeight: 500,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                  textAlign: "left",
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
                        fontSize: downSM ? "1.8rem" : "2.5rem",
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
                        fontWeight: 500,
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
                direction="column"
                justifyContent="center"
              >
                <Grid item>
                  <Typography
                    sx={{
                      fontSize: downSM ? "0.8rem" : "1.5rem",
                      fontWeight: 700,
                      color: "darkorange",
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
                            spacing={1}
                          >
                            {item.category_name?<Grid item>
                              <Typography
                                sx={{
                                  fontSize: downSM ? "0.5rem" : "1.2rem",
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
                                  fontSize: downSM ? "1.5rem" : "2.3rem",
                                  fontWeight: 500,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                  textAlign: "left",
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
                        fontSize: downSM ? "1.8rem" : "2.5rem",
                        fontWeight: 500,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
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
                direction="column"
                justifyContent="center"
              >
                <Grid item>
                  <Typography
                    sx={{
                      fontSize: downSM ? "0.8rem" : "1.5rem",
                      fontWeight: 700,
                      color: "darkorange",
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
                            spacing={1}
                          >
                            {item.category_name?<Grid item>
                              <Typography
                                sx={{
                                  fontSize: downSM ? "0.5rem" : "1.2rem",
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
                                  fontSize: downSM ? "1.5rem" : "2.3rem",
                                  fontWeight: 500,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                  textAlign: "left",
                                  
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
                        fontSize: downSM ? "1.8rem" : "2.5rem",
                        fontWeight: 500,
                        color:
                          theme.palette.mode === "dark" ? "white" : "black",
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
