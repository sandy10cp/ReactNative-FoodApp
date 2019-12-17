import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';


export default class ModalSignIn extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visibleSignIn: false,
            email: '',
            pass: '',
            validEmail: false,
            inputEmail: '',
            inputYourName: '',
            inputYourPassword: '',
            inputConfirmPassword: '',
        };
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({ visibleSignIn: props.visible });
    }

    _closeModal(visible) {
        this.setState({ visibleSignIn: visible })

    }

    _CreateAccount = () => {
        this.setState({ loading: true })
        const { inputEmail } = this.state
        const { inputYourName } = this.state
        const { inputYourPassword } = this.state
        const { inputConfirmPassword } = this.state

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(inputEmail) === false) {
            setTimeout(() => {
                this.setState({
                    loading: false,
                    validEmail: false,
                });
                alert("Email is Not Correct");
            }, 1000);
        }
        else {
            this.setState({ validEmail: true })


            if (inputYourPassword != inputConfirmPassword) {
                setTimeout(() => {
                    this.setState({
                        loading: false,
                        validEmail: false,
                    });
                    alert("Confirm password salah");
                }, 1000);
            } else {

                fetch('http://192.168.201.103:8080/food_app/save_user.php', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputEmail: inputEmail,
                        inputYourName: inputYourName,
                        inputYourPassword: inputYourPassword,
                    }),
                })
                    .then((Response) => Response.json()
                        .then((responseJson) => {
                            if (responseJson == 0) {
                                alert('Gagal simpan ke database')
                            } else if (responseJson == 2) {
                                alert('Isi semua field')
                            } else {
                                alert('Create account success')
                                setTimeout(() => {
                                    this.setState({
                                        loading: false,
                                        isLogin: true,
                                        userData: responseJson,
                                    });
                                }, 1000);
                                this._GetAccount(responseJson)
                            }

                        })
                        .catch((error) => {
                            console.error(error);
                        }))

            }
        }

    }

    render() {
        return (
            <Modal animationType={"slide"} transparent={false}
                visible={this.state.visibleSignIn}
                onRequestClose={() => { console.log("Modal has been closed.") }}>
                <View>
                    <ScrollView style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.txtSignIn}>Sign In</Text>
                            <TouchableHighlight
                                style={styles.closeModal}
                                onPress={() => { this._closeModal(false) }}>
                                <Text style={styles.text}>X</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.formLogin}>
                            <View style={{ marginVertical: 15, marginHorizontal: 10, }}>
                                <TextInput
                                    placeholder="Email Address"
                                    style={styles.txtInput}
                                    onChangeText={inputEmail => this.setState({ inputEmail })}
                                />
                                <TextInput
                                    placeholder="Your Password"
                                    style={styles.txtInput}
                                    secureTextEntry={true}
                                    onChangeText={inputYourPassword => this.setState({ inputYourPassword })}
                                />
                            </View>

                            <View style={styles.buttonSave}>
                                <TouchableOpacity
                                    onPress={() => { this._CreateAccount() }}
                                    style={styles.button}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <TouchableOpacity
                            onPress={() => { this._closeModal(false) }}
                            style={styles.modalFooter}>

                        </TouchableOpacity>
                    </ScrollView>
                </View>


            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        height: '100%',
        backgroundColor: 'white',

    },
    modalHeader: {
        flexDirection: 'row',
        height: 80,
    },
    text: {
        fontWeight: '900',
        color: '#49b38d'
    },
    closeModal: {
        borderColor: 'gray',
        borderWidth: 1,
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        top: 40,
        left: 190,
        borderRadius: 5,

    },
    txtSignIn: {
        fontWeight: 'bold',
        fontSize: 35,
        marginTop: 30,
        marginLeft: 10,
        color: '#102048',
    },
    txtInput: {
        height: 45,
        borderColor: 'gray',
        borderBottomWidth: 0.5,
        marginBottom: 10,
    },
    buttonSave: {
        height: 50,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    button: {
        height: 40,
        width: 60,
        backgroundColor: '#49b38d',
        marginBottom: 5,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
})
