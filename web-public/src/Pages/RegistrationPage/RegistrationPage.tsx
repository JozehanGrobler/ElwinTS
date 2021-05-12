import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Robot from "@material-ui/icons/Info";
import { Redirect, useHistory } from "react-router";
import { Formik } from "formik";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuthContext } from "../../Context/AuthContext";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  infoBlock: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minWidth: 300,
    height: 300,
    padding: theme.spacing(2),
  },
  infoBlockIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export function RegistrationPage() {
  const classes = useStyles();
  const history = useHistory();
  const { authenticated, handleRegister } = useAuthContext();
  if (authenticated) {
    return <Redirect to="/" />;
  }
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
          const response = await handleRegister(
            values.username,
            values.password
          );
          if (response) {
            history.push("/");
            setSubmitting(false);
          }
        } catch (e) {
          alert(e.message);
          setSubmitting(false);
        }
      }}
    >
      {({ submitForm, isSubmitting }) => {
        return (
          <div className={classes.container}>
            <Paper className={classes.infoBlock}>
              <div className={classes.infoBlockIcon}>
                <Robot />
              </div>
              <Typography variant="h4">Register</Typography>
              <TextField
                label="username"
                defaultValue="jozehangrobler@gmail.com"
              />
              <TextField
                type="password"
                label="Password"
                name="password"
                defaultValue="password"
                onKeyPress={(e) => {
                  if (e.code.toLowerCase() === "enter") {
                    submitForm();
                  }
                }}
              />
              <TextField
                type="confirmPassword"
                label="Confirm Password"
                onKeyPress={(e) => {
                  if (e.code.toLowerCase() === "enter") {
                    submitForm();
                  }
                }}
              />
              <Button
                variant="contained"
                disabled={isSubmitting}
                onClick={() => {
                  submitForm();
                }}
                endIcon={isSubmitting && <CircularProgress size={15} />}
              >
                Register
              </Button>
              <Link href="/resetPassword">Reset Password</Link>
              <Link href="/login">Login</Link>
            </Paper>
          </div>
        );
      }}
    </Formik>
  );
}
