// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Fab, CardHeader, Avatar, IconButton, Tooltip, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { ApplicationContext, Agents } from '../../application-context';
import CodeIcon from '@material-ui/icons/Code';
import SmartContractCode from 'components/SmartContract/SmartContractCode';
import { GlobalContext } from 'containers/GlobalContext';

export function Government() {

    const [smartContractDialogOpen, setSmartContractDialogOpen] = useState<boolean>(false);
    const { state: {actions, showHelp } } = useContext(GlobalContext);

    const renderdemoGovContent = () => {

        if (actions.demoGov === 'noRequests') {
            return (
                <p> No credentials have been issued to {Agents.owner} yet. </p>
            );
        } else if (actions.demoGov === 'pendingRequest') {
            return (
                <p> There is a pending request from {Agents.owner}. </p>
            );
        } else if (actions.demoGov === 'credIssued') {
            return (
                <p> Digital Passport successfully issued to {Agents.owner}. </p>
            );
        } else if (actions.demoGov === 'credNotIssued') {
            return (
                <p> Digital Passport request denied to {Agents.owner}. </p>
            );
        } else return null;
    }

        return (
                    <span>
                        <CardHeader
                            avatar={<Avatar aria-label="Recipe"> <AccountBalanceIcon className="AgentIcon" /> </Avatar>}
                            title={
                                <div className="AgentCardTitle">
                                    <div>
                                        <h1> {Agents.government} </h1>
                                    </div>
                                    <div className="AgentCardTitle">
                                        <div className="SmartContractButton">
                                            <Tooltip title="Show Issuer smart contract for Government">
                                                <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={() => setSmartContractDialogOpen(false)}>
                                                    <CodeIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        <h2> Issuer </h2>
                                    </div>
    
                                </div>}
                            className="AgentCardHeader"
                        />
                        <div className="AgentContainer">
                            {renderdemoGovContent()}
                            {actions.demoOwnerDID === 'success' ? (
                                <Link to="/governmentAdmin" className="ButtonLink">
                                    <Fab variant="extended" color="primary"> Go To Government WebPage </Fab>
                                </Link>
                            ) : (<Fab disabled variant="extended" > Go To Government WebPage </Fab>)
                            }
                            {showHelp ? (
                                <div style={{ textAlign: 'end' }}>
                                    <br />
                                    <hr />
                                    <small> Status of Government: <strong> {actions.demoGov} </strong> </small>
                                </div>
                            ) : null}
                        </div>
    
                        <Dialog onClose={() => setSmartContractDialogOpen(false)} open={smartContractDialogOpen} maxWidth="lg">
                                <DialogTitle> Code of Issuer Smart Contract for {Agents.government} </DialogTitle>
                                <div>
                                    <DialogContent className="DialogContent DialogContentPadding">
    
                                        <div className="DialogCodeContainer">
                                        <SmartContractCode issuer="government"/>
                                        </div>
    
                                    </DialogContent>
    
                                </div>
    
    
                            </Dialog>
    
                    </span>
    
        );
}

export default Government;
