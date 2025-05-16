import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar, View, ActivityIndicator } from "react-native";
import colors from "@/constants/Colors";
import ErrorBoundary from "../components/error-boundary";
import { useAuthStore } from "@/store/auth-store";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const [appIsReady, setAppIsReady] = useState(false);
  const { refreshSession } = useAuthStore();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        // Load any resources or data that we need prior to rendering the app
        await refreshSession();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (loaded && appIsReady) {
      // Add a small delay to ensure everything is ready
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [loaded, appIsReady]);

  if (!loaded || !appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="loan-request" options={{ headerShown: false }} />
          <Stack.Screen name="loan-payment" options={{ headerShown: false }} />
          <Stack.Screen name="loan-details" options={{ headerShown: false }} />
          <Stack.Screen name="profile/current-loans" options={{ headerShown: false }} />
          <Stack.Screen name="profile/loan-history" options={{ headerShown: false }} />
          <Stack.Screen name="profile/faq" options={{ headerShown: false }} />
          <Stack.Screen name="profile/support" options={{ headerShown: false }} />
          <Stack.Screen name="profile/terms" options={{ headerShown: false }} />
          <Stack.Screen name="profile/privacy" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}