import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Tooltip } from "@material-ui/core";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import HelpIcon from '@material-ui/icons/HelpOutline';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';


export const GovernmentBar = React.memo(function() {
    return (
        <AppBar position="static" color="secondary">
            <Toolbar>
                <IconButton color="inherit" aria-label="Menu">
                    <AccountBalanceIcon className="GovernmentLogo" />
                </IconButton>
                <Typography variant="h6" color="inherit" className="NavBarTypography"> Government Web Page </Typography>
                <Tooltip title="Help">
                    <Link to="/help" className="HelpButton">
                        <IconButton color="inherit" aria-label="Menu">
                            <HelpIcon className="HelpIconBar" />
                        </IconButton>
                    </Link>
                </Tooltip>
                <Tooltip title="Close Government Web Page">
                    <Link to="/dashboard" className="CloseButton">
                        <IconButton color="inherit" aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                    </Link>
                </Tooltip>
            </Toolbar>
        </AppBar>
    )
});