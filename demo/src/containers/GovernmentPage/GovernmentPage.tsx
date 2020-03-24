// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import './GovernmentPage.css';
import {
    TextField, Fab, CircularProgress,
    RadioGroup, Radio, FormControlLabel, FormControl
} from '@material-ui/core';
import ActiveAgent from 'components/ActiveAgent/ActiveAgent';
import { Agents } from '../../application-context';
import UserTips from 'components/UserTips/UserTips';
import PassportRequests, { PassportReq, PassportStatus } from 'components/PassportRequests/PassportRequests';
import uuid from 'uuid/v1';

// Import from seraph-id-sdk 
import { SeraphIDIssuer } from '@sbc/seraph-id-sdk';
import * as configs from 'configs';
import { GlobalContext } from 'containers/GlobalContext';
import { GovernmentBar } from './GovermentBar';
import { useStepActions } from 'containers/hooks';

interface Props {
    isAdmin: boolean;
}

export const GovernmentPage = React.memo(({isAdmin}: Props) =>  {
    const [secondName, setSecondName] = useState({ value: '', error: false, touched: false });
    const [birthDate, setBirthDate] = useState({ value: '', error: false, touched: false, helperText: 'Format DD.MM.YYYY' });
    const [citizenship, setCitizenship] = useState({ value: '', error: false, touched: false });
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('male');
    const [formValidate, setFormValidate] = useState(false);
    const { state: { data: { ownerWallet, actions }} } = useContext(GlobalContext);
    const { _changeAction, _nextTip } = useStepActions();

    function handleSecondNameChange(event: any) {
        localStorage.setItem('secondName', event.target.value);
        const error = !event.target.value || event.target.value === '';
        const newSecondName = { value: event.target.value, error: error, touched: true };
        setSecondName(newSecondName);
    }

    function handleBirthDateChange(event: any) {
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
        setBirthDate(newBirthDate);
    }

    function handleCitizenshipChange(event: any) {
        localStorage.setItem('citizenship', event.target.value);
        const error = !event.target.value || event.target.value === '';
        const newCitizenship = { value: event.target.value, error: error, touched: true };
        setCitizenship(newCitizenship);
    }

    function handleAddressChange(event: any) {
        localStorage.setItem('address', event.target.value);
        setAddress(event.target.value);
    }


    function handleGenderChange(event: any){
        localStorage.setItem('gender', event.target.value);
        setGender(event.target.value);
    }

    function getFormValidation() {
        if (secondName.touched && birthDate.touched && citizenship.touched) {
            return !(secondName.error ||citizenship.error || birthDate.error);
        } else return false;
    }

    function validateForm() {
        if (formValidate !== getFormValidation()) {
            setFormValidate(!formValidate);
        }
    }

    useEffect(validateForm);

    const FirstNameInput = React.memo(() => (
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
    ))

    const secondNameInput = useMemo(() => (
        <div>
            <TextField
                className="InputField"
                required
                id="second-name"
                label="Second Name"
                value={secondName.value}
                error={secondName.error}
                onChange={(event) => handleSecondNameChange(event)}
            />
        </div>
    ), [secondName]);

    const citizenshipInput = useMemo(() => (
        <div>
            <TextField
                className="InputField"
                required
                id="citizenship"
                label="Citizenship"
                value={citizenship.value}
                error={citizenship.error}
                onChange={(event) => handleCitizenshipChange(event)}
            />
        </div>
    ), [citizenship]);

    const birthDateInput = useMemo(() => (
        <div>
            <TextField
                className="InputField"
                required
                id="date-of-birth"
                label="Date of birth"
                value={birthDate.value}
                error={birthDate.error}
                helperText={birthDate.helperText}
                onChange={(event) => handleBirthDateChange(event)}
            />
        </div>
    ), [birthDate]);

    const cityInput = useMemo(() => (
        <div>
            <TextField
                className="InputField"
                id="address"
                label="City"
                value={address}
                onChange={(event) => handleAddressChange(event)}
            />
        </div>
    ), [address])

    const genderInput = useMemo(() => (
        <FormControl className="GenderRadioButton">
            <p className="GenderRadioLabel"> Gender </p>
            <RadioGroup
                aria-label="gender"
                name="gender"
                value={gender}
                onChange={(event) => handleGenderChange(event)}
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
    ), [gender]);

    const submitButton = useMemo(() => (
        <div className="GetCredentialsButton">
            <Fab 
                onClick={getCredentials} 
                variant="extended" 
                color= "secondary" 
                disabled={!formValidate}
            > 
                Send Request 
            </Fab>
        </div>
    ), [formValidate])

    function renderContentForOwner() {
        if (actions.govPageAsOwner === 'toFillForm') {
            return (
                <div className="FormPageContainer">
                    <h1 className="PassportFormTitle"> Passport Request </h1>
                    <form noValidate autoComplete="off" className="FormContainer">
                        <FirstNameInput></FirstNameInput>
                        {secondNameInput}
                        {birthDateInput}
                        {citizenshipInput}
                        {cityInput}
                        {genderInput}
                    </form>
                    {submitButton}
                </div>
            );

        } else if (actions.govPageAsOwner === 'askForCredentials') {
            return (
                <div className="PageContainer">
                    <h1> Requesting credentials </h1>
                    <CircularProgress color="secondary" />
                </div>
            );
        } else if (actions.govPageAsOwner === 'waitingForCredentials') {
            return (
                <div className="PageContainer">
                    <h1> Waiting for the Government to issue the digital Passport. </h1>
                </div>
            );
        } else if (actions.govPageAsOwner === 'success') {
            return (
                <div className="PageContainer">
                    <h1> Credential successfully got from {Agents.government}.  </h1>
                </div>
            );
        } else if (actions.govPageAsOwner === 'failure') {
            return (
                <div className="PageContainer">
                    <h1> {Agents.government} denied to issue the digital Passport. It's not possible to book a flat. </h1>
                </div>
            );
        }
    }


    function renderContentForGovernment() {

        const name = Agents.owner;
        const surname = localStorage.getItem('secondName');
        const birthDate = localStorage.getItem('birthDate');
        const citizenship = localStorage.getItem('citizenship');
        const address = localStorage.getItem('address');
        const gender = localStorage.getItem('gender');


        if (actions.govPageAsGov === 'noRequests') {
            return (
                <div>
                    <PassportRequests />
                </div>
            );
        } else if (actions.govPageAsGov === 'pendingRequest') {
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
                        denied={doNotIssueCredential}
                        issued={() => issueCredential(request)}
                    />
                </div>
            );
        } else if (actions.govPageAsGov === 'issuing') {
            return (
                <div className="PageContainer">
                    <h1> Issuing Passport to {Agents.owner} </h1>
                    <CircularProgress color="secondary" />
                </div>
            );
        } else if (actions.govPageAsGov === 'credIssued') {
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


        } else if (actions.govPageAsGov === 'credNotIssued') {

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
        } else if (actions.govPageAsGov === 'errorIssuingCred') {

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

    function renderContent(agent: string) {
        if (agent === Agents.owner) {
            return renderContentForOwner();
        } else {
            return renderContentForGovernment();
        }
    }


    function getCredentials() {

        _changeAction('govPageAsOwner', 'askForCredentials');

        setTimeout(() => {
            _nextTip(`Play as ${Agents.government} to issue credentials to ${Agents.owner}`);

            _changeAction('govPageAsOwner', 'waitingForCredentials');
            _changeAction('demoOwnerCredFromGov', 'waiting');
            _changeAction('demoGov', 'pendingRequest');
            _changeAction('govPageAsGov', 'pendingRequest');

        }, 3000);
    }

    function issueCredential (request: PassportReq) {

        _changeAction('govPageAsGov', 'issuing');
        const govIssuer = new SeraphIDIssuer(configs.GOVERNMENT_SCRIPT_HASH, configs.NEO_RPC_URL, configs.NEOSCAN_URL, configs.DID_NETWORK)
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
                        ownerWallet!.addClaim(res);
                        const addedClaim = ownerWallet!.getClaim(res.id);
                        console.log('claim Added to the Wallet: ', addedClaim);

                        localStorage.setItem('passportClaimID', res.id);
                        localStorage.setItem('passportClaim', JSON.stringify(res));

                        _changeAction('agencyPageAsOwner', 'toChooseAFlat');
                        _nextTip(`Play as ${Agents.owner} and choose an accommodation from the ${Agents.smartAgency} Web Page.`);

                        _changeAction('govPageAsOwner', 'success');
                        _changeAction('demoOwnerCredFromGov', 'success');
                        _changeAction('demoGov', 'credIssued');
                        _changeAction('govPageAsGov', 'credIssued');
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

    function handleCredIssuingError() {
        _changeAction('govPageAsGov', 'errorIssuingCred');
        handleFailure();

    }

    function doNotIssueCredential() {
        _changeAction('govPageAsGov', 'credNotIssued');
        handleFailure();
    }

    function handleFailure() {
        _nextTip(`${Agents.owner} can not book a flat without a valid digital Passport. Go back to the Help Page, click the reset button and try again!!!`);

        _changeAction('govPageAsOwner', 'failure');
        _changeAction('demoOwnerCredFromGov', 'failure');
        _changeAction('demoGov', 'credNotIssued');      
    }


    let agent = isAdmin? Agents.government : Agents.owner;
    return (
                <span>
                    <GovernmentBar></GovernmentBar>
                    <div className="GovPageContainer">
                        <ActiveAgent agent={agent} location="GovWebPage" />
                        <UserTips />
                        <div className="GovPageContent">
                            {renderContent(agent)}
                        </div>
                    </div>
                </span>
    );
});

export default GovernmentPage;
