import { Onest_400Regular } from '@expo-google-fonts/onest/400Regular';
import { Onest_600SemiBold } from '@expo-google-fonts/onest/600SemiBold';
import { Onest_700Bold } from '@expo-google-fonts/onest/700Bold';
import { Onest_800ExtraBold } from '@expo-google-fonts/onest/800ExtraBold';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AcademyScreen from './src/AcademyScreen';
import { onest, system } from './src/theme';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Onest_400Regular,
    Onest_600SemiBold,
    Onest_700Bold,
    Onest_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <AcademyScreen fonts={fontsLoaded ? onest : system} />
    </SafeAreaProvider>
  );
}
