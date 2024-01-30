import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import {MaterialIcons} from "@expo/vector-icons";

const App = () => {
    const [selectedItem, setSelectedItem] = useState('Accueil');
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Sora-VariableFont_wght': require('./assets/fonts/Sora-VariableFont_wght.ttf'), // Assurez-vous que le chemin est correct
            });
            setFontLoaded(true);
        };

        loadFonts();
    }, []);

    const handleMenuItemPress = (item) => {
        setSelectedItem(item);
        // Ajoutez ici la logique pour afficher le contenu correspondant à l'élément du menu sélectionné
    };

    if (!fontLoaded) {
        return null; // Attendre que la police soit chargée avant de rendre le composant
    }

    return (
        <View style={styles.container}>
            {/* Contenu de la page */}
            <View style={styles.content}>
                <Text>Contenu de la page {selectedItem}</Text>
            </View>

            {/* Menu en bas */}
            <View style={styles.menu}>
                <TouchableOpacity style={styles.icon} onPress={() => handleMenuItemPress('Accueil')}>
                    <MaterialIcons name={'home'} size={24}/>
                    <Text style={[styles.menuItem, selectedItem === 'Accueil' && styles.selectedItem]}>Accueil</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleMenuItemPress('Calendrier')}>
                    <MaterialIcons name={'calendar'} size={24}/>
                    <Text style={[styles.menuItem, selectedItem === 'Calendrier' && styles.selectedItem]}>Calendrier</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleMenuItemPress('Contact')}>
                    <Text style={[styles.menuItem, selectedItem === 'Contact' && styles.selectedItem]}>Contact</Text>
                </TouchableOpacity>
            </View>
        </View>
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
        height: 80, // Ajustez la hauteur selon vos besoins
    },
    menuItem: {
        fontSize: 18,
        marginHorizontal: 10,
        fontFamily: 'Sora-VariableFont_wght',
    },
    selectedItem: {
        fontWeight: 'bold',
    },
    icon: {
        alignItems: "center"
    },
    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#242424',
    },
});

export default App;
