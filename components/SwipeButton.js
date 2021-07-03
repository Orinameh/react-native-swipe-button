import React, {useState} from 'react'
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { Extrapolate, interpolate, interpolateColor, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const BUTTON_WIDTH = 350;
const BUTTON_HEIGHT = 100;
const BUTTON_PADDING = 10;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

const SwipeButton = ({onToggle}) => {
    const X = useSharedValue(0);
    const [toggled, setToggled] = useState(false);

    const handleComplete = isToggled => {
        if(isToggled !== toggled) {
            setToggled(isToggled);
            onToggle(isToggled)
        }
    }

    const animatedGestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.completed = toggled
        }, 
        onActive: (e, ctx) => {
            let newValue;
            if(ctx.completed) {
                newValue = H_SWIPE_RANGE + e.translationX;
            } else {
                newValue = e.translationX
            }
            if(newValue >= 0 && newValue <= H_SWIPE_RANGE) {
            X.value = newValue

            }

        },
        onEnd: () => {
            if(X.value < BUTTON_WIDTH/2 - SWIPEABLE_DIMENSIONS/2) {
                X.value = withSpring(0)
                runOnJS(handleComplete)(false);
            } else {
                X.value = withSpring(H_SWIPE_RANGE);
                runOnJS(handleComplete)(true);

            }
        }
    });
    
    const InterpolateInputX = [0, H_SWIPE_RANGE];
    const AnimatedStyles = {
        swipeable: useAnimatedStyle(() => {
            return {
                backgroundColor: interpolateColor(X.value, 
                    [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
                    ['#06d6a0', '#fff']
                ),
                transform: [{translateX: X.value}],
            }
        }),
        swipeText: useAnimatedStyle(() => {
            return {
                opacity: interpolate(X.value, InterpolateInputX, [0.8, 0], Extrapolate.CLAMP),
                transform: [{ translateX: interpolate(X.value, InterpolateInputX, 
                    [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS], Extrapolate.CLAMP)}]
            }
        }),
        colorWave: useAnimatedStyle(() => {
            return {
                width: H_WAVE_RANGE + X.value,
                opacity: interpolate(X.value, InterpolateInputX, [0, 1])
            }
        })
    }
    return (
        <View style={styles.swipeContainer}>
            <AnimatedLinearGradient 
                style={[AnimatedStyles.colorWave, styles.colorWave]}
                colors={['#06d6a0','#1b9aaa']}
                start={{x: 0.0, y: 0.5}}
                end={{x: 1.0, y: 0.5}}

            />
            <PanGestureHandler onGestureEvent={animatedGestureHandler}>
                <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}></Animated.View>
            </PanGestureHandler>
            <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>Swipe me</Animated.Text>
        </View>
    )
};

const styles = StyleSheet.create({
    swipeContainer: {
        height: BUTTON_HEIGHT,
        width: BUTTON_WIDTH,
        padding: BUTTON_PADDING,
        marginHorizontal: 30,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BUTTON_HEIGHT
    },
    colorWave: {
        position: 'absolute',
        left: 0,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT/2,

    },
    swipeable: {
        height: SWIPEABLE_DIMENSIONS,
        width: SWIPEABLE_DIMENSIONS,
        borderRadius: SWIPEABLE_DIMENSIONS,
        position: 'absolute',
        left: BUTTON_PADDING,
        zIndex: 3
    },
    swipeText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1b9aaa',
        zIndex: 2
    }
})

export default SwipeButton;
