// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Fab, CardHeader, Avatar, IconButton, Tooltip, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { ApplicationContext, Agents } from '../../application-context';
import CodeIcon from '@material-ui/icons/Code';
import SmartContractCode from 'components/SmartContract/SmartContractCode';


interface Props { }

interface State {
    smartContractDialogOpen: boolean; 
 }


export class Government extends React.Component<Props, State> {

    public state: State = {
        smartContractDialogOpen: false
    }

    renderdemoGovContent = (value: any) => {

        if (value.actions.demoGov === 'noRequests') {
            return (
                <p> No credentials have been issued to {Agents.owner} yet. </p>
            );
        } else if (value.actions.demoGov === 'pendingRequest') {
            return (
                <p> There is a pending request from {Agents.owner}. </p>
            );
        } else if (value.actions.demoGov === 'credIssued') {
            return (
                <p> Digital Passport successfully issued to {Agents.owner}. </p>
            );
        } else if (value.actions.demoGov === 'credNotIssued') {
            return (
                <p> Digital Passport request denied to {Agents.owner}. </p>
            );
        } else return null;
    }

    handleDialog = (toOpen: boolean) => {
        this.setState({ smartContractDialogOpen: toOpen });
    }

    render() {
        return (
            <ApplicationContext.Consumer>
                {(value: any) => (
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
                                                <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={() => { this.handleDialog(true) }}>
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
                            {this.renderdemoGovContent(value)}
                            {value.actions.demoOwnerDID === 'success' ? (
                                <Link to="/governmentAdmin" className="ButtonLink">
                                    <Fab variant="extended" color="primary"> Go To Government WebPage </Fab>
                                </Link>
                            ) : (<Fab disabled variant="extended" > Go To Government WebPage </Fab>)
                            }
                            {value.showHelp ? (
                                <div style={{ textAlign: 'end' }}>
                                    <br />
                                    <hr />
                                    <small> Status of Government: <strong> {value.actions.demoGov} </strong> </small>
                                </div>
                            ) : null}
                        </div>
    
                        <Dialog onClose={() => this.handleDialog(false)} open={this.state.smartContractDialogOpen} maxWidth="lg">
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
                )}
            </ApplicationContext.Consumer>
    
        );
    }
}

export default Government;
