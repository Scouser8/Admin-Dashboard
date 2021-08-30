import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  makeStyles,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Link } from "react-router-dom";
import axios from "../axios";
import { Alert } from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";
import { UserLogin } from "../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  content: { width: "30%", color: "#424242" },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: "1.4rem",
    fontWeight: "bold",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  input: {
    height: 50,
    color: "#424242",
    padding: "0px 15px",
    lineHeight: "normal",
  },
  forgotPassword: {
    color: "#01ab55",
    cursor: "pointer",
  },
  submitButton: {
    height: 50,
    fontFamily: `"Almarai", sans-serif`,
    fontWeight: "600",
    color: "#ffffff",
    background: "#01ab55",
    // border: "2px solid #EF9300",
    borderRadius: 0,
    "&:hover": {
      background: "#228B22",
      color: "#ffffff",
    },
    // width: "15%",
  },
}));

const CustomCheckbox = withStyles({
  root: {
    "&$checked": {
      color: "#01ab55",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid Email.")
    .max(255)
    .required("Email is required."),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .required("Password is required."),
});

export default function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();

  // const rememberMe = useRef();
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, updateFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    axios
      .post("users/login", formData)
      .then(({ data }) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        dispatch(UserLogin(data.data, data.token));
        if (rememberMe) {
          window.localStorage.setItem(
            "my-task-user",
            JSON.stringify(data.data)
          );
          window.localStorage.setItem(
            "my-task-token",
            JSON.stringify(data.token)
          );
        }
      })
      .catch(({ response }) => {
        setStatus({ success: false });
        setErrors({ submit: response.data });
        setSubmitting(false);
      });
  };

  const handleStateChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.header}>
          <span className={classes.headerTitle}>Sign in</span>
          <p>Enter your details below</p>
        </div>
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
            setFieldValue,
            values,
            resetForm,
            isSubmitting,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {errors.submit && (
                    <Alert mt={2} mb={1} severity="error">
                      {errors.submit}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    required
                    autoFocus
                    value={formData.email}
                    name="email"
                    label="Email"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    handleBlur={handleBlur}
                    InputProps={{
                      classes: {
                        input: classes.input,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    name="password"
                    label="Password"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    handleBlur={handleBlur}
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
                    InputProps={{
                      classes: {
                        input: classes.input,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <CustomCheckbox
                          value="remember"
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                      }
                      label="Remember me"
                      style={{ userSelect: "none" }}
                    />

                    <span className={classes.forgotPassword}>
                      Forgot password?
                    </span>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.submitButton}
                    disabled={isSubmitting}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
