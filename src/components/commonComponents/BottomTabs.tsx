import * as React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../home/Home';
import CartScreen from '../cart/Cart';
import CategoriesScreen from '../categories/Categories';
import ProfileScreen from '../profile/Profile';
import {CartImg, HomeImg, ProfileImg, CategoriesImg} from '../../assets/index';
const Tab = createBottomTabNavigator();



class BottomTabs extends React.Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let iconSource;
            let tintColor = focused ? '#fff' : '#989898';
            if (route.name === 'Home') {
              iconSource = HomeImg;
            } else if (route.name === 'Shop') {
              iconSource = CartImg;
            } else if (route.name === 'Categories') {
              iconSource = CategoriesImg;
            } else if (route.name === 'Profile') {
              iconSource = ProfileImg;
            }
            return (
              <View
                style={[styles.tabItemContainer, focused && styles.activeTab]}>
                <Image source={iconSource} style={[styles.icon, {tintColor}]} />
                <Text
                  style={[
                    styles.tabLabel,
                    focused ? {color: '#fff', paddingRight: 2} : { display: 'none'},
                  ]}>
                  {route.name}
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#989898',
          tabBarStyle: styles.tabBar,
        })}>
        <Tab.Screen name="Home" component={Home} options={{tabBarLabel: ''}} />
        <Tab.Screen
          name="Shop"
          component={CartScreen}
          options={{tabBarLabel: ''}}
        />
        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{tabBarLabel: ''}}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{tabBarLabel: ''}}
        />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: -2},
    shadowRadius: 10,
    elevation: 3,
    paddingHorizontal: 13,
    paddingTop: 34,
  },
  tabItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: '#A0E045',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  icon: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
    marginRight: 5,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Montserrat',
    lineHeight: 17
  },
});

export default BottomTabs;
