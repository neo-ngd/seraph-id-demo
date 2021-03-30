// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';

interface Props {
    issuer: string;
}

function SmartContractCode({ issuer }: Props) {

    let code = 'Not Available. ';
    if (issuer === 'government') {
        code =
            `
/// <note>
/// The private keys for the issuer corresponds to wallet2.json
/// </note>
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using System.Numerics;
using Neo.SmartContract.Framework.Services.System;

namespace SeraphID
{
    /// <summary>
    /// Claim Status Flag
    /// </summary>
    public enum ClaimStatus
    {
        Nonexistent = 0,
        Valid = 1,
        Revoked = 2
    }

    /// <summary>
    /// SeraphID Issuer Smart Contract Template
    /// </summary>
    public class Issuer : SmartContract
    {
        /// <summary>
        /// Main entrypoint of the smart contract
        /// </summary>
        /// <param name="operation">The method to be invoked</param>
        /// <param name="args">Arguments specific to the method</param>
        /// <returns>Result object</returns>
        public static object Main(string operation, params object[] args)
        {
            if (operation == "Name") return ISSUER_NAME;
            if (operation == "PublicKey") return ISSUER_PUBLIC_KEY;
            if (operation == "GetSchemaDetails") return GetSchemaDetails(args);
            if (operation == "RegisterSchema") return RegisterSchema(args);
            if (operation == "InjectClaim") return InjectClaim(args);
            if (operation == "RevokeClaim") return RevokeClaim(args);
            if (operation == "IsValidClaim") return IsValidClaim(args);
            else return Result(false, "Invalid operation: " + operation);
        }

        private static readonly string ISSUER_NAME = "Government";
        private static readonly string ISSUER_PUBLIC_KEY = "02103a7f7dd016558597f7960d27c516a4394fd968b9e65155eb4b013e4040406e";

        private static readonly string SCHEMA_DEFINITIONS_MAP = "schema-definitions";
        private static readonly string REVOKABLE_SCHEMAS_MAP = "revokable-schemas";
        private static readonly string CLAIMS_MAP = "claims";

        private static readonly byte[] OWNER = "AWLYWXB8C9Lt1nHdDZJnC5cpYJjgRDLk17".ToScriptHash();

        /// <summary>
        /// Gets a schemas definition given its name
        /// </summary>
        /// <param name="args">schemaName (string)</param>
        private static object[] GetSchemaDetails(params object[] args)
        {
            if (args.Length != 1) return Result(false, "Incorrect number of parameters");

            string schemaName = (string)args[0];

            StorageMap definitions = Storage.CurrentContext.CreateMap(SCHEMA_DEFINITIONS_MAP);
            string schemaDefinition = Bytes2String(definitions.Get(schemaName));

            if (schemaDefinition == null) return Result(false, "Schema does not exist");

            return Result(true, schemaDefinition);
        }

        /// <summary>
        /// Registers a schema given a schema definition
        /// </summary>
        /// <param name="args">schemaName (string), schemaDefinition (string)</param>
        private static object[] RegisterSchema(params object[] args)
        {
            if (args.Length != 3) return Result(false, "Incorrect number of parameters");
            if (!Runtime.CheckWitness(OWNER)) return Result(false, "Only SmartContract owner can call this operation");

            string schemaName = (string)args[0];
            string schemaDefinition = (string)args[1];

            StorageMap definitions = Storage.CurrentContext.CreateMap(SCHEMA_DEFINITIONS_MAP);
            string existingDefinition = Bytes2String(definitions.Get(schemaName));

            if (existingDefinition != null) return Result(false, "Schema already exists");

            definitions.Put(schemaName, schemaDefinition);

            StorageMap revokableSchemas = Storage.CurrentContext.CreateMap(REVOKABLE_SCHEMAS_MAP);
            revokableSchemas.Put(schemaName, (byte[])args[2]);


            return Result(true, true);
        }

        /// <summary>
        /// Inject a claim into the smart contract
        /// </summary>
        /// <param name="args">claimID (string)</param>
        private static object[] InjectClaim(params object[] args)
        {
            if (args.Length != 1) return Result(false, "Incorrect number of parameters");
            if (!Runtime.CheckWitness(OWNER)) return Result(false, "Only SmartContract owner can call this operation");

            string id = (string)args[0];

            StorageMap claims = Storage.CurrentContext.CreateMap(CLAIMS_MAP);
            ClaimStatus status = ByteArray2ClaimStatus(claims.Get(id));

            if (status != ClaimStatus.Nonexistent) return Result(false, "Claim already exists");

            claims.Put(id, ClaimStatus2ByteArray(ClaimStatus.Valid));

            return Result(true, true);
        }

        /// <summary>
        /// Revoke a claim given a claimID
        /// </summary>
        /// <param name="args">claimID (string)</param>
        private static object[] RevokeClaim(params object[] args)
        {
            if (args.Length != 1) return Result(false, "Incorrect number of parameters");
            if (!Runtime.CheckWitness(OWNER)) return Result(false, "Only SmartContract owner can call this operation");

            string id = (string)args[0];

            StorageMap claims = Storage.CurrentContext.CreateMap(CLAIMS_MAP);
            ClaimStatus status = ByteArray2ClaimStatus(claims.Get(id));

            if (status == ClaimStatus.Nonexistent) return Result(false, "Claim does not exist");
            if (status == ClaimStatus.Revoked) return Result(true, true);

            claims.Put(id, ClaimStatus2ByteArray(ClaimStatus.Revoked));

            return Result(true, true);
        }

        /// <summary>
        /// Check if claim is revoked
        /// </summary>
        /// <param name="args">claimID (string)</param>
        private static bool IsValidClaim(params object[] args)
        {
            if (args.Length != 1) return false;
            string id = (string)args[0];

            StorageMap claims = Storage.CurrentContext.CreateMap(CLAIMS_MAP);
            ClaimStatus status = ByteArray2ClaimStatus(claims.Get(id));
        
            return status == ClaimStatus.Valid;
        }

        /// <summary>
        /// Helper method to serialize ClaimStatus
        /// </summary>
        /// <param name="value">ClaimStatus</param>
        /// <returns>Serialized ClaimStatus</returns>

        private static byte[] ClaimStatus2ByteArray(ClaimStatus value) => ((BigInteger)(int)value).AsByteArray();
        /// <summary>
        /// Helper method to deserialize bytes to ClaimStatus
        /// </summary>
        /// <param name="value">Serialized ClaimStatus</param>
        /// <returns>Deserialized ClaimStatus</returns>

        private static ClaimStatus ByteArray2ClaimStatus(byte[] value) => value == null || value.Length == 0 ? ClaimStatus.Nonexistent : (ClaimStatus)(int)value.AsBigInteger();

        /// <summary>
        /// Helper method to deserialize bytes to boolean
        /// </summary>
        /// <param name="data">Serialized boolean</param>
        /// <returns>Deserialized boolean</returns>
        private static bool Bytes2Bool(byte[] data) => data != null && data.Length > 0 && data[0] != 0;
        
        /// <summary>
        /// Helper method to deserialize bytes to string
        /// </summary>
        /// <param name="data">Serialized string</param>
        /// <returns>Deserialized string</returns>
        private static string Bytes2String(byte[] data) => data == null || data.Length == 0 ? null : data.AsString();

        /// <summary>
        /// Helper method for unified smart contract return format
        /// </summary>
        /// <param name="success">Indicates wether an error has occured during execution</param>
        /// <param name="result">The result or error message</param>
        /// <returns>Object containing the parameters</returns>
        private static object[] Result(bool success, object result) => new object[] { success, result };
    }
}
            `;
    } else if (issuer === 'agency') {
        code = `
/// <note>
/// The private keys for the issuer corresponds to wallet3.json
/// </note>
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using System.Numerics;
using Neo.SmartContract.Framework.Services.System;

namespace SeraphID
{
    /// <summary>
    /// Claim Status Flag
    /// </summary>
    public enum ClaimStatus
    {
        Nonexistent = 0,
        Valid = 1,
        Revoked = 2
    }

    /// <summary>
    /// SeraphID Issuer Smart Contract Template
    /// </summary>
    public class Issuer : SmartContract
    {
        /// <summary>
        /// Main entrypoint of the smart contract
        /// </summary>
        /// <param name="operation">The method to be invoked</param>
        /// <param name="args">Arguments specific to the method</param>
        /// <returns>Result object</returns>
        public static object Main(string operation, params object[] args)
        {
            if (operation == "Name") return ISSUER_NAME;
            if (operation == "PublicKey") return ISSUER_PUBLIC_KEY;
            if (operation == "GetSchemaDetails") return GetSchemaDetails(args);
            if (operation == "RegisterSchema") return RegisterSchema(args);
            if (operation == "InjectClaim") return InjectClaim(args);
            if (operation == "RevokeClaim") return RevokeClaim(args);
            if (operation == "IsValidClaim") return IsValidClaim(args);
            else return Result(false, "Invalid operation: " + operation);
        }

        private static readonly string ISSUER_NAME = "Real Estate Agency";
        private static readonly string ISSUER_PUBLIC_KEY = "03d90c07df63e690ce77912e10ab51acc944b66860237b608c4f8f8309e71ee699";

        private static readonly string SCHEMA_DEFINITIONS_MAP = "schema-definitions";
        private static readonly string REVOKABLE_SCHEMAS_MAP = "revokable-schemas";
        private static readonly string CLAIMS_MAP = "claims";

        private static readonly byte[] OWNER = "AR3uEnLUdfm1tPMJmiJQurAXGL7h3EXQ2F".ToScriptHash();

        /// <summary>
        /// Gets a schemas definition given its name
        /// </summary>
        /// <param name="args">schemaName (string)</param>
        private static object[] GetSchemaDetails(params object[] args)
        {
            if (args.Length != 1) return Result(false, "Incorrect number of parameters");

            string schemaName = (string)args[0];

            StorageMap definitions = Storage.CurrentContext.CreateMap(SCHEMA_DEFINITIONS_MAP);
            string schemaDefinition = Bytes2String(definitions.Get(schemaName));

            if (schemaDefinition == null) return Result(false, "Schema does not exist");

            return Result(true, schemaDefinition);
        }

        /// <summary>
        /// Registers a schema given a schema definition
        /// </summary>
        /// <param name="args">schemaName (string), schemaDefinition (string)</param>
        private static object[] RegisterSchema(params object[] args)
        {
            if (args.Length != 3) return Result(false, "Incorrect number of parameters");
            if (!Runtime.CheckWitness(OWNER)) return Result(false, "Only SmartContract owner can call this operation");

            string schemaName = (string)args[0];
            string schemaDefinition = (string)args[1];

            StorageMap definitions = Storage.CurrentContext.CreateMap(SCHEMA_DEFINITIONS_MAP);
            string existingDefinition = Bytes2String(definitions.Get(schemaName));

            if (existingDefinition != null) return Result(false, "Schema already exists");

            definitions.Put(schemaName, schemaDefinition);

            StorageMap revokableSchemas = Storage.CurrentContext.CreateMap(REVOKABLE_SCHEMAS_MAP);
            revokableSchemas.Put(schemaName, (byte[])args[2]);


            return Result(true, true);
        }

        /// <summary>
        /// Inject a claim into the smart contract
        /// </summary>
        /// <param name="args">claimID (string)</param>
        private static object[] InjectClaim(params object[] args)
        {
            if (args.Length != 1) return Result(false, "Incorrect number of parameters");
            if (!Runtime.CheckWitness(OWNER)) return Result(false, "Only SmartContract owner can call this operation");

            string id = (string)args[0];

            StorageMap claims = Storage.CurrentContext.CreateMap(CLAIMS_MAP);
            ClaimStatus status = ByteArray2ClaimStatus(claims.Get(id));

            if (status != ClaimStatus.Nonexistent) return Result(false, "Claim already exists");

            claims.Put(id, ClaimStatus2ByteArray(ClaimStatus.Valid));

            return Result(true, true);
        }

        /// <summary>
        /// Revoke a claim given a claimID
        /// </summary>
        /// <param name="args">claimID (string)</param>
        private static object[] RevokeClaim(params object[] args)
        {
            if (args.Length != 1) return Result(false, "Incorrect number of parameters");
            if (!Runtime.CheckWitness(OWNER)) return Result(false, "Only SmartContract owner can call this operation");

            string id = (string)args[0];

            StorageMap claims = Storage.CurrentContext.CreateMap(CLAIMS_MAP);
            ClaimStatus status = ByteArray2ClaimStatus(claims.Get(id));

            if (status == ClaimStatus.Nonexistent) return Result(false, "Claim does not exist");
            if (status == ClaimStatus.Revoked) return Result(true, true);

            claims.Put(id, ClaimStatus2ByteArray(ClaimStatus.Revoked));

            return Result(true, true);
        }

        /// <summary>
        /// Check if claim is revoked
        /// </summary>
        /// <param name="args">claimID (string)</param>
        private static bool IsValidClaim(params object[] args)
        {
            if (args.Length != 1) return false;
            string id = (string)args[0];

            StorageMap claims = Storage.CurrentContext.CreateMap(CLAIMS_MAP);
            ClaimStatus status = ByteArray2ClaimStatus(claims.Get(id));
        
            return status == ClaimStatus.Valid;
        }

        /// <summary>
        /// Helper method to serialize ClaimStatus
        /// </summary>
        /// <param name="value">ClaimStatus</param>
        /// <returns>Serialized ClaimStatus</returns>

        private static byte[] ClaimStatus2ByteArray(ClaimStatus value) => ((BigInteger)(int)value).AsByteArray();
        /// <summary>
        /// Helper method to deserialize bytes to ClaimStatus
        /// </summary>
        /// <param name="value">Serialized ClaimStatus</param>
        /// <returns>Deserialized ClaimStatus</returns>

        private static ClaimStatus ByteArray2ClaimStatus(byte[] value) => value == null || value.Length == 0 ? ClaimStatus.Nonexistent : (ClaimStatus)(int)value.AsBigInteger();

        /// <summary>
        /// Helper method to deserialize bytes to boolean
        /// </summary>
        /// <param name="data">Serialized boolean</param>
        /// <returns>Deserialized boolean</returns>
        private static bool Bytes2Bool(byte[] data) => data != null && data.Length > 0 && data[0] != 0;
        
        /// <summary>
        /// Helper method to deserialize bytes to string
        /// </summary>
        /// <param name="data">Serialized string</param>
        /// <returns>Deserialized string</returns>
        private static string Bytes2String(byte[] data) => data == null || data.Length == 0 ? null : data.AsString();

        /// <summary>
        /// Helper method for unified smart contract return format
        /// </summary>
        /// <param name="success">Indicates wether an error has occured during execution</param>
        /// <param name="result">The result or error message</param>
        /// <returns>Object containing the parameters</returns>
        private static object[] Result(bool success, object result) => new object[] { success, result };
    }
}

        `;
    }

    return (
        <pre>
            <code>
                {code}
            </code>
        </pre>

    );
}

export default SmartContractCode;
