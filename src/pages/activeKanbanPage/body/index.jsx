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
          rowSpan: index === 0 ? group.rowSpan : 0,
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
            backgroundColor: theme.palette.mode === "dark" ? "#2b2b2b" : "lightgray",
            textAlign: "center",
            broderRight: "none",
          },
        };
      },
      //fixed: "left",
      dataIndex: "group_name",
      key: "group_name",
      //width: 20,
      width: downSM ? 55 : 40,
    //   flex:1,
      onCell: (_, index) => {
        const row = data[index];
        return {
          rowSpan: row.rowSpan,
          style: {
            
            backgroundColor:
              theme.palette.mode === "dark" ? "#2b2b2b" : "lightgray",
            color: theme.palette.mode === "dark" ? "white" : "black",
          },
        };
      },
      render: (value) => (
        <Typography
          fontSize={downSM?"0.8rem":"1rem"}
          fontWeight={700}
          style={{
            textOrientation: "sideways",
            writingMode: "vertical-lr",
            color: theme.palette.mode === "dark" ? "white" : "black",
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
          style: { backgroundColor: "lightgreen", textAlign: "center",borderRight:theme.palette.mode === "dark" ? "solid black" : "solid white" },
        };
      },
      children: [
        {
          title: (
            <Typography
              textAlign="center"
              fontSize={15}
              fontWeight={700}
              style={{
                color: theme.palette.mode === "dark" ? "white" : "black",
              }}
            >
              Position
            </Typography>
          ),
          onHeaderCell: () => {
            return {
              style: {
                backgroundColor:
                  theme.palette.mode === "dark" ? "black" : "white",
                borderBottom: "solid 2px lightgreen",
                borderRight: "solid 2px lightgreen",
              },
            };
          },
          dataIndex: "category_name",
          key: "category_name",
          width: 100,
          fixed: "left",
          render: (value, rowValue) => {
            const color =
              rowValue.highlight === "Y" && theme.palette.mode === "dark"
                ? "yellow" // Use darkyellow if highlight is 'Y' and in dark mode
                : rowValue.highlight === "Y" && theme.palette.mode === "light"
                ? "darkorange" // Use orange if highlight is 'Y' and in light mode
                : rowValue.highlight === undefined || rowValue.highlight !== "Y"
                ? theme.palette.mode === "dark"
                  ? "white" // Use white if highlight is not 'Y' and dark mode
                  : "black" // Use black if highlight is not 'Y' and light mode
                : "black"; // Default to black if rowValue.highlight is undefined or doesn't match 'Y'

            return (
              <Typography
                textAlign={"left"}
                fontWeight={700}
                fontSize={14}
                style={{
                  color: color,
                }}
              >
                {value}
              </Typography>
            );
          },
          onCell: () => {
            return {
              style: {
                backgroundColor:
                  theme.palette.mode === "dark" ? "black" : "white",
                borderRight: "solid 2px lightgreen",
              },
            };
          },
        },
        {
          title: (
            <Typography
              textAlign="center"
              fontSize={15}
              fontWeight={700}
              style={{
                color: theme.palette.mode === "dark" ? "white" : "black",
              }}
            >
              Current
            </Typography>
          ),
          onHeaderCell: () => {
            return {
              style: {
                backgroundColor:
                  theme.palette.mode === "dark" ? "black" : "white",
                borderBottom: "solid 2px lightgreen",
                borderRight: "solid 2px lightgreen",
              },
            };
          },
          dataIndex: "wip",
          key: "wip",
          width: 90,
          render: (value, rowValue) => {
            const color =
              rowValue.highlight === "Y" && theme.palette.mode === "dark"
                ? "yellow" // Use darkyellow if highlight is 'Y' and in dark mode
                : rowValue.highlight === "Y" && theme.palette.mode === "light"
                ? "darkorange" // Use orange if highlight is 'Y' and in light mode
                : rowValue.highlight === undefined || rowValue.highlight !== "Y"
                ? theme.palette.mode === "dark"
                  ? "white" // Use white if highlight is not 'Y' and dark mode
                  : "black" // Use black if highlight is not 'Y' and light mode
                : "black"; // Default to black if rowValue.highlight is undefined or doesn't match 'Y'
            return value == -1 ? null : (
              <Typography
                textAlign={"center"}
                fontSize={20}
                fontWeight={600}
                style={{
                  color: color,
                }}
              >
                {value <= 0 ? null : value}
              </Typography>
            );
          },
          onCell: () => {
            return {
              style: {
                backgroundColor:
                  theme.palette.mode === "dark" ? "black" : "white",
                borderRight: "solid 2px lightgreen",
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
          style: { backgroundColor: "lightgreen", textAlign: "center" },
        };
      },
      children: [
        0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
      ].map((i) => ({
        title: (
          <Typography
            textAlign="center"
            fontSize={15}
            style={{ color: theme.palette.mode === "dark" ? "white" : "black" }}
          >
            {i}
          </Typography>
        ),
        onHeaderCell: () => {
          return {
            style: {
              backgroundColor:
                theme.palette.mode === "dark" ? "black" : "white",
              borderBottom: "solid 2px lightgreen",
            },
          };
        },
        dataIndex: `${i < 10 ? "0" : ""}${i}`,
        key: `${i < 10 ? "0" : ""}${i}`,
        width: 55,
        render: (value, rowValue) => {
          const color =
            rowValue.highlight === "Y" && theme.palette.mode === "dark"
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
              style={{ color: color }}
            >
              {value == 0 ? null : value}
            </Typography>
          );
        },
        onCell: () => {
          return {
            style: {
              backgroundColor:
                theme.palette.mode === "dark" ? "black" : "white",
              borderRight:
                i == 23
                  ? "solid 2px lightgreen"
                  : theme.palette.mode === "dark"
                  ? "dashed 1px white"
                  : "dashed 1px black",
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
          style: { backgroundColor: theme.palette.mode === "dark" ? "black" : "white", textAlign: "center",color:theme.palette.mode === "dark" ? "white" : "black" },
        };
      },
      key: "total",
      width: 40,
      fixed: "right",
      render: (value,rowValue) => {
        const color =
            rowValue.highlight === "Y" && theme.palette.mode === "dark"
              ? "yellow"
              : rowValue.highlight === "Y" && theme.palette.mode === "light"
              ? "darkorange"
              : rowValue.highlight === undefined || rowValue.highlight !== "Y"
              ? theme.palette.mode === "dark"
                ? "white"
                : "black"
              : "black";
        
        return(<Typography
          textAlign="center"
          fontSize={20}
          fontWeight={600}
          style={{ color: color }}
        >
          {value <= 0 ? null : value}
        </Typography>)
      },
      onCell: () => {
        return {
          style: {
            backgroundColor: theme.palette.mode === "dark" ? "black" : "white",
          },
        };
      },
    },
  ];
  const [scrollHeight, setScrollHeight] = useState("80vh");

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
        setScrollHeight("55vh");
      } else if (height < 900) {
        setScrollHeight("60vh");
      } else if (height < 1200) {
        setScrollHeight("60vh");
      } else if (height < 1500) {
        setScrollHeight("70vh");
      } else {
        // Handle cases where height is greater than 1500
        setScrollHeight("80vh"); // Or set a max percentage
      }
  };

  useEffect(() => {
    const debouncedResizeHandler = debounce(calculateScrollHeight, 80);
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
      <Box >
        {data ? (
          <Table
            columns={columns}
            dataSource={data}
            scroll={{ x: "max-content", y: scrollHeight }}
            pagination={false}
            bordered
            size="small"
          />
        ) : null}
      </Box>
    </DelayedRender>
  );
};

export default ActiveKanbanBody;
