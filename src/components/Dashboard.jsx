import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { Pagination } from "@material-ui/lab";
import { Delete, Edit, ExpandMore, MoreVert } from "@material-ui/icons";
import axios from "../axios";
import UserForm from "./UserForm";
import Popup from "./Popup";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "50px 30px",
    color: "#424242",
  },
  grid: {
    "& .super-app-theme--header": {
      backgroundColor: "#f5f6fa",
      color: "#7d8288",
    },
  },
  button: {
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    color: "#EF9300",
    background: "#ffffff",
    border: "1px solid #EF9300",
    borderRadius: 0,
    "&:hover": {
      background: "#EF9300",
      color: "#ffffff",
    },
    marginRight: "5px",
  },
}));

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default function Dashboard() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New Tag"); // Customize
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [sortModel, setSortModel] = useState([
    { field: "first_name", sort: "asc" },
  ]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const actionsMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    {
      field: "avatar",
      headerName: "Avatar",
      // headerClassName: "super-app-theme--header",
      width: 100,
      // renderCell: (params) =>
      //   `${params.row.first_name} ${params.row.last_name}`,
    },
    {
      field: "first_name",
      headerName: "Name",
      width: 200,
      renderCell: (params) =>
        `${params.row.first_name} ${params.row.last_name}`,
    },
    { field: "email", headerName: "Email", width: 200, flex: 1 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "dateCreated",
      headerName: "Date created",
      width: 200,
      renderCell: (params) => params.value.replace("T", " ").slice(0, 19),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              // padding: "5px"
            }}
          >
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={actionsMenu}
              onClose={handleClose}
            >
              <MenuItem
                key="edit-action"
                onClick={() => {
                  setSelectedItem(params.row);
                  setOpenPopup(true);
                  handleClose();
                }}
              >
                <div style={{ display: "flex" }}>
                  <div style={{ width: "25px" }}>
                    <Edit style={{ width: "20px", height: "20px" }} />
                  </div>
                  Edit
                </div>
              </MenuItem>

              <MenuItem
                key="edit-action"
                onClick={() => {
                  handleClose();
                  openDeleteConfirmation(params.row._id);
                }}
              >
                <div style={{ display: "flex" }}>
                  <div style={{ width: "25px" }}>
                    <Delete style={{ width: "20px", height: "20px" }} />
                  </div>
                  Delete
                </div>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const handlePageSize = ({ pageSize }) => {
    setPageSize(pageSize);
  };

  const handlePageChange = ({ page }) => {
    setPage(page);
  };

  const handleSortModelChange = (params) => {
    if (
      params[0].field !== sortModel[0].field ||
      params[0].sort !== sortModel[0].sort
    ) {
      setSortModel(params);
    }
  };

  const openDeleteConfirmation = (id) => {
    setOpenDeleteDialog(true);
    setItemToDelete(id);
  };

  const DeleteUser = () => {
    axios
      .delete(`/users/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setLoading(true);
        axios(
          `/users?pageNumber=${page}&recordsPerPage=${pageSize}&orderBy=${sortModel[0]?.field}&order=${sortModel[0]?.sort}`
        )
          .then(({ data }) => {
            if (Math.ceil(data.totalCount / pageSize) < page) {
              setPage(page - 1);
            }
            setRowsCount(data.totalCount);
            setRows(
              data.data.map((user, index) => ({ id: index + 1, ...user }))
            );
            setLoading(false);
          })
          .catch(({ response }) => {
            alert(response.data?.errors);
          });
      })
      .catch(({ response }) => {
        alert(response.data?.errors);
      });
  };

  useEffect(() => {
    if (openPopup) return;
    setLoading(true);
    axios
      .get(
        `/users?pageNumber=${page - 1}&recordsPerPage=${pageSize}&orderBy=${
          sortModel[0]?.field
        }&order=${sortModel[0]?.sort}`
      )
      .then(({ data }) => {
        setRowsCount(data.totalCount);
        setRows(data.data.map((user, index) => ({ id: index + 1, ...user })));
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to Fetch data");
      });
  }, [page, openPopup, sortModel, pageSize]);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h1>Users List</h1>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="textPrimary">Dashboard</Typography>
            <Typography color="textPrimary">User</Typography>
            <Typography color="textPrimary">List</Typography>
          </Breadcrumbs>
        </div>
        <Paper style={{ marginTop: 20 }}>
          <div style={{ width: "100%" }} className={classes.grid}>
            <DataGrid
              rows={rows}
              columns={columns}
              page={page}
              pageSize={pageSize}
              rowHeight={80}
              rowCount={rowsCount}
              sortingOrder={["desc", "asc"]}
              sortModel={sortModel}
              columnBuffer={pageSize}
              paginationMode="server"
              sortingMode="server"
              components={{
                // Pagination: CustomPagination,
                LoadingOverlay: CustomLoadingOverlay,
              }}
              loading={loading}
              checkboxSelection
              disableColumnMenu
              autoHeight={true}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSize}
              onSortModelChange={handleSortModelChange}
            />
          </div>
        </Paper>

        <Popup
          title={openPopupTitle}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <UserForm
            setPage={setPage}
            setOpenPopup={setOpenPopup}
            itemToEdit={selectedItem}
          />
        </Popup>
        <Dialog
          open={openDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Confirmation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this user? <br />
              If this was by accident please press Back
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                DeleteUser();
              }}
              color="secondary"
            >
              Yes, delete
            </Button>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              color="primary"
              autoFocus
            >
              Back
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
