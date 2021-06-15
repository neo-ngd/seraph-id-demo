
// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import { SeraphIDIssuerContract, SeraphIDIssuer } from '../demo/node_modules/@sbc/seraph-id-sdk/';
import * as configs from '../demo/src/configs';

console.log('... Executing bootstrap ... ');

// Contract instances: 
const govContract = new SeraphIDIssuerContract(configs.GOVERNMENT_SCRIPT_HASH, configs.NEO_RPC_URL, configs.DID_NETWORK, configs.MAGIC);
const agencyContract = new SeraphIDIssuerContract(configs.AGENCY_SCRIPT_HASH, configs.NEO_RPC_URL, configs.DID_NETWORK, configs.MAGIC);

// Passport Schema creation
const govIssuer = new SeraphIDIssuer(configs.GOVERNMENT_SCRIPT_HASH, configs.NEO_RPC_URL, configs.DID_NETWORK, configs.MAGIC);

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
const agencyIssuer = new SeraphIDIssuer(configs.AGENCY_SCRIPT_HASH, configs.NEO_RPC_URL, configs.DID_NETWORK, configs.MAGIC);
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

