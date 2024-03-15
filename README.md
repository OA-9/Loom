> Why do I have a folder named ".expo" in my project?
The ".expo" folder is created when an Expo project is started using "expo start" command.
> What do the files contain?
- "devices.json": contains information about devices that have recently opened this project. This is used to populate the "Development sessions" list in your development builds.
- "settings.json": contains the server configuration that is used to serve the application manifest.
> Should I commit the ".expo" folder?
No, you should not share the ".expo" folder. It does not contain any information that is relevant for other developers working on the project, it is specific to your machine.
Upon project creation, the ".expo" folder is already added to your ".gitignore" file.
Cette application React Native est une application de fitness complète qui permet aux utilisateurs de gérer leurs entraînements, y compris la création, la sauvegarde et la planification de ceux-ci. Elle propose une navigation entre les écrans, la persistance des données avec AsyncStorage et des interactions utilisateur personnalisées telles que des éléments de liste glissables et sélectionnables. Le code démontre des concepts avancés de React Native, y compris la gestion de l'état, la navigation, le stockage de données asynchrone et les composants UI personnalisés. Voici un aperçu des principaux composants et fonctionnalités de l'application :

### Composants Principaux

1. **`HomeScreen`** : La page d'accueil de l'application, offrant la navigation vers d'autres écrans.

2. **`CalendrierScreen`** : Une vue calendrier pour la planification et la visualisation des entraînements. Elle utilise `react-native-calendar-strip` pour afficher un calendrier en bande.

3. **`TrainingScreen`** : Un hub pour accéder à différents aspects de l'entraînement, comme voir vos entraînements, créer de nouveaux entraînements et accéder à un minuteur.

4. **`MyWorkoutScreen`** : Permet aux utilisateurs de voir et de gérer leurs entraînements sauvegardés. Les entraînements peuvent être sélectionnés et supprimés. L'écran démontre la récupération et la mise à jour des données avec AsyncStorage et la gestion de l'état de sélection.

5. **`CreateWorkoutScreen`** : Fournit un formulaire pour créer un nouvel entraînement, y compris la définition d'un titre, d'une description, d'exercices, et la sélection d'une image pour l'entraînement. Il présente la gestion de formulaire, les champs de formulaire dynamiques et l'intégration d'AsyncStorage pour sauvegarder les entraînements.

6. **`TimerScreen` et `AdjustableTimer`** : Offrent des fonctionnalités de chronomètre et de minuteur personnalisable pour gérer les durées d'entraînement, le temps de préparation, les rounds et les pauses.

7. **`SettingsScreen`, `SettingScreen`, `ProfilScreen`** : Composants d'espace réservé pour les paramètres de l'application et les informations de profil utilisateur, démontrant la structure pour un développement ultérieur.

### Navigation

L'application utilise `@react-navigation/native` et `@react-navigation/stack` pour gérer la navigation entre les écrans. Elle montre comment configurer un `StackNavigator`, personnaliser les styles d'en-tête et naviguer entre les écrans. Un menu inférieur permet un accès rapide aux sections principales de l'application.

### AsyncStorage

L'application utilise `@react-native-async-storage/async-storage` pour le stockage local des données, permettant la persistance des entraînements des utilisateurs. Elle démontre le stockage, la récupération, la mise à jour et la suppression de données de manière asynchrone.

### Gestion de l'État

Le code utilise abondamment les hooks `useState` et `useEffect` de React pour gérer l'état des composants et les effets secondaires, tels que le chargement des données lors du montage du composant et la mise à jour de l'UI en réponse aux changements d'état.

### Hooks Personnalisés et Refs

Bien que non explicitement définis comme des hooks personnalisés, la logique de l'application montre des schémas qui pourraient être refactorisés en hooks personnalisés pour une meilleure réutilisabilité. `useRef` est utilisé pour référencer la navigation et gérer les intervalles de minuterie.

### Style

Le style de l'application est géré via `StyleSheet.create`, démontrant l'approche de React Native pour styler les composants. Il comprend des styles personnalisés pour les mises en page, le texte, les boutons et plus encore, offrant une apparence et une sensation unifiées.

### Chargement de Polices

L'application démontre le chargement asynchrone de polices avec `expo-font`, améliorant l'UI avec une typographie personnalisée.

### Composants React Native Clés Utilisés

- `View`, `Text`, `TouchableOpacity`, `ScrollView`, `TextInput`, `Button`, `ImageBackground`, `Image`, `ActivityIndicator`, `Alert` pour la

construction de l'UI de base.
- `Picker` et `DropDownPicker` pour les entrées de sélection déroulantes.
- `Swipeable` pour les interactions de balayage.
- `KeyboardAvoidingView`, `TouchableWithoutFeedback`, `Keyboard` pour améliorer les expériences de saisie de formulaire.
- `FontAwesome5` pour les icônes.
