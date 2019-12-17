import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default class Screen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    

    static navigationOptions = {
        headerLeft: null,
        headerTransparent: true
    }

    _GoToHome (){
        setTimeout(() => {
            this.props.navigation.navigate('Home')
        }, 2500);
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this._GoToHome()
                }
                <Text style={styles.textStyles}>
                    FoodApp
                </Text>
                <Text style={styles.txtCR}>@sandyw</Text>
                <ActivityIndicator
                    size = "large"
                    color='#49b38d' 
                    style={{marginTop : 10}}/>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor: 'white',
        alignItems : 'center',
        justifyContent : 'center'
    },
    textStyles: {
        color: '#49b38d',
        fontSize: 40,
        fontWeight: 'bold'
    }, 
    txtCR : {
        color : '#102048',
        fontSize : 12,
    }
})
