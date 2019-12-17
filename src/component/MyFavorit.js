import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class MyFavorit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItems: [],
            id_user: '',
        };
    }

    static navigationOptions = {
        headerTransparent: true,
    }

    componentDidMount() {
        this.fetchData()
        AsyncStorage.getItem('id_user')
            .then((value) => this.setState({ id_user: value }))
    }

    fetchData() {
        fetch('http://192.168.201.103:8080/food_app/my_favorit.php', {
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
                if (responseJson != null) {
                    this.setState({
                        menuItems: responseJson,
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

    _DeleteFavorit(id) {

        fetch('http://192.168.201.103:8080/food_app/delete_item_fav.php', {
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

    _DetailMenu = (menu, price, img, des, id_menu) => {
        this.props.navigation.navigate('DetailMenu', { menu: menu, price: price, img: img, des: des, id_menu: id_menu })

    }

    _renderMenu() {
        const { menuItems } = this.state
        if (menuItems == '') {
            return (
                <View style={styles.contentEmpty}>
                    <Text style={styles.txtEmpty}>Favorit Empty</Text>
                </View>
            )
        } else {
            return this.state.menuItems.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => { this._DetailMenu(item.menu, item.price, item.img, item.des, item.id_menu) }}
                    >
                        <View style={styles.menuFav}>
                            <Image style={styles.imgMenu} source={{ uri: item.img }} />
                            <View style={styles.contentTxt}>
                                <Text style={styles.txtItem}>{item.menu}</Text>
                                <Text style={styles.txtItemPrice}>${item.price}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { this._DeleteFavorit(item.id_fav) }}
                                style={styles.btnDelete}>
                                <Text style={styles.txtDelete}>D</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
    }

    render() {
        return (
            <View>
                <View style={styles.myHeader}>
                    <Text style={styles.txtMyFavorit}>My Favorit</Text>
                </View>
                <ScrollView style={styles.content}>
                    {
                        this._renderMenu()
                    }

                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    myHeader: {
        flexDirection: 'row',
        height: 80,
        marginTop: 10,
    },
    txtMyFavorit: {
        fontWeight: 'bold',
        fontSize: 35,
        marginTop: 30,
        marginLeft: 10,
        color: '#102048',
    },
    content: {
        height: '100%',
        marginTop: 5,
    },
    menuFav: {
        height: 120,
        backgroundColor: '#ededed',
        marginBottom: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
    imgMenu: {
        height: 90,
        width: 90,
        marginLeft: 5,
    },
    contentTxt: {
        width: 200,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 15,
    },
    txtItem: {
        fontSize: 30,
        color: '#102048',
        fontWeight: 'bold',

    },
    txtItemPrice: {
        fontSize: 25,
        color: '#102048',
        fontWeight: '900',
    },
    txtDelete: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white'
    },
    btnDelete: {
        height: 120,
        backgroundColor: 'red',
        width: 30,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentEmpty: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtEmpty: {
        fontSize: 20,
        fontWeight: '900',
        color: '#102048',
        backgroundColor: '#ededed',
        borderRadius: 5,
    }

})