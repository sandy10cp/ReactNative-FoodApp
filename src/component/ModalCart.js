import React, { PureComponent } from 'react';
import { View, Text, Modal, TouchableHighlight, StyleSheet, ScrollView, Image, TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class ModalCart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisable: false,
            modalVisible: false,
            itemCart: [],
            totalOrder: '',
            deleteBtn: false,
            disabled: true,
            nama: '',
            id_user: '',
        };

    }

    componentDidMount() {
        this.fetchData();

        AsyncStorage.getItem('nama')
            .then((value) => this.setState({ nama: value }))
        AsyncStorage.getItem('id_user')
            .then((value) => this.setState({ id_user: value }))
    }

    fetchData() {
        fetch('http://192.168.201.103:8080/food_app/item_cart.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_user: this.state.id_user,

            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // alert(JSON.stringify(responseJson));
                if (responseJson == 1) {
                    this.setState({
                        isLoading: false,
                        itemCart: responseJson
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        itemCart: responseJson
                    });
                }
                AsyncStorage.getItem('id_user')
                    .then((value) => this.setState({ id_user: value }))
                this.fetchData()
                this._totalOrder()

            })
            .catch((error) => {
                console.error(error);
            })

    }


    // static getDerivedStateFromProps(nextProps, prevState) {
    //     // do things with nextProps.someProp and prevState.cachedSomeProp
    //     const { visible } = nextProps

    //     return {
    //         modalVisible: visible
    //     }

    // }

    // componentDidUpdate(nextProps, prevState) {
    //     if (nextProps.visible == prevState.modalVisible) {
    //         this.setState({ modalVisible: nextProps.visible })
    //     }
    //     else {
    //         this.setState({ modalVisible: nextProps.visible })
    //     }


    // }



    UNSAFE_componentWillReceiveProps(props) {
        this.setState({ modalVisible: props.visible });
    }




    _closeModal() {

        this.setState({ modalVisible: false })
    }

    async deleteOrderNo() {
        try {
            await AsyncStorage.removeItem('orderNo')
        } catch (err) {
            console.log(`The error is: ${err}`)
        }
    }

    _CheckOut = () => {
        this.deleteOrderNo()

        const dataItems = this.state.itemCart
        for (var i = 0; i < dataItems.length; i++) {
            fetch('http://192.168.201.103:8080/food_app/check_out.php', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dataItems: dataItems[i],

                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson == 0) {
                        alert('Check out gagal data tidak ada')
                    } else if (responseJson == 1) {
                        alert('Check out berhasil')
                        this.fetchData()
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }

    }

    _totalOrder() {
        var a = this.state.itemCart
        if (a.length != 0) {
            this.setState({ buttonDisable: false })
        } else {
            this.setState({ buttonDisable: true })
        }
        var total = 0;
        var totalFix = 0
        for (var i = 0; i < a.length; i++) {
            total += parseFloat(a[i].harga)
            totalFix = total.toFixed(2)

        }
        this.setState({ totalOrder: totalFix })
    }

    _showBtnDelete = () => {
        if (this.state.deleteBtn == false) {
            this.setState({ deleteBtn: true })
        } else {
            this.setState({ deleteBtn: false })
        }
    }

    _deleteItem(id) {

        fetch('http://192.168.201.103:8080/food_app/delete_item_cart.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,

            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson == 0) {
                    alert('Gagal delete')
                } else if (responseJson == 1) {
                    alert('Delete berhasil')
                    this.fetchData()
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    _Min(id, total, priceItem) {

        if (this.state.disabled == false) {

            const qty = parseInt(total) - 1
            const price = parseFloat(priceItem) * qty
            const priceFix = price.toFixed(2)

            fetch('http://192.168.201.103:8080/food_app/update_qty.php', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    total: qty,
                    harga: priceFix,
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson == 0) {
                        alert('Gagal update')
                    } else if (responseJson == 1) {
                        this.fetchData()
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        if (total <= 2) {
            this.setState((prevState, props) => ({
                disabled: true,
            }));
        }


    }

    _Plus(id, total, priceItem) {

        const qty = parseInt(total) + 1
        const price = parseFloat(priceItem) * qty
        const priceFix = price.toFixed(2)

        fetch('http://192.168.201.103:8080/food_app/update_qty.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                total: qty,
                harga: priceFix,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson == 0) {
                    alert('Gagal update')
                } else if (responseJson == 1) {
                    this.fetchData()
                }
            })
            .catch((error) => {
                console.error(error);
            });

        this.setState((prevState, props) => ({
            disabled: false,
        }));
    }


    _getItem() {

        return this.state.itemCart.map((item, index) => {

            return (
                <View
                    key={index}
                    style={styles.itemOrder}>
                    <View style={styles.item}>
                        <View>
                            <Image style={styles.imgItem} source={{ uri: item.img }} />
                        </View>
                        <View style={styles.contentTxt}>
                            <Text style={styles.txtItem}>{item.nama_menu}</Text>
                            <Text style={styles.txtItemPrice}>${item.harga}</Text>
                        </View>

                        <View style={styles.qty}>
                            <TouchableOpacity
                                disabled={this.state.disabled}
                                onPress={() => { this._Min(item.id_item, item.total, item.priceItem) }}
                            >
                                <Text style={styles.txtMin}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.txtQty}>{item.total}</Text>
                            <TouchableOpacity
                                onPress={() => { this._Plus(item.id_item, item.total, item.priceItem) }}
                            >
                                <Text style={styles.txtPlus}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        this.state.deleteBtn
                            ? <TouchableOpacity style={styles.delete}
                                onPress={() => { this._deleteItem(item.id_item) }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>D</Text>
                            </TouchableOpacity> : null
                    }

                </View>
            );


        });

    }



    render() {

        return (
            <Modal animationType={"slide"} transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => { console.log("Modal has been closed.") }}>

                <View style={styles.modal}>
                    <ScrollView>
                        <View style={styles.modalHeader}>
                            <Text style={styles.txtMyOrder}>My Order</Text>
                            <TouchableHighlight
                                style={styles.closeModal}
                                onPress={() => { this._closeModal(false) }}>
                                <Text style={styles.text}>X</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.contentOrder}>

                            <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 15, marginBottom: 5, }}
                                onPress={this._showBtnDelete}
                            >
                                <Text>EDIT</Text>
                            </TouchableOpacity>

                            {
                                this._getItem()
                            }

                        </View>

                    </ScrollView>
                    <View style={styles.contentButton}>
                        <TouchableOpacity
                            disabled={this.state.buttonDisable}
                            onPress={() => { this._CheckOut() }}
                            style={styles.buttonOrder}>
                            <Text style={styles.txtOrder}>CHECK OUT</Text>
                        </TouchableOpacity>

                        <View style={styles.price}>
                            <Text style={styles.txtPrice}>${this.state.totalOrder}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => { this._closeModal(false) }}
                    style={styles.modalFooter}>

                </TouchableOpacity>


            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        height: '65%',
        backgroundColor: 'white',

    },
    modalFooter: {
        height: '35%',
        backgroundColor: 'gray',
        opacity: 0.7
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
    contentOrder: {
        marginVertical: 10,
    },
    itemOrder: {
        height: 65,
        backgroundColor: '#ededed',
        marginVertical: 3,
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
        borderRadius: 7,
    },
    item: {
        paddingHorizontal: 9,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imgItem: {
        height: 50,
        width: 50,
    },
    contentTxt: {
        width: 200,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    txtItem: {
        fontSize: 15,
        color: '#102048',
        fontWeight: 'bold',

    },
    txtItemPrice: {
        fontSize: 14,
        color: '#102048',
        fontWeight: '900',
    },
    qty: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 60,
    },
    txtMin: {
        fontWeight: '900',
        fontSize: 25,
        color: '#102048',
        marginRight: 15,
    },
    txtPlus: {
        fontWeight: '900',
        fontSize: 25,
        color: '#102048',
        marginLeft: 10,
    },
    txtQty: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#102048',
    },
    contentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 5,
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
    delete: {
        height: 65,
        width: 15,
        backgroundColor: 'red',
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomRightRadius: 7,
        borderTopRightRadius: 7,
    }
});
