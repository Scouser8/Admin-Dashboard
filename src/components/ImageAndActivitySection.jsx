import React, { useState } from "react";
import {
  Avatar,
  FormControlLabel,
  makeStyles,
  Switch,
} from "@material-ui/core";
import axios from "../axios";
import { UpdateUser, UserLogin } from "../actions";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  userImgContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadInput: {
    display: "none",
  },
  avatar: {
    width: 100,
    height: 100,
    padding: "10px",
    border: "1px dotted grey",
    cursor: "pointer",
  },
  userImgHelper: {
    fontSize: "1rem",
    color: "grey",
  },
}));

export default function ImageAndActivitySection() {
  const classes = useStyles();
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  //   const [adminActivated, setAdminActivated] = useState(false);

  const handleUpload = (e) => {
    const imgSize = e.target.files[0]?.size / 1000; //Convert Size from bytes to kilo bytes

    // Maximum Size for an Image is 3.1 MB
    if (imgSize > 3100) {
      alert("Maximum size for the image is 3.1 MB");
      return;
    }
  };

  const toggleStatus = (e) => {
    // setAdminActivated(!adminActivated);
    const newStatus = e.target.checked ? "active" : "inactive";
    axios
      .put(`/users/${user._id}`, { status: newStatus })
      .then((res) => {
        dispatch(UpdateUser({ ...user, status: newStatus }));
        alert("Admin status updated successfully");
      })
      .catch(({ response }) => {
        alert("Failed to toggle status");
      });
  };

  return (
    <div className={classes.userImgContainer}>
      <input
        accept="image/*"
        className={classes.uploadInput}
        id="icon-button-file"
        type="file"
        onChange={handleUpload}
      />
      <label htmlFor="icon-button-file">
        <Avatar className={classes.avatar} />
      </label>
      <p className={classes.userImgHelper}>Allowed *.jpeg *.jpg *.png *.gif</p>

      <FormControlLabel
        value="start"
        control={
          <Switch
            checked={user.status === "active" ? true : false}
            onChange={toggleStatus}
            color="primary"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        }
        label={<span style={{ color: "#424242" }}>Public Profile</span>}
        labelPlacement="start"
      />
    </div>
  );
}
