import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Button,
    ScrollView,
    ImageBackground,
    Image,
    ActivityIndicator, Alert
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { FontAwesome5 } from "@expo/vector-icons";
import CalendarStrip from 'react-native-calendar-strip';
import { TransitionSpecs } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';


const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.content}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
            >
            </TouchableOpacity>
            <ScrollView style={styles.scrollView}>

            </ScrollView>
        </View>
    );
};

const CalendrierScreen = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <View style={styles.container}>
            <CalendarStrip
                style={styles.calendarStrip}
                calendarColor={'#242424'}
                calendarHeaderStyle={{ color: 'black' }}
                dateNumberStyle={{ color: 'black' }}
                dateNameStyle={{ color: 'black' }}
                highlightDateNumberStyle={{ color: '#007BFF' }}
                highlightDateNameStyle={{ color: '#007BFF' }}
                onDateSelected={(date) => setSelectedDate(date)}
                selectedDate={selectedDate}
                iconContainer={{ flex: 0.1 }}
            />
        </View>
    );
};
const TrainingScreen = ({ navigation }) => {
    return (
        <View style={styles.content}>

            {/* Secondary Menu */}
            <View style={styles.secondaryMenuMyWorkout}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('MyWorkout')}
                    style={styles.secondaryMenuItemCreateWorkout} // Assuming this doesn't have backgroundColor
                >
                    <View style={{ borderRadius: 10, backgroundColor: '#007BFF', padding: 10 }}>
                        <Text style={styles.menuItem}>My Workout</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryMenuItemCreateWorkout}
                    onPress={() => navigation.navigate('CreateWorkout')}
                >
                    <View style={{ borderRadius: 10, backgroundColor: '#007BFF', padding: 10 }}>
                    <Text style={styles.menuItem}>Create Workout</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryMenuItemCreateWorkout}
                    onPress={() => navigation.navigate('Timer')}
                >
                    <View style={{ borderRadius: 10, backgroundColor: '#007BFF', padding: 10 }}>
                        <Text style={styles.menuItem}>Timer</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const MyWorkoutScreen = () => {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const loadWorkouts = async () => {
            try {
                const storedWorkouts = await AsyncStorage.getItem('workouts');
                const loadedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
                setWorkouts(loadedWorkouts);

            } catch (error) {
                Alert.alert("Error", "Failed to load workouts.");
                console.error('Error loading workouts from AsyncStorage:', error);
            }
        };

        loadWorkouts();
    }, []);




    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedWorkouts, setSelectedWorkouts] = useState(new Set());

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        if (isSelectionMode) { // If turning off selection mode, clear selections
            setSelectedWorkouts(new Set());
        }
    };

    const [isModificationMode, setIsModificationMode] = useState(false);

    const deleteSelectedWorkouts = async () => {
        const newWorkouts = workouts.filter((_, index) => !selectedWorkouts.has(index));
        setWorkouts(newWorkouts);
        setSelectedWorkouts(new Set()); // Clear selections
        setIsSelectionMode(false); // Exit selection mode
        // Update AsyncStorage
        await AsyncStorage.setItem('workouts', JSON.stringify(newWorkouts));
    };
    const toggleWorkoutSelection = (index) => {
        const newSelection = new Set(selectedWorkouts);
        if (newSelection.has(index)) {
            newSelection.delete(index);
        } else {
            newSelection.add(index);
        }
        setSelectedWorkouts(newSelection);
    };

    const updateAsyncStorage = async (newWorkouts) => {
        try {
            await AsyncStorage.setItem('workouts', JSON.stringify(newWorkouts));
            Alert.alert("Success", "Workouts updated successfully!");
        } catch (error) {
            Alert.alert("Error", "Failed to update workouts.");
        }
    };


    return (
        <View style={styles.container}>
            {!isModificationMode && (
                <TouchableOpacity style={styles.button} onPress={() => setIsModificationMode(true)}>
                    <Text style={styles.buttonText}>Modify</Text>
                </TouchableOpacity>
            )}
            {isModificationMode && (
                <>
                    <TouchableOpacity style={styles.button} onPress={() => {setIsModificationMode(false);setSelectedWorkouts(new Set())}}>
                        <Text style={styles.buttonText}>Cancel Modification</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={deleteSelectedWorkouts}>
                        <Text style={styles.buttonText}>Delete Selected</Text>
                    </TouchableOpacity>
                </>
            )}
            <ScrollView contentContainerStyle={styles.containerContent}>
                {isSelectionMode && (
                    <TouchableOpacity
                        onPress={deleteSelectedWorkouts}
                        style={styles.deleteButton}
                    >
                        <Text style={styles.buttonText}>Delete Selected Workouts</Text>
                    </TouchableOpacity>
                )}
                {workouts.length > 0 ? (
                    workouts.map((workout, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.workoutCard, selectedWorkouts.has(index) ? styles.selectedWorkout : {}]}
                            onPress={() => isModificationMode ? toggleWorkoutSelection(index) : undefined}
                            onLongPress={() => !isModificationMode && setIsModificationMode(true)}
                        >
                            <ImageBackground
                                source={imageMap[workout.image]}
                                style={{ width: '100%', height: 300 }}
                                resizeMode="cover"
                            >
                                <View style={styles.workoutTitleContainer}>
                                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                                    <Text style={styles.workoutDescription}>{workout.description}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noWorkoutsText}>No workouts found</Text>
                )}
            </ScrollView>
        </View>
    );
};

