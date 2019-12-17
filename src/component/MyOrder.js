import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class MyOrder extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            myItemOrder: [],
            onOrder: [],
            nama: '',
            id_user: '',
        };
    }

    static navigationOptions = {
        headerTransparent: true,
    }

    componentDidMount() {
        this.fetchData();
        this.fetchDataOnOrder()
        AsyncStorage.getItem('nama')
            .then((value) => this.setState({ nama: value }))
        AsyncStorage.getItem('id_user')
            .then((value) => this.setState({ id_user: value }))
    }

    fetchDataOnOrder() {
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
                if (responseJson == 1) {
                    this.setState({
                        isLoading: false,
                        onOrder: responseJson
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        onOrder: responseJson
                    });
                }
                this.fetchDataOnOrder()

            })
            .catch((error) => {
                console.error(error);
            })

    }

    fetchData() {
        fetch('http://192.168.201.103:8080/food_app/my_order.php', {
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
                if (responseJson == 1) {
                    this.setState({
                        isLoading: false,
                        myItemOrder: responseJson
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        myItemOrder: responseJson
                    });
                }
                AsyncStorage.getItem('id_user')
                    .then((value) => this.setState({ id_user: value }))
                this.fetchData()

            })
            .catch((error) => {
                console.error(error);
            })

    }

    _ToHome() {
        this.props.navigation.navigate('Home')
    }


    _getItemOnOrder() {

        return this.state.onOrder.map((item, index) => {
            return (
                <View
                    key={index}
                    style={styles.itemOnOrder}>
                    <View style={styles.item}>
                        <View>
                            <Image style={styles.imgItem} source={{ uri: item.img }} />
                        </View>
                        <View style={styles.contentTxt}>
                            <Text style={styles.txtItem}>{item.nama_menu}</Text>
                            <Text style={styles.txtItemPrice}>${item.harga}</Text>
                        </View>

                        <View style={styles.qty}>

                            <Text style={styles.txtQty}>{item.total}</Text>

                        </View>
                    </View>

                </View>
            );
        })

    }


    _getItem() {
        let a = this.state.myItemOrder
        if (a.length <= 0) {
            return (
                <View style={styles.contentButtonOrder}>
                    <TouchableOpacity
                        onPress={() => { this._ToHome() }}
                        style={styles.buttonMakeOrder}>
                        <Text style={{ color: 'white', fontWeight: '900' }}>Make Your Order</Text>
                    </TouchableOpacity>
                </View>

            )
        } else {

            return this.state.myItemOrder.map((item, index) => {

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
                                <Text style={styles.txtItemPrice}>${item.price}</Text>
                                <Text style={styles.txtItemPrice}>{item.tgl_checkout}</Text>
                            </View>

                            <View style={styles.qty}>

                                <Text style={styles.txtQty}>{item.qty}</Text>

                            </View>
                        </View>

                    </View>
                );


            });
        }



    }



    render() {
        return (

            <View style={styles.modal}>
                <View style={styles.modalHeader}>
                    <Text style={styles.txtMyOrder}>My Order</Text>
                </View>
                <ScrollView>
                    <View style={styles.completedOrder}>
                        <Text style={styles.txtCompletedOrder}>On Order</Text>
                    </View>
                    <View style={styles.contentOrder}>

                        {
                            this._getItemOnOrder()
                        }

                    </View>
                    <View style={styles.completedOrder}>
                        <Text style={styles.txtCompletedOrder}>Completed Order</Text>
                    </View>
                    <View style={styles.contentOrder}>

                        {
                            this._getItem()
                        }

                    </View>

                </ScrollView>
            </View>

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
        marginTop: 10,
    },
    contentButtonOrder: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,

    },
    buttonMakeOrder: {
        height: 30,
        width: 120,
        backgroundColor: '#49b38d',
        alignItems: 'center',
        justifyContent: 'center',
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
    itemOnOrder: {
        height: 65,
        backgroundColor: '#ededed',
        marginVertical: 3,
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
        borderRadius: 7,
    },
    itemOrder: {
        height: 65,
        backgroundColor: '#ededed',
        marginVertical: 3,
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
        borderRadius: 7,
        opacity: 0.7,
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
        marginRight: 20,
    },
    txtQty: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#102048',
    },
    completedOrder: {
        marginLeft: 10,
    },
    txtCompletedOrder: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#102048'
    }

});
