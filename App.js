import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Screen from './src/component/Screen'
import Home from './src/component/Home';
import DetailMenu from './src/component/DetailMenu';
import Account from './src/component/Account';
import MyOrder from './src/component/MyOrder';
import MyFavorit from './src/component/MyFavorit';


const AppNavigator = createStackNavigator({
  Screen: { screen: Screen },
  Home: { screen: Home },
  DetailMenu: { screen: DetailMenu },
  Account: { screen: Account },
  MyOrder: { screen: MyOrder },
  MyFavorit: { screen: MyFavorit },

},
  { header: null, }
)

class App extends Component {

  render() {
    return (
      <Application />
    );
  }
}

export default createAppContainer(AppNavigator);
