import React, { useEffect, useState } from "react";
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
import { Table } from "antd";
import SkeletonBody from "../../../components/SkeletonBody";

import DelayedRender from "../../../components/DelayedRender";
import { BorderBottom, BorderLeft } from "@mui/icons-material";

const ActiveKanbanBody = ({ BodyJson }) => {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down("sm"));
  const downMD = useMediaQuery(theme.breakpoints.down("md"));
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));
  const downXL = useMediaQuery(theme.breakpoints.down("xl"));
  const [data, setData] = useState(null);
  const [zoomRatio, setZoomRatio] = useState(window.devicePixelRatio);

useEffect(() => {
  const handleZoom = () => {
    setZoomRatio(window.devicePixelRatio);
  };

  window.addEventListener("resize", handleZoom);
  return () => window.removeEventListener("resize", handleZoom);
}, []);

  useEffect(() => {
    if (BodyJson) {
      setData(processBodyData(BodyJson));
    } else {
      return;
    }
  }, [BodyJson, BodyJson.body]);

  const processBodyData = (bodyData) => {
    const groupedData = {};
    const result = [];
    bodyData.forEach((group) => {
      const { group_name, group_sequence, record } = group;

      if (!groupedData[group_name]) {
        groupedData[group_name] = { rowSpan: 0, records: [] };
      }

      groupedData[group_name].rowSpan += record.length;
      groupedData[group_name].records.push(...record);
    });

    for (const groupName in groupedData) {
      const group = groupedData[groupName];
      group.records.sort((a, b) => a.category_sequence - b.category_sequence);

      group.records.forEach((record, index) => {
        // Handle hourly data being null or empty array
        const hourlyData = record.hourly
          ? record.hourly.reduce((acc, curr) => {
              acc[curr.hour] = curr.qty;
              return acc;
            }, {})
          : {};

        const row = {
          key: `${groupName}-${record.category_sequence}-${index}`,
          group_name: groupName,
          category_name: record.category_name,
          wip: record.wip,
          ...hourlyData,
          total: Object.values(hourlyData).reduce((sum, qty) => sum + qty, 0),
          highlight: record.highlight ? record.highlight : "N",
          isCapacity: record.isCapacity,
          rowSpan: index === 0 ? group.rowSpan : 0,
          isEndOfGroup: index === group.records.length - 1 ? true : false,
        };
        result.push(row);
      });
    }

    return result;
  };
  const columns = [
    {
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor: theme.palette.mode === "dark" ? "#1a237e" : "#e3e6fa", // distinct blue for leftmost column
            textAlign: "center",
            borderRight: "none",
            borderBottom: "solid 5px #43a047",
            color: theme.palette.mode === "dark" ? "#fff" : "#1a237e",
            fontWeight: 900,
            fontSize: `${22 * (1 / zoomRatio)}px`,
            letterSpacing: 1.2,
            maxWidth: 90,
          },
        };
      },
      //fixed: "left",
      dataIndex: "group_name",
      key: "group_name",
      width: 90, // use maxWidth instead of minimal width
      onCell: (_, index) => {
        const row = data[index];
        return {
          rowSpan: row.rowSpan,
          style: {
            backgroundColor: theme.palette.mode === "dark" ? "#232b4d" : "#e3e6fa", // match header, distinct from rest
            color: theme.palette.mode === "dark" ? "#fff" : "#1a237e",
            borderBottom: "solid 5px #43a047",
            fontWeight: 800,
            fontSize: `${32 * (1 / zoomRatio)}px`,
            maxWidth: 90,
            whiteSpace: 'nowrap',
            padding: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }
        };
      },
      render: (value) => (
        <Typography
          fontSize={downSM ? "1.1rem" : "1.3rem"}
          fontWeight={900}
          style={{
            textOrientation: "sideways",
            writingMode: "vertical-lr",
            color: theme.palette.mode === "dark" ? "#fff" : "#1a237e",
            fontSize: `${38 *(1 / zoomRatio)}px`,
            letterSpacing: 1.2,
            maxWidth: 90,
            whiteSpace: 'nowrap',
            padding: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      title: "Summary",
      fixed: "left",
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor: "#43a047", // high contrast green
            textAlign: "center",
            borderRight: theme.palette.mode === "dark" ? "solid black" : "solid white",
            fontSize: `${28 * (1 / zoomRatio)}px`,
            color: "#fff",
            fontWeight: 900,
            letterSpacing: 1.2,
          },
        };
      },
      children: [ 
        {
          title: (
            <Typography
              textAlign="center"
              fontSize={18}
              fontWeight={900}
              style={{
                color: theme.palette.mode === "dark" ? "#b3e5fc" : "#1976d2",
                fontSize: `${28 * (1 / zoomRatio)}px`,
                letterSpacing: 1.2,
              }}
            >
              Position
            </Typography>
          ),
          onHeaderCell: () => {
            return {
              style: {
                backgroundColor: theme.palette.mode === "dark" ? "#2a3b4d" : "#e3f6fd", // soft blue for summary
                borderBottom: "solid 5px #43a047",
                borderRight: "solid 2px #43a047",
                padding: 0,
                color: theme.palette.mode === "dark" ? "#b3e5fc" : "#1976d2",
                fontWeight: 900,
                fontSize: `${22 * (1 / zoomRatio)}px`,
              },
            };
          },
          dataIndex: "category_name",
          key: "category_name",
          width: '1%',
          onCell: (rowValue, rowIndex) => {
            const isStriped = rowIndex % 2 === 1;
            return {
              style: {
                whiteSpace: 'nowrap',
                padding: '0 4px',
                textAlign: 'center',
                backgroundColor: theme.palette.mode === "dark"
                  ? isStriped ? "#395b7a" : "#2a3b4d"
                  : isStriped ? "#e3f6fd" : "#b3e5fc",
                borderBottom: "solid 5px #43a047",
                borderRight: "solid 2px #43a047",
                color: theme.palette.mode === "dark" ? "#b3e5fc" : "#1976d2",
                fontWeight: 800,
                fontSize: `${28 * (1 / zoomRatio)}px`,
              },
            };
          },
          render: (value, rowValue) => {
            const color =
              rowValue.isCapacity === true
                ? "#ff9800"
                : rowValue.highlight === "Y" && theme.palette.mode === "dark"
                ? "#fff176"
                : rowValue.highlight === "Y" && theme.palette.mode === "light"
                ? "#ff9800"
                : rowValue.highlight === undefined || rowValue.highlight !== "Y"
                ? theme.palette.mode === "dark"
                  ? "#fff"
                  : "#111"
                : "#111";

            return (
              <Typography
                textAlign="left"
                fontWeight={900}
                style={{
                  fontSize: `${32 *(1 / zoomRatio)}px`,
                  color: color,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: 0,
                  margin: 0,
                  letterSpacing: 1.1,
                }}
              >
                {value == 0 ? null : value}
              </Typography>
            );
          },
        },
        {
          title: (
            <Typography
              textAlign="center"
              fontSize={18}
              fontWeight={900}
              style={{
                color: theme.palette.mode === "dark" ? "#b3e5fc" : "#1976d2",
                fontSize: `${28 * (1 / zoomRatio)}px`,
                letterSpacing: 1.2,
              }}
            >
              Current
            </Typography>
          ),
          onHeaderCell: () => {
            return {
              style: {
                backgroundColor: theme.palette.mode === "dark" ? "#2a3b4d" : "#e3f6fd",
                borderBottom: "solid 5px #43a047",
                borderRight: "solid 2px #43a047",
                color: theme.palette.mode === "dark" ? "#b3e5fc" : "#1976d2",
                fontWeight: 900,
                fontSize: `${22 * (1 / zoomRatio)}px`,
              },
            };
          },
          dataIndex: "wip",
          key: "wip",
          width: 90,
          render: (value, rowValue) => {
            const color =
              rowValue.isCapacity === true
                ? "#ff9800"
                : rowValue.highlight === "Y" && theme.palette.mode === "dark" 
                ? "#fff176"
                : rowValue.highlight === "Y" && theme.palette.mode === "light"
                ? "#ff9800"
                : rowValue.highlight === undefined || rowValue.highlight !== "Y"
                ? theme.palette.mode === "dark"
                  ? "#fff"
                  : "#111"
                : "#111";
            return value == -1 ? null : (
              <Typography
                textAlign={"center"}
                fontWeight={900}
                style={{
                  color: color,
                  fontSize: `${42 *(1 / zoomRatio)}px`,
                  letterSpacing: 1.1,
                }}
              >
                {value <= 0 ? null : value}
              </Typography>
            );
          },
          onCell: (rowValue, rowIndex) => {
            const isStriped = rowIndex % 2 === 1;
            return {
              style: {
                backgroundColor: theme.palette.mode === "dark"
                  ? isStriped ? "#395b7a" : "#2a3b4d"
                  : isStriped ? "#e3f6fd" : "#b3e5fc",
                borderRight: "solid 2px #43a047",
                borderBottom: rowValue.isEndOfGroup
                  ? "solid 5px #43a047"
                  : null,
                color: theme.palette.mode === "dark" ? "#b3e5fc" : "#1976d2",
                fontWeight: 800,
                fontSize: `${28 * (1 / zoomRatio)}px`,
              },
            };
          },
        },
      ],
    },
    {
      title: "Hourly QTY",
      onHeaderCell: () => {
        return {
          style: { backgroundColor: "lightgreen", textAlign: "center"
          ,fontSize: `${25 * (1 / zoomRatio)}px`
          },
        };
      },
      children:[
        0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
      ].map((i) => ({
        title:(
          <Typography
            textAlign="center"
            fontSize={15}
            style={{ color: theme.palette.mode === "dark" ? "white" : "black"
              ,fontSize: `${30 * (1 / zoomRatio)}px`
            }}
          >
            {i}
          </Typography>
        ),
        onHeaderCell: () => {
          return {
            style: {
              backgroundColor:
                theme.palette.mode === "dark" ? "black" : "white",
              borderBottom: "solid 5px lightgreen",
              //borderRight:"solid 1px lightgreen",
            },
          };
        },
        dataIndex: `${i < 10 ? "0" : ""}${i}`,
        key: `${i < 10 ? "0" : ""}${i}`,
        width: 55,
        render: (value, rowValue) => {
          const color =
            rowValue.isCapacity === true
              ? "darkorange"
              : rowValue.highlight === "Y" && theme.palette.mode === "dark"
              ? "yellow"
              : rowValue.highlight === "Y" && theme.palette.mode === "light"
              ? "darkorange"
              : rowValue.highlight === undefined || rowValue.highlight !== "Y"
              ? theme.palette.mode === "dark"
                ? "white"
                : "black"
              : "black";
          return (
            <Typography
              textAlign="center"
              fontSize={20}
              fontWeight={600}
              style={{ color: color,
                fontSize: `${45 *(1 / zoomRatio)}px`
              }}
            >
              {value == 0 ? null : value}
            </Typography>
          );
        },
        onCell: (rowValue, rowIndex) => {
          const isStriped = rowIndex % 2 === 1;
          return {
            style: {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? isStriped
                    ? "#222"
                    : "#000"
                  : isStriped
                  ? "#f5f5f5"
                  : "#fff",
              borderRight:
                i == 23
                  ? "solid 2px lightgreen"
                  : theme.palette.mode === "dark"
                  ? "dashed 1px white"
                  : "dashed 1px black",
              borderBottom: rowValue.isEndOfGroup
                ? "solid 5px lightgreen"
                : null,
            },
          };
        },
      })),
    },
    {
      title: "Total",
      dataIndex: "total",
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor: theme.palette.mode === "dark" ? "black" : "white",
            textAlign: "center",
            color: theme.palette.mode === "dark" ? "white" : "black",
            borderBottom:"solid 5px lightgreen",
            fontSize: `${45 *(1 / zoomRatio)}px`
          },
        };
      },
      key: "total",
      width: 45,
      fixed: "right",
      render: (value, rowValue) => {
        const color =
          rowValue.isCapacity === true
            ? "darkorange"
            : rowValue.highlight === "Y" && theme.palette.mode === "dark"
            ? "yellow"
            : rowValue.highlight === "Y" && theme.palette.mode === "light"
            ? "darkorange"
            : rowValue.highlight === undefined || rowValue.highlight !== "Y"
            ? theme.palette.mode === "dark"
              ? "white"
              : "black"
            : "black";

        return (
          <Typography
            textAlign="center"
            fontSize={20}
            fontWeight={600}
            style={{ color: color,
              fontSize: `${45 *(1 / zoomRatio)}px`
            }}
          >
            {value <= 0 ? null : value}
          </Typography>
        );
      },
      onCell: (rowValue, rowIndex) => {
        const isStriped = rowIndex % 2 === 1;
        return {
          style: {
            backgroundColor: theme.palette.mode === "dark"
              ? isStriped
                ? "#222"
                : "#000"
              : isStriped
              ? "#f5f5f5"
              : "#fff",
            borderBottom: rowValue.isEndOfGroup ? "solid 5px lightgreen" : null,
          },
        };
      },
    },
  ];
  const [scrollHeight, setScrollHeight] = useState("100vh");

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const calculateScrollHeight = () => {
    const height = window.innerHeight;
    if (height < 600) {
      setScrollHeight("100vh");
    } else if (height < 900) {
      setScrollHeight("100vh");
    } else if (height < 1200) {
      setScrollHeight("100vh");
    } else if (height < 1450) {
      setScrollHeight("100vh");
    } else {
      // Handle cases where height is greater than 1450
      setScrollHeight("100vh"); // Or set a max percentage
    }
  };

  useEffect(() => {
    const debouncedResizeHandler = debounce(calculateScrollHeight, 100);
    calculateScrollHeight(); // Initial calculation
    window.addEventListener("resize", debouncedResizeHandler);
    return () => {
      window.removeEventListener("resize", debouncedResizeHandler);
    };
  }, []);

  //const maxWidth = downSM ? "88vw" : downMD ? "90vw" : downLG ? "95vw" : "97vw";
  //const scrollHeight = downSM ? "60vh" : downMD ? "55vh" : downLG ? "60vh" : "65vh";
  return (
    <DelayedRender Skeleton={SkeletonBody}>
      <Box sx={{ width: '100%', flex: '1 1 auto', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flex: '1 1 auto', minHeight: 0, overflow: 'auto', height: '100%' }}>
          {data ? (
            <Table
              columns={columns}
              dataSource={data}
              scroll={{ x: "max-content", y: '100%' }} // Table scrolls, page does not
              pagination={false}
              bordered
              size="small"
              style={{ height: '100%', maxHeight: '100%', overflow: 'auto' }}
            />
          ) : null}
        </Box>
      </Box>
    </DelayedRender>
  );
};

export default ActiveKanbanBody;