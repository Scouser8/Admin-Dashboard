import React, { useState } from "react";
import clsx from "clsx";
import {
  Avatar,
  Breadcrumbs,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { AccountBox, VpnKey } from "@material-ui/icons";
import UserInfoForm from "./UserInfoForm";
import ChangePassword from "./ChangePassword";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "15px 30px",
    color: "#424242",
  },
  navigator: {
    display: "flex",
    marginTop: 25,
  },
  tab: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    cursor: "pointer",
    color: "gray",
    marginRight: 40,
    borderBottom: "2px solid transparent",
    userSelect: "none",
    marginBottom: 20,
  },
  tabIcon: {
    marginRight: 10,
  },
  activeTab: {
    borderColor: "#01ab55",
    color: "#424242",
    fontWeight: "bold",
  },
  content: {
    marginTop: "20px",
  },
  userImgContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    padding: "10px",
    border: "1px dotted grey",
  },
  userImgHelper: {
    fontSize: "1rem",
    color: "grey",
  },
}));

export default function Profile() {
  const classes = useStyles();
  const { user } = useSelector((state) => state);
  const [activeTab, setActiveTab] = useState("general");
  const [adminActivated, setAdminActivated] = useState(false);

  return (
    <div className={classes.root}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <h1>Account</h1>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="textPrimary">Dashboard</Typography>
          <Typography color="textPrimary">User</Typography>
          <Typography color="textPrimary">Account Settings</Typography>
        </Breadcrumbs>
      </div>

      <div className={classes.navigator}>
        <div
          className={clsx(
            classes.tab,
            activeTab === "general" && classes.activeTab
          )}
          onClick={() => setActiveTab("general")}
        >
          <AccountBox className={classes.tabIcon} />
          <span>General</span>
        </div>

        <div
          className={clsx(
            classes.tab,
            activeTab === "change-password" && classes.activeTab
          )}
          onClick={() => setActiveTab("change-password")}
        >
          <VpnKey className={classes.tabIcon} />
          <span>Change Password</span>
        </div>
      </div>

      <div className={classes.content}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Paper elevation={2} style={{ height: "100%" }}>
              <div className={classes.userImgContainer}>
                <Avatar className={classes.avatar} />
                <p className={classes.userImgHelper}>
                  Allowed *.jpeg *.jpg *.png *.gif
                </p>

                <FormControlLabel
                  value="start"
                  control={
                    <Switch
                      checked={adminActivated}
                      onChange={() => setAdminActivated(!adminActivated)}
                      color="primary"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label={
                    <span style={{ color: "#424242" }}>Public Profile</span>
                  }
                  labelPlacement="start"
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper elevation={2} style={{ padding: "20px 30px" }}>
              {activeTab === "general" ? (
                <UserInfoForm user={user} />
              ) : (
                <ChangePassword />
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
