// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React, { useState, useContext } from 'react';
import './UserTips.css';
import { Snackbar } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { GlobalContext } from 'containers/GlobalContext';

export const UserTips = React.memo(() => {
    const { state: { data: { tip, showTip }}, dispatch } = useContext(GlobalContext);
    const handleClose = () => {
        dispatch({
            type: 'CLOSE_TIP'
        })
    }
    return (
                <Snackbar
                    onClick={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={showTip}
                    message={
                        <span
                            className="UserTipContent">
                            <InfoIcon className="TipInfoIcon" />
                            {tip}
                        </span>
                    }
                />
    );
});

export default UserTips;
