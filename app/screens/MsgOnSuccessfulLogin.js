import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

let styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "black"
    },
    imageProps: {
        width: 350,
        height: 400,
    },
    textProps: {
        fontSize: 25,
        color: "white"
    }
} );

function MsgToUser() {
    return (
        <View style={styles.container}>
            <Image style={styles.imageProps} source={require('../assets/banana.png')}></Image>
            <Text style={styles.textProps}>Great job Monkey!!!</Text>
        </View>
    );
}

export default MsgToUser;