import React, { useEffect, useState, useRef,useMemo } from "react";
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

// const chunkIntoParts = (arr,parts)=>{
//   const size = Math.ceil(arr.length/parts)
//   const chunks=[]
//   for(let i=0; i<arr.length;i+=size){
//     chunks.push(arr.slice(i,i+size))
//   }
//   return chunks
// }

const ActiveKanbanBody = ({ BodyJson }) => {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down("sm"));
  const downMD = useMediaQuery(theme.breakpoints.down("md"));
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));
  const downXL = useMediaQuery(theme.breakpoints.down("xl"));

  const getResponsiveFontSize = () => {
    if (downSM) return 12;
    if (downMD) return 16;
    if (downLG) return 20;
    if (downXL) return 24;
    return 40;
  };
  const fontSize = getResponsiveFontSize();

  //const [data, setData] = useState(null);
  const [zoomRatio, setZoomRatio] = useState(window.devicePixelRatio);
  const tableBoxRef = useRef(null);
  const [maxRowsPerTable, setMaxRowsPerTable] = useState(null);

  useEffect(() => {
    const handleZoom = () => {
      setZoomRatio(window.devicePixelRatio);
    };

    window.addEventListener("resize", handleZoom);
    return () => window.removeEventListener("resize", handleZoom);
  }, []);

  // function categoryChuncks(categories,size){
  //   let chunks=[]
  //   categories.forEach((item,index)=>{
  //     const groupIndex=Math.floor(index/size)
  //     if(!chunks[groupIndex]){
  //       chunks[groupIndex]=[]
  //     }
  //     chunks[groupIndex].push(item)
  //   })
  //   return chunks
  // }
  // useEffect(() => {
  //   if (BodyJson) {
  //     setData(processBodyData(categoryChuncks(BodyJson,3)[0]))
  //     //console.log(processBodyData(BodyJson))
  //   //setData(processBodyData(BodyJson))
  
  //   } else {
  //     return;
  //   }
  // }, [BodyJson]);

  // const partsCount = 4
  // const partitions=useMemo(()=>{
  //   if(!BodyJson)return []
  //   return chunkIntoParts(BodyJson,partsCount)
  // },[BodyJson,partsCount])

  const estimateMaxRows = () => {
    const rowHeight = fontSize + 35; 
    const availableHeight = window.innerHeight * 0.55;
    return Math.floor(availableHeight / rowHeight);
  };

  useEffect(() => {
    setMaxRowsPerTable(estimateMaxRows());
    const handleResize = () => {
      setMaxRowsPerTable(estimateMaxRows());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fontSize]);

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
  const hourlyColumns = [0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const hourlyColWidth = 90;

  const columns = [
    {
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor:
              theme.palette.mode === "dark" ? "#2b2b2b" : "lightgray",
            textAlign: "center",
            borderRight: "none",
            borderBottom: "solid 5px lightgreen",
          },
        };
      },
      dataIndex: "group_name",
      key: "group_name",
      width: 48, 
      onCell: (record)=>({
        rowSpan: record.rowSpan,
          style: {
            backgroundColor:
              theme.palette.mode === "dark" ? "#2b2b2b" : "lightgray",
            color: theme.palette.mode === "dark" ? "white" : "black",
            borderBottom: "solid 5px lightgreen",
          }
      }),
      render: (value) => (
        <Typography
          fontWeight={900}
          style={{
            textOrientation: "sideways",
            writingMode: "vertical-lr",
            color: theme.palette.mode === "dark" ? "white" : "black",
            fontSize: fontSize,
            maxWidth: 48,
            minWidth: 36,
            width: 48,
            padding: 0,
            margin: 0,
            overflow: 'visible',
            display: 'block',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            lineHeight: 1.1,
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
            backgroundColor: "lightgreen", 
            textAlign: "center",
            borderRight: theme.palette.mode === "dark" ? "solid black" : "solid white",
            fontSize: `${fontSize-15}px`,
            fontWeight: 600,
            letterSpacing: 1.2,
          },
        };
      },
      children: [ 
        {
          title: (
            <Typography
              textAlign="center"
              fontWeight={900}
              style={{
                color: theme.palette.mode === "dark" ? "#fff" : "#111",
                fontSize: `${fontSize-15}px`,
                letterSpacing: 1.2,
              }}
            >
              Position
            </Typography>
          ),
          onHeaderCell: () => {
            return {
              style: {
                backgroundColor: theme.palette.mode === "dark" ? "#181818" : "#fff", 
                borderBottom: "solid 5px #43a047",
                borderRight: "solid 5px #43a047",
                borderLeft: "solid 2px white",
                padding: 0,
                color: theme.palette.mode === "dark" ? "#fff" : "#111",
                fontWeight: 900,
                fontSize: `${fontSize}px`, 
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
                // padding: '6px 12px', 
                textAlign: 'center',
                backgroundColor: theme.palette.mode === "dark"
                  ? isStriped ? "#232323" : "#181818"
                  : isStriped ? "#f5f5f5" : "#fff",
                borderBottom: "solid 9px #43a047", 
                borderRight: "solid 5px #43a047",
                color: theme.palette.mode === "dark" ? "#fff" : "#111",
                fontWeight: 800,
                fontSize: `${fontSize}px`,
              },
            };
          },
          render: (value, rowValue) => {

            const color =

              rowValue.isCapacity === true

                ? "darkorange"

                : rowValue.highlight === "Y" && theme.palette.mode === "dark"

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
                textAlign="left"
                fontWeight={900}
                style={{
                  fontSize: fontSize-5,
                  color: color,
                  overflow: 'hidden',
                  padding: 0,
                  margin: 0,
                  letterSpacing: 1.1,
                  display: 'block',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}
              >
                {value == 0 ? null : value}
              </Typography>
            );
          },

          onCell: (rowValue) => {

            return {

              style: {

                backgroundColor:

                  theme.palette.mode === "dark" ? "black" : "white",

                borderRight: "solid 5px lightgreen",

                borderBottom: rowValue.isEndOfGroup

                  ? "solid 5px lightgreen"

                  : null,

              },

            };

          },
        },
        
        {
          title: (
            <Typography
              textAlign="center"
              fontWeight={900}
              style={{
                color: theme.palette.mode === "dark" ? "#fff" : "#111",
                fontSize: `${fontSize-15}px`,
                letterSpacing: 1.2,
              }}
            >
              Current
            </Typography>
          ),
          onHeaderCell: () => {
            return {
              style: {
                backgroundColor: theme.palette.mode === "dark" ? "#181818" : "#fff",
                borderBottom: "solid 5px #43a047",
                borderRight: "solid 5px #43a047",
                color: theme.palette.mode === "dark" ? "#fff" : "#111",
                fontWeight: 900,
                fontSize: `20px`,
                width: 80,
                minWidth: 60,
                maxWidth: 100,
                textAlign: 'center',
                padding: 0,
                whiteSpace: 'nowrap',
              },
            };
          },
          dataIndex: "wip",
          key: "wip",
          width: 80,
          minWidth: 60,
          maxWidth: 100,
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
                  fontSize: fontSize+10,
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  textOverflow: 'clip',
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: 0,
                  display: 'inline-block',
                  padding: 0,
                  margin: 0,
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
                  ? isStriped ? "#232323" : "#181818"
                  : isStriped ? "#f5f5f5" : "#fff",
                borderRight: "solid 5px #43a047",
                borderBottom: rowValue.isEndOfGroup
                  ? "solid 9px #43a047"
                  : null,
                color: theme.palette.mode === "dark" ? "#fff" : "#111",
                fontWeight: 800,
                fontSize: `${fontSize}px`,
                width: 80,
                minWidth: 60,
                maxWidth: 100,
                whiteSpace: 'nowrap',
                overflow: 'visible',
                textOverflow: 'clip',
                padding: 0,
                margin: 0,
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
          style: { backgroundColor: "lightgreen", textAlign: "center", fontSize: `${fontSize-15}px` },
        };
      },
      children: hourlyColumns.map((i) => ({
        title: (
          <Typography
            textAlign="center"
            style={{ color: theme.palette.mode === "dark" ? "white" : "black", fontSize: `${fontSize-10}px`, fontWeight:500, }}
          >
            {i}
          </Typography>
        ),
        onHeaderCell: () => {
          return {
            style: {
              backgroundColor: theme.palette.mode === "dark" ? "black" : "white",
              borderBottom: "solid 5px lightgreen",
              width: hourlyColWidth,
              minWidth: hourlyColWidth,
              maxWidth: hourlyColWidth,
              boxSizing: 'border-box',
              padding: 0,
            },
          };
        },
        dataIndex: `${i < 10 ? "0" : ""}${i}`,
        key: `${i < 10 ? "0" : ""}${i}`,
        width: hourlyColWidth,
        minWidth: hourlyColWidth,
        maxWidth: hourlyColWidth,
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
              fontWeight={600}
              style={{ color: color,
                fontSize: fontSize+20,
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
                  ? "solid 5px lightgreen"
                  : theme.palette.mode === "dark"
                  ? "dashed 1px white"
                  : "dashed 1px black",
              borderBottom: rowValue.isEndOfGroup ? "solid 9px lightgreen" : null,
              width: hourlyColWidth,
              minWidth: hourlyColWidth,
              maxWidth: hourlyColWidth,
              boxSizing: 'border-box',
              padding: 0,
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
            borderBottom: "solid 5px lightgreen",
            fontSize: fontSize-10,
            width: 80,
            minWidth: 60,
            maxWidth: 100,
            textAlign: 'center',
            padding: 0,
          },
        };
      },
      key: "total",
      width: 80,
      minWidth: 60,
      maxWidth: 100,
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
            textAlign={"center"}
            fontWeight={900}
            style={{
              color: color,
              fontSize: fontSize+10,
              whiteSpace: 'nowrap',
              overflow: 'visible',
              textOverflow: 'clip',
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              display: 'block',
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
            borderBottom: rowValue.isEndOfGroup ? "solid 9px lightgreen" : null,
            width: 80,
            minWidth: 60,
            maxWidth: 100,
            whiteSpace: 'nowrap',
            overflow: 'visible', 
            textOverflow: 'clip', 
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

      setScrollHeight("65vh");

    } else if (height < 1500) {

      setScrollHeight("70vh");

    } else {

      // Handle cases where height is greater than 1500
      setScrollHeight("80vh"); // Or set a max percentage

    }
  };

  useEffect(() => {
    const debouncedResizeHandler = debounce(calculateScrollHeight, 80);
    calculateScrollHeight(); 
    window.addEventListener("resize", debouncedResizeHandler);
    return () => {
      window.removeEventListener("resize", debouncedResizeHandler);
    };
  }, []);

const getPart = (data, maxRows) => {
  const part = [];
  let currentPart = [];
  let currentCount = 0;
  let lastGroup = null;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (lastGroup !== row.group_name && currentCount > 0 && currentCount + 1 > maxRows) {
      part.push(currentPart);
      currentPart = [];
      currentCount = 0;
    }
    currentPart.push(row);
    currentCount++;
    lastGroup = row.group_name;
  }
  if (currentPart.length > 0) part.push(currentPart);
  return part.map(part => {
    const groupRowCount = {};
    part.forEach(row => {
      groupRowCount[row.group_name] = (groupRowCount[row.group_name] || 0) + 1;
    });
    return part.map((row, idx) => {
      if (idx === 0 || row.group_name !== part[idx - 1].group_name) {
        row.rowSpan = groupRowCount[row.group_name];
      } else {
        row.rowSpan = 0;
      }
      return row;
    });
  });
};

  const getWidth = (numTables, columnsCount, minColWidth = 40, maxColWidth = 90) => {
    const viewportWidth = window.innerWidth;
    const otherColsWidth = 200; 
    let colWidth = maxColWidth;
    while (numTables * (columnsCount * colWidth + otherColsWidth) > viewportWidth && colWidth > minColWidth) {
      colWidth -= 2;
    }
    return Math.max(colWidth, minColWidth);
  };

  return (
    <DelayedRender Skeleton={SkeletonBody}>
      <Box ref={tableBoxRef}>
        {BodyJson && (() => {
          const flatData = processBodyData(BodyJson);
          const groupTables = getPart(flatData, maxRowsPerTable || 10);
          const colWidth = getWidth(groupTables.length, hourlyColumns.length);
          const patchedColumns = columns.map(col => {
            if (col.title === 'Hourly QTY') {
              return {
                ...col,
                children: col.children.map(child => ({
                  ...child,
                  width: colWidth,
                  minWidth: colWidth,
                  maxWidth: colWidth,
                  onHeaderCell: () => ({
                    style: {
                      ...child.onHeaderCell().style,
                      width: colWidth,
                      minWidth: colWidth,
                      maxWidth: colWidth,
                    }
                  })
                }))
              };
            }
            return col;
          });
          const gridItemWidth = `${Math.floor(100 / groupTables.length)}%`;
          return (
            <Grid container spacing={2} direction="row" wrap="nowrap">
              {groupTables.map((tableData, idx) => (
                <Grid item style={{ width: gridItemWidth, minWidth: 320, maxWidth: gridItemWidth, flex: '0 0 auto' }} key={idx}>
                  <Table
                    columns={patchedColumns}
                    dataSource={tableData}
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                    bordered
                    size="small"
                    style={{ width: '100%' }}
                  />
                </Grid>
              ))}
            </Grid>
          );
        })()}
      </Box>
    </DelayedRender>
  );
};

export default ActiveKanbanBody;
