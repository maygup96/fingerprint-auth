import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { hasHardwareForFingerPrintScan, isFingerPrintRegistered, authenticate } from '../services/autheticationService';
import MsgOnSuccessfulLogin from './MsgOnSuccessfulLogin';
import { textStyle } from '../styles/style.js'

let rightHandFingers = [ 'thumb', 'index finger', 'middle finger', 'ring finger', 'little finger' ];

let messages = new Map();

let setMessages = () => {
    messages.set( 'fpSensorCheck', 'Checking for device compatibility... Please wait.' );
    messages.set( 'noFpSensorFound', `Sorry your device does not support fingerprint scan and hence you can't login. Please try with a different device.` );
    messages.set( 'promptUserForAuth', 'Click on the scan button below to start. Place your finger on the scanner as per the instructions in the prompt' );
    messages.get( 'fpNotRegistered', 'We could not find any fingerprints registered with the device. Please register yourself before logging in.' );
    messages.set( 'authFailed', 'Sorry! There was no match of the information provided by you. Please try again.' );
};

let styles = StyleSheet.create( { 
    title: {
        marginBottom: 15,
        fontSize: 20
    },
    container: {
        alignItems: "center"
    },
    button: {
        marginBottom: 100
    },
    buttonContainer: {
        width: 150
    },
    errMsg: {
        fontSize: 20
    }
} );

let allLoginStepsDone = ( state ) => state.loginStep === 2;

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            loginStep: 0,
            hasHardwareForBiometric: null,
            isFingerPrintRegistered: null,
            authStatus: 'PENDING'
        }
    }

    componentDidMount() {
        setMessages();
        hasHardwareForFingerPrintScan()
            .then( hwStatus => {
                let newState = {};
                newState.hasHardwareForBiometric = hwStatus;

                isFingerPrintRegistered()
                    .then( resisterStatus => {
                        newState.isFingerPrintRegistered = resisterStatus;
                        this.setState( newState )
                    } )
                    .catch( err => {
                        newState.isFingerPrintRegistered = false;
                        this.setState( newState );
                    } );
            } )
            .catch( err => {
                this.setState( { hasHardwareForBiometric: false } );
            } );
    }

    componentWillUnmount() {
        messages.clear();
    }

    getRandomFingerIndex() {
        return Math.floor( Math.random() * 4 );
    }

    authenticateFingerPrint( stepIndex ) {
        authenticate( { msg: `Please provide ${rightHandFingers[ this.getRandomFingerIndex() + 1 ]} fingerprints to login.`, disableDeviceFallback: true } )
            .then( result => {
                let oldState = { ...this.state };
                if( result.success ) {
                    if( allLoginStepsDone( this.state ) ) {
                        this.setState( { 
                            loginStep: oldState.loginStep + 1, 
                            authStatus: 'COMPLETED' 
                        } );
                    }
                    else {
                        this.setState( { 
                            loginStep: oldState.loginStep + 1 
                        } );
                        this.authenticateFingerPrint( stepIndex + 1 );
                    }
                }
                else {
                    this.setState( { 
                        loginStep: 0, 
                        authStatus: 'CANCELLED' 
                    } );
                }
            } ).catch( err => {
                this.setState( { 
                    loginStep: 0, 
                    authStatus: 'FAILED' 
                } );
            } );;
    }

    render() {
        if( this.state.hasHardwareForBiometric === null ) {
            return <Text style={textStyle}>{ messages.get( 'fpSensorCheck' ) }</Text>
        }
        else if( this.state.hasHardwareForBiometric === false ) {
            return <Text style={textStyle}>{ messages.get( 'noFpSensorFound' ) }</Text>;
        }
        else if( this.state.authStatus === 'COMPLETED' ) {
            return <MsgOnSuccessfulLogin></MsgOnSuccessfulLogin>
        }
        else {
            return this.state.isFingerPrintRegistered ?
            <View>
                <Text style={styles.title}>{ messages.get( 'promptUserForAuth' ) }</Text>
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <Button title='Scan' onPress={() => this.authenticateFingerPrint( 1 )} style={styles.button}></Button>
                    </View>
                    <Text style={styles.status}>
                        { this.state.authStatus === 'FAILED' ? messages.get( 'authFailed' ) : `${this.state.loginStep} / 3 Steps Completed` }
                    </Text>
                </View>
            </View> :
            <Text style={textStyle}>{ messages.get( 'fpNotRegistered' ) }</Text>
        }
    }
};

export default Login;
