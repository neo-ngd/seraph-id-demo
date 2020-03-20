// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React, { useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Owner.css';
import { Fab, CircularProgress, Grid, Tooltip, IconButton, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { Agents } from '../../application-context';
import SadFaceIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import HappyFaceIcon from '@material-ui/icons/SentimentVerySatisfied';
import CodeIcon from '@material-ui/icons/Code';
import Header from './OwnerHeader';

// Import from seraph-id-sdk 
import { DIDNetwork } from '@sbc/seraph-id-sdk';
import { GlobalContext } from 'containers/GlobalContext';
import { changeAction, nextTip } from 'containers/action';

const OWNER_GOV_BTN_LABEL = 'Apply for Passport';
const OWNER_AGENCY_BTN_LABEL = 'Book a flat';
const OWNER_DOOR_BTN_LABEL = 'Open the door';

export const Owner = React.memo(function () {
    const { state, dispatch } = useContext(GlobalContext);
    const { 
        ownerWallet, 
        actions: { 
            demoOwnerDID, 
            demoOwnerCredFromGov,
            demoOwnerCredFromAgency,
            demoOwnerOpenDoor        }, 
        showHelp 
    } = state;
    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        content: ''
    })
    const { open, title, content } = dialog;

    function _changeAction(agent: string, newContext: string) {
        dispatch!(changeAction(agent, newContext))
    }

    function _nextTip(newTip: string) {
        dispatch!(nextTip(newTip))
    }

    function renderJSONObject(objString: string) {
        const jsonStart = "{";
        const jsonEnd = "}"
        const attributesStartIndex = objString.indexOf("attributes");
        if (attributesStartIndex < 0) {
            return <div> {jsonStart} {renderJSONLevel(objString)} {jsonEnd} </div>;
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
                            {renderJSONLevel(attributes)}
                        </div>
                        <p> {jsonEnd}, <br /> </p>
                        {renderJSONLevel(others)}
                    </div>
                    <p> {jsonEnd} <br /> </p>

                </div>
            );
        }
    }

    function renderJSONLevel(objString: string) {

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

    const DIDSection = useMemo(() => (
        <Grid item className="OwnerGridItem">
            {renderDIDSection()}
        </Grid>
    ), [demoOwnerDID])

    const modalDialog = useMemo(() => (
        <Dialog onClose={() => closeDialog()} open={open} >
            <DialogTitle> {title} </DialogTitle>
            <DialogContent className="DialogContent">
                <div className="DialogCodeContainer">
                    <code>
                        {renderJSONObject(content)}
                    </code>
                </div>
            </DialogContent>
        </Dialog>
    ), [open, content, title])


    function renderDIDSection() {
        if (demoOwnerDID === 'todo') {
            return (
                <div>
                    <p> Generate your DID and create a wallet. </p>
                    <Fab onClick={() => { generateDID() }} variant="extended" color="primary">
                        Generate DID
                    </Fab>
                </div>
            );
        } else if (demoOwnerDID === 'waiting') {
            return (
                <div>
                    <p> Waiting for DID generation.  </p>
                    <CircularProgress />
                </div>
            );
        } else if (demoOwnerDID === 'success') {
            return (
                <div className="ShowCodeSection DIDSuccess">
                    <p> DID successfully generated. </p>
                    <Tooltip title="Show DID code">
                        <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={() => { openDialog('DID') }} >
                            <CodeIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            );
        } else if (demoOwnerDID === 'failure') {
            return (
                <div>
                    <p> Error occurred generating the DID. </p>
                    <SadFaceIcon className="ResultIcon" />
                </div>
            );
        } else return null;

    }

    const credFromGovSection = useMemo(() => (
        <Grid item className="OwnerGridItem">
            {renderCredFromGovSection()}
        </Grid>
    ), [demoOwnerDID, demoOwnerCredFromGov]);

    function renderCredFromGovSection () {

        if (demoOwnerDID !== 'success') {
            return (
                <div>
                    <p> Ask the {Agents.government} to issue a digital Passport. </p>
                    <Fab disabled variant="extended" >
                        {OWNER_GOV_BTN_LABEL}
                    </Fab>
                </div>
            );
        } else {
            if (demoOwnerCredFromGov === 'todo') {
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
            } else if (demoOwnerCredFromGov === 'waiting') {
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
            } else if (demoOwnerCredFromGov === 'success') {
                return (
                    <div>
                        <div className="ShowCodeSection">
                            <p> Claim successfully got from the {Agents.government}. </p>
                            <Tooltip title="Show claim">
                                <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={() => { openDialog('gov') }}>
                                    <CodeIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                );
            } else if (demoOwnerCredFromGov === 'failure') {
                return (
                    <div>
                        <p> Digital Passport not issued from the {Agents.government}. {Agents.owner} can not rent a flat.</p>
                        <SadFaceIcon className="ResultIcon" />
                    </div>
                );
            } else return null;

        }
    }

    const credFromAgencySection = useMemo(() => (
        <Grid item className="OwnerGridItem">
            {renderCredFromAgencySection()}
        </Grid>
    ), [demoOwnerDID, demoOwnerCredFromAgency, demoOwnerCredFromGov])

    function renderCredFromAgencySection() {
        if (demoOwnerDID !== 'success') {
            return (
                <div>
                    <p> Once you got the digital Passport from the Government, you can use the claim in the accomodation dApp to get another credential: the access key. </p>
                    <Fab disabled variant="extended">
                        {OWNER_AGENCY_BTN_LABEL}
                    </Fab>
                </div>
            );
        } else {
            if (demoOwnerCredFromAgency === 'todo') {
                if (demoOwnerCredFromGov === 'success') {
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

            } else if (demoOwnerCredFromAgency === 'waiting') {
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
            } else if (demoOwnerCredFromAgency === 'success') {
                return (
                    <div>
                        <div className="ShowCodeSection">
                            <p> Claim successfully got from the {Agents.smartAgency}. </p>
                            <Tooltip title="Show claim">
                                <IconButton color="primary" aria-label="Menu" className="CodeButton" onClick={() => { openDialog('agency') }}>
                                    <CodeIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                );
            } else if (demoOwnerCredFromAgency === 'failure') {
                return (
                    <div>
                        <p> Access key not issued from the {Agents.smartAgency}. {Agents.owner} can not rent a flat. </p>
                        <SadFaceIcon className="ResultIcon" />
                    </div>
                );
            } else return null;
        }
    }

    const openDoorSection = useMemo(() => (
        <Grid item className="OwnerGridItem">
            {renderOpenDoorSection()}
        </Grid>
    ), [demoOwnerDID, demoOwnerOpenDoor, demoOwnerCredFromAgency])

    function renderOpenDoorSection() {

        if (demoOwnerDID !== 'success') {
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
            if (demoOwnerOpenDoor === 'todo') {

                if (demoOwnerCredFromAgency === 'success') {
                    return (
                        <div>
                            <p> Use the access key you just got from the {Agents.smartAgency},
                                <br />  to open the door of the accommodation. </p>
                            <Fab onClick={() => openDoor()} variant="extended" color="primary">
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
            else if (demoOwnerOpenDoor === 'sharingCredentials') {
                return (
                    <div>
                        <p> Sharing access key with the {Agents.landlord}. </p>
                        <CircularProgress />
                    </div>
                );
            } else if (demoOwnerOpenDoor === 'sharingCredentialsFailed') {
                return (
                    <div>
                        <p> Sharing access key failed. {Agents.owner} can not access the flat. </p>
                        <SadFaceIcon className="ResultIcon" />
                    </div>
                );
            } else if (demoOwnerOpenDoor === 'waiting') {
                return (
                    <div>
                        <p> Waiting for the {Agents.landlord} to validate the provided access key </p>
                    </div>
                );
            } else if (demoOwnerOpenDoor === 'success') {
                return (
                    <div>
                        <p> Key validated. {Agents.owner} can now access the flat. </p>
                        <HappyFaceIcon className="ResultIcon" />
                    </div>
                );
            } else if (demoOwnerOpenDoor === 'failure') {
                return (
                    <div>
                        <p> Key validation failed. {Agents.owner} can not access the flat. </p>
                        <SadFaceIcon className="ResultIcon" />
                    </div>
                );
            } else return null;

        }

    }

    function openDoor() {

        _changeAction('demoOwnerOpenDoor', 'sharingCredentials');

        const accessKeyClaimID = localStorage.getItem('accessKeyClaimID');
        console.log('accessKeyClaimID', accessKeyClaimID);
        if (accessKeyClaimID) {
            let accessKeyClaim = ownerWallet!.getClaim(accessKeyClaimID);

            if (accessKeyClaim) {
                accessKeyClaim = accessKeyClaim;
                setTimeout(() => {
                    
                    console.log('access Key Claim from Owner Wallet', accessKeyClaim);
    
                    _nextTip(`Let the ${Agents.landlord} verify the access key provided by ${Agents.owner}`);
                    _changeAction('demoOwnerOpenDoor', 'waiting');
                    _changeAction('demoLandlord', 'pendingRequest');
                    
                }, 2000);

            } else {
                _changeAction('demoOwnerOpenDoor', 'sharingCredentialsFailed');
            }
        } else {
            _changeAction('demoOwnerOpenDoor', 'sharingCredentialsFailed');
        }
    }


    async function generateDID () {

        _changeAction('demoOwnerDID', 'waiting');

        const did = ownerWallet!.createDID(DIDNetwork.PrivateNet);
        localStorage.setItem('ownerDID', did);
        console.log('created DID', did);

        if (did) {
            _changeAction('demoOwnerDID', 'success');
            _nextTip(`Act as ${Agents.owner} and ask the digital Passport to the ${Agents.government}`);
        } else {
            _changeAction('demoOwnerDID', 'failure');
            _nextTip(`Error occurred while generating the DID. Please go back to the Help Page, click the reset button and try again!`);
        }

    }

    function openDialog(type: string) {
        if (type === 'DID') {
            const ownerDID = '{' + localStorage.getItem('ownerDID') + '}';
            const title = `${Agents.owner}'s DID`;
            setDialog({ title, content: ownerDID, open: true });
        } else if (type === 'gov') {
            const passportClaim = '' + localStorage.getItem('passportClaim');
            setDialog({ title: 'Claim: Digital Passport', content: passportClaim, open: true });
        } else if (type === 'agency') {
            const accessKeyClaim = '' + localStorage.getItem('accessKeyClaim');
            setDialog({ title: 'Claim: Access key', content: accessKeyClaim, open: true });
        }

    }

    function closeDialog(){
        setDialog({...dialog,  open: false });
    }

    const GridBody = React.memo(() => (
        <Grid
            container
            alignItems="center"
            spacing={0}
            direction="column"
            justify="space-between"
            className="OwnerGridContainer"
        >
            {DIDSection}
            {credFromGovSection}
            {credFromAgencySection}
            {openDoorSection}
            {showHelp ? (
                <Grid item>
                    <div className="AgentStatusHelp">
                        <br />
                        <hr />
                        <small> Status of getting credentials from Gov: <strong> {demoOwnerCredFromGov} </strong> </small>
                        <br />
                        <small> Status of getting credentials from the agency:  <strong>{demoOwnerCredFromAgency} </strong> </small>
                        <br />
                        <small> Status of opening the door of the flat:  <strong> {demoOwnerOpenDoor} </strong> </small>
                    </div>
                </Grid>) : null}
            {modalDialog}
        </Grid>
    ))
    return (
        <span>       
            <Header></Header>
            <GridBody></GridBody>
        </span>
    );
});

export default Owner;
