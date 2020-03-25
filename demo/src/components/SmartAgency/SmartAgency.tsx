// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React, { useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Fab, CardHeader, Avatar, Tooltip, IconButton, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { Agents } from '../../application-context';
import CodeIcon from '@material-ui/icons/Code';
import { GlobalContext } from 'containers/GlobalContext';
import { openDialog } from 'containers/action';
import { AGENCY_CODE } from 'components/SmartContract/SmartContractCode';

export const SmartAgency = React.memo(() => {
    const {state: {data: {actions: {demoAgency, demoOwnerDID }, showHelp}}, dispatch} = useContext(GlobalContext);
    const { owner } = Agents;

    function _openDialog() {
        dispatch(openDialog(AGENCY_CODE, `Code of Issuer Smart Contract for ${Agents.smartAgency}`));
    }

    function getDemoAgencyContent() {
        switch(demoAgency) {
            case 'noRequests':
                return `No credentials have been issued to ${owner} yet.`;
            case 'pendingRequest':
                return `There is a pending request from ${owner}.` ;
            case 'digitalIdentityVerified':
                return `${owner}'s digital Passport successfully verified.`;
            case 'digitalIdentityNotVerified':
                return `${owner}'s digital Passport not verified.`;
            case 'credIssued':
                return `Access key successfully issued to ${owner}.`;
            case 'credNotIssued':
                return `Access key request denied to ${owner}. `;
            default:
                return `Oops, Exceptional!`;
        }
    }

    const demoAgencyContent = useMemo(() => (
        <p> {getDemoAgencyContent()} </p>
    ), [demoAgency])

    const Header = React.memo(() => (
        <CardHeader
                avatar={<Avatar aria-label="Recipe"> <HomeIcon className="AgentIcon" /> </Avatar>}
                title={
                    <div className="AgentCardTitle">
                        <div>
                            <h1> {Agents.smartAgency} </h1>
                        </div>
                        <div className="AgentCardTitle">
                            <div className="SmartContractButton">
                                <Tooltip title="Show Issuer smart contract for Real Estate Agency">
                                    <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={_openDialog}>
                                        <CodeIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <h2> Issuer and Verifier </h2>
                        </div>
                    </div>}
                className="AgentCardHeader"
            />
    ))

    return (
        <span>
            <Header></Header>
            <div className="AgentContainer">
                {demoAgencyContent}
                {demoOwnerDID === 'success' ? (
                    <Link to="/accommodationAdmin" className="ButtonLink">
                        <Fab variant="extended" color="primary"> Go To Accommodation dApp </Fab>
                    </Link>
                ) : (<Fab disabled variant="extended"> Go To Accommodation dApp </Fab>)}
                {showHelp ? (
                    <div style={{ textAlign: 'end' }}>
                        <br />
                        <br />
                        <hr />
                        <small> Status of Agent: <strong> {demoAgency} </strong> </small>
                    </div>
                ) : null }
            </div>
        </span>
        );
});

export default SmartAgency;
