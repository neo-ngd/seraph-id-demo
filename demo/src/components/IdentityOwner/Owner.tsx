// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';
import { Link } from 'react-router-dom';
import './Owner.css';
import { Fab, CardHeader, Avatar, CircularProgress, Grid, Tooltip, IconButton, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { ApplicationContext, Agents } from '../../application-context';
import SadFaceIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import HappyFaceIcon from '@material-ui/icons/SentimentVerySatisfied';
import CodeIcon from '@material-ui/icons/Code';

// Import from seraph-id-sdk 
import { DIDNetwork } from '@sbc/seraph-id-sdk';

const OWNER_GOV_BTN_LABEL = 'Apply for Passport';
const OWNER_AGENCY_BTN_LABEL = 'Book a flat';
const OWNER_DOOR_BTN_LABEL = 'Open the door';


interface Props {
    ownerWallet: any
}

interface State {
    dialogOpen: boolean;
    dialogTitle: string;
    dialogContent: string;
}

export class Owner extends React.Component<Props, State> {

    public state: State = {
        dialogOpen: false,
        dialogTitle: '',
        dialogContent: ''
    };

    renderJSONObject = (objString: string) => {

        const jsonStart = "{";
        const jsonEnd = "}"

        const attributesStartIndex = objString.indexOf("attributes");
        if (attributesStartIndex < 0) {
            return <div> {jsonStart} {this.renderJSONLevel(objString)} {jsonEnd} </div>;
        } else {
            const fromAttrToEnd = objString.slice(attributesStartIndex + 12);
            const closeAttrSectionIndex = fromAttrToEnd.indexOf('}');
            const attributes = fromAttrToEnd.slice(0, closeAttrSectionIndex);
            const others = fromAttrToEnd.slice(closeAttrSectionIndex + 1);

            return (
                <div>
                    <p> {jsonStart} <br /> </p>
                    <div className="JSONLevel">
                        <p> "attributes": {jsonStart} <br />  </p>
                        <div className="JSONLevel">
                            {this.renderJSONLevel(attributes)}
                        </div>
                        <p> {jsonEnd}, <br /> </p>
                        {this.renderJSONLevel(others)}
                    </div>
                    <p> {jsonEnd} <br /> </p>

                </div>
            );
        }
    }


    renderJSONLevel = (objString: string) => {

        if (objString) {
            const l = objString.length;
            const step0 = objString.substring(1, l - 1);
            const step1 = step0.split(",");
            const res = step1.map((field, index) => {
                if (index === step1.length - 1) {
                    return <p key={index}> {field} <br />  </p>
                } else {
                    return <p key={index}> {field}, <br />  </p>
                }
            });
            return (
                <div> {res} </div>
            );

        } else {
            return (
                <div> Not available </div>
            );
        }
    }


    renderDIDSection = (value: any) => {
        if (value.actions.demoOwnerDID === 'todo') {
            return (
                <div>
                    <p> Generate your DID and create a wallet. </p>
                    <Fab onClick={() => { this.generateDID(value) }} variant="extended" color="primary">
                        Generate DID
                    </Fab>
                </div>
            );
        } else if (value.actions.demoOwnerDID === 'waiting') {
            return (
                <div>
                    <p> Waiting for DID generation.  </p>
                    <CircularProgress />
                </div>
            );
        } else if (value.actions.demoOwnerDID === 'success') {
            return (
                <div className="ShowCodeSection DIDSuccess">
                    <p> DID successfully generated. </p>
                    <Tooltip title="Show DID code">
                        <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={() => { this.openDialog('DID') }} >
                            <CodeIcon />
                        </IconButton>
                    </Tooltip>
                    <Dialog onClose={() => this.closeDialog()} open={this.state.dialogOpen} >
                        <DialogTitle> {this.state.dialogTitle} </DialogTitle>
                        <DialogContent className="DialogContent">

                            <div className="DialogCodeContainer">
                                <code>
                                    {this.renderJSONObject(this.state.dialogContent)}
                                </code>
                            </div>

                        </DialogContent>
                    </Dialog>
                </div>
            );
        } else if (value.actions.demoOwnerDID === 'failure') {
            return (
                <div>
                    <p> Error occurred generating the DID. </p>
                    <SadFaceIcon className="ResultIcon" />
                </div>
            );
        } else return null;

    }

    renderCredFromGovSection = (value: any) => {

        if (value.actions.demoOwnerDID !== 'success') {
            return (
                <div>
                    <p> Ask the {Agents.government} to issue a digital Passport. </p>
                    <Fab disabled variant="extended" >
                        {OWNER_GOV_BTN_LABEL}
                    </Fab>
                </div>
            );
        } else {
            if (value.actions.demoOwnerCredFromGov === 'todo') {
                return (
                    <div>
                        <p> Ask the {Agents.government} to issue a digital Passport. </p>
                        <Link to="/government" className="ButtonLink">
                            <Fab variant="extended" color="primary">
                                {OWNER_GOV_BTN_LABEL}
                            </Fab>
                        </Link>
                    </div>
                );
            } else if (value.actions.demoOwnerCredFromGov === 'waiting') {
                return (
                    <div>
                        <p> Waiting for the claim from the {Agents.government}. </p>
                        <Link to="/government" className="ButtonLink">
                            <Fab disabled variant="extended">
                                {OWNER_GOV_BTN_LABEL}
                            </Fab>
                        </Link>
                    </div>


                );
            } else if (value.actions.demoOwnerCredFromGov === 'success') {
                return (
                    <div>
                        <div className="ShowCodeSection">
                            <p> Claim successfully got from the {Agents.government}. </p>
                            <Tooltip title="Show claim">
                                <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={() => { this.openDialog('gov') }}>
                                    <CodeIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                );
            } else if (value.actions.demoOwnerCredFromGov === 'failure') {
                return (
                    <div>
                        <p> Digital Passport not issued from the {Agents.government}. {Agents.owner} can not rent a flat.</p>
                        <SadFaceIcon className="ResultIcon" />
                    </div>
                );
            } else return null;

        }
    }

    renderCredFromAgencySection = (value: any) => {


        if (value.actions.demoOwnerDID !== 'success') {
            return (
                <div>
                    <p> Once you got the digital Passport from the Government, you can use the claim in the accomodation dApp to get another credential: the access key. </p>
                    <Fab disabled variant="extended">
                        {OWNER_AGENCY_BTN_LABEL}
                    </Fab>
                </div>
            );
        } else {
            if (value.actions.demoOwnerCredFromAgency === 'todo') {
                if (value.actions.demoOwnerCredFromGov === 'success') {
                    return (
                        <div>
                            <p> Use the claim of digital Passport you just got and go to the accomodation dApp to get another credential: the access key. </p>
                            <Link to="/accommodation" className="ButtonLink">
                                <Fab variant="extended" color="primary">
                                    {OWNER_AGENCY_BTN_LABEL}
                                </Fab>
                            </Link>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <p> Once you got the digital Passport from the Government, you can use the claim in the accomodation dApp to get another credential: the access key. </p>
                            <Link to="/accommodation" className="ButtonLink">
                                <Fab variant="extended" color="primary">
                                    {OWNER_AGENCY_BTN_LABEL}
                                </Fab>
                            </Link>
                        </div>
                    );
                }

            } else if (value.actions.demoOwnerCredFromAgency === 'waiting') {
                return (
                    <div>
                        <p> Pending request to the {Agents.smartAgency}  </p>
                        <Link to="/accommodation" className="ButtonLink">
                            <Fab variant="extended" color="primary">
                                {OWNER_AGENCY_BTN_LABEL}
                            </Fab>
                        </Link>
                    </div>
                );
            } else if (value.actions.demoOwnerCredFromAgency === 'success') {
                return (
                    <div>
                        <div className="ShowCodeSection">
                            <p> Claim successfully got from the {Agents.smartAgency}. </p>
                            <Tooltip title="Show claim">
                                <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={() => { this.openDialog('agency') }}>
                                    <CodeIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                );
            } else if (value.actions.demoOwnerCredFromAgency === 'failure') {
                return (
                    <div>
                        <p> Access key not issued from the {Agents.smartAgency}. {Agents.owner} can not rent a flat. </p>
                        <SadFaceIcon className="ResultIcon" />
                    </div>
                );
            } else return null;
        }
    }


    renderOpenDoorSection = (value: any) => {

        if (value.actions.demoOwnerDID !== 'success') {
            return (
                <div>
                    <p> Use the access key provided from the Agency,
                        <br />  to open the door of the accommodation. </p>
                    <Fab disabled variant="extended">
                        {OWNER_DOOR_BTN_LABEL}
                    </Fab>
                </div>
            );
        } else {
            if (value.actions.demoOwnerOpenDoor === 'todo') {

                if (value.actions.demoOwnerCredFromAgency === 'success') {
                    return (
                        <div>
                            <p> Use the access key you just got from the {Agents.smartAgency},
                                <br />  to open the door of the accommodation. </p>
                            <Fab onClick={() => this.openDoor(value)} variant="extended" color="primary">
                                {OWNER_DOOR_BTN_LABEL}
                            </Fab>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <p> Use the access key provided from the Agency,
                                <br />  to open the door of the accommodation. </p>
                            <Tooltip title={Agents.owner + " didn't book any flat yet"}>
                                <div>
                                    <Fab disabled variant="extended">
                                        {OWNER_DOOR_BTN_LABEL}
                                    </Fab>
                                </div>
                            </Tooltip>
                        </div>
                    );

                }
            }
            else if (value.actions.demoOwnerOpenDoor === 'sharingCredentials') {
                return (
                    <div>
                        <p> Sharing access key with the {Agents.landlord}. </p>
                        <CircularProgress />
                    </div>
                );
            } else if (value.actions.demoOwnerOpenDoor === 'sharingCredentialsFailed') {
                return (
                    <div>
                        <p> Sharing access key failed. {Agents.owner} can not access the flat. </p>
                        <SadFaceIcon className="ResultIcon" />
                    </div>
                );
            } else if (value.actions.demoOwnerOpenDoor === 'waiting') {
                return (
                    <div>
                        <p> Waiting for the {Agents.landlord} to validate the provided access key </p>
                    </div>
                );
            } else if (value.actions.demoOwnerOpenDoor === 'success') {
                return (
                    <div>
                        <p> Key validated. {Agents.owner} can now access the flat. </p>
                        <HappyFaceIcon className="ResultIcon" />
                    </div>
                );
            } else if (value.actions.demoOwnerOpenDoor === 'failure') {
                return (
                    <div>
                        <p> Key validation failed. {Agents.owner} can not access the flat. </p>
                        <SadFaceIcon className="ResultIcon" />
                    </div>
                );
            } else return null;

        }

    }

    openDoor = (value: any) => {

        value.changeAction('demoOwnerOpenDoor', 'sharingCredentials');

        const accessKeyClaimID = localStorage.getItem('accessKeyClaimID');
        console.log('accessKeyClaimID', accessKeyClaimID);
        if (accessKeyClaimID) {
            const accessKeyClaim = this.props.ownerWallet.getClaim(accessKeyClaimID);

            if (accessKeyClaim) {
                value.accessKeyClaim = accessKeyClaim;
                setTimeout(() => {
                    
                    console.log('access Key Claim from Owner Wallet', accessKeyClaim);
    
                    value.nextTip(`Let the ${Agents.landlord} verify the access key provided by ${Agents.owner}`);
                    value.changeAction('demoOwnerOpenDoor', 'waiting');
                    value.changeAction('demoLandlord', 'pendingRequest');
                    
                }, 2000);

            } else {
                value.changeAction('demoOwnerOpenDoor', 'sharingCredentialsFailed');
            }
        } else {
            value.changeAction('demoOwnerOpenDoor', 'sharingCredentialsFailed');
        }
    }


    generateDID = async (value: any) => {

        value.changeAction('demoOwnerDID', 'waiting');

        const did = this.props.ownerWallet.createDID(DIDNetwork.PrivateNet);
        localStorage.setItem('ownerDID', did);
        console.log('created DID', did);

        if (did) {
            value.changeAction('demoOwnerDID', 'success');
            value.nextTip(`Act as ${Agents.owner} and ask the digital Passport to the ${Agents.government}`);
        } else {
            value.changeAction('demoOwnerDID', 'failure');
            value.nextTip(`Error occurred while generating the DID. Please go back to the Help Page, click the reset button and try again!`);
        }

    }

    openDialog = (type: string) => {
        if (type === 'DID') {
            const ownerDID = '{' + localStorage.getItem('ownerDID') + '}';
            const title = `${Agents.owner}'s DID`;
            this.setState({ dialogTitle: title, dialogContent: ownerDID, dialogOpen: true });
        } else if (type === 'gov') {
            const passportClaim = '' + localStorage.getItem('passportClaim');
            this.setState({ dialogTitle: 'Claim: Digital Passport', dialogContent: passportClaim, dialogOpen: true });
        } else if (type === 'agency') {
            const accessKeyClaim = '' + localStorage.getItem('accessKeyClaim');
            this.setState({ dialogTitle: 'Claim: Access key', dialogContent: accessKeyClaim, dialogOpen: true });
        }

    }

    closeDialog = () => {
        this.setState({ dialogOpen: false });
    }

    render() {
        return (
            <ApplicationContext.Consumer>
                {(value: any) => (
                    <span>
                        <CardHeader
                            avatar={<Avatar aria-label="Recipe"> <AccountCircleIcon className="OwnerIcon" /> </Avatar>}
                            title={<div className="AgentCardTitle"> <div> <h1> {Agents.owner} </h1> </div> <div> <h2> Identity Owner </h2> </div> </div>}
                            className="AgentCardHeader"
                        />

                        <Grid container>
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    alignItems="center"
                                    spacing={0}
                                    direction="column"
                                    justify="space-between"
                                    className="OwnerGridContainer"
                                >
                                    <Grid item className="OwnerGridItem">
                                        {this.renderDIDSection(value)}
                                    </Grid>

                                    <Grid item className="OwnerGridItem">
                                        {this.renderCredFromGovSection(value)}
                                    </Grid>

                                    <Grid item className="OwnerGridItem">
                                        {this.renderCredFromAgencySection(value)}
                                    </Grid>

                                    <Grid item className="OwnerGridItem">
                                        {this.renderOpenDoorSection(value)}
                                    </Grid>

                                    {value.showHelp ? (
                                        <Grid item>
                                            <div className="AgentStatusHelp">
                                                <br />
                                                <hr />
                                                <small> Status of getting credentials from Gov: <strong> {value.actions.demoOwnerCredFromGov} </strong> </small>
                                                <br />
                                                <small> Status of getting credentials from the agency:  <strong>{value.actions.demoOwnerCredFromAgency} </strong> </small>
                                                <br />
                                                <small> Status of opening the door of the flat:  <strong> {value.actions.demoOwnerOpenDoor} </strong> </small>
                                            </div>
                                        </Grid>) : null}
                                </Grid>
                            </Grid>
                        </Grid>

                    </span>
                )}
            </ApplicationContext.Consumer>

        );
    }
}

export default Owner;
