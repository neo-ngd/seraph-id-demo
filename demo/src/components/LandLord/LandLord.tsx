// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';
import { Fab, CardHeader, Avatar, Tooltip, CircularProgress } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { ApplicationContext, Agents } from '../../application-context';

// Import from seraph-id-sdk 
import { SeraphIDVerifier } from '@sbc/seraph-id-sdk';
import * as configs from 'configs';


function LandLord() {

    const renderdemoLandlordContent = (value: any) => {

        if (value.actions.demoLandlord === 'noRequests') {
            return (
                <div>
                    <p> No credentials related to {Agents.owner} have been provided or verfified yet. </p>
                    <Tooltip title={Agents.owner + " didn't book any flat yet"}>
                        <div>
                            <Fab disabled variant="extended"> Verify Access Key </Fab>
                        </div>
                    </Tooltip>
                </div>

            );
        } else if (value.actions.demoLandlord === 'pendingRequest') {
            return (
                <div>
                    <p> There is a pending request from {Agents.owner}. </p>
                    <div>
                        <Fab variant="extended" color="primary" onClick={() => verifyAccessKey(value)}> Verify Access Key </Fab>
                    </div>
                </div>
            );
        } else if (value.actions.demoLandlord === 'verifying') {
            return (
                <div>
                    <p> Verifying access key provided by {Agents.owner}. </p>
                    <CircularProgress />
                </div>
            );
        } else if (value.actions.demoLandlord === 'doorOpened') {
            return (
                <div>
                    <p> The access key is successfully verified. {Agents.owner} can open the door of the accommodation. </p>
                    <Fab disabled variant="extended"> Verify Access Key </Fab>
                </div>

            );
        } else if (value.actions.demoLandlord === 'doorNotOpened') {
            return (
                <div>
                    <p> The access key is not verified. {Agents.owner} couldn't open the door of the accommodation. </p>
                    <div>
                        <Fab variant="extended" color="primary" onClick={() => verifyAccessKey(value)}> Try again </Fab>
                    </div>
                </div>
            );
        } else return null;
    }

    const verifyAccessKey = (value: any) => {

        value.changeAction('demoLandlord', 'verifying');

        const landLordVerifier = new SeraphIDVerifier(configs.AGENCY_SCRIPT_HASH, configs.NEO_RPC_URL, configs.DID_NETWORK, configs.MAGIC);
        const accessKeyClaim = value.accessKeyClaim;
        console.log('access key Claim to Verify: ', value.accessKeyClaim);

        if (accessKeyClaim) {

            landLordVerifier.validateClaim(accessKeyClaim, (accessKeyClaim) => { return true; }).then(
                (res: any) => {

                    console.log('validateClaim RES: ', res);
                    if (res) {
                        value.nextTip(`Congratulation: ${Agents.owner} just opened the door thanks to you!!! If you want to play again, go back to the Help Page and click the reset button.`);

                        value.changeAction('demoOwnerOpenDoor', 'success');
                        value.changeAction('demoLandlord', 'doorOpened');

                    } else {
                        handleVerifyingFailure(value);
                    }
                }
            ).catch((err: any) => {
                console.error('validateClaim ERR: ', err);
                handleVerifyingFailure(value);
            });
        } else {
            console.log('error getting access key claim');
            handleVerifyingFailure(value);
        }

    }

    const handleVerifyingFailure = (value: any) => {
        value.nextTip(`Oh no... The access key provided by ${Agents.owner} is not verified. Go back to the Help Page, click the reset button and try again!`);

        value.changeAction('demoOwnerOpenDoor', 'failure');
        value.changeAction('demoLandlord', 'doorNotOpened');

    }

    return (
        <ApplicationContext.Consumer>
            {(value: any) => (
                <span>
                    <CardHeader
                        avatar={<Avatar aria-label="Recipe"> <VpnKeyIcon className="AgentIcon" /> </Avatar>}
                        title={<div className="AgentCardTitle"> <div> <h1> {Agents.landlord} </h1> </div> <div> <h2> Verifier </h2> </div> </div>}
                        className="AgentCardHeader"
                    />
                    <div className="AgentContainer">
                        {renderdemoLandlordContent(value)}

                        {value.showHelp ? (
                            <div style={{ textAlign: 'end' }}>
                                <br />
                                <hr />
                                <small> Status of Agent: <strong> {value.actions.demoLandlord} </strong> </small>
                            </div>
                        ) : null}
                    </div>
                </span>
            )}
        </ApplicationContext.Consumer>

    );
}

export default LandLord;

