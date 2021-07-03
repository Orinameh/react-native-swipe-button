import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import AnimatedHeader from './components/AnimatedHeader';
import DATA from './data';
import SwipeButton from './components/SwipeButton';
import LinearGradientUI from './components/LinearGradientUI';

export default function App() {
  const offset = useRef(new Animated.Value(0)).current;
  const [toggleState, setToggleState] = useState(false);

  const handleToggle = (value) => setToggleState(value);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: toggleState ? '#222' : '#ebedee'}} forceInset={{top: 'always'}}>
        {/* <AnimatedHeader animatedValue={offset} />
        <ScrollView 
          style={{flex: 1, backgroundColor: 'white'}}
          contentContainerStyle={{
            alignItems: 'center',
            paddingTop: 220,
            paddingHorizontal: 20

          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: {y: offset}}}],
            {useNativeDriver: false}
          )}
          >
        {
          DATA.map((item) => (
            <View
              key={item.id}
              style={{
                marginBottom: 20
              }}
            >
              <Text style={{ color: '#101010', fontSize: 32 }}>
                {item.title}
              </Text>
            </View>
          ))
        }
        </ScrollView> */}
        <LinearGradientUI />
          <SwipeButton onToggle={handleToggle} />
        <LinearGradientUI />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