const imageMap = {
    'abs-workout': require('./assets/workoutImages/abs-workout.jpg'),
    'barbell': require('./assets/workoutImages/barbell.jpg'),
    'boxing': require('./assets/workoutImages/boxing.jpg'),
    'circuit-training': require('./assets/workoutImages/circuit-training.jpg'),
    'crossfit': require('./assets/workoutImages/crossfit.jpg'),
    'weight-lifting': require('./assets/workoutImages/weight-lifting.jpg'),
    'training2': require('./assets/workoutImages/training2.jpg'),
    'training': require('./assets/workoutImages/training.jpg'),
    'street-workout2': require('./assets/workoutImages/street-workout2.jpg'),
    'street-workout1': require('./assets/workoutImages/street-workout1.jpg'),
    'powerlifting': require('./assets/workoutImages/powerlifting.jpg'),
    'dumbells2': require('./assets/workoutImages/dumbells2.jpg'),
    'dumbells1': require('./assets/workoutImages/dumbells1.jpg'),
};
const CreateWorkoutScreen = ({ navigation, route }) => {
    const { selectedDate: passedSelectedDate } = route.params || {};
    const defaultDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    const [selectedDate, setSelectedDate] = useState(passedSelectedDate || defaultDate);

    const [workoutTitle, setWorkoutTitle] = useState('');
    const [workoutDescription, setWorkoutDescription] = useState('');
    const [exercises, setExercises] = useState([
        {
            id: Math.random().toString(),
            name: '',
            sets: [
                { id: Math.random().toString(), reps: '', weight: '' }
            ],
            type: 'set-reps', // Default type, could also be 'duration' or 'distance'
            duration: '', // For duration-based exercises
            distance: '' // For distance-based exercises
        }
    ]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageId, setSelectedImageId] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setImagesLoading(false); // This should actively set the state
        }, 2000);

        return () => clearTimeout(timer);
    }, []);
