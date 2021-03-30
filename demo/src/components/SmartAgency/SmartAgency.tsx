// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Fab, CardHeader, Avatar, Tooltip, IconButton, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { ApplicationContext, Agents } from '../../application-context';
import CodeIcon from '@material-ui/icons/Code';
import SmartContractCode from 'components/SmartContract/SmartContractCode';



interface Props { }

interface State {
    smartContractDialogOpen: boolean;
}


export class SmartAgency extends React.Component<Props, State> {

    public state: State = {
        smartContractDialogOpen: false
    }


    renderdemoAgencyContent = (value: any) => {

        if (value.actions.demoAgency === 'noRequests') {
            return (
                <p> No credentials have been issued to {Agents.owner} yet. </p>
            );
        } else if (value.actions.demoAgency === 'pendingRequest') {
            return (
                <p> There is a pending request from {Agents.owner}. </p>
            );
        } else if (value.actions.demoAgency === 'digitalIdentityVerified') {
            return (
                <p> {Agents.owner}'s digital Passport successfully verified. </p>
            );
        } else if (value.actions.demoAgency === 'digitalIdentityNotVerified') {
            return (
                <p> {Agents.owner}'s digital Passport not verified. </p>
            );
        } else if (value.actions.demoAgency === 'credIssued') {
            return (
                <p> Access key successfully issued to {Agents.owner}. </p>
            );
        } else if (value.actions.demoAgency === 'credNotIssued') {
            return (
                <p> Access key request denied to {Agents.owner}. </p>
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
                            avatar={<Avatar aria-label="Recipe"> <HomeIcon className="AgentIcon" /> </Avatar>}
                            title={
                                <div className="AgentCardTitle">
                                    <div>
                                        <h1> {Agents.smartAgency} </h1>
                                    </div>
                                    <div className="AgentCardTitle">
                                        <div className="SmartContractButton">
                                            <Tooltip title="Show Issuer smart contract for Real Estate Agency">
                                                <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={() => { this.handleDialog(true) }}>
                                                    <CodeIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        <h2> Issuer and Verifier </h2>
                                    </div>
                                </div>}
                            className="AgentCardHeader"
                        />
                        <div className="AgentContainer">
                            {this.renderdemoAgencyContent(value)}
                            {value.actions.demoOwnerDID === 'success' ? (
                                <Link to="/accommodationAdmin" className="ButtonLink">
                                    <Fab variant="extended" color="primary"> Go To Accommodation dApp </Fab>
                                </Link>
                            ) : (<Fab disabled variant="extended"> Go To Accommodation dApp </Fab>)
                            }

                            {value.showHelp ? (
                                <div style={{ textAlign: 'end' }}>
                                    <br />
                                    <br />
                                    <hr />
                                    <small> Status of Agent: <strong> {value.actions.demoAgency} </strong> </small>
                                </div>
                            ) : null}

                        </div>

                        <Dialog onClose={() => this.handleDialog(false)} open={this.state.smartContractDialogOpen} maxWidth="lg">
                            <DialogTitle> Code of Issuer Smart Contract for {Agents.smartAgency} </DialogTitle>

                            <div>
                                <DialogContent className="DialogContent DialogContentPadding">

                                    <div className="DialogCodeContainer">
                                        <SmartContractCode issuer="agency"/>
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

export default SmartAgency;
