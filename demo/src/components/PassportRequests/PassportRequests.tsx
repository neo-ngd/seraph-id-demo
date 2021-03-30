// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';
import './PassportRequests.css';
import { Paper, Table, TableHead, TableRow, TableBody, TableCell, Fab, Grid, Tooltip } from '@material-ui/core';
import MediaQuery from 'react-responsive';


interface Props {
    activeRequest?: PassportReq;
    denied?: any;
    issued?: any;
}

export enum PassportStatus {
    pending,
    issued,
    denied,
    error
}

export class PassportReq {
    firstName: string;
    secondName: string;
    birthDate: string;
    citizenship: string;
    address: string;
    gender: string;
    passportId: string;
    status: PassportStatus;
    issuedClaim: string;

    constructor(firstName: string, secondName: string, birthDate: string, citizenship: string, address: string, gender: string,
        passportId: string, status: PassportStatus, issuedClaim: string) {
        this.firstName = firstName;
        this.secondName = secondName;
        this.birthDate = birthDate;
        this.citizenship = citizenship;
        this.address = address;
        this.gender = gender;
        this.passportId = passportId;
        this.status = status;
        this.issuedClaim = issuedClaim;
    }
}

function PassportRequests({ activeRequest, issued, denied }: Props) {

    let requests: PassportReq[] = [
        new PassportReq('Emma', 'Smith', '11.03.1992', 'Italy', 'Rome', 'female', 'BF0192332F', PassportStatus.issued, ' '),
        new PassportReq('William', 'Jones', '17.06.1949', 'Italy', 'Milan', 'male', 'ABA9875413', PassportStatus.issued, ' '),
        new PassportReq('Grace', 'Williams', '30.11.1983', 'China', 'Beijing', 'female', 'KF0192332E', PassportStatus.issued, ' '),
        new PassportReq('Richard', 'Taylor', '28.09.1970', 'England', 'London', 'male', 'GF0192311L', PassportStatus.issued, ' '),
        new PassportReq('Jacob', 'Brown', '22.10.2001', 'Singapore', 'Singapore', 'male', 'LF0194332R', PassportStatus.denied, ' '),
        new PassportReq('Elizabeth', 'Davies', '20.06.1991', 'Japan', 'Tokyo', 'female', 'KF0142332C', PassportStatus.issued, ' '),
        new PassportReq('George', 'Evans', '13.03.2000', 'Italy', 'Rome', 'male', 'JF0192382D', PassportStatus.issued, ' '),
        new PassportReq('Sarah', 'Wilson', '07.02.1960', 'China', 'Beijing', 'female', 'CF0192332E', PassportStatus.issued, ' '),
        new PassportReq('Charlie', 'Thomas', '21.01.1976', 'England', 'London', 'male', 'LF0192332M', PassportStatus.issued, ' '),
        new PassportReq('Michael', 'Johnson', '09.12.1987', 'France', 'Paris', 'male', 'MF0192332C', PassportStatus.denied, ' '),
        new PassportReq('Audrey', 'Roberts', '15.07.1966', 'USA', 'New York', 'female', 'AF0192332R', PassportStatus.issued, ' '),
        new PassportReq('David', 'Lewis', '03.08.1962', 'Singapore', 'Singapore', 'male', 'BF0192332F', PassportStatus.issued, ' ')
    ];

    if (activeRequest) {
        requests.unshift(activeRequest);

    }

    const actions = (req: PassportReq) => {
        if (req.status === PassportStatus.pending) {
            return (
                <TableCell align="center">
                    <Fab className="ActionButtonLeft" onClick={denied} variant="extended" color="secondary"> Reject </Fab>
                    <Fab onClick={issued} variant="extended" color="secondary"> Issue </Fab>
                </TableCell>
            );
        } else if (req.status === PassportStatus.issued) {
            return (
                <TableCell align="center"> <span className="CredentialIssued"> Credential Issued </span> </TableCell>
            )
        } else if (req.status === PassportStatus.denied) {
            return (
                <TableCell align="center"> <span className="ReqDenied"> Request Denied </span> </TableCell>
            )
        } else {
            return (
                <TableCell align="center">
                    <Tooltip title="Error: calling smart contract failed!">
                        <span className="ReqDenied"> Error </span>
                    </Tooltip>
                </TableCell>
            );

        }
    }

    return (
        <div className="PassportReqContainer">
            <h1> Passport Requests Overview </h1>

            <Grid container direction="row" justify="space-between">
                <Grid item> </Grid>

                <Grid item>
                    <Paper className="RequestsPaper">

                        <MediaQuery query="(min-device-width: 1224px)">
                            {/* desktop or laptop */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell> First Name </TableCell>
                                        <TableCell> Second Name</TableCell>
                                        <TableCell> Gender </TableCell>
                                        <TableCell align="right"> Birth Date</TableCell>
                                        <TableCell align="right"> City </TableCell>
                                        <TableCell align="right"> Passport ID</TableCell>
                                        <TableCell align="center"> Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map(req => (
                                        <TableRow key={req.firstName + req.secondName}>
                                            <TableCell component="th" scope="row">
                                                {req.firstName}
                                            </TableCell>
                                            <TableCell>{req.secondName}</TableCell>
                                            <TableCell>{req.gender === 'female' ? 'F' : 'M'}</TableCell>
                                            <TableCell align="right">{req.birthDate}</TableCell>
                                            <TableCell align="right">{req.address}</TableCell>
                                            <TableCell align="right">{req.passportId}</TableCell>
                                            {actions(req)}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </MediaQuery>


                        <MediaQuery query="(max-device-width: 1224px)">
                            {/* tablet */}
                            <MediaQuery query="(min-width: 750px)">

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell> First Name </TableCell>
                                            <TableCell> Second Name</TableCell>
                                            <TableCell align="right"> Passport ID</TableCell>
                                            <TableCell align="center"> Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {requests.map(req => (
                                            <TableRow key={req.firstName + req.secondName}>
                                                <TableCell component="th" scope="row">
                                                    {req.firstName}
                                                </TableCell>
                                                <TableCell>{req.secondName}</TableCell>
                                                <TableCell align="right">{req.passportId}</TableCell>
                                                {actions(req)}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                            </MediaQuery>

                            {/* mobile */}
                            <MediaQuery query="(max-width: 750px)">

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell> Name </TableCell>
                                            <TableCell align="center"> Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {requests.map(req => (
                                            <TableRow key={req.firstName + req.secondName}>
                                                <TableCell component="th" scope="row"> {req.firstName} {req.secondName} </TableCell>
                                                {actions(req)}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                            </MediaQuery>
                        </MediaQuery>

                    </Paper>
                </Grid>
                <Grid item> </Grid>

            </Grid >
        </div >


    );
}

export default PassportRequests;
