import React, { useRef, useEffect, useState } from "react";
import { Box, TableContainer, Paper, Typography } from "@mui/material";
import Header from "../../components/header";
import KanbanSettingHeader from "../../components/kanbanSettingHeader";
import { useMutation } from "@tanstack/react-query";
import { Badge, Dropdown, Space, Table, Progress, Descriptions } from "antd";
import Skeleton from '@mui/material/Skeleton';

import { getKanbanRecord } from "../../api/apiClientService";

const TestPage = ({ props }) => {
  // const processBodyData = (bodyData) => {
  //   const groupedData = {};
  //   const result = [];

  //   bodyData.forEach((group) => {
  //     const { group_name, group_sequence, record } = group;

  //     if (!groupedData[group_name]) {
  //       groupedData[group_name] = { rowSpan: 0, records: [] };
  //     }

  //     groupedData[group_name].rowSpan += record.length;
  //     groupedData[group_name].records.push(...record);
  //   });
  //   for (const groupName in groupedData) {
  //     const group = groupedData[groupName];
  //     group.records.sort((a, b) => a.category_sequence - b.category_sequence);

  //     group.records.forEach((record, index) => {
  //       const hourlyData = record.hourly.reduce((acc, curr) => {
  //         acc[curr.hour] = curr.qty;
  //         return acc;
  //       }, {});

  //       const row = {
  //         group_name: groupName,
  //         category_name: record.category_name,
  //         wip: record.wip,
  //         ...hourlyData,
  //         total: Object.values(hourlyData).reduce((sum, qty) => sum + qty, 0),
  //         rowSpan: index === 0 ? group.rowSpan : 0,
  //       };
  //       result.push(row);
  //     });
  //   }

  //   return result;
  // };
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
          rowSpan: index === 0 ? group.rowSpan : 0,
        };
        result.push(row);
      });
    }

    return result;
  };

  const [data, setData] = useState([]);

  const getRecord = useMutation({
    mutationFn: (mappingKey) => getKanbanRecord(mappingKey),
    onError: (error) => {
      // showMessage(
      //   "Error getting kanban record: " + error.message,
      //   "error"
      // );
    },
    onSuccess: (data) => {
      //showMessage("Category Setting deleted successfully", "success");
      //getHeaderSettings.mutate();
      console.log(data);
      setData(processBodyData(data.body));
    },
  });
  useEffect(() => {
    console.log(props);
    getRecord.mutate(props.mapping_key);
  }, [props.mapping_key]);

  const columns = [
    {
      fixed: "left",
      dataIndex: "group_name",
      key: "group_name",
      width: 50,
      onCell: (_, index) => {
        const row = data[index];
        return {
          rowSpan: row.rowSpan,
          style: { backgroundColor: "lightgray" },
        };
      },
      render: (value) => (
        <Typography
          fontSize={10}
          fontWeight={700}
          style={{ textOrientation: "sideways", writingMode: "vertical-lr" }}
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
          style: { backgroundColor: "lightgreen", textAlign: "center" },
        };
      },
      children: [
        {
          title: (
            <Typography textAlign="center" fontSize={12}>
              Position
            </Typography>
          ),
          dataIndex: "category_name",
          key: "category_name",
          width: 100,
          fixed: "left",
          render: (value) => (
            <Typography textAlign={"center"} fontWeight={700}>
              {value}
            </Typography>
          ),
        },
        {
          title: (
            <Typography textAlign="center" fontSize={12}>
              Current
            </Typography>
          ),
          dataIndex: "wip",
          key: "wip",
          width: 60,
          render: (value) =>
            value == -1 ? null : (
              <Typography textAlign={"center"}>{value}</Typography>
            ),
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
        title: <Typography textAlign="center">{i}</Typography>,
        dataIndex: `${i < 10 ? "0" : ""}${i}`,
        key: `${i < 10 ? "0" : ""}${i}`,
        width: 55,
        render: (value) => (
          <Typography textAlign="center" fontSize={20} fontWeight={600}>
            {value}
          </Typography>
        ),
      })),
    },
    {
      title: "Total",
      dataIndex: "total",
      onHeaderCell: () => {
        return {
          style: { backgroundColor: "lightgreen", textAlign: "center" },
        };
      },
      key: "total",
      width: 80,
      fixed: "right",
    },
  ];
  return (
    <Box>
      <Box m="20px">
        <Header title={props.kanban_name} />
        <Skeleton variant="rectangular" sx={{ my: 2 }} height={40} />
        <Skeleton variant="rectangular" sx={{ my: 2 }} height={40} />
        {/* <KanbanSettingHeader /> */}
        {data ? (
          <Table
            columns={columns}
            dataSource={data}
            scroll={{ x: "max-content" }}
            pagination={false}
            bordered
            size="small"
          />
        ) : null}
      </Box>
      <Box height="50vh" width="60vw" ml={10}></Box>
    </Box>
  );
};

export default TestPage;
