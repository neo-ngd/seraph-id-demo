// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React, { useState, useContext } from 'react';
import './AccommodationDapp.css';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Fab, CircularProgress } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ActiveAgent from 'components/ActiveAgent/ActiveAgent';
import { Agents } from '../../application-context';
import CloseIcon from '@material-ui/icons/Close';
import { theme } from '../App';
import UserTips from 'components/UserTips/UserTips';
import FlatCards from 'components/FlatCards/FlatCards';
import HelpIcon from '@material-ui/icons/HelpOutline';
import AccessKeyRequests, { PassportStatus, AccessKeyReq, AccessKeyStatus } from 'components/AccessKeyRequests/AccessKeyRequests';
import moment from 'moment';
import uuid from 'uuid/v1';


// Import from seraph-id-sdk 
import { SeraphIDIssuer, SeraphIDVerifier } from '@sbc/seraph-id-sdk';
import * as configs from 'configs';
import { GlobalContext } from 'containers/GlobalContext';
import { changeAction, nextTip } from 'containers/action';
import { useStepActions } from 'containers/hooks';

interface Props {
    isAdmin: boolean;
}

export function AccommodationDapp({isAdmin}: Props) {
    const [, setChosenFlat] = useState({ city: '', price: '' })
    const themeColor = theme.palette.error.main;
    const style = { backgroundColor: themeColor, color: 'white' };
    const spinnerStyle = { color: themeColor };

    const { state: { data: {ownerWallet, passportClaim, actions}} } = useContext(GlobalContext);
    const { _changeAction, _nextTip } = useStepActions();


    function verifyDigitalIdentity() {

        _changeAction('agencyPageAsAgency', 'verifying');

        const agencyVerifier = new SeraphIDVerifier(configs.GOVERNMENT_SCRIPT_HASH, configs.NEO_RPC_URL, configs.NEOSCAN_URL, configs.DID_NETWORK);
        console.log('passport Claim to Verify: ', passportClaim);

        if (passportClaim) {
            agencyVerifier.validateClaim(passportClaim, (passportClaim) => passportValidationFunc(passportClaim)).then(
                (res: any) => {
                    console.log('validateClaim RES: ', res);
                    if (res) {
                        setTimeout(() => {
                            _nextTip(`As ${Agents.smartAgency}, issue the Access Key of the booked accomodation to ${Agents.owner}`);

                            _changeAction('agencyPageAsOwner', 'waitingForAccessKey');
                            _changeAction('agencyPageAsAgency', 'digitalIdentityVerified');
                            _changeAction('demoOwnerCredFromAgency', 'waiting');
                            _changeAction('demoAgency', 'digitalIdentityVerified');
                        }, 2000);
                    } else {
                        handleVerifyingFailure();
                    }
                }
            ).catch((err: any) => {
                console.error('validateClaim ERR: ', err);
                handleVerifyingFailure();
            });
        } else {
            console.log('error getting passport claim');
            handleVerifyingFailure();
        }

    }

    function passportValidationFunc (passportClaim: any) {
        let validated = false;
        const birthDate = passportClaim.attributes.birthDate;
        if (birthDate) {
            const birthYear = birthDate.slice(-4);
            const currentYear = new Date().getFullYear();
            if (currentYear - birthYear > 17) {
                validated = true;
            }
        }
        return validated;
    }

    function handleVerifyingFailure () {
        _nextTip(`${Agents.owner} can not book a flat without a verified Digital Passport. Go back to the Help Page, click the reset button and try again!!!`);

        _changeAction('agencyPageAsOwner', 'digitalIdentityNotVerified');
        _changeAction('agencyPageAsAgency', 'digitalIdentityNotVerified');
        _changeAction('demoOwnerCredFromAgency', 'failure');
        _changeAction('demoAgency', 'digitalIdentityNotVerified');
    }

    function agencyRequestCredentials (id: number, city?: string, price?: string) {

        if (city && price) {
            const flat = { city: city, price: price };
            localStorage.setItem('flatId', `${id}`);
            localStorage.setItem('flatLocation', city);
            localStorage.setItem('price', price);
            setChosenFlat(flat);
        }

        _changeAction('agencyPageAsOwner', 'requestingDigitalIdentity');
        if (actions.demoOwnerCredFromGov === 'success') {
            _nextTip(`As ${Agents.owner}, share your digital Passport with ${Agents.smartAgency}`);
        }

        setTimeout(() => {
            _changeAction('agencyPageAsOwner', 'toShareDigitalIdentity');
        }, 5000);

    }

    function shareCredentials () {

        _changeAction('agencyPageAsOwner', 'sharingCredentials');

        const passportClaimID = localStorage.getItem('passportClaimID');
        if (passportClaimID) {
            const passportClaim = ownerWallet!.getClaim(passportClaimID);

            if (passportClaim) {
                console.log('passport Claim from Owner Wallet', passportClaim);

                _nextTip(`As ${Agents.smartAgency}, you need to verify the identity of ${Agents.owner} from your Web Page`);

                _changeAction('agencyPageAsOwner', 'waitingForValidation');
                _changeAction('agencyPageAsAgency', 'pendingRequest');
                _changeAction('demoOwnerCredFromAgency', 'waiting');
                _changeAction('demoAgency', 'pendingRequest');

            } else {
                _changeAction('agencyPageAsOwner', 'digitalIdentityNotFound');
            }
        } else {
            _changeAction('agencyPageAsOwner', 'digitalIdentityNotFound');
        }

    }

    function doNotShareCredentials () {

        if (actions.demoOwnerCredFromGov === 'success') {
            _nextTip(`Play as ${Agents.owner} and choose an accommodation from the ${Agents.smartAgency} Web Page.`);
        }

        _changeAction('agencyPageAsOwner', 'toChooseAFlat');
        _changeAction('agencyPageAsAgency', 'noRequests');
        _changeAction('demoOwnerCredFromAgency', 'todo');
        _changeAction('demoAgency', 'noRequests');

    }

    function issueAccesskey () {

        _changeAction('agencyPageAsAgency', 'credIssuing');

        const agencyIssuer = new SeraphIDIssuer(configs.AGENCY_SCRIPT_HASH, configs.NEO_RPC_URL, configs.NEOSCAN_URL, configs.DID_NETWORK);
        const ownerDID = localStorage.getItem('ownerDID');
        const flatAddress = localStorage.getItem('flatLocation');
        const flatId = localStorage.getItem('flatId');

        const validFrom = new Date();
        validFrom.setHours(0, 0, 0, 0);
        const validTo = new Date();
        validTo.setHours(23, 59, 59, 999);

        const claimID = uuid();
        const newClaim = agencyIssuer.createClaim(claimID, configs.ACCESS_KEY_SCHEMA_NAME,
            {
                'flatId': flatId,
                'address': flatAddress
            }, ownerDID ? ownerDID : '', validFrom, validTo);


        console.log('new created Claim', newClaim);
        agencyIssuer.issueClaim(newClaim, configs.AGENCY_ISSUER_PRIVATE_KEY).then(
            res => {
                setTimeout(() => {
                    console.log('issueClaimID RES', res.id);

                    try {
                        ownerWallet!.addClaim(res);
                        const addedClaim = ownerWallet!.getClaim(res.id);
                        console.log('claim Added to the Wallet: ', addedClaim);

                        localStorage.setItem('accessKeyClaimID', res.id);
                        localStorage.setItem('accessKeyClaim', JSON.stringify(res));

                        _nextTip(`Play as ${Agents.owner} and try to open the door with the access key you just got. `);

                        _changeAction('agencyPageAsOwner', 'success');
                        _changeAction('agencyPageAsAgency', 'credIssued');
                        _changeAction('demoOwnerCredFromAgency', 'success');
                        _changeAction('demoAgency', 'credIssued');
                    }
                    catch (err) {
                        console.error('issueClaim ERR', err);
                        handleCredIssuingError();
                    }

                }, 2000);
            }
        ).catch(err => {
            console.error('issueClaim ERR', err);
            handleCredIssuingError();
        });
    }

    function handleCredIssuingError () {
        _changeAction('agencyPageAsAgency', 'errorIssuingCred');
        handleFailure();

    }


    function doNotIssueAccesskey () {
        _changeAction('agencyPageAsAgency', 'credNotIssued');
        handleFailure();
    }

    function handleFailure () {
        _nextTip(`${Agents.owner} can not book a flat without an access key. Go back to the Help Page, click the reset button and try again!!!`);

        _changeAction('agencyPageAsOwner', 'failure');
        _changeAction('demoOwnerCredFromAgency', 'failure');
        _changeAction('demoAgency', 'credNotIssued');

    }

    function renderContentForOwner () {

        if (actions.agencyPageAsOwner === 'toChooseAFlat') {
            return (
                <FlatCards flatBooked={(id: number, city: string, price: string) => agencyRequestCredentials(id, city, price)} />
            );
        } else if (actions.agencyPageAsOwner === 'requestingDigitalIdentity') {
            return (
                <div className="PageContainer">
                    <h1> Requesting credentials </h1>
                    <CircularProgress style={spinnerStyle} />
                </div>
            );
        } else if (actions.agencyPageAsOwner === 'errorRequestingDigitalIdentity') {
            return (
                <div className="PageContainer">
                    <h1> Error occurred while requesting credentials. </h1>
                </div>
            );

        } else if (actions.agencyPageAsOwner === 'toShareDigitalIdentity') {
            return (
                <div className="PageContainer">
                    <h1> You need to share your digital Passport in order to book the flat. </h1>
                    <Fab variant="extended" style={style} onClick={() => { doNotShareCredentials() }}> Don't Share </Fab>
                    <Fab variant="extended" style={style} className="RightButton" onClick={() => { shareCredentials() }}> Share credential </Fab>
                </div>
            );
        } else if (actions.agencyPageAsOwner === 'sharingCredentials') {
            return (
                <div className="PageContainer">
                    <h1> Sharing credentials </h1>
                    <CircularProgress style={spinnerStyle} />
                </div>
            );
        } else if (actions.agencyPageAsOwner === 'digitalIdentityNotFound') {
            return (
                <div className="PageContainer">
                    <h1> Passport not found in your wallet. </h1>
                </div>
            );
        } else if (actions.agencyPageAsOwner === 'waitingForValidation') {
            return (
                <div className="PageContainer">
                    <h1> Request successfully forwarded to the Agency. </h1>
                </div>
            );
        } else if (actions.agencyPageAsOwner === 'digitalIdentityNotVerified') {
            return (
                <div className="PageContainer">
                    <h1> Digital Passport not successfully verified from the {Agents.smartAgency}. </h1>
                </div>
            );
        } else if (actions.agencyPageAsOwner === 'waitingForAccessKey') {
            return (
                <div className="PageContainer">
                    <h1> Request successfully forwarded to the Agency. </h1>
                </div>
            );
        } else if (actions.agencyPageAsOwner === 'success') {
            return (
                <div className="PageContainer">
                    <h1> Credentials successfully got from {Agents.smartAgency}. </h1>
                </div>
            );
        } else if (actions.agencyPageAsOwner === 'failure') {
            return (
                <div className="PageContainer">
                    <h1> {Agents.smartAgency} denied to issue the access key. It's not possible to book a flat. </h1>
                </div>
            );
        }
    }


    function renderContentForAgency () {

        const city = localStorage.getItem('flatLocation');
        const price = localStorage.getItem('price');
        const checkIn = moment().format("MMMM Do YYYY");
        const checkOut = moment().add(1, 'days').format("MMMM Do YYYY");

        if (actions.agencyPageAsAgency === 'noRequests') {
            return (
                <div>
                    <AccessKeyRequests />
                </div>
            );
        } else if (actions.agencyPageAsAgency === 'pendingRequest') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.toVerify, AccessKeyStatus.waitingForPassport)}
                        verified={() => verifyDigitalIdentity()}
                    />
                </div>
            );
        } else if (actions.agencyPageAsAgency === 'verifying') {
            return (
                <div className="PageContainer">
                    <h1> Verifying Passport provided by {Agents.owner}</h1>
                    <CircularProgress style={spinnerStyle} />
                </div>
            );
        } else if (actions.agencyPageAsAgency === 'digitalIdentityNotVerified') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.notValid, AccessKeyStatus.waitingForPassport)}
                    />
                </div>
            );
        } else if (actions.agencyPageAsAgency === 'digitalIdentityVerified') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.valid, AccessKeyStatus.pending)}
                        issued={() => issueAccesskey()}
                        denied={() => doNotIssueAccesskey()}
                    />
                </div>
            );
        } else if (actions.agencyPageAsAgency === 'credIssuing') {
            return (
                <div className="PageContainer">
                    <h1> Issuing Access Key to {Agents.owner}</h1>
                    <CircularProgress style={spinnerStyle} />
                </div>
            );
        } else if (actions.agencyPageAsAgency === 'credIssued') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.valid, AccessKeyStatus.issued)}
                    />
                </div>
            );
        } else if (actions.agencyPageAsAgency === 'credNotIssued') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.valid, AccessKeyStatus.denied)}
                    />
                </div>

            );
        } else if (actions.agencyPageAsAgency === 'errorIssuingCred') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.valid, AccessKeyStatus.error)}
                    />
                </div>
            );
        }

    }

    function renderContent (agent: string) {
        if (agent === Agents.owner) {
            return renderContentForOwner();
        } else {
            return renderContentForAgency();
        }
    }


        let agent = isAdmin? Agents.smartAgency: Agents.owner;

        return (
                    <span>
                        <AppBar position="static" style={style}>
                            <Toolbar>
                                <IconButton color="inherit" aria-label="Menu">
                                    <HomeIcon className="AgencyLogo" />
                                </IconButton>
                                <Typography variant="h6" color="inherit" className="NavBarTypography"> Smart Agency dApp </Typography>

                                <Tooltip title="Help">
                                    <Link to="/help" className="HelpButton">
                                        <IconButton color="inherit" aria-label="Menu">
                                            <HelpIcon className="HelpIconBar" />
                                        </IconButton>
                                    </Link>
                                </Tooltip>

                                <Tooltip title="Close Agency Web Page">
                                    <Link to="/dashboard" className="CloseButton">
                                        <IconButton color="inherit" aria-label="Close">
                                            <CloseIcon />
                                        </IconButton>
                                    </Link>
                                </Tooltip>

                            </Toolbar>
                        </AppBar>

                        <div className="AgencyPageContainer">
                            <ActiveAgent agent={agent} location="AgencyWebPage" />
                            <div className="AgencyPageContent">
                                {renderContent(agent)}
                            </div>
                        </div>

                    </span>

        );

}

export default AccommodationDapp;
