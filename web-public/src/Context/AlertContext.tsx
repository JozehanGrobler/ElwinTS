import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { AlertProps } from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import InfoIcon from "@material-ui/icons/Info";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // backgroundColor: theme.pc.primary.tint.blue("80%"),
    borderRadius: 8,
  },
  successIcon: {
    borderRadius: 100,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.common.white,
  },
  errorIcon: {
    borderRadius: 100,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
  infoIcon: {
    borderRadius: 100,
    padding: theme.spacing(1),
    // color: theme.pc.primary.tint.lightBlue("60%"),
  },
  warningIcon: {
    borderRadius: 100,
    padding: theme.spacing(1),
    color: theme.palette.warning.main,
  },
  message: {
    fontWeight: 700,
  },
}));

type AlertContextType = (
  message: string,
  severity: AlertProps["severity"]
) => void;

const AlertContext = React.createContext<AlertContextType>(() => {});

export const useAlertContext = () =>
  React.useContext<AlertContextType>(AlertContext);
interface Props {
  children: React.ReactNode;
}

export function AlertContextProvider({ children }: Props) {
  const [state, setState] = React.useState<{
    open: boolean;
    severity: AlertProps["severity"];
    message: string;
  }>({ open: false, severity: "success", message: "default message" });

  const handleClose = React.useCallback(
    (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setState((o) => ({ ...o, open: false }));
      setTimeout(() => {
        setState((o) => ({ ...o, message: "", severity: undefined }));
      }, 1000);
    },
    []
  );
  const alert = React.useCallback(
    (message: string, severity: AlertProps["severity"]) => {
      setState({ open: true, message, severity: severity });
    },
    []
  );
  const value = React.useMemo(() => alert, [alert]);
  const classes = useStyles();
  return (
    <AlertContext.Provider value={value}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={state.open}
        autoHideDuration={6000}
        onClose={handleClose}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" style={{ color: "white" }} />
            </IconButton>
          </React.Fragment>
        }
        message={
          <Box display="flex" alignItems="center">
            {(() => {
              switch (state.severity) {
                case "success":
                  return <CheckIcon className={classes.successIcon} />;

                case "error":
                  return <ClearIcon className={classes.errorIcon} />;

                case "info":
                  return <InfoIcon className={classes.infoIcon} />;

                case "warning":
                  return <WarningIcon className={classes.warningIcon} />;

                default:
                  return "";
              }
            })()}

            <Box ml={4}>
              <Box pb={2}>
                {(() => {
                  switch (state.severity) {
                    case "success":
                      return (
                        <Typography className={classes.message} variant="body1">
                          Successful
                        </Typography>
                      );

                    case "error":
                      return (
                        <Typography className={classes.message} variant="body1">
                          Failed
                        </Typography>
                      );

                    case "info":
                      return (
                        <Typography className={classes.message} variant="body1">
                          Information
                        </Typography>
                      );

                    case "warning":
                      return (
                        <Typography className={classes.message} variant="body1">
                          Warning
                        </Typography>
                      );

                    default:
                      return "";
                  }
                })()}
              </Box>
              <Box>
                {state.message.split("\n").map((m) => {
                  return (
                    <Typography key={m} variant="body1">
                      {m}
                    </Typography>
                  );
                })}
              </Box>
            </Box>
          </Box>
        }
        ContentProps={{
          classes: {
            root: classes.root,
          },
        }}
      />

      {children}
    </AlertContext.Provider>
  );
}
