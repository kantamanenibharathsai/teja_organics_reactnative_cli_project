import React from 'react';
import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import AppRoutes from './src/navigations/AppRoutes';
import store from './src/redux/store';
const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
