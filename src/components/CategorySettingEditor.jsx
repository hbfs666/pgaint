import React, { useEffect, useState, lazy } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  IconButton,
  Typography,
  Box,
  Slide,
  Switch,
  useMediaQuery,
  Select,
  MenuItem,
  Fab,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import EditSharp from "@mui/icons-material/EditSharp";
import DeleteForeverSharp from "@mui/icons-material/DeleteForeverSharp";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useMutation } from "@tanstack/react-query";
import { useError } from "../context/ErrorHandlerContext";
import Loadable from "./Loadable";
import {
  getActiveCategorySetting,
  createOrUpdateCategorySettings,
  deleteCategorySetting,
} from "../api/apiClientService";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteConfirmationDialog = Loadable(
  lazy(() => import("../components/DeleteCategorySettingPopUp"))
);

const CategorySettingEditor = ({ open, onClose, rowData }) => {
  const theme = useTheme();
  const downXL = useMediaQuery(theme.breakpoints.down("xl"));
  const downSM = useMediaQuery(theme.breakpoints.down("sm"));
  const showMessage = useError();
  const [rows, setRows] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    category_id: "",
    id: "",
    from: "",
    to: "",
    exclude: false,
  });
  const getCategorySetting = useMutation({
    mutationFn: () => getActiveCategorySetting(rowData.category_id),
    onMutate: () => {},
    onError: (error) => {
      showMessage("Error in Category Setting: " + error.message, "error");
    },
    onSuccess: (data) => {
      const transformedData = data.map((item) => {
        const [from, to] = item.station_range.split("/");
        return {
          ...item,
          id: parseInt(item.id),
          from,
          to,
          exclude: item.exclude,
        };
      });
      setRows(transformedData);
      showMessage("Category Setting Fetched Successfully", "success");
    },
  });

  const createOrUpdateCategorySetting = useMutation({
    mutationFn: (data) =>
      createOrUpdateCategorySettings(
        data.id,
        data.category_id,
        data.from + "/" + data.to,
        data.exclude
      ),
    onError: (error) => {
      showMessage(
        "Error saving category setting: " + error.response.data,
        "error"
      );
    },
    onSuccess: () => {
      showMessage("Category Setting saved successfully", "success");
      getCategorySetting.mutate();
    },
  });

  const deleteCategorySettingMutation = useMutation({
    mutationFn: (categoryId) => deleteCategorySetting(categoryId),
    onError: (error) => {
      showMessage("Error deleting category setting: " + error.message, "error");
    },
    onSuccess: () => {
      showMessage("Category Setting deleted successfully", "success");
      getCategorySetting.mutate();
    },
  });

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  useEffect(() => {
    if (!rowData) return;
    if (!rowData.category_id) return;
    getCategorySetting.mutate();
  }, [rowData]);

  const handleEditOpen = (row) => {
    setEditData(row);
    setIsEditOpen(true);
  };

  const handleEdit = () => {
    if (editData.from == "" && editData.to == "") {
      showMessage("Nothing to update", "error");
      return;
    }
    createOrUpdateCategorySetting.mutate({
      id: editData.id,
      category_id: rowData.category_id,
      from: editData.from || "",
      to: editData.to || "",
      exclude: editData.exclude || false,
    });
    setEditData({
      category_id: "",
      id: "",
      from: "",
      to: "",
      exclude: false,
    });
    setIsEditOpen(false);
  };

  const handleAddOpen = () => {
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    if (editData.from == "" && editData.to == "") {
      showMessage("Nothing to add", "error");
      return;
    }
    createOrUpdateCategorySetting.mutate({
      id: "",
      category_id: rowData.category_id,
      from: editData.from || "",
      to: editData.to || "",
      exclude: editData.exclude || false,
    });
    setEditData({
      category_id: "",
      id: "",
      from: "",
      to: "",
      exclude: false,
    });
    setIsEditOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteDialogOpen = (row) => {
    setSelectedId(row.id);
    setSelectedRow(row);
    setIsDeleteDialogOpen(true);
  };

  const getCurrentRow = () => selectedRow;

  const handleDeleteDialogClose = () => {
    setSelectedId(null);
    setSelectedRow(null);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = (Id) => {
    deleteCategorySettingMutation.mutate(Id);
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    {
      field: "from",
      headerName: "From",
      minWidth: 100,
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "to",
      headerName: "To",
      minWidth: 100,
      editable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "exclude",
      headerName: "Exclude",
      minWidth: 100,
      editable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography mt={1.8}>{params.value ? `YES` : `NO`}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditOpen(params.row)}
            disabled={isEditOpen}
          >
            <EditSharp sx={{ fill: "lightgreen", fontSize: "large" }} />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteDialogOpen(params.row)}
            disabled={isDeleteDialogOpen}
          >
            <DeleteForeverSharp sx={{ fill: "orange", fontSize: "large" }} />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Transition}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "lightgreen",
            color: theme.palette.primary.main,
          }}
        >
          <Typography
            fontSize="1.5rem"
            fontWeight="500"
          >{`Category Setting Editor`}</Typography>
          {/* <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton> */}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box display="flex" flexDirection="row">
            <Typography variant="h3" gutterBottom>
              {downSM?"":"Layout Section: "}
              <Typography
                variant="h3"
                color="green"
                component="span"
                style={{ textTransform: "uppercase" }}
                fontWeight="600"
              >
                {rowData?.layout_section}
              </Typography>
            </Typography>
            <Box
              marginLeft={2}
              marginRight={2}
              borderLeft={1}
              borderColor="grey.500"
              height="85%"
            />
            <Typography variant="h3" gutterBottom>
              {downSM?"":"Group Name: "}
              <Typography
                variant="h3"
                color="green"
                component="span"
                style={{ textTransform: "uppercase" }}
                fontWeight="600"
              >
                {rowData?.group_name}
              </Typography>
            </Typography>
          </Box>

          <Box
            width={downXL ? "78vw" : "100%"}
            height="65vh"
            position="relative"
          >
            {isEditOpen ? null : (
              <Fab
                color="primary"
                aria-label="add"
                sx={{
                  position: "absolute",
                  top: "30vh",
                  right: -30,
                  zIndex: 1,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "green"
                      : theme.palette.primary.main,
                }}
                onClick={handleAddOpen}
              >
                <AddIcon />
              </Fab>
            )}
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableColumnFilter
              disableColumnMenu
              disableColumnSelector
              disableSelectionOnClick
              disableRowSelectionOnClick
              disableColumnSorting
              disableColumnResize
              hideFooter
              sx={{
                "& .super-app-theme--header": {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.secondary,
                },
                "& .MuiDataGrid-cell": {
                  color: theme.palette.text.primary,
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f0f0f0", // Optional: to see if styling is applied
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                  fontSize: "1rem",
                },
                minWidth: "100%",
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onClose}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#f44336" : "#f44336", // Button color based on mode
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#d32f2f" : "#d32f2f", // Button hover color based on mode
                  boxShadow: `0px 4px 6px ${theme.palette.primary.main}`, // Button shadow on hover
                },
                marginTop: "10px",
              }}
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditOpen}
        onClose={handleEditClose}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            minWidth: "90vw",
            minHeight: "55vh",
          },
        }}
      >
        <DialogTitle
          color={theme.palette.primary.main}
          mb={"5px"}
          sx={{ backgroundColor: "lightgreen", padding: "15px" }}
          border={`1px solid ${theme.palette.divider}`}
        >
          <Typography fontSize="1.2rem" fontWeight="500">
            {editData.id == ""
              ? `Add Category Setting`
              : `Edit Category Setting`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            border={`1px solid ${theme.palette.divider}`}
            borderRadius={1}
            p={2}
            width="100%"
          >
            <Typography>From Station:</Typography>
            <Select
              value={
                rowData.station_list.includes(editData.from)
                  ? editData.from
                  : ""
              }
              onChange={(e) => handleChange(e)}
              name="from"
              fullWidth
            >
              {rowData.station_list?.split("/").map((station, index) => (
                <MenuItem value={station} key={index}>
                  {station}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box
            border={`1px solid ${theme.palette.divider}`}
            borderRadius={1}
            p={2}
            width="100%"
            mt={2}
          >
            <Typography>To Station:</Typography>
            <Select
              value={
                rowData.station_list.includes(editData.to) ? editData.to : ""
              }
              onChange={(e) => handleChange(e)}
              name="to"
              fullWidth
            >
              {rowData.station_list?.split("/").map((station, index) => (
                <MenuItem value={station} key={index}>
                  {station}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box
            border={`1px solid ${theme.palette.divider}`}
            borderRadius={1}
            p={2}
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ marginTop: 2 }}
          >
            <Typography mr="auto">Exclude:</Typography>
            <FormControl>
              <RadioGroup
                aria-labelledby="category-setting-exclude-group"
                name="exclude"
                onChange={(e) => handleChange(e)}
                value={editData.exclude}
                row
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={editData.id == "" ? handleAdd : handleEdit}
            sx={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#4caf50" : "#4caf50", // Button color based on mode
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#388e3c" : "#388e3c", // Button hover color based on mode
                boxShadow: `0px 4px 6px ${theme.palette.primary.main}`, // Button shadow on hover
              },
            }}
          >
            {editData.id == "" ? `Add` : `Save`}
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleEditClose}
            sx={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#f44336" : "#f44336", // Button color based on mode
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#d32f2f" : "#d32f2f", // Button hover color based on mode
                boxShadow: `0px 4px 6px ${theme.palette.primary.main}`, // Button shadow on hover
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {isDeleteDialogOpen ? (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={handleDeleteDialogClose}
          onConfirm={() => handleDeleteConfirm(selectedId)}
          onRow={getCurrentRow()}
        />
      ) : null}
    </Box>
  );
};

export default CategorySettingEditor;
