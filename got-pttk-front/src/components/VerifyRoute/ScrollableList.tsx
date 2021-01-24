import { List, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  listBox: {
    width: "100%",
    height: "60vh",
    background: theme.palette.background.paper,
    borderRadius: "17px",
    border: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  list: {
    width: "100%",
    height: "100%",
    overflowY: "scroll",
  },
}));

interface ScrollableListProps {
  itemsJSX: Array<JSX.Element>;
}

export default function ScrollableList({ itemsJSX }: ScrollableListProps) {
  const classes = useStyles();

  return (
    <div className={classes.listBox}>
      <List dense component="ul" className={classes.list}>
        {itemsJSX.map((listItem) => listItem)}
      </List>
    </div>
  );
}
