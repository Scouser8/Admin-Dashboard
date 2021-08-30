import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { Logout } from "../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#DCDCDC",
    padding: 20,
  },
  link: {
    color: "#424242",
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginRight: 40,
    width: "fit-content",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      color: "grey",
    },
  },
  logoutBtn: {
    position: "absolute",
    right: 30,
  },
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(Logout())
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("my-task-user");
    localStorage.removeItem("my-task-token");
  };
  return (
    <div className={classes.root}>
      <span className={classes.link} onClick={() => history.push("/")}>
        Dashboard
      </span>
      <span className={classes.link} onClick={() => history.push("/profile")}>
        Profile
      </span>
      <span className={classes.link} onClick={() => history.push("/about")}>
        About Us
      </span>

      <Button
        variant="contained"
        color="secondary"
        className={classes.logoutBtn}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}
