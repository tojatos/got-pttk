import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ButtonProps } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "22px",
    textTransform: "none",
    color: theme.palette.common.white,
  },
  green: {
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: theme.palette.success.main,
      },
    },
  },
}));

interface CustomButtonProps extends Omit<ButtonProps, "color"> {
  children: React.ReactChild;
  color?: "inherit" | "primary" | "secondary" | "default" | "action";
  className?: string;
}

export default function CustomButton({
  children,
  color,
  className,
  ...props
}: CustomButtonProps) {
  const classes = useStyles();

  return (
    <>
      <Button
        color={color && color !== "action" ? color : "primary"}
        className={
          className +
          " " +
          classes.root +
          (color === "action" ? ` ${classes.green}` : "")
        }
        {...props}
      >
        {children}
      </Button>
    </>
  );
}
