import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ModalCart from './ModalCart';
import Loader from './Loader'


export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            txtQty: true,
            search: '',
            menuItems: [],
            itemCart: [],
            id_user: '',
            refreshing: true,
            loading: false,
        };
    }

    static navigationOptions = {
        headerLeft: null,
        headerTransparent: true
    }

    componentDidMount() {
        this.fetchData()
        this.fetchItemCart();
        AsyncStorage.getItem('id_user')
            .then((value) => this.setState({ id_user: value }))
    }

    fetchItemCart() {
        this.setState({ modalVisible: false })
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
                if (responseJson != null) {
                    this.setState({
                        isLoading: false,
                        itemCart: responseJson,
                        refreshing: false,
                        modalVisible: false,
                    });
                }

            })
            .catch((error) => {
                console.error(error);
            })
    }

    onRefresh() {
        setTimeout(() => {
            this.setState({
                menuItems: [],
                modalVisible: false,
            })
            this.fetchData();
        }, 500);

    }

    fetchData() {
        fetch('http://192.168.201.103:8080/food_app/menu.php')
            .then((response) => response.json())
            .then((responseJson) => {
                // alert(JSON.stringify(responseJson));
                if (responseJson == 1) {
                    this.setState({
                        isLoading: false,
                        menuItems: responseJson,
                        modalVisible: false,
                    });

                } else {
                    this.setState({
                        isLoading: false,
                        menuItems: responseJson,
                        modalVisible: false,
                    });

                }

            })
            .catch((error) => {
                console.error(error);
            })
    }

    _DetailMenu = (menu, price, img, des, id_menu) => {
        this.props.navigation.navigate('DetailMenu', { menu: menu, price: price, img: img, des: des, id_menu: id_menu })

    }

    _Account = () => {
        this.props.navigation.navigate('Account')

    }

    _MyOrder() {
        this.props.navigation.navigate('MyOrder')
    }

    _MyFavorit() {
        this.props.navigation.navigate('MyFavorit')
    }


    _renderMenu() {
        return this.state.menuItems.map((item, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => { this._DetailMenu(item.menu, item.price, item.img, item.deskripsi, item.id_menu) }}
                    style={styles.menu}>
                    <Image style={styles.imgMenu} source={{ uri: item.img }} />
                    <Text style={styles.txtMenu}>{item.menu}</Text>
                </TouchableOpacity>
            );
        });
    }

    toggleModalCart() {
        this.setState({ modalVisible: true });
    }

    _Search = () => {
        this.setState({ loading: true })
        fetch('http://192.168.201.103:8080/food_app/search_item.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                search: this.state.search,

            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson != null) {
                    setTimeout(() => {
                        this.setState({
                            loading: false,
                            menuItems: responseJson,
                            refreshing: false,
                            isLoading: false,
                        });
                    }, 1500);
                }

            })
            .catch((error) => {
                console.error(error);
            })
    }



    render() {
        return (
            <View style={{ flex: 1, }}>
                <ModalCart
                    visible={this.state.modalVisible}
                />
                <View style={styles.header}>
                    <Text style={styles.txtHeader}>Our menu</Text>
                    <View style={styles.imageView}>
                        <TextInput style={styles.txtInputSrc}
                            placeholder='Search'
                            onChangeText={search => this.setState({ search })}
                        />
                        <TouchableOpacity
                            onPress={() => { this._Search() }}
                        >
                            <Image style={styles.imageSrc} source={require('../icon/search.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { this.toggleModalCart() }}
                        >
                            {
                                this.state.txtQty ? <Text style={styles.txtCart}>{this.state.itemCart.length}</Text> : null
                            }
                            <Image style={styles.imageCart} source={require('../icon/cart.png')} />
                        </TouchableOpacity>

                    </View>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            //refresh control used for the Pull to Refresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                    <View style={styles.category}>
                        <Text style={styles.txtCategory}>TOP CATEGORY</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                            <View style={styles.topCategory}>
                                {
                                    this._renderMenu()
                                }
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.categoryPopuler}>
                        <Text style={styles.txtCategory}>POPULAR RIGHT NOW</Text>
                        <ScrollView style={styles.topCategory} horizontal={true} showsHorizontalScrollIndicator={false} >
                            <View style={styles.menu}>
                                <Image style={styles.imgMenu} source={require('../menu/meal.png')} />
                                <Text style={styles.txtMenu}>Rawon</Text>
                            </View>
                            <View style={styles.menu}>
                                <Image style={styles.imgMenu} source={require('../menu/nasi_goreng.png')} />
                                <Text style={styles.txtMenu}>Nasi Goreng</Text>
                            </View>
                            <View style={styles.menu}>
                                <Image style={styles.imgMenu} source={require('../menu/butter_chiken.png')} />
                                <Text style={styles.txtMenu}>Nasi Uduk</Text>
                            </View>
                            <View style={styles.menu}>
                                <Image style={styles.imgMenu} source={require('../menu/chicken-caloriesmart.png')} />
                                <Text style={styles.txtMenu}>Nasi Uduk</Text>
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.allMenu}>
                        <Text style={styles.txtCategory}>ALL MENU</Text>
                        <ScrollView style={styles.topCategory} horizontal={true} showsHorizontalScrollIndicator={false} >
                            <View style={styles.menu}>
                                <Image style={styles.imgMenu} source={require('../menu/meal.png')} />
                                <Text style={styles.txtMenu}>Rawon</Text>
                            </View>
                            <View style={styles.menu}>
                                <Image style={styles.imgMenu} source={require('../menu/nasi_goreng.png')} />
                                <Text style={styles.txtMenu}>Nasi Goreng</Text>
                            </View>
                            <View style={styles.menu}>
                                <Image style={styles.imgMenu} source={require('../menu/butter_chiken.png')} />
                                <Text style={styles.txtMenu}>Nasi Uduk</Text>
                            </View>
                            <View style={styles.menu}>
                                <Image style={styles.imgMenu} source={require('../menu/chicken-caloriesmart.png')} />
                                <Text style={styles.txtMenu}>Nasi Uduk</Text>
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        onPress={() => { this._MyFavorit() }}
                        style={styles.favorit}>
                        <Image source={require('../icon/help.png')} />
                        <Text style={styles.txtFooter}>Favorit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { this._MyOrder() }}
                        style={styles.favorit}>
                        <Image source={require('../icon/order.png')} />
                        <Text style={styles.txtFooter}>Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { this._Account() }}
                        style={styles.favorit}>
                        <Image source={require('../icon/account.png')} />
                        <Text style={styles.txtFooter}>Acount</Text>
                    </TouchableOpacity>
                </View>
                <Loader
                    loading={this.state.loading} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: 65,
        backgroundColor: 'white',
        paddingTop: 20,
        paddingLeft: 8,
    },
    txtHeader: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#102048'
    },
    txtInputSrc: {
        width: '48%',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    imageView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    imageCart: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    txtCart: {
        position: 'absolute',
        fontWeight: 'bold',
        top: -15,
        left: 6,
        color: 'white',
        backgroundColor: 'red',
        borderRadius: 15,
    },
    imageSrc: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    topCategory: {
        flexDirection: 'row',
        height: 180,
        paddingHorizontal: 5,
        marginRight: 10,
    },
    menu: {
        height: 160,
        width: 120,
        backgroundColor: '#ededed',
        justifyContent: 'center',
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    imgMenu: {
        height: 100,
        width: 100,
    },
    txtMenu: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#102048'
    },
    txtCategory: {
        color: '#102048',
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 15,
    },
    categoryPopuler: {
        marginTop: 25,
        borderTopLeftRadius: 30,
        marginBottom: 15,
    },
    allMenu: {
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#f7f7f7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    favorit: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 15,
        height: 45,
        width: 45,
    },
    txtFooter: {
        fontWeight: '900',
        fontSize: 12,
        color: '#9aa3aa'
    }
})
