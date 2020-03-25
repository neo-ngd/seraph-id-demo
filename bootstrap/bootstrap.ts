
// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import { SeraphIDContract, SeraphIDIssuer } from '../demo/node_modules/@sbc/s@justin_jin/seraph-id-sdk
import * as configs from '../demo/src/configs';

console.log('... Executing bootstrap ... ');

// Contract instances: 
const govContract = new SeraphIDContract(configs.GOVERNMENT_SCRIPT_HASH, configs.NEO_RPC_URL, configs.NEOSCAN_URL, configs.DID_NETWORK);
const agencyContract = new SeraphIDContract(configs.AGENCY_SCRIPT_HASH, configs.NEO_RPC_URL, configs.NEOSCAN_URL, configs.DID_NETWORK);



// Passport Schema creation
const govIssuer = new SeraphIDIssuer(configs.GOVERNMENT_SCRIPT_HASH, configs.NEO_RPC_URL, configs.NEOSCAN_URL, configs.DID_NETWORK);

govIssuer.registerNewSchema(
  configs.PASSPORT_SCHEMA_NAME,
  ['idNumber', 'firstName', 'secondName', 'birthDate', 'gender', 'citizenship', 'address'],
  true,
  configs.GOVERNMENT_ISSUER_PRIVATE_KEY)
  .then(_ => {
    checkIfSchemaExists(configs.PASSPORT_SCHEMA_NAME, 'government');
  })
  .catch(err => console.error('registerNewSchema ERR: ', err));



// Access Key Schema creation
const agencyIssuer = new SeraphIDIssuer(configs.AGENCY_SCRIPT_HASH, configs.NEO_RPC_URL, configs.NEOSCAN_URL, configs.DID_NETWORK);
agencyIssuer.registerNewSchema(
  configs.ACCESS_KEY_SCHEMA_NAME,
  ['flatId', 'address'],
  true,
  configs.AGENCY_ISSUER_PRIVATE_KEY)
  .then(_ => {
    checkIfSchemaExists(configs.ACCESS_KEY_SCHEMA_NAME, 'agency');
  })
  .catch(err => console.error('registerNewSchema ERR: ', err));


const checkIfSchemaExists = (SCHEMA_NAME: string, issuerName: string) => {

  let contract = govContract;
  if (issuerName === 'agency') {
    contract = agencyContract;
  }
  let schemaRegistered = false;

  if (!schemaRegistered) {
    const intervall = setInterval(() => {
      contract.getSchemaDetails(SCHEMA_NAME).then(
        (res: any) => {
          console.log('checkIfSchemaExists RES: ', res);
          clearInterval(intervall);
        }
      ).catch((err: any) => console.error('checkIfSchemaExists ERR: ', err));

    }, 30000);
  }

}

