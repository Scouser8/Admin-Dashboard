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

function UserForm({ setPage, setOpenPopup, itemToEdit }) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    email: itemToEdit ? itemToEdit.email : "",
    first_name: itemToEdit ? itemToEdit.first_name : "",
    last_name: itemToEdit ? itemToEdit.last_name : "",
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
    first_name: Yup.string().required("Required Field"),
    last_name: Yup.string().required("Required Field"),
    email: Yup.string()
      .email("Please enter a valid Email")
      .max(255)
      .required("Required Field"),
    password: !itemToEdit
      ? Yup.string()
          .matches(
            /^(?!.* )(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!/@_#\$%\^&\*])/,
            "Must have no Spaces, contain 8 Characters, One Uppercase, One Lowercase, One Number & One Special Character"
          )
          .min(8, "Password minimum length is 8 characters")
          .max(255)
          .required("Required Field")
      : Yup.string().notRequired().nullable(),
    // password_confirmation: !itemToEdit
    //   ? Yup.string().when("password", {
    //       is: (val) => (val && val.length > 0 ? true : false),
    //       then: Yup.string()
    //         .oneOf(
    //           [Yup.ref("password")],
    //           "Please match with the password entered above"
    //         )
    //         .required("Required Field"),
    //     })
    //   : Yup.string().notRequired().nullable(),
  });

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (itemToEdit) {
      axios
        .put(`/users/${itemToEdit._id}`, formData)
        .then((res) => {
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setIsSubmitting(false);
          setResponseErrors(response.data);
        });
    } else {
      axios
        .post("/users/add", formData)
        .then((res) => {
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setIsSubmitting(false);
          setResponseErrors(response.data);
        });
    }
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
      email: "",
      password: "",
      first_name: "",
      last_name: "",
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
                  name="email"
                  required
                  fullWidth
                  label="Email"
                  value={formData.email}
                  autoFocus
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.email ||
                    Boolean(touched.email && errors.email) ||
                    responseErrors.email
                  }
                  helperText={
                    (touched.email && errors.email) || responseErrors.email
                  }
                />
              </Grid>

              {!itemToEdit ? (
                <Grid item xs={12}>
                  <TextField
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    fullWidth
                    label="Password"
                    value={formData.password}
                    autoComplete="new-password"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.password ||
                      Boolean(touched.password && errors.password) ||
                      responseErrors.password
                    }
                    helperText={
                      (touched.password && errors.password) ||
                      responseErrors.password
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
              ) : null}

              <Grid item xs={6}>
                <TextField
                  name="first_name"
                  required
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.first_name ||
                    Boolean(touched.first_name && errors.first_name) ||
                    responseErrors.first_name
                  }
                  helperText={
                    (touched.first_name && errors.first_name) ||
                    responseErrors.first_name
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="last_name"
                  required
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.last_name ||
                    Boolean(touched.last_name && errors.last_name) ||
                    responseErrors.last_name
                  }
                  helperText={
                    (touched.last_name && errors.last_name) ||
                    responseErrors.last_name
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

export default UserForm;
