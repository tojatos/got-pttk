import React, { useEffect, useState } from "react";
import { List, makeStyles, Divider, Box } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles((theme) => ({
  paginator: {
    justifyContent: "center",
    padding: "10px",
  },
}));

interface CustomListProps {
  itemsJSX: Array<JSX.Element>;
}

export default function CustomList({ itemsJSX }: CustomListProps) {
  const classes = useStyles();
  const pageItems = 5;
  const [page, setPage] = useState(1);
  const [pagesNum, setPagesNum] = useState(
    Math.ceil(itemsJSX.length / pageItems)
  );

  // set correct page num if we delete last item on last page
  useEffect(() => {
    setPagesNum(Math.ceil(itemsJSX.length / pageItems));
    if (page > pagesNum) setPage(pagesNum);
  }, [itemsJSX.length, page, pagesNum]);

  const onChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div>
      <List dense component="span">
        {itemsJSX
          .slice((page - 1) * pageItems, page * pageItems)
          .map((listItem) => listItem)}
      </List>
      <Divider />
      <Box component="span">
        <Pagination
          count={pagesNum}
          page={page}
          onChange={onChangePage}
          defaultPage={1}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          classes={{ ul: classes.paginator }}
        />
      </Box>
    </div>
  );
}
