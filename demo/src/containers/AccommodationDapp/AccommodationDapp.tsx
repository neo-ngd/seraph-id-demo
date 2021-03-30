// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React from 'react';
import './AccommodationDapp.css';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Fab, CircularProgress } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ActiveAgent from 'components/ActiveAgent/ActiveAgent';
import { Agents } from '../../application-context';
import CloseIcon from '@material-ui/icons/Close';
import { theme } from '../App';
import { ApplicationContext } from '../../application-context';
import UserTips from 'components/UserTips/UserTips';
import FlatCards from 'components/FlatCards/FlatCards';
import HelpIcon from '@material-ui/icons/HelpOutline';
import AccessKeyRequests, { PassportStatus, AccessKeyReq, AccessKeyStatus } from 'components/AccessKeyRequests/AccessKeyRequests';
import moment from 'moment';
import uuid from 'uuid/v1';


// Import from seraph-id-sdk 
import { SeraphIDIssuer, SeraphIDVerifier } from '@sbc/seraph-id-sdk';
import * as configs from 'configs';


interface Flat {
    city: string;
    price: string;
}

interface Props {
    isAdmin: boolean;
    ownerWallet: any;
}
interface State {
    chosenFlat: Flat;
}

export class AccommodationDapp extends React.Component<Props, State> {

    public state: State = {
        chosenFlat: { city: '', price: '' }
    };

    public themeColor = theme.palette.error.main;
    public style = { backgroundColor: this.themeColor, color: 'white' };
    public spinnerStyle = { color: this.themeColor };


    verifyDigitalIdentity = (value: any) => {

        value.changeAction('agencyPageAsAgency', 'verifying');

        const agencyVerifier = new SeraphIDVerifier(configs.GOVERNMENT_SCRIPT_HASH, configs.NEO_RPC_URL, configs.DID_NETWORK, configs.MAGIC);
        const passportClaim = value.passportClaim;
        console.log('passport Claim to Verify: ', value.passportClaim);

        if (passportClaim) {
            agencyVerifier.validateClaim(passportClaim, (passportClaim) => this.passportValidationFunc(passportClaim)).then(
                (res: any) => {
                    console.log('validateClaim RES: ', res);
                    if (res) {
                        setTimeout(() => {
                            value.nextTip(`As ${Agents.smartAgency}, issue the Access Key of the booked accomodation to ${Agents.owner}`);

                            value.changeAction('agencyPageAsOwner', 'waitingForAccessKey');
                            value.changeAction('agencyPageAsAgency', 'digitalIdentityVerified');
                            value.changeAction('demoOwnerCredFromAgency', 'waiting');
                            value.changeAction('demoAgency', 'digitalIdentityVerified');
                        }, 2000);
                    } else {
                        this.handleVerifyingFailure(value);
                    }
                }
            ).catch((err: any) => {
                console.error('validateClaim ERR: ', err);
                this.handleVerifyingFailure(value);
            });
        } else {
            console.log('error getting passport claim');
            this.handleVerifyingFailure(value);
        }

    }

