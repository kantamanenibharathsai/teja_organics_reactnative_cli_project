import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

class CategoriesScreen extends React.Component {
  render() {
    return (
      <View style={styles.screen}>
        <Text>Categories Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default CategoriesScreen;