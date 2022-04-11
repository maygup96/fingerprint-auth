import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { hasHardwareForFingerPrintScan, authenticate } from '../services/autheticationService';

let rightHandFingers = [ 'thumb', 'index finger', 'middle finger', 'ring finger', 'little finger' ];

let messages = new Map();

let setMessages = () => {
    messages.set( 'fpSensorCheck', 'Checking for device compatibility... Please wait.' );
    messages.set( 'noFpSensorFound', `Sorry your device does not support fingerprint scan and hence you can't login. Please try with a different device.` );
    messages.set( 'promptUserForScan', ' Great to see your interest with us! You will be asked to register the fingerprints of your right hand. Click on the button below to start.' );
    messages.set( 'cancelReg', 'Registration Cancelled. Please try again.' );
};

let areAllFingersRegistered = ( state ) => state.registerStatus === 'COMPLETED';

let styles = StyleSheet.create( {
    message: { fontSize: 20 },
    title: {
        marginBottom: 15,
        fontSize: 20
    },
    buttonContainer: {
        width: 150
    },
    button: {
        marginBottom: 100
    },
    status: {
        fontSize: 15,
        alignContent: "center"
    },
    container: {
        alignItems: "center"
    }
} );

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            registerStatus: 'PENDING',
            fingerIndx: -1,
            hasHardwareForBiometric: null,
            onRegisterAttemptMsg: ''
        };
    }

    componentDidMount() {
        setMessages();
        hasHardwareForFingerPrintScan()
            .then( hwStatus => {
                let newState = {};
                newState.hasHardwareForBiometric = hwStatus;
                this.setState( newState );
            } )
            .catch( err => {
                this.setState( { hasHardwareForBiometric: false } );
            } );
    }

    componentDidUpdate() {
        if( this.state.registerStatus === 'COMPLETED' ) {
            this.props.navigation.navigate( 'Login' );
        }
    }

    componentWillUnmount() {
        messages.clear();
    }

    startFingerPrintScan( stepIndex ) {
        if( this.state.status !== 'PENDING' )
            this.setState( { registerStatus: 'PENDING' } );

        authenticate( { msg: `Please scan your ${rightHandFingers[ this.state.fingerIndx + 1]} by placing on the fingerprint sensor.` } )
            .then( result => {
                let oldState = { ...this.state };
                if( result.success ) {
                    if( stepIndex === 5 ) {
                        this.setState( { 
                            registerStatus: 'COMPLETED', 
                            fingerIndx: oldState.fingerIndx + 1, 
                            onRegisterAttemptMsg: 'All Set'
                        } );
                    }
                    else {
                        this.setState( {
                            fingerIndx: oldState.fingerIndx + 1, 
                        } );
                        this.startFingerPrintScan( stepIndex + 1 );
                    }
                }
                else if( result.success === false && result.error === 'user_cancel' ) {
                    this.setState( {
                        registerStatus: 'TERMINATED', 
                        fingerIndx: -1, 
                        onRegisterAttemptMsg: messages.get( 'cancelReg' ) 
                    } )
                }
            } )
            .catch( err => {
                this.setState( {
                    registerStatus: 'FAILED',
                    fingerIndx: -1, 
                    onRegisterAttemptMsg: err.message } );
            } );
    }

    render() {
        if( this.state.hasHardwareForBiometric === null ) {
            return <Text style={styles.message}>{ messages.get( 'fpSensorCheck' ) }</Text>
        } 
        else if( this.state.hasHardwareForBiometric === false ) {
            return <Text style={styles.message}>{ messages.get( 'noFpSensorFound' ) }</Text>
        }
        else {
            return (
                <View>
                    <Text style={styles.title}>{ messages.get( 'promptUserForScan' ) }</Text>
                    <View style={styles.container}>
                        <View style={styles.buttonContainer}>
                            <Button title='Start' onPress={() => this.startFingerPrintScan( 1 )} style={styles.button}></Button>
                        </View>
                        <Text style={styles.status}>
                            { this.state.registerStatus === 'PENDING' ? `${this.state.fingerIndx + 1} / 5 Completed` : this.state.onRegisterAttemptMsg }
                        </Text>
                    </View>
                </View>
            )
        }
    }
};

export default Register;

// 1. check if already registerd  - no need
// 2. display try again button after registration failed/stopped and display msg - ;eft
// 3. disaply login screen post registeraation
// display a button to login after registration finished ?

// couldn't check for auth cancellation