import React from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

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
    "&:hover": {
      color: "grey",
    },
  },
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
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
    </div>
  );
}
