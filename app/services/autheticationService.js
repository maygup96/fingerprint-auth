import * as LocalAuthentication from 'expo-local-authentication';

export let authenticate = data => {
    let options = {
        promptMessage: data.msg
    };
    return new Promise( ( resolve, reject ) => {
        LocalAuthentication.authenticateAsync( options )
            .then( result => {
                resolve( result );
            } )
            .catch( err => {
                reject( err );
            } )
    } );
};

let registerId = null;

export let registerFingerPrint = () => {
    let registrationSuccessful = false;
    return new Promise( ( resolve, reject ) => {
        registerId = setTimeout( () => {
            registerId = null;
            resolve( registrationSuccessful = true );
        }, 3000 );
    } );
};

export let cancelRegistration = () => {
    if( !registerId ) {
        return 'REGISTRATION_SUCCESSFUL'
    }
    clearTimeout( registerId );
    registerId = null;
    return 'REGISTRATION_CANCELLED';
};

export let hasHardwareForFingerPrintScan = () => LocalAuthentication.hasHardwareAsync();

export let isFingerPrintRegistered = () => LocalAuthentication.isEnrolledAsync();

export let cancelAuthentication = () => LocalAuthentication.cancelAuthenticate();


