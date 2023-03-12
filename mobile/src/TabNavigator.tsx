import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';

import { activeColor, passiveColor, blackColor, whiteColor, disabledColor } from './shared/Vars';
import { HomeStackScreen } from './stacks/HomeStack';
import { SettingsStackScreen } from './stacks/SettingsStack';
import { ProfileStackScreen } from './stacks/ProfileStack';

interface TabNavigatorProps {
  darkTheme?: boolean;
}

const Tab = createBottomTabNavigator();

export const TabNavigator = ({ darkTheme }: TabNavigatorProps) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName: IconProps<any>['name'];

          switch (route.name) {
            case 'Home':
              iconName = `pencil`;
              return <SimpleLineIcons name={iconName} size={25} color={color} focused={focused} />;
            case 'Profile':
              iconName = `ios-person`;
              break;
            case 'Settings':
              iconName = `ios-settings-outline`;
              break;
            default:
              return null;
          }
          return <Ionicons name={iconName} size={25} color={color} focused={focused} />;
        },
      })}
      // @ts-ignore - без этого ругается
      tabBarOptions={{
        style: {
          paddingTop: 10,
          borderTopWidth: 0,
          shadowColor: whiteColor,
          shadowOffset: {
            width: 12,
            height: 12,
          },
          shadowOpacity: 0.11,
          shadowRadius: 16.0,

          elevation: 6,
          backgroundColor: darkTheme ? blackColor : whiteColor,
        },
        safeAreaInset: { bottom: 'never', top: 'never' },
        activeTintColor: darkTheme ? whiteColor : activeColor,
        inactiveTintColor: darkTheme ? disabledColor : passiveColor,

        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
};
