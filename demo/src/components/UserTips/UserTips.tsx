// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React, { useState, useContext } from 'react';
import './UserTips.css';
import { Snackbar } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { GlobalContext } from 'containers/GlobalContext';

interface Props {
    location?: string
}

export function UserTips({location}: Props) {
    const [open, setOpen] = useState(true);
    const { state: {tip} } = useContext(GlobalContext);
    const handleClose = () => {
        setOpen(false);
    }
    return (
                <Snackbar
                    onClick={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={open}
                    message={
                        <span
                            className="UserTipContent">
                            <InfoIcon className="TipInfoIcon" />
                            {tip}
                        </span>
                    }
                />
    );
}

export default UserTips;
