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
import { UpdateUser, UserLogin } from "../actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
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

function UserInfoForm({ user }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const formRef = useRef();
  const [formData, updateFormData] = useState({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("Required Field"),
    last_name: Yup.string().required("Required Field"),
    email: Yup.string()
      .email("Please enter a valid Email")
      .max(255)
      .required("Required Field"),
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    axios
      .put(`/users/${user._id}`, formData)
      .then((res) => {
        dispatch(UpdateUser({ ...user, ...formData }));
        alert("Admin info updated successfully");
        setIsSubmitting(false);
      })
      .catch(({ response }) => {
        setIsSubmitting(false);
        setResponseErrors(response.data);
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
      email: "",
      first_name: "",
      last_name: "",
    });
    setResponseErrors("");
  };
  return (
    <div>
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
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
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
                  variant="outlined"
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

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
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

export default UserInfoForm;
