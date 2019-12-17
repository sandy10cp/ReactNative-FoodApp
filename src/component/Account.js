import React, { PureComponent } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Modal, TouchableHighlight, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Loader'

class Account extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: false,
            isLogin: false,
            validEmail: false,
            inputEmail: '',
            inputYourName: '',
            inputYourPassword: '',
            inputConfirmPassword: '',
            userData: [],
            email: '',
            nama: '',
            id_user: '',
            points: '',
        };
    }

    static navigationOptions = {
        headerTransparent: true,
    }

    componentDidMount = () => {
        AsyncStorage.getItem('nama')
            .then((value) => this.setState({ nama: value }))
        AsyncStorage.getItem('email')
            .then((value) => this.setState({ email: value }))
        AsyncStorage.getItem('isLogin')
            .then((value) => this.setState({ isLogin: JSON.parse(value) }))
        AsyncStorage.getItem('points')
            .then((value) => this.setState({ points: value }))

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

    async deleteToken() {
        try {
            await AsyncStorage.removeItem('nama')
            await AsyncStorage.removeItem('id_user')
            await AsyncStorage.removeItem('email')
            await AsyncStorage.removeItem('isLogin')
            await AsyncStorage.removeItem('points')
        } catch (err) {
            console.log(`The error is: ${err}`)
        }
    }

    _GetAccount(data) {
        let nama = data.nama
        let email = data.email
        let id = data.id
        let points = data.points
        let isLogin = true
        AsyncStorage.setItem('nama', nama);
        AsyncStorage.setItem('email', email);
        AsyncStorage.setItem('id_user', id);
        AsyncStorage.setItem('points', points);
        AsyncStorage.setItem('isLogin', JSON.stringify(isLogin));
        this.setState({ nama: nama, email: email, id_user: id, isLogin: isLogin, points: points })
    }


    _SignIn = () => {
        this.setState({ loading: true })
        const { inputEmail } = this.state
        const { inputYourPassword } = this.state

        if (inputEmail == '' && inputYourPassword == '') {
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
                alert("Input email & password")
            }, 1000);
        } else {

            fetch('http://192.168.201.103:8080/food_app/login.php', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: inputEmail,
                    pass: inputYourPassword
                }),
            })
                .then((Response) => Response.json()
                    .then((responseJson) => {
                        if (responseJson == '0') {
                            setTimeout(() => {
                                this.setState({
                                    loading: false,
                                });
                                alert("Email tidak active")
                            }, 1000);

                        } else if (responseJson == '2') {
                            setTimeout(() => {
                                this.setState({
                                    loading: false
                                });
                                alert('Input email & password')
                            }, 1000);
                        } else {
                            setTimeout(() => {
                                this.setState({
                                    loading: false,
                                    isLogin: true,
                                    modalVisible: false,
                                });
                            }, 1000);
                            this.setState({
                                userData: responseJson,
                            })
                            this._GetAccount(responseJson)
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    }))
        }



    }

    _Logout() {
        this.deleteToken()
        this.setState({ loading: true, isLogin: false })
        setTimeout(() => {
            this.setState({
                loading: false,
                isLogin: false,
            });
            alert('Logout')
        }, 1000);
    }

    _closeModal(visible) {
        this.setState({ modalVisible: visible })

    }

    toggleModalCart(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        return (
            <View>

                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { console.log("Modal has been closed.") }}>
                    <ScrollView>
                        <View style={styles.modal}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.txtSignIn}>Create Account</Text>
                                <TouchableHighlight
                                    style={styles.closeModal}
                                    onPress={() => { this._closeModal(false) }}>
                                    <Text style={styles.text}>X</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.createAccount}>
                                <View style={{ marginVertical: 15, marginHorizontal: 10, }}>
                                    <TextInput
                                        placeholder="Email Address"
                                        style={styles.txtInput}
                                        onChangeText={inputEmail => this.setState({ inputEmail })}
                                    />
                                    <TextInput
                                        placeholder="Your Name"
                                        style={styles.txtInput}
                                        onChangeText={inputYourName => this.setState({ inputYourName })}
                                    />
                                    <TextInput
                                        placeholder="Your Password"
                                        style={styles.txtInput}
                                        secureTextEntry={true}
                                        onChangeText={inputYourPassword => this.setState({ inputYourPassword })}
                                    />
                                    <TextInput
                                        placeholder="Confirm Password"
                                        style={styles.txtInput}
                                        secureTextEntry={true}
                                        onChangeText={inputConfirmPassword => this.setState({ inputConfirmPassword })}
                                    />
                                </View>

                                <View style={styles.buttonSave}>
                                    <TouchableOpacity
                                        onPress={() => { this._CreateAccount() }}
                                        style={styles.button}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                </Modal>
                <ScrollView>
                    <View style={styles.Header}>
                        {
                            this.state.isLogin ?
                                <View>
                                    <Text style={styles.txtMyAccount}>My Account</Text>
                                    <TouchableOpacity
                                        onPress={() => { this._Logout() }}
                                        style={styles.logout}>
                                        <Text style={{ color: '#49b38d', fontWeight: '900' }}>Logout</Text>
                                    </TouchableOpacity>
                                </View>

                                :
                                <Text style={styles.txtMyAccount}>Sign In</Text>
                        }
                    </View>

                    <View style={styles.cotent}>
                        {
                            this.state.isLogin ?
                                <View style={styles.myaccount}>
                                    <View style={styles.profile}>
                                        <Image style={styles.photo} source={require('../icon/user.png')} />
                                        <View>
                                            <Text style={styles.txtProfile}>{this.state.nama}</Text>
                                            <Text style={{ fontWeight: 'bold', color: '#102048', marginLeft: 5, }}>Profile</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <View style={styles.point}>
                                            <Text style={{ color: '#102048', }}>POINTS</Text>
                                            <Image style={{ width: 40, height: 40, marginTop: 5, }} source={require('../icon/reward.png')} />
                                            <Text style={{ color: '#e3ae22', fontSize: 18, fontWeight: 'bold', marginTop: 5, }}>{this.state.points}</Text>
                                        </View>
                                        <View style={styles.point}>
                                            <Text>Kupon</Text>
                                        </View>
                                    </View>
                                </View> :
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
                                        <TouchableOpacity
                                            onPress={() => { this.toggleModalCart(true) }}
                                        >
                                            <Text style={{ color: '#49b38d', fontWeight: 'bold', }}>Create Account ?</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.buttonSave}>
                                        <TouchableOpacity
                                            onPress={() => { this._SignIn() }}
                                            style={styles.button}>
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                        }

                        <Loader
                            loading={this.state.loading} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default Account;

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
        left: 60,
        borderRadius: 5,

    },
    txtSignIn: {
        fontWeight: 'bold',
        fontSize: 35,
        marginTop: 30,
        marginLeft: 10,
        color: '#102048',
    },
    Header: {
        flex: 1,
        flexDirection: 'row',
        height: 95,
        backgroundColor: 'white',
    },
    logout: {
        flexDirection: 'row',
        height: 25,
        width: 55,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 3,
        top: 50,
        right: -150,
        position: 'absolute'
    },
    txtMyAccount: {
        fontWeight: 'bold',
        fontSize: 35,
        marginTop: 45,
        marginLeft: 10,
        color: '#102048',
    },
    cotent: {
        height: 340,
        backgroundColor: 'white',
    },
    myaccount: {
        height: '80%',
        backgroundColor: '#ededed',
        marginTop: 20,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    profile: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 15,
    },
    photo: {
        height: 50,
        width: 50,
    },
    txtProfile: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#102048',
        marginLeft: 5,
    },
    point: {
        height: 100,
        width: 90,
        backgroundColor: '#f5f5f5',
        marginHorizontal: 10,
        marginBottom: 25,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        borderWidth: 0.5,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    formLogin: {
        height: '63%',
        backgroundColor: '#ededed',
        marginTop: 20,
        marginHorizontal: 10,
        borderRadius: 5,

    },
    createAccount: {
        height: '80%',
        backgroundColor: '#ededed',
        marginTop: 20,
        marginHorizontal: 10,
        borderRadius: 5,

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
    }
});
