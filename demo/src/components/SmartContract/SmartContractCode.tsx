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
            using Neo;
            using Neo.Cryptography.ECC;
            using Neo.SmartContract;
            using Neo.SmartContract.Framework;
            using Neo.SmartContract.Framework.Services;
            using System;
            using System.Numerics;
            
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
                public partial class Issuer : SmartContract
                {
                    private static readonly string ISSUER_NAME = "SeraphID Issuer";
                    [InitialValue("0205651e30690e8bc3b9a1ea86ea07dc83584200d80700de28ddd447000721eb95", ContractParameterType.PublicKey)]
                    private static readonly ECPoint ISSUER_DEFAULT_PUBLIC_KEY = default;//changed
                    [InitialValue("f754d6edec058175469c19697516fbd75e404e5a", ContractParameterType.ByteArray)]
                    private static readonly UInt160 Owner = default;
            
                    private const byte Prefix_Schema = 0x01;
                    private const byte Prefix_Claims = 0x02;
            
                    private static StorageMap Schema => new StorageMap(Storage.CurrentContext, Prefix_Schema);
                    private static StorageMap Claims => new StorageMap(Storage.CurrentContext, Prefix_Claims);
            
                    /// <summary>
                    /// <summary>
                    /// Get issuer name
                    /// </summary>
                    public static string Name()
                    {
                        return ISSUER_NAME;
                    }
            
                    public static void _deploy(object data, bool update)
                    {
                        if (update) return;
                        AdminList.Put(ISSUER_DEFAULT_PUBLIC_KEY, 0);
                    }
            
                    /// <summary>
                    /// Gets a schemas definition given its name
                    /// </summary>
                    /// <param name="schemaName">schemaName (string)</param>
                    public static string GetSchemaDetails(string schemaName)
                    {
                        string schemaDefinition = Schema.Get(schemaName);
                        if (schemaDefinition == null) throw new Exception("Schema does not exist");
                        return schemaDefinition;
                    }
            
                    /// <summary>
                    /// Registers a schema given a schema definition
                    /// </summary>
                    /// <param name="schemaName">schema name (string)</param>
                    /// <param name="schemaDefinition">schema definition</param>
                    public static bool RegisterSchema(string schemaName, string schemaDefinition)
                    {
                        if (!IsCalledByAdmin()) throw new Exception("Only SmartContract admin can call this operation");
            
                        string existingDefinition = Schema.Get(schemaName);
            
                        if (existingDefinition != null) throw new Exception("Schema already exists");
                        Schema.Put(schemaName, schemaDefinition);
            
                        //StorageMap revokableSchemas = Storage.CurrentContext.CreateMap(REVOKABLE_SCHEMAS_MAP);
                        //revokableSchemas.Put(schemaName, (byte[])args[2]);
                        return true;
                    }
            
                    /// <summary>
                    /// Inject a claim into the smart contract
                    /// </summary>
                    /// <param name="id">claim ID</param>
                    public static bool InjectClaim(string id)
                    {
                        if (!IsCalledByAdmin()) throw new Exception("Only SmartContract admin can call this operation");
            
                        ClaimStatus status = ByteArray2ClaimStatus((byte[])Claims.Get(id));
            
                        if (status != ClaimStatus.Nonexistent) throw new Exception("Claim already exists");
            
                        Claims.Put(id, (ByteString)ClaimStatus2ByteArray(ClaimStatus.Valid));
            
                        return true;
                    }
            
                    /// <summary>
                    /// Revoke a claim given a claimID
                    /// </summary>
                    /// <param name="id">claim ID</param>
                    public static bool RevokeClaim(string id)
                    {
                        if (!IsCalledByAdmin()) throw new Exception("Only SmartContract admin can call this operation");
            
                        ClaimStatus status = ByteArray2ClaimStatus((byte[])Claims.Get(id));
            
                        if (status == ClaimStatus.Nonexistent) throw new Exception("Claim does not exist");
                        if (status == ClaimStatus.Revoked) return true;
            
                        Claims.Put(id, (ByteString)ClaimStatus2ByteArray(ClaimStatus.Revoked));
                        return true;
                    }
            
                    /// <summary>
                    /// Check if claim is revoked
                    /// </summary>
                    /// <param name="id">claim ID (string)</param>
                    public static bool IsValidClaim(string id)
                    {
                        ClaimStatus status = ByteArray2ClaimStatus((byte[])Claims.Get(id));
                        return status == ClaimStatus.Valid;
                    }
            
                    /// <summary>
                    /// Helper method to serialize ClaimStatus
                    /// </summary>
                    /// <param name="value">ClaimStatus</param>
                    /// <returns>Serialized ClaimStatus</returns>
                    private static byte[] ClaimStatus2ByteArray(ClaimStatus value) => ((BigInteger)(int)value).ToByteArray();
            
                    /// <summary>
                    /// Helper method to deserialize bytes to ClaimStatus
                    /// </summary>
                    /// <param name="value">Serialized ClaimStatus</param>
                    /// <returns>Deserialized ClaimStatus</returns>
                    private static ClaimStatus ByteArray2ClaimStatus(byte[] value)
                    {
                        if (value == null || value.Length == 0) return ClaimStatus.Nonexistent;
                        return (ClaimStatus)(int)(BigInteger)(ByteString)value;
                    }
                }
            }
            
            `;
    } else if (issuer === 'agency') {
        code = `
        using Neo;
        using Neo.Cryptography.ECC;
        using Neo.SmartContract;
        using Neo.SmartContract.Framework;
        using Neo.SmartContract.Framework.Services;
        using System;
        using System.Numerics;
        
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
            public partial class Issuer : SmartContract
            {
                private static readonly string ISSUER_NAME = "SeraphID Issuer";
                [InitialValue("0205651e30690e8bc3b9a1ea86ea07dc83584200d80700de28ddd447000721eb95", ContractParameterType.PublicKey)]
                private static readonly ECPoint ISSUER_DEFAULT_PUBLIC_KEY = default;//changed
                [InitialValue("f754d6edec058175469c19697516fbd75e404e5a", ContractParameterType.ByteArray)]
                private static readonly UInt160 Owner = default;
        
                private const byte Prefix_Schema = 0x01;
                private const byte Prefix_Claims = 0x02;
        
                private static StorageMap Schema => new StorageMap(Storage.CurrentContext, Prefix_Schema);
                private static StorageMap Claims => new StorageMap(Storage.CurrentContext, Prefix_Claims);
        
                /// <summary>
                /// <summary>
                /// Get issuer name
                /// </summary>
                public static string Name()
                {
                    return ISSUER_NAME;
                }
        
                public static void _deploy(object data, bool update)
                {
                    if (update) return;
                    AdminList.Put(ISSUER_DEFAULT_PUBLIC_KEY, 0);
                }
        
                /// <summary>
                /// Gets a schemas definition given its name
                /// </summary>
                /// <param name="schemaName">schemaName (string)</param>
                public static string GetSchemaDetails(string schemaName)
                {
                    string schemaDefinition = Schema.Get(schemaName);
                    if (schemaDefinition == null) throw new Exception("Schema does not exist");
                    return schemaDefinition;
                }
        
                /// <summary>
                /// Registers a schema given a schema definition
                /// </summary>
                /// <param name="schemaName">schema name (string)</param>
                /// <param name="schemaDefinition">schema definition</param>
                public static bool RegisterSchema(string schemaName, string schemaDefinition)
                {
                    if (!IsCalledByAdmin()) throw new Exception("Only SmartContract admin can call this operation");
        
                    string existingDefinition = Schema.Get(schemaName);
        
                    if (existingDefinition != null) throw new Exception("Schema already exists");
                    Schema.Put(schemaName, schemaDefinition);
        
                    //StorageMap revokableSchemas = Storage.CurrentContext.CreateMap(REVOKABLE_SCHEMAS_MAP);
                    //revokableSchemas.Put(schemaName, (byte[])args[2]);
                    return true;
                }
        
                /// <summary>
                /// Inject a claim into the smart contract
                /// </summary>
                /// <param name="id">claim ID</param>
                public static bool InjectClaim(string id)
                {
                    if (!IsCalledByAdmin()) throw new Exception("Only SmartContract admin can call this operation");
        
                    ClaimStatus status = ByteArray2ClaimStatus((byte[])Claims.Get(id));
        
                    if (status != ClaimStatus.Nonexistent) throw new Exception("Claim already exists");
        
                    Claims.Put(id, (ByteString)ClaimStatus2ByteArray(ClaimStatus.Valid));
        
                    return true;
                }
        
                /// <summary>
                /// Revoke a claim given a claimID
                /// </summary>
                /// <param name="id">claim ID</param>
                public static bool RevokeClaim(string id)
                {
                    if (!IsCalledByAdmin()) throw new Exception("Only SmartContract admin can call this operation");
        
                    ClaimStatus status = ByteArray2ClaimStatus((byte[])Claims.Get(id));
        
                    if (status == ClaimStatus.Nonexistent) throw new Exception("Claim does not exist");
                    if (status == ClaimStatus.Revoked) return true;
        
                    Claims.Put(id, (ByteString)ClaimStatus2ByteArray(ClaimStatus.Revoked));
                    return true;
                }
        
                /// <summary>
                /// Check if claim is revoked
                /// </summary>
                /// <param name="id">claim ID (string)</param>
                public static bool IsValidClaim(string id)
                {
                    ClaimStatus status = ByteArray2ClaimStatus((byte[])Claims.Get(id));
                    return status == ClaimStatus.Valid;
                }
        
                /// <summary>
                /// Helper method to serialize ClaimStatus
                /// </summary>
                /// <param name="value">ClaimStatus</param>
                /// <returns>Serialized ClaimStatus</returns>
                private static byte[] ClaimStatus2ByteArray(ClaimStatus value) => ((BigInteger)(int)value).ToByteArray();
        
                /// <summary>
                /// Helper method to deserialize bytes to ClaimStatus
                /// </summary>
                /// <param name="value">Serialized ClaimStatus</param>
                /// <returns>Deserialized ClaimStatus</returns>
                private static ClaimStatus ByteArray2ClaimStatus(byte[] value)
                {
                    if (value == null || value.Length == 0) return ClaimStatus.Nonexistent;
                    return (ClaimStatus)(int)(BigInteger)(ByteString)value;
                }
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