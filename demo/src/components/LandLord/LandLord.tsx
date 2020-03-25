// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';
import { Fab, CardHeader, Avatar, Tooltip, CircularProgress } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { Agents } from '../../application-context';

// Import from seraph-id-sdk 
import { SeraphIDVerifier } from '@sbc/seraph-id-sdk';
import * as configs from 'configs';
import { useContext } from 'react';
import { GlobalContext } from 'containers/GlobalContext';
import { useStepActions } from 'containers/hooks';


function LandLord() {
    const { state: { data: {actions: {demoLandlord }, showHelp, accessKeyClaim}}} = useContext(GlobalContext);
    const { _changeAction, _nextTip } = useStepActions();

    const renderdemoLandlordContent = React.useMemo(() => {

        if (demoLandlord === 'noRequests') {
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
        } else if (demoLandlord === 'pendingRequest') {
            return (
                <div>
                    <p> There is a pending request from {Agents.owner}. </p>
                    <div>
                        <Fab variant="extended" color="primary" onClick={verifyAccessKey}> Verify Access Key </Fab>
                    </div>
                </div>
            );
        } else if (demoLandlord === 'verifying') {
            return (
                <div>
                    <p> Verifying access key provided by {Agents.owner}. </p>
                    <CircularProgress />
                </div>
            );
        } else if (demoLandlord === 'doorOpened') {
            return (
                <div>
                    <p> The access key is successfully verified. {Agents.owner} can open the door of the accommodation. </p>
                    <Fab disabled variant="extended"> Verify Access Key </Fab>
                </div>

            );
        } else if (demoLandlord === 'doorNotOpened') {
            return (
                <div>
                    <p> The access key is not verified. {Agents.owner} couldn't open the door of the accommodation. </p>
                    <div>
                        <Fab variant="extended" color="primary" onClick={() => verifyAccessKey()}> Try again </Fab>
                    </div>
                </div>
            );
        } else return null;
    }, [demoLandlord]);

    const verifyAccessKey = () => {

        _changeAction('demoLandlord', 'verifying');

        const landLordVerifier = new SeraphIDVerifier(configs.AGENCY_SCRIPT_HASH, configs.NEO_RPC_URL, configs.NEOSCAN_URL, configs.DID_NETWORK);
        console.log('access key Claim to Verify: ', accessKeyClaim);

        if (accessKeyClaim) {

            landLordVerifier.validateClaim(accessKeyClaim, () => { return true; }).then(
                (res: any) => {

                    console.log('validateClaim RES: ', res);
                    if (res) {
                        _nextTip(`Congratulation: ${Agents.owner} just opened the door thanks to you!!! If you want to play again, go back to the Help Page and click the reset button.`);

                        _changeAction('demoOwnerOpenDoor', 'success');
                        _changeAction('demoLandlord', 'doorOpened');

                    } else {
                        handleVerifyingFailure();
                    }
                }
            ).catch((err: any) => {
                console.error('validateClaim ERR: ', err);
                handleVerifyingFailure();
            });
        } else {
            console.log('error getting access key claim');
            handleVerifyingFailure();
        }

    }

    const handleVerifyingFailure = () => {
        _nextTip(`Oh no... The access key provided by ${Agents.owner} is not verified. Go back to the Help Page, click the reset button and try again!`);

        _changeAction('demoOwnerOpenDoor', 'failure');
        _changeAction('demoLandlord', 'doorNotOpened');

    }

    return (
                <span>
                    <CardHeader
                        avatar={<Avatar aria-label="Recipe"> <VpnKeyIcon className="AgentIcon" /> </Avatar>}
                        title={<div className="AgentCardTitle"> <div> <h1> {Agents.landlord} </h1> </div> <div> <h2> Verifier </h2> </div> </div>}
                        className="AgentCardHeader"
                    />
                    <div className="AgentContainer">
                        {renderdemoLandlordContent}

                        {showHelp ? (
                            <div style={{ textAlign: 'end' }}>
                                <br />
                                <hr />
                                <small> Status of Agent: <strong> {demoLandlord} </strong> </small>
                            </div>
                        ) : null}
                    </div>
                </span>

    );
}

export default LandLord;

