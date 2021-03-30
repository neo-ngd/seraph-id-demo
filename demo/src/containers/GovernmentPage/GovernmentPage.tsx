// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React from 'react';
import './GovernmentPage.css';
import {
    AppBar, Toolbar, Typography, IconButton, TextField, Fab, Tooltip, CircularProgress,
    RadioGroup, Radio, FormControlLabel, FormControl
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ActiveAgent from 'components/ActiveAgent/ActiveAgent';
import { Agents, ApplicationContext } from '../../application-context';
import CloseIcon from '@material-ui/icons/Close';
import UserTips from 'components/UserTips/UserTips';
import HelpIcon from '@material-ui/icons/HelpOutline';
import PassportRequests, { PassportReq, PassportStatus } from 'components/PassportRequests/PassportRequests';
import uuid from 'uuid/v1';

// Import from seraph-id-sdk 
import { SeraphIDIssuer } from '@sbc/seraph-id-sdk';
import * as configs from 'configs';

interface Props {
    isAdmin: boolean;
    ownerWallet: any;
}
interface State {
    secondName: { value: string, error: boolean, touched: boolean };
    birthDate: { value: string, error: boolean, touched: boolean, helperText: string };
    citizenship: { value: string, error: boolean, touched: boolean };
    address: string;
    gender: string;
}

export class GovernmentPage extends React.Component<Props, State> {

    public state: State = {
        secondName: { value: '', error: false, touched: false },
        birthDate: { value: '', error: false, touched: false, helperText: 'Format DD.MM.YYYY' },
        citizenship: { value: '', error: false, touched: false },
        address: '',
        gender: 'male'
    };

    handleSecondNameChange = (event: any) => {
        localStorage.setItem('secondName', event.target.value);
        const error = !event.target.value || event.target.value === '';
        const newSecondName = { value: event.target.value, error: error, touched: true };
        this.setState({ secondName: newSecondName });
    }

    handleBirthDateChange = (event: any) => {
        const inputValue = event.target.value;
        localStorage.setItem('birthDate', inputValue);

        const regex = /^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/;
        const match = inputValue.match(regex);

        let helperText = "Format DD.MM.YYYY";
        let isDateValid = true;
        const currentYear = new Date().getFullYear();
        if (match) {
            const year = inputValue.slice(-4);
            if (year < currentYear - 100 || year >= 2019) {
                isDateValid = false;
                helperText = "Date not valid";
            }
        }
        const error = !inputValue || inputValue === '' || !match || !isDateValid;

        const newBirthDate = { value: event.target.value, error: error, touched: true, helperText: helperText };
        this.setState({ birthDate: newBirthDate });
    }

    handleCitizenshipChange = (event: any) => {
        localStorage.setItem('citizenship', event.target.value);
        const error = !event.target.value || event.target.value === '';
        const newCitizenship = { value: event.target.value, error: error, touched: true };
        this.setState({ citizenship: newCitizenship });
    }

    handleAddressChange = (event: any) => {
        localStorage.setItem('address', event.target.value);
        this.setState({ address: event.target.value });
    }


    handleGenderChange = (event: any) => {
        localStorage.setItem('gender', event.target.value);
        this.setState({ gender: event.target.value });
    }

    getFormValidation = () => {
        if (this.state.secondName.touched && this.state.birthDate.touched && this.state.citizenship.touched) {
            return !(this.state.secondName.error || this.state.citizenship.error || this.state.birthDate.error);
        } else return false;

    }

    renderContentForOwner = (value: any) => {
        if (value.actions.govPageAsOwner === 'toFillForm') {
            return (
                <div className="FormPageContainer">
                    <h1 className="PassportFormTitle"> Passport Request </h1>
                    <form noValidate autoComplete="off" className="FormContainer">
                        <div>
                            <TextField
                                className="InputField"
                                disabled
                                required
                                id="first-name"
                                label="First Name"
                                value={Agents.owner}
                            />
                        </div>

                        <div>
                            <TextField
                                className="InputField"
                                required
                                id="second-name"
                                label="Second Name"
                                value={this.state.secondName.value}
                                error={this.state.secondName.error}
                                onChange={(event) => this.handleSecondNameChange(event)}
                            />
                        </div>

                        <div>
                            <TextField
                                className="InputField"
                                required
                                id="date-of-birth"
                                label="Date of birth"
                                value={this.state.birthDate.value}
                                error={this.state.birthDate.error}
                                helperText={this.state.birthDate.helperText}
                                onChange={(event) => this.handleBirthDateChange(event)}
                            />
                        </div>


                        <div>
                            <TextField
                                className="InputField"
                                required
                                id="citizenship"
                                label="Citizenship"
                                value={this.state.citizenship.value}
                                error={this.state.citizenship.error}
                                onChange={(event) => this.handleCitizenshipChange(event)}
                            />
                        </div>

                        <div>
                            <TextField
                                className="InputField"
                                id="address"
                                label="City"
                                value={this.state.address}
                                onChange={(event) => this.handleAddressChange(event)}
                            />
                        </div>

                        <FormControl className="GenderRadioButton">
                            <p className="GenderRadioLabel"> Gender </p>

                            <RadioGroup
                                aria-label="gender"
                                name="gender"
                                value={this.state.gender}
                                onChange={(event) => this.handleGenderChange(event)}
                                row
                            >
                                <FormControlLabel
                                    value="female"
                                    control={<Radio color="secondary" />}
                                    label="Female"
                                />
                                <FormControlLabel
                                    value="male"
                                    control={<Radio color="secondary" />}
                                    label="Male"
                                />
                            </RadioGroup>

                        </FormControl>




                    </form>

                    {this.getFormValidation() ? (
                        <div className="GetCredentialsButton">
                            <Fab onClick={() => this.getCredentials(value)} variant="extended" color="secondary"> Send Request </Fab>
                        </div>
                    ) : (
                            <div className="GetCredentialsButton">
                                <Fab disabled variant="extended"> Send Request </Fab>
                            </div>

                        )}
                </div>
            );

        } else if (value.actions.govPageAsOwner === 'askForCredentials') {
            return (
                <div className="PageContainer">
                    <h1> Requesting credentials </h1>
                    <CircularProgress color="secondary" />
                </div>
            );
        } else if (value.actions.govPageAsOwner === 'waitingForCredentials') {
            return (
                <div className="PageContainer">
                    <h1> Waiting for the Government to issue the digital Passport. </h1>
                </div>
            );
        } else if (value.actions.govPageAsOwner === 'success') {
            return (
                <div className="PageContainer">
                    <h1> Credential successfully got from {Agents.government}.  </h1>
                </div>
            );
        } else if (value.actions.govPageAsOwner === 'failure') {
            return (
                <div className="PageContainer">
                    <h1> {Agents.government} denied to issue the digital Passport. It's not possible to book a flat. </h1>
                </div>
            );
        }
    }


    renderContentForGovernment = (value: any) => {

        const name = Agents.owner;
        const surname = localStorage.getItem('secondName');
        const birthDate = localStorage.getItem('birthDate');
        const citizenship = localStorage.getItem('citizenship');
        const address = localStorage.getItem('address');
        const gender = localStorage.getItem('gender');


        if (value.actions.govPageAsGov === 'noRequests') {
            return (
                <div>
                    <PassportRequests />
                </div>
            );
        } else if (value.actions.govPageAsGov === 'pendingRequest') {
            const request = new PassportReq(
                name ? name : '',
                surname ? surname : '',
                birthDate ? birthDate : '',
                citizenship ? citizenship : '',
                address ? address : '',
                gender ? gender : 'male',
                ' - ', PassportStatus.pending, ' - ');
            return (
                <div>
                    <PassportRequests
                        activeRequest={request}
                        denied={() => this.doNotIssueCredential(value)}
                        issued={() => this.issueCredential(value, request)}
                    />
                </div>
            );
        } else if (value.actions.govPageAsGov === 'issuing') {
            return (
                <div className="PageContainer">
                    <h1> Issuing Passport to {Agents.owner} </h1>
                    <CircularProgress color="secondary" />
                </div>
            );
        } else if (value.actions.govPageAsGov === 'credIssued') {
            const request = new PassportReq(
                name ? name : '',
                surname ? surname : '',
                birthDate ? birthDate : '',
                citizenship ? citizenship : '',
                address ? address : '',
                gender ? gender : 'male',
                'J12393496', PassportStatus.issued, ' - ');

            return (
                <PassportRequests
                    activeRequest={request}
                />
            );


        } else if (value.actions.govPageAsGov === 'credNotIssued') {

            const request = new PassportReq(
                name ? name : '',
                surname ? surname : '',
                birthDate ? birthDate : '',
                citizenship ? citizenship : '',
                address ? address : '',
                gender ? gender : 'male',
                ' - ', PassportStatus.denied, ' - ');


            return (
                <PassportRequests
                    activeRequest={request}
                />
            );
        } else if (value.actions.govPageAsGov === 'errorIssuingCred') {

            const request = new PassportReq(
                name ? name : '',
                surname ? surname : '',
                birthDate ? birthDate : '',
                citizenship ? citizenship : '',
                address ? address : '',
                gender ? gender : 'male',
                ' - ', PassportStatus.error, ' - ');


            return (
                <PassportRequests
                    activeRequest={request}
                />
            );
        }
    }

    renderContent = (value: any, agent: string) => {
        if (agent === Agents.owner) {
            return this.renderContentForOwner(value);
        } else {
            return this.renderContentForGovernment(value);
        }
    }


    getCredentials = (value: any) => {

        value.changeAction('govPageAsOwner', 'askForCredentials');

        setTimeout(() => {
            value.nextTip(`Play as ${Agents.government} to issue credentials to ${Agents.owner}`);

            value.changeAction('govPageAsOwner', 'waitingForCredentials');
            value.changeAction('demoOwnerCredFromGov', 'waiting');
            value.changeAction('demoGov', 'pendingRequest');
            value.changeAction('govPageAsGov', 'pendingRequest');

        }, 3000);
    }

    issueCredential = (value: any, request: PassportReq) => {

        value.changeAction('govPageAsGov', 'issuing');
        const govIssuer = new SeraphIDIssuer(configs.GOVERNMENT_SCRIPT_HASH, configs.NEO_RPC_URL, configs.DID_NETWORK, configs.MAGIC)
        const ownerDID = localStorage.getItem('ownerDID');

        const claimID = uuid();
        const newClaim = govIssuer.createClaim(claimID, configs.PASSPORT_SCHEMA_NAME,
            {
                'idNumber': 'J12393496',
                'firstName': request.firstName,
                'secondName': request.secondName,
                'birthDate': request.birthDate,
                'citizenship': request.citizenship,
                'address': request.address,
                'gender': request.gender
            }, ownerDID ? ownerDID : '');

        console.log('new created Claim', newClaim);
        govIssuer.issueClaim(newClaim, configs.GOVERNMENT_ISSUER_PRIVATE_KEY).then(
            res => {
                setTimeout(() => {
                    console.log('issueClaimID RES', res.id);

                    try {
                        this.props.ownerWallet.addClaim(res);
                        const addedClaim = this.props.ownerWallet.getClaim(res.id);
                        console.log('claim Added to the Wallet: ', addedClaim);

                        localStorage.setItem('passportClaimID', res.id);
                        localStorage.setItem('passportClaim', JSON.stringify(res));

                        value.changeAction('agencyPageAsOwner', 'toChooseAFlat');
                        value.nextTip(`Play as ${Agents.owner} and choose an accommodation from the ${Agents.smartAgency} Web Page.`);

                        value.changeAction('govPageAsOwner', 'success');
                        value.changeAction('demoOwnerCredFromGov', 'success');
                        value.changeAction('demoGov', 'credIssued');
                        value.changeAction('govPageAsGov', 'credIssued');
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
        value.changeAction('govPageAsGov', 'errorIssuingCred');
        this.handleFailure(value);

    }

    doNotIssueCredential = (value: any) => {
        value.changeAction('govPageAsGov', 'credNotIssued');
        this.handleFailure(value);
    }

    handleFailure = (value: any) => {
        value.nextTip(`${Agents.owner} can not book a flat without a valid digital Passport. Go back to the Help Page, click the reset button and try again!!!`);

        value.changeAction('govPageAsOwner', 'failure');
        value.changeAction('demoOwnerCredFromGov', 'failure');
        value.changeAction('demoGov', 'credNotIssued');      
    }

    public render() {

        let agent = Agents.owner;
        if (this.props.isAdmin) {
            agent = Agents.government;
        }

        return (
            <ApplicationContext.Consumer>
                {(value: any) => (
                    <span>
                        <AppBar position="static" color="secondary">
                            <Toolbar>
                                <IconButton color="inherit" aria-label="Menu">
                                    <AccountBalanceIcon className="GovernmentLogo" />
                                </IconButton>
                                <Typography variant="h6" color="inherit" className="NavBarTypography"> Government Web Page </Typography>

                                <Tooltip title="Help">
                                    <Link to="/help" className="HelpButton">
                                        <IconButton color="inherit" aria-label="Menu">
                                            <HelpIcon className="HelpIconBar" />
                                        </IconButton>
                                    </Link>
                                </Tooltip>

                                <Tooltip title="Close Government Web Page">
                                    <Link to="/dashboard" className="CloseButton">
                                        <IconButton color="inherit" aria-label="Close">
                                            <CloseIcon />
                                        </IconButton>
                                    </Link>
                                </Tooltip>
                            </Toolbar>
                        </AppBar>

                        <div className="GovPageContainer">
                            <ActiveAgent agent={agent} location="GovWebPage" />
                            <UserTips location="GovWebPage" />
                            <div className="GovPageContent">
                                {this.renderContent(value, agent)}
                            </div>
                        </div>
                    </span>
                )}
            </ApplicationContext.Consumer>

        );
    }

}

export default GovernmentPage;
