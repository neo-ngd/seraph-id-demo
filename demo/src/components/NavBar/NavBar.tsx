// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import { Tooltip, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/HelpOutline';
import logoHorizontal from '../../assets/seraph-logo-horizontal.png';



function NavBar() {

    return (
        <div className="NavBarRoot">
            <AppBar position="static" className="NavBarMain">
                <Toolbar>
                    <Tooltip title="Go to Seraph ID landing page">
                        <a href="https://www.seraphid.io/">
                            <img src={logoHorizontal} alt="SeraphID logo" className="navLogo" />
                        </a>
                    </Tooltip>
                    <Typography className="NavBarTypography"> </Typography>
                    <Tooltip title="Help">
                        <Link to="/help" className="HelpButton">
                            <IconButton color="inherit" aria-label="Menu">
                                <HelpIcon className="HelpIconBar" />
                            </IconButton>
                        </Link>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </div>



    );
}

export default NavBar;
