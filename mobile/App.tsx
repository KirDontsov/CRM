import { useState } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';

import { TabNavigator } from './src/TabNavigator';

async function loadApp() {
  await Font.loadAsync({
    ...Ionicons.font,
  });
}

const App = () => {
  const [isReady, setIsReady] = useState(false);
  if (!isReady) {
    return (
      <AppLoading
        startAsync={() => loadApp()}
        /* eslint-disable-next-line no-console */
        onError={(err: never) => console.log(err)}
        onFinish={() => setIsReady(true)}
      />
    );
  }

  return (
    <SafeAreaProvider>
      {/* <Provider store={store}> */}
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
      {/* </Provider> */}
    </SafeAreaProvider>
  );
};

export default App;
