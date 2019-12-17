import React, { PureComponent } from 'react';
import { View, Text, Modal, TouchableHighlight, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class componentName extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            qtyAdd: '1',
            disabled: true,
            price: '',
            priceItem: this.props.price,
            id_menu: this.props.id_menu,
            id_user: '',
            orderNo: '',

        };

    }

    toggleModal(visible) {
        this.setState({ modalVisible: visible });
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({ modalVisible: props.visible, price: props.price });
        AsyncStorage.getItem('id_user')
            .then((value) => this.setState({ id_user: value }))
    }

    componentDidMount() {
        this._OrderNo()
    }

    _Min = () => {
        if (this.state.disabled == false) {
            this.setState((prevState, props) => ({
                qtyAdd: parseInt(prevState.qtyAdd) - 1
            }));
            this.setState((prevState, props) => ({
                price: (parseFloat(props.price) * parseInt(prevState.qtyAdd)).toFixed(2),
            }));
        }
        if (this.state.qtyAdd <= 2) {
            this.setState((prevState, props) => ({
                disabled: true,
            }));
        }

    }
    _Plus = () => {
        this.setState((prevState, props) => ({
            qtyAdd: parseInt(prevState.qtyAdd) + 1,
            disabled: false,
        }));
        this.setState((prevState, props) => ({
            price: (parseFloat(props.price) * parseInt(prevState.qtyAdd)).toFixed(2),
        }));
    }

    _OrderNo() {

        fetch('http://192.168.201.103:8080/food_app/order_no.php')
            .then((response) => response.json())
            .then((responseJson) => {
                this.getOrderNo(responseJson)
            })
            .catch((error) => {
                console.error(error);
            })

    }

    getOrderNo(value) {
        const orderno = parseInt(value)
        AsyncStorage.setItem('orderNo', value);
        this.setState({ orderNo: orderno })
    }

    _MakeOrder = (menu) => {
        const no = this.state.orderNo



        fetch('http://192.168.201.103:8080/food_app/save_cart.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codeOrder: parseInt(no) + 1,
                namaMenu: menu,
                harga: this.state.price,
                total: this.state.qtyAdd,
                priceItem: this.state.priceItem,
                id_menu: this.state.id_menu,
                id_user: this.state.id_user,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson == 0) {
                    alert('Gagal simpan')
                } else if (responseJson == 1) {
                    alert('MENU : ' + menu + '\nTOTAL : ' + this.state.qtyAdd + ' = $' + this.state.price)
                    this.setState(() => ({
                        modalVisible: false,
                    }));
                } else {
                    alert('Gagal simpan')
                }
            })
            .catch((error) => {
                console.error(error);
            });


    }

    render() {
        const { menu, img } = this.props
        const { qtyAdd, disabled, price } = this.state
        return (
            <Modal animationType={"slide"} transparent={false}
                visible={this.state.modalVisible}
                style={styles.modal}
                onRequestClose={() => { console.log("Modal has been closed.") }}>
                <ScrollView>
                    <View style={styles.modalHeader}>
                        <Text style={styles.txtMyOrder}>My Order</Text>
                        <TouchableHighlight
                            style={styles.closeModal}
                            onPress={() => { this.toggleModal(false) }}>
                            <Text style={styles.text}>X</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.contentMenu}>
                            <View style={styles.imgContent}>
                                <Image style={styles.image} source={{ uri: img }} />
                            </View>
                            <Text style={styles.txtContent}>{menu}</Text>
                            <Text>{this.state.orderNo}</Text>
                            <View style={styles.qty}>
                                <TouchableOpacity
                                    disabled={disabled}
                                    onPress={this._Min}
                                >
                                    <Text style={styles.txtMin}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.txtQty}>{qtyAdd}</Text>
                                <TouchableOpacity
                                    onPress={this._Plus}
                                >
                                    <Text style={styles.txtPlus}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.titleAdd}>ADD :</Text>
                    <ScrollView style={styles.add} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity style={styles.addMenu}>
                            <Image style={styles.imgAdd} source={require('../menu/tomato.png')} />
                            <Text style={styles.txtAdd}>TOMATOS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addMenu}>
                            <Image style={styles.imgAdd} source={require('../menu/CHEDDAR.png')} />
                            <Text style={styles.txtAdd}>CHEDDAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addMenu}>
                            <Image style={styles.imgAdd} source={require('../menu/CHILI.png')} />
                            <Text style={styles.txtAdd}>CHILI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addMenu}>
                            <Image style={styles.imgAdd} source={require('../menu/BECON.png')} />
                            <Text style={styles.txtAdd}>BECON</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addMenu}>
                            <Image style={styles.imgAdd} source={require('../menu/tomato.png')} />
                            <Text style={styles.txtAdd}>CHEDDAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addMenu}>
                            <Image style={styles.imgAdd} source={require('../menu/tomato.png')} />
                            <Text style={styles.txtAdd}>CHEDDAR</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={styles.contentButton}>
                        <TouchableOpacity
                            onPress={() => { this._MakeOrder(menu) }}
                            style={styles.buttonOrder}>
                            <Text style={styles.txtOrder}>MAKE ORDER</Text>
                        </TouchableOpacity>

                        <View style={styles.price}>
                            <Text style={styles.txtPrice}>${price}</Text>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        );
    }
}

export default componentName;

const styles = StyleSheet.create({

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
        left: 160,
        borderRadius: 5,

    },
    txtMyOrder: {
        fontWeight: 'bold',
        fontSize: 35,
        marginTop: 30,
        marginLeft: 10,
        color: '#102048',
    },
    content: {
        height: '62%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentMenu: {
        height: '95%',
        width: '95%',
        backgroundColor: '#ededed',
        borderRadius: 10.
    },
    image: {
        height: 220,
        width: 220,

    },
    imgContent: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    qty: {
        height: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 10,
        alignItems: 'center',
    },
    txtContent: {
        fontSize: 30,
        fontWeight: '900',
        color: '#102048',
        marginLeft: 10,
        marginTop: 10,
    },
    txtMin: {
        fontWeight: '900',
        fontSize: 30,
        color: '#102048',
        marginRight: 15,
    },
    txtPlus: {
        fontWeight: '900',
        fontSize: 30,
        color: '#102048',
        marginLeft: 15,
    },
    txtQty: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#102048',
    },
    titleAdd: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#102048',
        marginLeft: 10,
    },
    add: {
        height: 100,
        marginTop: 5,
        flexDirection: 'row',
    },
    addMenu: {
        height: 60,
        width: 60,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center'
    },
    txtAdd: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'gray'
    },
    imgAdd: {
        width: 40,
        height: 40,
    },
    contentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    txtOrder: {
        fontWeight: '900',
        color: 'white'
    },
    txtPrice: {
        fontWeight: '900',
        color: 'white'
    },
    buttonOrder: {
        width: 230,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: '#49b38d',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'

    },
    price: {
        height: 40,
        width: '30%',
        backgroundColor: '#6dc2a4',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,

    },
});