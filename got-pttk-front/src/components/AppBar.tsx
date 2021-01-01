import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import logoPTTK from '../assets/logoPTTK.png'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        borderBottom: `solid 1px ${theme.palette.secondary.main}`
    },
    logo: {
        margin: theme.spacing(1),
        width: '3em',
    },
  }));

export default function MenuAppBar() {
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.root}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <img src={logoPTTK} alt="logo PTTK" className={classes.logo}/>
          </Toolbar>
        </AppBar>
    );
  }