// Dependency array is empty, so this runs once on mount.
    const handleImageSelection = (imageKey) => {
        setSelectedImage(imageKey); // Here, imageKey is something like 'abs-workout'
    };


    const [imagesLoading, setImagesLoading] = useState(true);

    const addExercise = () => {
        setExercises([...exercises, {
            id: Math.random().toString(),
            name: '',
            type: 'set-reps', // Default type
            sets: [
                { id: Math.random().toString(), reps: '', weight: '' }
            ],
            duration: '',
            distance: '',
        }]);
    };

    const deleteExercise = (exerciseIndex) => {
        const updatedExercises = exercises.filter((_, exIndex) => exIndex !== exerciseIndex);
        setExercises(updatedExercises);
    };


    const duplicateExercise = (index) => {
        const newExercise = { ...exercises[index], id: Math.random().toString() };
        const newExercises = [...exercises];
        newExercises.splice(index + 1, 0, newExercise);
        setExercises(newExercises);
    };

    // Function to update an exercise's details
    const updateExercise = (index, field, value) => {
        const updatedExercises = exercises.map((exercise, i) => {
            if (i === index) {
                return { ...exercise, [field]: value };
            }
            return exercise;
        });
        setExercises(updatedExercises);
    };

    const addSet = (exerciseIndex) => {
        const updatedExercises = exercises.map((exercise, index) => {
            if (index === exerciseIndex) {
                const newSet = { id: Math.random().toString(), reps: '', weight: '' };
                const updatedSets = [...exercise.sets, newSet];
                return { ...exercise, sets: updatedSets };
            }
            return exercise;
        });
        setExercises(updatedExercises);
    };

    const deleteSet = (exerciseIndex, setIndex) => {
        const updatedExercises = exercises.map((exercise, exIndex) => {
            if (exIndex === exerciseIndex) {
                const updatedSets = exercise.sets.filter((_, sIndex) => sIndex !== setIndex);
                return { ...exercise, sets: updatedSets };
            }
            return exercise;
        });
        setExercises(updatedExercises);
    };

    // Render function for exercises
    const renderExerciseInputFields = (exercise, index) => {
        // Define input fields for "set-reps" type exercises
        const setRepsFields = (
            <View>
                {exercise.sets.map((set, setIndex) => (
                    <View key={set.id} style={styles.inputGroup}>
                        <Text style={styles.label}>Set {setIndex + 1}</Text>
                        <TextInput
                            placeholder="Reps"
                            value={set.reps}
                            onChangeText={(text) => updateSet(index, setIndex, 'reps', text)}
                            style={styles.inputstyle}
                            keyboardType="numeric"
                        />
                        <TextInput
                            placeholder="Weight"
                            value={set.weight}
                            onChangeText={(text) => updateSet(index, setIndex, 'weight', text)}
                            style={styles.inputstyle}
                            keyboardType="numeric"
                        />
                    </View>
                ))}
                {exercise.sets.map((set, setIndex) => (
                    <View key={set.id} style={styles.inputGroup}>
                        {/* Existing set inputs */}
                        <TouchableOpacity onPress={() => deleteSet(index, setIndex)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>Delete Set</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity onPress={() => addSet(index)} style={styles.button}>
                    <Text style={styles.buttonText}>Add Set</Text>
                </TouchableOpacity>
            </View>
        );

        // Similar wrapper for "duration" and "distance" fields
        const durationFields = (
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                    placeholder="Duration (minutes)"
                    value={exercise.duration}
                    onChangeText={text => updateExercise(index, 'duration', text)}
                    style={styles.inputstyle}
                    keyboardType="numeric"
                />
            </View>
        );



        const distanceFields = (
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Distance</Text>
                <TextInput
                    placeholder="Distance (miles)"
                    value={exercise.distance}
                    onChangeText={text => updateExercise(index, 'distance', text)}
                    style={styles.inputstyle}
                    keyboardType="numeric"
                />
            </View>
        );

        // Switch logic remains the same
        switch (exercise.type) {
            case 'set-reps':
                return setRepsFields;
            case 'duration':
                return durationFields;
            case 'distance':
                return distanceFields;
            default:
                return null; // Return null or an appropriate default if the exercise type doesn't match
        }
    };

    const renderSets = (exercise, exerciseIndex) => {
        return exercise.sets.map((set, setIndex) => (
            <View key={set.id} style={styles.inputGroup}>
                <Text style={styles.label}>Set {setIndex + 1}</Text>
                <TextInput
                    placeholder="Reps"
                    value={set.reps}
                    onChangeText={text => updateSet(exerciseIndex, setIndex, 'reps', text)}
                    style={styles.inputstyle}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Weight"
                    value={set.weight}
                    onChangeText={text => updateSet(exerciseIndex, setIndex, 'weight', text)}
                    style={styles.inputstyle}
                    keyboardType="numeric"
                />
            </View>
        ));
    };

    const updateSet = (exerciseIndex, setIndex, field, value) => {
        const updatedExercises = exercises.map((exercise, exIndex) => {
            if (exIndex === exerciseIndex) {
                const updatedSets = exercise.sets.map((set, sIndex) => {
                    if (sIndex === setIndex) {
                        return { ...set, [field]: value };
                    }
                    return set;
                });
                return { ...exercise, sets: updatedSets };
            }
            return exercise;
        });
        setExercises(updatedExercises);
    };
    const isFormValid = () => {
        if (!workoutTitle.trim()) {
            Alert.alert("Validation", "Please enter a workout title.");
            return false;
        }
        // Add more validation checks as needed
        return true;
    };
    const saveWorkoutLocally = async () => {
        if (!isFormValid()) return; // Check if form is valid before proceeding

        try {
            const existingWorkouts = await AsyncStorage.getItem('workouts');
            const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];
            const newWorkout = {
                title: workoutTitle,
                description: workoutDescription,
                exercises: exercises,
                date: selectedDate,
                image: selectedImage,
            };
            workouts.push(newWorkout);
            await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
            Alert.alert("Success", "Workout saved successfully!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to save the workout.");
            console.error('Error saving workout locally:', error);
        }
    };
    const imageKeys = Object.keys(imageMap); // Get all keys from the imageMap object


    return (
        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    style={styles.contentContainer}>
            {/* Workout Title */}
            <Text style={styles.label}>Workout Title</Text>
            <TextInput
                placeholder="Workout Title"
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
                style={styles.input}
            />

            {/* Workout Description */}
            <Text style={styles.label}>Workout Description</Text>
            <TextInput
                placeholder="Workout Description"
                value={workoutDescription}
                multiline
                onChangeText={setWorkoutDescription}
                style={styles.input}
            />

            <Text style={styles.label}>Select Workout Image</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {imageKeys.map((key) => (
                    <TouchableOpacity key={key} onPress={() => handleImageSelection(key)} style={styles.imageContainer}>
                        <Image source={imageMap[key]} style={styles.imageStyle} />
                        {selectedImage === key && (
                            <FontAwesome5 name="check" size={24} color="#007BFF" style={styles.checkmarkIcon} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {exercises.map((exercise, index) => (
                <React.Fragment key={exercise.id}>
                    <Picker style={styles.picker}
                            selectedValue={exercise.type}
                            onValueChange={(itemValue) => updateExercise(index, 'type', itemValue)}>
                        <Picker.Item label="Set & Reps" value="set-reps" />
                        <Picker.Item label="Duration" value="duration" />
                        <Picker.Item label="Distance" value="distance" />
                    </Picker>
                    <Text style={styles.label}>Exercise Name</Text>
                    <TextInput placeholder="Exercise Name"  value={exercise.name} onChangeText={text => updateExercise(index, 'name', text)} style={styles.exercisename} />
                    {renderExerciseInputFields(exercise, index)}
                    <TouchableOpacity onPress={() => deleteExercise(index)} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete Exercise</Text>
                    </TouchableOpacity>
                </React.Fragment>
            ))}

            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={addExercise} style={styles.button}>
                    <Text style={styles.buttonText}>Add Exercise</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={saveWorkoutLocally} style={styles.button}>
                    <Text style={styles.buttonText}>Save Workout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

};

const AdjustableTimer = ({ onTimerUpdate }) => {
    const [prepTime, setPrepTime] = useState(10); // Preparation time in seconds
    const [rounds, setRounds] = useState(10); // Total rounds
    const [roundDuration, setRoundDuration] = useState(180); // Duration of each round in seconds
    const [breakDuration, setBreakDuration] = useState(60); // Break duration between rounds in seconds
    const [currentRound, setCurrentRound] = useState(0); // Current round
    const [timeLeft, setTimeLeft] = useState(0); // Time left in the current phase
    const [isActive, setIsActive] = useState(false); // Timer active status
    const [isPrepTime, setIsPrepTime] = useState(true); // Is it preparation time?

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                if (timeLeft > 0) {
                    setTimeLeft(timeLeft - 1);
                } else {
                    if (isPrepTime) {
                        // End of preparation time, start the first round
                        setIsPrepTime(false);
                        setTimeLeft(roundDuration); // Set time for the first round
                    } else {
                        // Handle the transition between round and break, and increment round after each break
                        if ((currentRound * 2 - 1) <= rounds * 2) {
                            if (currentRound % 2 === 0) { // Just finished a break, start a new round
                                setTimeLeft(roundDuration);
                            } else { // Just finished a round, start a break
                                setTimeLeft(breakDuration);
                            }

                            // Increment currentRound only after a break
                            if (currentRound % 2 === 0 || currentRound === 1) {
                                setCurrentRound(currentRound + 1);
                            }
                        } else {
                            // Timer complete after all rounds and their breaks are done
                            setIsActive(false);
                            alert('Timer Complete');
                        }
                    }
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, currentRound, isPrepTime, rounds, roundDuration, breakDuration]);

    const handleStartPause = () => {
        if (!isActive && currentRound === 0) setTimeLeft(prepTime); // Initialize timer with prep time
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setCurrentRound(0);
        setTimeLeft(0);
        setIsPrepTime(true);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <View style={styles.innerContainer}>
                    <Text style={styles.timerText}>{isPrepTime ? 'Preparation' : `Round ${currentRound} / ${rounds}`}</Text>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    <TouchableOpacity onPress={handleStartPause} style={styles.button}>
                        <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReset} style={styles.button}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                    {/* Configuration inputs */}
                    <TextInput style={styles.input} keyboardType="numeric" placeholder="Prep Time (sec)" onChangeText={text => setPrepTime(Number(text))} />
                    <TextInput style={styles.input} keyboardType="numeric" placeholder="Rounds" onChangeText={text => setRounds(Number(text))} />
                    <TextInput style={styles.input} keyboardType="numeric" placeholder="Round Duration (sec)" onChangeText={text => setRoundDuration(Number(text))} />
                    <TextInput style={styles.input} keyboardType="numeric" placeholder="Break Duration (sec)" onChangeText={text => setBreakDuration(Number(text))} />

                </View>
            </KeyboardAvoidingView>
</TouchableWithoutFeedback>

);
};

const TimerScreen = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [laps, setLaps] = useState([]);
    const [showAdjustableTimer, setShowAdjustableTimer] = useState(false); // New state to toggle between timers

    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning && !showAdjustableTimer) { // Only run the stopwatch timer if the adjustable timer is not shown
            const startTime = Date.now() - timeElapsed;
            timerRef.current = setInterval(() => {
                setTimeElapsed(Date.now() - startTime);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, showAdjustableTimer]);

    const handleToggleTimer = () => {
        setShowAdjustableTimer(!showAdjustableTimer); // Toggle between the stopwatch and adjustable timer
        setIsRunning(false); // Optionally stop the timer when switching
    };
    const formatTime = (time) => {
        const seconds = Math.floor(time / 1000) % 60;
        const minutes = Math.floor(time / 60000) % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const renderRightActions = () => (
        <AdjustableTimer onTimerUpdate={(newSettings) => {
            console.log(newSettings);
        }} />
    );
    const handleStartStop = () => {
        if (isRunning) {
            clearInterval(timerRef.current);
        }
        setIsRunning(!isRunning);
    };

    const handleLap = () => {
        setLaps([...laps, timeElapsed]);
    };
    const handleReset = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setTimeElapsed(0);
        setLaps([]);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleToggleTimer} style={styles.toggleButton}>
                <Text style={styles.toggleButtonText}>{showAdjustableTimer ? 'Show Stopwatch' : 'Show Adjustable Timer'}</Text>
            </TouchableOpacity>

            {showAdjustableTimer ? (
                <AdjustableTimer onTimerUpdate={(newSettings) => { console.log(newSettings); }} />
            ) : (
                <View>
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
                        <View style={styles.buttonContainer}>
                            {/* Your timer control buttons */}
                        </View>
                    </View>
                    <ScrollView style={styles.lapsContainer}>
                        {laps.map((lap, index) => (
                            <Text key={index} style={styles.lapText}>Lap {index + 1}: {formatTime(lap)}</Text>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const SettingsScreen = ({ navigation }) => {
    return (
    <View style={styles.content}>

        {/* Secondary Menu */}
        <View style={styles.secondaryMenuMyWorkout}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Setting')}
                style={styles.secondaryMenuItemCreateWorkout} // Assuming this doesn't have backgroundColor
            >
                <View style={{ borderRadius: 10, backgroundColor: '#007BFF', padding: 10 }}>
                    <FontAwesome5 name={'wrench'} size={24} color={'black'} />
                    <Text style={styles.menuItem}>Settings</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryMenuItemCreateWorkout}
                onPress={() => navigation.navigate('Profil')}
            >
                <View style={{ borderRadius: 10, backgroundColor: '#007BFF', padding: 10 }}>
                    <FontAwesome5 name={'user'} size={24} color={'black'} />
                    <Text style={styles.menuItem}>Profil</Text>
                </View>
            </TouchableOpacity>
        </View>
    </View>
    );
};

const SettingScreen = ({ navigation }) => {

};
const ProfilScreen = ({ navigation }) => {

} ;
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
                    <Stack.Screen //page d'accueil
                        name="Home"
                        component={HomeScreen}
                        options={{
                            title: 'Accueil',
                            headerStyle: {
                                backgroundColor: '#007BFF',
                            },
                            headerTintColor: '#fff',
                        }}
                    />
                    <Stack.Screen //page d'accueil
                        name="Settings"
                        component={SettingsScreen}
                        options={{
                            title: 'Settings',
                            headerStyle: {
                                backgroundColor: '#007BFF',
                            },
                            headerTintColor: '#fff',
                            headerLeft: null,
                        }}
                    />
                    <Stack.Screen //page du calendrier avec les séances de sport
                        name="Calendrier"
                        component={CalendrierScreen}
                        options={{
                            title: 'Calendrier',
                            headerStyle: {
                                backgroundColor: '#007BFF',
                            },
                            headerTintColor: '#fff',
                            headerLeft: null,
                            cardStyleInterpolator: ({ current, layouts }) => {
                                return {
                                    cardStyle: {
                                        transform: [
                                            {
                                                translateX: current.progress.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [-layouts.screen.width, 0],
                                                }),
                                            },
                                        ],
                                    },
                                };
                            },
                        }}
                    />
                    <Stack.Screen
                        name="Training"
                        component={TrainingScreen}
                        options={{
                            title: 'Training',
                            headerStyle: {
                                backgroundColor: '#007BFF',
                            },
                            headerTintColor: '#fff',
                            headerLeft: null,
                        }}
                    />

                    <Stack.Screen
                        name="MyWorkout"
                        component={MyWorkoutScreen}
                        options={{
                            title: 'My Workout',
                            headerStyle: {
                                backgroundColor: '#007BFF',
                            },
                            headerTintColor: '#fff',
                        }}
                    />

                    <Stack.Screen
                        name="CreateWorkout"
                        component={CreateWorkoutScreen}
                        options={{
                            title: 'Create Workout',
                            headerStyle: {
                                backgroundColor: '#007BFF',
                            },
                            headerTintColor: '#fff',
                        }}
                    />

                    <Stack.Screen
                        name="Timer"
                        component={TimerScreen}
                        options={{
                            title: 'Timer',
                            headerStyle: {
                                backgroundColor: '#007BFF',
                            },
                            headerTintColor: '#fff',
                        }}
                    />
                    <Stack.Screen
                        name="Setting"
                        component={SettingScreen}
                        options={{
                            title: 'Setting',
                            headerStyle: {
                                backgroundColor: '#007BFF',
                            },
                            headerTintColor: '#fff',
                        }}
                    />
                    <Stack.Screen
                        name="Profil"
                        component={ProfilScreen}
                        options={{
                            title: 'Profil',
                            headerStyle: {
                                backgroundColor: '#007BFF',
                            },
                            headerTintColor: '#fff',
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
                        onPress={() => handleMenuItemPress('Training')}
                    >
                        <FontAwesome5 name={'dumbbell'} size={24} color={selectedItem === 'Training' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => handleMenuItemPress('Settings')}
                    >
                        <FontAwesome5 name={'cog'} size={24} color={selectedItem === 'Settings' ? 'white' : 'black'} />
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
        backgroundColor: '#242424',
    },
    menu: {
        flexDirection: 'row',
        backgroundColor: '#007BFF',
        padding: 20,
        height: 80,
    },
    menuItem: {
        fontSize: 18,
        backgroundColor: '#007BFF',
        borderRadius : 8 ,
        marginHorizontal: 10,
        padding : 6,
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
    workoutContainer: {
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    arrow: {
        fontSize: 24,
        color: '#007BFF',
    },
    workoutTitle: {
        margin: 10,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    workoutItem: {
        fontSize: 16,
        color: '#fff',
    },
    noWorkoutsText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
    calendar: {
        height: 50, // Adjust the height as needed
    },
    dayContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    calendarStrip: {
        height: 100,
        paddingTop: 20,
        paddingBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        color: 'white', // Choose a color that suits your app's theme
        marginBottom: 5, // Adjust the spacing as needed
    },
    input: {
        color: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
    },
    exerciseContainer: {
        marginBottom: 20,
    },
    contentContainer : {
        backgroundColor: '#242424',
    },
    secondaryMenuMyWorkout : {
        
        backgroundColor: 'EF6F13',
    },
    secondaryMenuItemCreateWorkout : {
        marginBottom : 10 ,
        backgroundColor: 'EF6F13',
        borderRadius: 8,
    },
    imageStyle: {
        width: 100,
        height: 100,
        margin: 5,
    },
    selectedImage: {
        borderColor: 'blue', // Choose a color that stands out
        borderWidth: 3,
    },
    unselectedImage: {
        borderColor: 'transparent', // Or your default color
        borderWidth: 1,
    },
    imageContainer: {
        position: 'relative',
    },
    checkmarkIcon: {
        position: 'absolute',
        right: 5,
        bottom: 5,
    },
    picker:{
        width: 350, // Adjust the width as needed
        color: '#000', // Adjust text color
    },

    inputstyle:{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#f8f8f8', // Light grey background
        fontSize: 16,
        color: '#333', // Text color
},

    exercisename: {
        backgroundColor: '#FFF', // Light background color for the input
        borderColor: '#007BFF', // Border color similar to Bootstrap's primary color
        borderWidth: 1, // Border width
        borderRadius: 5, // Rounded corners
        padding: 15, // Inner padding for text
        fontSize: 16, // Text size
        color: '#333', // Text color
        marginBottom: 10, // Margin at the bottom for spacing between inputs
        shadowColor: '#000', // Shadow color
        shadowOffset: {
            width: 0,
            height: 2, // Shadow position
        },
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow blur radius
        elevation: 5, // Elevat
    },
    button: {
        marginTop: 10 ,
        marginLeft: 10 ,
        marginRight: 10 ,
        backgroundColor: '#007BFF', // Example blue color
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginVertical: 5, // Space between buttons
        alignItems: 'center', // Center button text
    },
    buttonText: {
        color: '#FFFFFF', // Text color
        fontSize: 16,
        fontWeight: 'bold',
    },

    workoutCard: {
        height: 250,
        backgroundColor: 'black',
        borderRadius: 15,
        overflow: 'hidden',
        padding: 0,
        marginBottom: 10,
    },

    workoutTitleContainer: {
        height: 70,
        backgroundColor: 'rgba(36, 36, 36, 0.8)',
        overflow: 'hidden',
        padding: 0,
        marginBottom: 10,
    },

    inputGroup: {
        flexDirection: 'row', // Align items in a row
        justifyContent: 'space-between', // Distribute space evenly between the inputs
        alignItems: 'center', // Center items vertically
        padding: 10, // Add some padding around the group
        marginBottom: 10, // Add some space below each group
    },

    exerciseItem: {
        backgroundColor: '#f8f8f8', // Light grey background for each exercise item
        borderRadius: 5, // Rounded corners
        padding: 10, // Padding inside each exercise item for spacing
        marginVertical: 5, // Margin between each exercise item
        shadowColor: '#000', // Shadow color
        shadowOffset: {
            width: 0,
            height: 2, // Vertical shadow
        },
        shadowOpacity: 0.23, // Shadow opacity
        shadowRadius: 2.62, // Shadow blur radius

        elevation: 4, // Elevation for Android (shadow effect)
    },
    exerciseText: {
        fontSize: 16, // Text size
        color: '#333', // Text color
    },
    workoutDate: {
        fontSize: 14,
        color: '#666', // Grey text color
        marginBottom: 10, // Margin at the bottom of the date
    },
    workoutDescription: {
        marginLeft: 10 ,
        color: 'white' ,
        fontSize: 16,
        marginBottom: 15, // Margin at the bottom of the description
    },

    containerContent: {
        flexGrow: 1,
        paddingTop: 15,
        padding:10,
        backgroundColor: '#242424',
    },

    deleteButton: {
        backgroundColor: 'red',
        padding: 8,
        marginTop: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    selectedWorkout: {
        borderColor: 'red', // Example selection indication
        borderWidth: 2,
    },

    timerContainer: {
        alignItems: 'center',
        padding: 20,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 30,
    },

    lapsContainer: {
        marginTop: 20,
    },
    lapText: {
        fontSize: 18,
        marginVertical: 5,
    },
    actionButton: {
        justifyContent: 'center',
        flex: 1,
        width: 100,
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
    },

    resetButton: {
        backgroundColor: '#FF6347', // Tomato color for the reset button
    },
    dismissButton: {
        marginTop: 20,
        backgroundColor: '#ddd', // Example styling, customize as needed
        padding: 10,
        borderRadius: 5,
    },

});

export default App;

