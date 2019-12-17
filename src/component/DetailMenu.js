import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ModalOrder from './ModalOrder';

export default class DetailMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            id_user: '',
        };

    }

    static navigationOptions = {
        headerTransparent: true,
    }

    componentDidMount() {
        AsyncStorage.getItem('id_user')
            .then((value) => this.setState({ id_user: value }))
    }


    toggleModal() {
        AsyncStorage.getItem('id_user')
            .then((value) => this.setState({ id_user: value }))
        setTimeout(() => {
            let { id_user } = this.state
            if (id_user == null) {
                this.props.navigation.navigate('Account')
            } else {
                this.setState({ modalVisible: true });
            }
        }, 100);

    }

    _SaveFavorit = () => {
        const { menu, price, des, img, id_menu } = this.props.navigation.state.params

        fetch('http://192.168.201.103:8080/food_app/save_fav.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_menu: id_menu,
                menu: menu,
                price: price,
                img: img,
                des: des,
                id_user: this.state.id_user
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson == 0) {
                    alert('Gagal simpan')
                } else if (responseJson == 3) {
                    alert('Data sudah ada')
                } else if (responseJson == 1) {
                    alert('Berhasil')
                } else if (responseJson == 2) {
                    alert('Gagal simpan')
                }
            })
            .catch((error) => {
                alert('Berhasil')
            });
    }


    render() {
        const { menu, price, img, des, id_menu } = this.props.navigation.state.params
        return (
            <ScrollView>
                <ModalOrder visible={this.state.modalVisible}
                    menu={menu}
                    price={price}
                    img={img}
                    id_menu={id_menu}
                />
                <Image style={styles.backImage} source={require('../icon/abstrak.png')} />
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => { this._SaveFavorit() }}
                        style={styles.favorite}>
                        <Image style={styles.imgFavorit} source={require('../icon/star.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <Text style={styles.txtContent}>
                        {menu}
                    </Text>
                    <View style={styles.imgContent}>
                        <Image style={styles.image} source={{ uri: img }} />
                    </View>
                </View>
                <View style={styles.description}>
                    <Text style={styles.titleDesc}>DESCRIPTION</Text>
                    <Text style={styles.txtDesc}>{des}</Text>
                </View>
                <View style={styles.contentButton}>
                    <TouchableOpacity
                        onPress={() => { this.toggleModal() }}
                        style={styles.buttonOrder}>
                        <Text style={styles.txtOrder}>MAKE ORDER</Text>
                    </TouchableOpacity>

                    <View style={styles.price}>
                        <Text style={styles.txtPrice}>${price}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    backImage: {
        position: 'absolute',
        top: 70,
        right: 70,
        height: '60%',
        width: '60%',
        opacity: 0.7,
    },
    txtContent: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#102048',
        marginLeft: 10,
    },
    imgContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        height: 250,
        width: 270,

    },
    favorite: {
        width: 30,
        height: 30,
        backgroundColor: '#49b38d',
        marginRight: 20,
        marginTop: 25,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgFavorit: {
        height: 20,
        width: 20,
    },
    description: {
        marginTop: 15,
        marginHorizontal: 10,
    },
    titleDesc: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#102048',
    },
    txtDesc: {
        marginTop: 4,
        color: 'gray'
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
    contentButton: {
        marginTop: 20,
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
    modalHeader: {
        flex: 1,
        flexDirection: 'row'
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
    contentModal: {
        height: 100,
        backgroundColor: 'green',
        flex: 1,
        marginHorizontal: 10,
        flexDirection: 'row',
        marginBottom: 300,
        borderRadius: 10,
    }
});
