import React from 'react';

import classes from './Toolbar.module.css';
import menuClasses from './Hamburger.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';


const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <div className={menuClasses.DrawerToggle} onClick={props.showSideDrawer}>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div className={classes.Logo}>
            <Logo />
        </div>
        <nav className={classes.DesktopOnly}> 
            <NavigationItems />
        </nav>
    </header>
);


export default toolbar;