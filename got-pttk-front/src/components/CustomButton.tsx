import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ButtonProps } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "22px",
  },
}));

interface CustomButtonProps extends ButtonProps {
  children: React.ReactChild;
}

export default function CustomButton({
  children,
  ...props
}: CustomButtonProps) {
  const classes = useStyles();

  return (
    <>
      <Button className={classes.root} {...props}>
        {children}
      </Button>
    </>
  );
}
