import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "400px",
    height: "200px",
    textAlign: "center",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "17px",
    padding: theme.spacing(2),
  },
}));

interface CustomInfoDialogProps {
  content: string | React.ReactNode;
  open: boolean;
  onCancel: () => void;
}

const CustomInfoDialog = ({
  content,
  open,
  onCancel,
}: CustomInfoDialogProps) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: classes.root }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CustomButton
          onClick={onCancel}
          variant="contained"
          color="secondary"
          size="large"
        >
          OK
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
export default CustomInfoDialog;
