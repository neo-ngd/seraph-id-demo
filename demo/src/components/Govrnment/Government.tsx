// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Fab, CardHeader, Avatar, IconButton, Tooltip } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { Agents } from '../../application-context';
import CodeIcon from '@material-ui/icons/Code';
import { GlobalContext } from 'containers/GlobalContext';
import { openDialog } from 'containers/action';
import { GOVERNMENT_CODE } from 'components/SmartContract/SmartContractCode';

export const Government = React.memo(() => {
    const { owner, government } = Agents;

    const { state: { data: { actions: {demoGov, demoOwnerDID}, showHelp } }, dispatch } = useContext(GlobalContext);

    function _openDialog() {
        dispatch(openDialog(GOVERNMENT_CODE, `Code of Issuer Smart Contract for ${government}`));
    }

    const renderdemoGovContent = useMemo(() => {
        let description = '';
        const { owner } = Agents;
        switch(demoGov) {
            case 'noRequests': {
                description =  ` No credentials have been issued to ${owner} yet·`
            }
            case 'pendingRequest': {
                description = `There is a pending request from {owner}.`
            } 
            case 'credIssued': {
                description = `Digital Passport successfully issued to {owner}.`
            } 
            case 'credNotIssued': {
                description = `Digital Passport request denied to {owner}.`
            }
            default: {
                description = '';
            }
        }

        return (
            <p> {description} </p>
        );
    }, [demoGov])

    const Header = React.memo(() => (
        <CardHeader
            avatar={<Avatar aria-label="Recipe"> <AccountBalanceIcon className="AgentIcon" /> </Avatar>}
            title={
                <div className="AgentCardTitle">
                    <div>
                        <h1> {government} </h1>
                    </div>
                    <div className="AgentCardTitle">
                        <div className="SmartContractButton">
                            <Tooltip title="Show Issuer smart contract for Government">
                                <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={_openDialog}>
                                    <CodeIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <h2> Issuer </h2>
                    </div>
                </div>}
            className="AgentCardHeader"
        />
    ))

        return (
                    <span>
                        <Header></Header>
                        <div className="AgentContainer">
                            {renderdemoGovContent}
                            {demoOwnerDID === 'success' ? (
                                <Link to="/governmentAdmin" className="ButtonLink">
                                    <Fab variant="extended" color="primary"> Go To Government WebPage </Fab>
                                </Link>
                            ) : (<Fab disabled variant="extended" > Go To Government WebPage </Fab>)
                            }
                            {showHelp ? (
                                <div style={{ textAlign: 'end' }}>
                                    <br />
                                    <hr />
                                    <small> Status of Government: <strong> {demoGov} </strong> </small>
                                </div>
                            ) : null}
                        </div>    
                    </span>
    
        );
});

export default Government;
