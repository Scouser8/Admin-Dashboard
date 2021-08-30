import React, { useRef, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "../axios";
import { RotateLeft, Visibility, VisibilityOff } from "@material-ui/icons";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40vw",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submitButton: {
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    fontWeight: "600",
    color: "#01ab55",
    background: "#ffffff",
    border: "1px solid #01ab55",
    borderRadius: 0,
    "&:hover": {
      background: "#01ab55",
      color: "#ffffff",
    },
    margin: theme.spacing(3, 2, 2),
    width: "30%",
  },
  resetButton: {
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    fontWeight: "600",
    color: "#7B7B7B",
    background: "#ffffff",
    border: "1px solid #7B7B7B",
    borderRadius: 0,
    // "&:hover": {
    //   background: "#EF9300",
    //   color: "#ffffff",
    // },
    margin: theme.spacing(3, 2, 2),
    width: "30%",
  },
  errorsContainer: {
    marginBottom: theme.spacing(1),
  },
  errorMsg: {
    color: "#ff0000",
    fontWeight: "500",
  },
}));

function ChangePassword() {
  const classes = useStyles();
  const { user } = useSelector((state) => state);

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const validationSchema = Yup.object().shape({
    old_password: Yup.string()
      .matches(
        /^(?!.* )(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!/@_#\$%\^&\*])/,
        "Must have no Spaces, contain 8 Characters, One Uppercase, One Lowercase, One Number & One Special Character"
      )
      .min(8, "Password minimum length is 8 characters")
      .max(255)
      .required("Required Field"),
    new_password: Yup.string()
      .matches(
        /^(?!.* )(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!/@_#\$%\^&\*])/,
        "Must have no Spaces, contain 8 Characters, One Uppercase, One Lowercase, One Number & One Special Character"
      )
      .min(8, "Password minimum length is 8 characters")
      .max(255)
      .required("Required Field"),
    confirm_password: Yup.string().when("new_password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string()
        .oneOf(
          [Yup.ref("new_password")],
          "Please match with the new password entered"
        )
        .required("Required Field"),
    }),
  });

  const handleSubmit = () => {
    // setIsSubmitting(true);

    axios
      .put(`/users/change/password/${user._id}`, formData)
      .then((res) => {
        setIsSubmitting(false);
        alert("Password changed succussfully!");
        updateFormData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
        setResponseErrors({});
      })
      .catch(({ response }) => {
        alert(response?.data?.error);
        setIsSubmitting(false);
        // setResponseErrors(response.error);
      });
  };

  const handleStateChange = (e) => {
    let value = e.target.value;

    updateFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleReset = () => {
    updateFormData({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
    setResponseErrors("");
  };
  return (
    <div className={classes.paper}>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleSubmit,
          handleChange,
          handleBlur,
          touched,
          values,
          status,
          resetForm,
        }) => (
          <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  type={showPassword ? "text" : "password"}
                  name="old_password"
                  required
                  fullWidth
                  label="Old Password"
                  value={formData.old_password}
                  autoComplete="new-password"
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.old_password ||
                    Boolean(touched.old_password && errors.old_password) ||
                    responseErrors.old_password
                  }
                  helperText={
                    (touched.old_password && errors.old_password) ||
                    responseErrors.old_password
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type={showPassword ? "text" : "password"}
                  name="new_password"
                  required
                  fullWidth
                  label="New Password"
                  value={formData.new_password}
                  autoComplete="new-password"
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.new_password ||
                    Boolean(touched.new_password && errors.new_password) ||
                    responseErrors.new_password
                  }
                  helperText={
                    (touched.new_password && errors.new_password) ||
                    responseErrors.new_password
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="password"
                  name="confirm_password"
                  required
                  fullWidth
                  label="Confirm New Password"
                  value={formData.confirm_password}
                  autoComplete="new-password"
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.confirm_password ||
                    Boolean(
                      touched.confirm_password && errors.confirm_password
                    ) ||
                    responseErrors.confirm_password
                  }
                  helperText={
                    (touched.confirm_password && errors.confirm_password) ||
                    responseErrors.confirm_password
                  }
                />
              </Grid>
            </Grid>

            {typeof responseErrors === "string" ? (
              <Grid item xs={12}>
                <span key={`faluire-msg`} className={classes.errorMsg}>
                  {responseErrors}
                </span>
              </Grid>
            ) : null}
            <Grid container justify="center" style={{ marginTop: 10 }}>
              <Button
                className={classes.submitButton}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Submit
              </Button>
              <Button
                className={classes.resetButton}
                startIcon={<RotateLeft />}
                variant="contained"
                onClick={() => {
                  handleReset();
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Reset
              </Button>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default ChangePassword;
