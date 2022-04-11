import React from 'react';
import { Text, Button, StyleSheet, SafeAreaView, View } from 'react-native';
import { textStyle } from '../styles/style.js'

let styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "black"
    },
    text: textStyle,
    salutation: {
        margin: 15,
        fontSize: 40,
        color: "white"
    },
    button: {
        width: 100,
    },
    registerText: {
        fontWeight: 'bold'
    }
} );

function WelcomeScreen( { navigation } ) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.salutation}>Hello User</Text>
            <View style={styles.button}>
                <Button title='Login' onPress={() => navigation.navigate( 'Login' )}></Button>
            </View>
            <Text onPress={() => navigation.navigate( 'Register' )} style={styles.text}>New to the app ?
                <Text style={styles.registerText}>
                    Register Now
                </Text>
            </Text>
        </SafeAreaView>
    )
}

export default WelcomeScreen;