    passportValidationFunc = (passportClaim: any) => {
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

    handleVerifyingFailure = (value: any) => {
        value.nextTip(`${Agents.owner} can not book a flat without a verified Digital Passport. Go back to the Help Page, click the reset button and try again!!!`);

        value.changeAction('agencyPageAsOwner', 'digitalIdentityNotVerified');
        value.changeAction('agencyPageAsAgency', 'digitalIdentityNotVerified');
        value.changeAction('demoOwnerCredFromAgency', 'failure');
        value.changeAction('demoAgency', 'digitalIdentityNotVerified');
    }

    agencyRequestCredentials = (value: any, id: number, city?: string, price?: string) => {

        if (city && price) {
            const flat = { city: city, price: price };
            localStorage.setItem('flatId', `${id}`);
            localStorage.setItem('flatLocation', city);
            localStorage.setItem('price', price);
            this.setState({ chosenFlat: flat });
        }

        value.changeAction('agencyPageAsOwner', 'requestingDigitalIdentity');
        if (value.actions.demoOwnerCredFromGov === 'success') {
            value.nextTip(`As ${Agents.owner}, share your digital Passport with ${Agents.smartAgency}`);
        }

        setTimeout(() => {
            value.changeAction('agencyPageAsOwner', 'toShareDigitalIdentity');
        }, 5000);

    }

    shareCredentials = (value: any) => {

        value.changeAction('agencyPageAsOwner', 'sharingCredentials');

        const passportClaimID = localStorage.getItem('passportClaimID');
        if (passportClaimID) {
            const passportClaim = this.props.ownerWallet.getClaim(passportClaimID);

            if (passportClaim) {
                value.passportClaim = passportClaim;

                console.log('passport Claim from Owner Wallet', passportClaim);

                value.nextTip(`As ${Agents.smartAgency}, you need to verify the identity of ${Agents.owner} from your Web Page`);

                value.changeAction('agencyPageAsOwner', 'waitingForValidation');
                value.changeAction('agencyPageAsAgency', 'pendingRequest');
                value.changeAction('demoOwnerCredFromAgency', 'waiting');
                value.changeAction('demoAgency', 'pendingRequest');

            } else {
                value.changeAction('agencyPageAsOwner', 'digitalIdentityNotFound');
            }
        } else {
            value.changeAction('agencyPageAsOwner', 'digitalIdentityNotFound');
        }

    }

    doNotShareCredentials = (value: any) => {

        if (value.actions.demoOwnerCredFromGov === 'success') {
            value.nextTip(`Play as ${Agents.owner} and choose an accommodation from the ${Agents.smartAgency} Web Page.`);
        }

        value.changeAction('agencyPageAsOwner', 'toChooseAFlat');
        value.changeAction('agencyPageAsAgency', 'noRequests');
        value.changeAction('demoOwnerCredFromAgency', 'todo');
        value.changeAction('demoAgency', 'noRequests');

    }

    issueAccesskey = (value: any) => {

        value.changeAction('agencyPageAsAgency', 'credIssuing');

        const agencyIssuer = new SeraphIDIssuer(configs.AGENCY_SCRIPT_HASH, configs.NEO_RPC_URL, configs.DID_NETWORK, configs.MAGIC);
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
                        this.props.ownerWallet.addClaim(res);
                        const addedClaim = this.props.ownerWallet.getClaim(res.id);
                        console.log('claim Added to the Wallet: ', addedClaim);

                        localStorage.setItem('accessKeyClaimID', res.id);
                        localStorage.setItem('accessKeyClaim', JSON.stringify(res));

                        value.nextTip(`Play as ${Agents.owner} and try to open the door with the access key you just got. `);

                        value.changeAction('agencyPageAsOwner', 'success');
                        value.changeAction('agencyPageAsAgency', 'credIssued');
                        value.changeAction('demoOwnerCredFromAgency', 'success');
                        value.changeAction('demoAgency', 'credIssued');
                    }
                    catch (err) {
                        console.error('issueClaim ERR', err);
                        this.handleCredIssuingError(value);
                    }

                }, 2000);
            }
        ).catch(err => {
            console.error('issueClaim ERR', err);
            this.handleCredIssuingError(value);
        });
    }

    handleCredIssuingError = (value: any) => {
        value.changeAction('agencyPageAsAgency', 'errorIssuingCred');
        this.handleFailure(value);

    }


    doNotIssueAccesskey = (value: any) => {
        value.changeAction('agencyPageAsAgency', 'credNotIssued');
        this.handleFailure(value);
    }

    handleFailure = (value: any) => {
        value.nextTip(`${Agents.owner} can not book a flat without an access key. Go back to the Help Page, click the reset button and try again!!!`);

        value.changeAction('agencyPageAsOwner', 'failure');
        value.changeAction('demoOwnerCredFromAgency', 'failure');
        value.changeAction('demoAgency', 'credNotIssued');

    }

    renderContentForOwner = (value: any) => {

        if (value.actions.agencyPageAsOwner === 'toChooseAFlat') {
            return (
                <FlatCards flatBooked={(id: number, city: string, price: string) => this.agencyRequestCredentials(value, id, city, price)} />
            );
        } else if (value.actions.agencyPageAsOwner === 'requestingDigitalIdentity') {
            return (
                <div className="PageContainer">
                    <h1> Requesting credentials </h1>
                    <CircularProgress style={this.spinnerStyle} />
                </div>
            );
        } else if (value.actions.agencyPageAsOwner === 'errorRequestingDigitalIdentity') {
            return (
                <div className="PageContainer">
                    <h1> Error occurred while requesting credentials. </h1>
                </div>
            );

        } else if (value.actions.agencyPageAsOwner === 'toShareDigitalIdentity') {
            return (
                <div className="PageContainer">
                    <h1> You need to share your digital Passport in order to book the flat. </h1>
                    <Fab variant="extended" style={this.style} onClick={() => { this.doNotShareCredentials(value) }}> Don't Share </Fab>
                    <Fab variant="extended" style={this.style} className="RightButton" onClick={() => { this.shareCredentials(value) }}> Share credential </Fab>
                </div>
            );
        } else if (value.actions.agencyPageAsOwner === 'sharingCredentials') {
            return (
                <div className="PageContainer">
                    <h1> Sharing credentials </h1>
                    <CircularProgress style={this.spinnerStyle} />
                </div>
            );
        } else if (value.actions.agencyPageAsOwner === 'digitalIdentityNotFound') {
            return (
                <div className="PageContainer">
                    <h1> Passport not found in your wallet. </h1>
                </div>
            );
        } else if (value.actions.agencyPageAsOwner === 'waitingForValidation') {
            return (
                <div className="PageContainer">
                    <h1> Request successfully forwarded to the Agency. </h1>
                </div>
            );
        } else if (value.actions.agencyPageAsOwner === 'digitalIdentityNotVerified') {
            return (
                <div className="PageContainer">
                    <h1> Digital Passport not successfully verified from the {Agents.smartAgency}. </h1>
                </div>
            );
        } else if (value.actions.agencyPageAsOwner === 'waitingForAccessKey') {
            return (
                <div className="PageContainer">
                    <h1> Request successfully forwarded to the Agency. </h1>
                </div>
            );
        } else if (value.actions.agencyPageAsOwner === 'success') {
            return (
                <div className="PageContainer">
                    <h1> Credentials successfully got from {Agents.smartAgency}. </h1>
                </div>
            );
        } else if (value.actions.agencyPageAsOwner === 'failure') {
            return (
                <div className="PageContainer">
                    <h1> {Agents.smartAgency} denied to issue the access key. It's not possible to book a flat. </h1>
                </div>
            );
        }
    }


    renderContentForAgency = (value: any) => {

        const city = localStorage.getItem('flatLocation');
        const price = localStorage.getItem('price');
        const checkIn = moment().format("MMMM Do YYYY");
        const checkOut = moment().add(1, 'days').format("MMMM Do YYYY");

        if (value.actions.agencyPageAsAgency === 'noRequests') {
            return (
                <div>
                    <AccessKeyRequests />
                </div>
            );
        } else if (value.actions.agencyPageAsAgency === 'pendingRequest') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.toVerify, AccessKeyStatus.waitingForPassport)}
                        verified={() => this.verifyDigitalIdentity(value)}
                    />
                </div>
            );
        } else if (value.actions.agencyPageAsAgency === 'verifying') {
            return (
                <div className="PageContainer">
                    <h1> Verifying Passport provided by {Agents.owner}</h1>
                    <CircularProgress style={this.spinnerStyle} />
                </div>
            );
        } else if (value.actions.agencyPageAsAgency === 'digitalIdentityNotVerified') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.notValid, AccessKeyStatus.waitingForPassport)}
                    />
                </div>
            );
        } else if (value.actions.agencyPageAsAgency === 'digitalIdentityVerified') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.valid, AccessKeyStatus.pending)}
                        issued={() => this.issueAccesskey(value)}
                        denied={() => this.doNotIssueAccesskey(value)}
                    />
                </div>
            );
        } else if (value.actions.agencyPageAsAgency === 'credIssuing') {
            return (
                <div className="PageContainer">
                    <h1> Issuing Access Key to {Agents.owner}</h1>
                    <CircularProgress style={this.spinnerStyle} />
                </div>
            );
        } else if (value.actions.agencyPageAsAgency === 'credIssued') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.valid, AccessKeyStatus.issued)}
                    />
                </div>
            );
        } else if (value.actions.agencyPageAsAgency === 'credNotIssued') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.valid, AccessKeyStatus.denied)}
                    />
                </div>

            );
        } else if (value.actions.agencyPageAsAgency === 'errorIssuingCred') {
            return (
                <div>
                    <AccessKeyRequests
                        activeRequest={new AccessKeyReq(0, city ? city : '', checkIn, checkOut, price ? price : '', PassportStatus.valid, AccessKeyStatus.error)}
                    />
                </div>
            );
        }

    }

    renderContent = (value: any, agent: string) => {
        if (agent === Agents.owner) {
            return this.renderContentForOwner(value);
        } else {
            return this.renderContentForAgency(value);
        }
    }

    public render() {

        let agent = Agents.owner;
        if (this.props.isAdmin) {
            agent = Agents.smartAgency;
        }

        return (
            <ApplicationContext.Consumer>
                {(value: any) => (
                    <span>
                        <AppBar position="static" style={this.style}>
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
                            <UserTips location="AgencyWebPage" />
                            <div className="AgencyPageContent">
                                {this.renderContent(value, agent)}
                            </div>
                        </div>

                    </span>
                )}
            </ApplicationContext.Consumer>

        );
    }

}

export default AccommodationDapp;
