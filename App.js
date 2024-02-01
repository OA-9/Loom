import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { FontAwesome5 } from "@expo/vector-icons";
import { Calendar } from 'react-native-calendars';



const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.content}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
            >
            </TouchableOpacity>
            <ScrollView style={styles.scrollView}>
                <View>
                    <Text>Entrainement Boxe</Text>
                    <Image source={{ uri: 'https://freepngimg.com/static/img/youtube.png' }} style={{ width: 200, height: 200 }} />
                </View>
                <View>
                    <Text>Entrainement Boxe</Text>
                    <Image source={{ uri: 'https://freepngimg.com/static/img/youtube.png' }} style={{ width: 200, height: 200 }} />
                </View>
            </ScrollView>
        </View>
    );
};

const CalendrierScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.content}>
            <Calendar
                // Propriétés et configurations du calendrier
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('Calendrier')}
            >
            </TouchableOpacity>
        </View>
    );
};


const App = () => {
    const [selectedItem, setSelectedItem] = useState('Home');
    const [fontLoaded, setFontLoaded] = useState(false);
    const Stack = createStackNavigator();

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Sora-VariableFont_wght': require('./assets/fonts/Sora-VariableFont_wght.ttf'),
            });
            setFontLoaded(true);
        };

        loadFonts();
    }, []);

    const handleMenuItemPress = (item) => {
        setSelectedItem(item);

        // Utilisez la navigation pour changer d'écran
        navigationRef.current?.navigate(item);
    };

    const navigationRef = useRef(null);

    if (!fontLoaded) {
        return null; // Attendre que la police soit chargée avant de rendre le composant
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <View style={styles.container}>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            title: 'Accueil',
                            headerStyle: {
                                backgroundColor: '#EF6F13',
                            },
                            headerTintColor: '#fff',
                        }}
                    />
                    <Stack.Screen
                        name="Calendrier"
                        component={CalendrierScreen}
                        options={{
                            title: 'Calendrier',
                            headerStyle: {
                                backgroundColor: '#EF6F13',
                            },
                            headerTintColor: '#fff',
                            headerLeft: null,
                        }}
                    />
                </Stack.Navigator>

                <View style={styles.menu}>

                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => handleMenuItemPress('Calendrier')}
                    >
                        <FontAwesome5 name={'calendar'} size={24} color={selectedItem === 'Calendrier' ? 'white' : 'black'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => handleMenuItemPress('Home')}
                    >
                        <FontAwesome5 name={'home'} size={24} color={selectedItem === 'Home' ? 'white' : 'black'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => handleMenuItemPress('entrainement')}
                    >
                        <FontAwesome5 name={'dumbbell'} size={24} color={selectedItem === 'entrainement' ? 'white' : 'black'} />
                    </TouchableOpacity>
                </View>
            </View>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },



    menu: {
        flexDirection: 'row',
        backgroundColor: '#EF6F13',
        padding: 20,
        height: 80,
    },
    menuItem: {
        fontSize: 18,
        marginHorizontal: 10,
        fontFamily: 'Sora-VariableFont_wght',
    },

    selectedItem: {
        color: 'white',
        fontWeight: 'bold',
    },
    icon: {
        marginHorizontal: 35,
        alignItems: "center"
    },
    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#242424',
    },
    scrollView: {
        marginHorizontal: 50,
    },

});

export default App;
