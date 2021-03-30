// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';
import './ActiveAgent.css';
import Chip from '@material-ui/core/Chip';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Avatar } from '@material-ui/core';
import { theme } from '../../containers/App';

interface Props {
    agent: string;
    location: string;
}

function ActiveAgent({ agent, location }: Props) {

    let highlightedText = theme.palette.error.main;
    if (location === "GovWebPage") {
        highlightedText = theme.palette.secondary.main;
    }

    const style = { color: highlightedText, paddingRight: '5px' };

    return (
        <div className="AgentChipContainer">
            <div> </div>
            <div>
                <Chip
                    avatar={<Avatar> <AccountCircleIcon /> </Avatar>}
                    label={<p> You are acting in behalf of
                                <strong style={style}> {' ' + agent} </strong>
                    </p>}
                />
            </div>
        </div>
    );
}

export default ActiveAgent;
