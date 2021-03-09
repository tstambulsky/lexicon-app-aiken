import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import HomeScreen from '../screens/HomeScreen';
import theme from '../theme';
import PlayerContext from '../PlayerContext';

const MainNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  const [player, setPlayer] = useState(null);

  const handlePlayerSelector = () => {
    Alert.alert(
      null,
      'Please select a Player',
      [
        {
          text: 'P1',
          onPress: () => setPlayer('1'),
        },
        { text: 'P2', onPress: () => setPlayer('2') },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (!player) {
      handlePlayerSelector();
    }
  }, []);

  return (
    <PlayerContext.Provider value={[player, setPlayer]}>
      <Navigator
        initialRouteName="Lexikon"
        screenOptions={{
          headerStatusBarHeight: Platform.OS === 'android' ? 0 : undefined,
          gestureEnabled: false,
          headerTintColor: theme.white,
          headerStyle: { backgroundColor: theme.header },
        }}>
        <Screen
          options={() => ({
            headerRightContainerStyle: {
              marginRight: 10,
            },
            headerRight: () => (
              <Icon
                size={20}
                type="material"
                name="more-vert"
                color="white"
                onPress={handlePlayerSelector}
              />
            ),
          })}
          name="Lexikon"
          component={HomeScreen}
        />
      </Navigator>
    </PlayerContext.Provider>
  );
};

export default MainNavigator;
