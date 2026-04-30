# Pre-Publish Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare Potinho for Google Play publication by adding Firebase Analytics, fixing the theme system, adding i18n (PT/EN), and data export/import.

**Architecture:** Four independent features implemented sequentially. Analytics is pure service code. Themes use CSS variables consumed by Tailwind tokens — requires touching every component/screen to replace hardcoded colors. i18n wraps all UI strings via i18next with auto-detection. Backup adds a new service + settings UI.

**Tech Stack:** Expo 54, React Native 0.81, Zustand + MMKV, NativeWind/Tailwind, TypeScript strict, i18next, Firebase Analytics, expo-localization, expo-file-system, expo-sharing, expo-document-picker

---

### Task 1: Firebase Analytics — Install and Configure

**Files:**
- Modify: `package.json`
- Modify: `app.json`
- Modify: `src/services/analyticsService.ts`

- [ ] **Step 1: Install Firebase dependencies**

Run:
```bash
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

- [ ] **Step 2: Add Firebase plugin to app.json**

Add to the `plugins` array in `app.json`:

```json
"@react-native-firebase/app"
```

The full `plugins` array becomes:
```json
"plugins": [
  "expo-router",
  "expo-audio",
  "expo-asset",
  "@sentry/react-native",
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-2826077560722110~2767250862"
    }
  ],
  "expo-font",
  "@react-native-firebase/app"
]
```

- [ ] **Step 3: Place google-services.json**

The user must create a Firebase project in the Firebase Console, register the Android app with package name `com.diegofernandes.potinho`, and download `google-services.json` to the project root directory.

Run to verify it exists:
```bash
ls google-services.json
```

- [ ] **Step 4: Update analyticsService.ts**

Replace `src/services/analyticsService.ts` with:

```typescript
import analytics from '@react-native-firebase/analytics';

export const Events = {
  FIRST_SESSION: 'first_session',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  TASK_ADDED: 'task_added',
  DRAW_STARTED: 'draw_started',
  DRAW_ACCEPTED: 'draw_accepted',
  TASK_COMPLETED: 'task_completed',
  TASK_SKIPPED: 'task_skipped',
  MILESTONE_REACHED: 'milestone_reached',
  PAYWALL_OPENED: 'paywall_opened',
  PURCHASE_ATTEMPTED: 'purchase_attempted',
  PURCHASE_COMPLETED: 'purchase_completed',
  PURCHASE_FAILED: 'purchase_failed',
  PURCHASE_RESTORED: 'purchase_restored',
  AD_BANNER_SHOWN: 'ad_banner_shown',
  INTERSTITIAL_SHOWN: 'interstitial_shown',
} as const;

type EventName = (typeof Events)[keyof typeof Events];

function track(event: EventName, params?: Record<string, unknown>) {
  if (__DEV__) {
    console.log(`[Analytics] ${event}`, params ?? '');
    return;
  }

  analytics().logEvent(event, params).catch(() => {});
}

export const analyticsService = { track };
```

- [ ] **Step 5: Add mock for Firebase in tests**

Create `__mocks__/@react-native-firebase/analytics.ts`:

```typescript
const analytics = () => ({
  logEvent: jest.fn().mockResolvedValue(undefined),
});
export default analytics;
```

Create `__mocks__/@react-native-firebase/app.ts`:

```typescript
export default {};
```

Update `jest.config.js` — add to `moduleNameMapper`:

```javascript
'^@react-native-firebase/analytics$': '<rootDir>/__mocks__/@react-native-firebase/analytics.ts',
'^@react-native-firebase/app$': '<rootDir>/__mocks__/@react-native-firebase/app.ts',
```

- [ ] **Step 6: Run tests to verify nothing broke**

Run: `npx jest --no-cache`

Expected: All existing tests pass.

- [ ] **Step 7: Commit**

```bash
git add package.json app.json src/services/analyticsService.ts __mocks__/@react-native-firebase jest.config.js
git commit -m "feat: integrate Firebase Analytics for production event tracking"
```

---

### Task 2: Theme System — CSS Variables and Tailwind Tokens

**Files:**
- Modify: `global.css`
- Modify: `tailwind.config.js`
- Delete: `src/theme/colors.ts`

- [ ] **Step 1: Define CSS variables in global.css**

Replace `global.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-surface: 248 239 217;
  --color-surface-hi: 255 251 239;
  --color-ink: 35 18 8;
  --color-ink-soft: 74 46 30;
  --color-brand: 232 80 61;
  --color-brand-dark: 184 50 30;
  --color-sage: 137 164 124;
  --color-muted: 138 120 104;
  --color-accent: 217 165 32;
  --color-jar: 232 213 183;
  --color-blush: 255 213 200;
  --color-night: 26 14 7;
}

.theme-pastel-blue {
  --color-brand: 138 180 216;
  --color-brand-dark: 94 140 179;
}

.theme-pastel-pink {
  --color-brand: 232 166 182;
  --color-brand-dark: 199 122 141;
}

.theme-pastel-green {
  --color-brand: 159 201 163;
  --color-brand-dark: 111 160 117;
}

.theme-dark {
  --color-surface: 43 35 28;
  --color-surface-hi: 59 47 38;
  --color-ink: 255 248 239;
  --color-ink-soft: 200 185 170;
  --color-muted: 168 150 128;
}
```

Note: NativeWind uses space-separated RGB values (not hex) for `rgb()` / opacity support.

- [ ] **Step 2: Update tailwind.config.js to use CSS variables**

Replace `tailwind.config.js` with:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-hi': 'rgb(var(--color-surface-hi) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--color-ink-soft) / <alpha-value>)',
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        'brand-dark': 'rgb(var(--color-brand-dark) / <alpha-value>)',
        sage: 'rgb(var(--color-sage) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        jar: 'rgb(var(--color-jar) / <alpha-value>)',
        blush: 'rgb(var(--color-blush) / <alpha-value>)',
        night: 'rgb(var(--color-night) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Caprasimo_400Regular'],
        body: ['Fraunces_400Regular'],
        bodyMedium: ['Fraunces_500Medium'],
        bodySemi: ['Fraunces_600SemiBold'],
        bodyBold: ['Fraunces_700Bold'],
        bodyBlack: ['Fraunces_900Black'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Delete src/theme/colors.ts**

Run:
```bash
rm src/theme/colors.ts
```

Verify no imports reference it:
```bash
grep -r "theme/colors" src/ app/
```
Expected: no results (it's not imported anywhere currently).

- [ ] **Step 4: Commit theme infrastructure**

```bash
git add global.css tailwind.config.js
git rm src/theme/colors.ts
git commit -m "feat: theme system with CSS variables and Tailwind tokens"
```

---

### Task 3: Theme System — Apply Theme Class on Root Layout

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Update _layout.tsx to apply theme class**

Replace `app/_layout.tsx` with:

```typescript
import '../global.css';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import { useFonts, Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_900Black,
} from '@expo-google-fonts/fraunces';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { adsService } from '@/services/adsService';
import { purchaseService } from '@/services/purchaseService';
import { analyticsService, Events } from '@/services/analyticsService';
import { useJarStore } from '@/stores/jarStore';
import { useAppStore } from '@/stores/appStore';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  enableAutoSessionTracking: true,
});

function RootLayout() {
  const theme = useAppStore((s) => s.theme);
  const [fontsLoaded] = useFonts({
    Caprasimo_400Regular,
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_900Black,
  });

  useEffect(() => {
    if (!useAppStore.getState().onboardingDone) {
      analyticsService.track(Events.FIRST_SESSION);
    }
    useJarStore.getState().ensureDefault();
    adsService.init().catch(() => {});
    purchaseService.init().catch(() => {});
    return () => {
      purchaseService.cleanup().catch(() => {});
    };
  }, []);

  if (!fontsLoaded) {
    return <View className="flex-1 bg-surface" />;
  }

  const themeClass = theme !== 'default' ? `theme-${theme}` : '';

  return (
    <ErrorBoundary>
      <GestureHandlerRootView className={`flex-1 ${themeClass}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="add-task" options={{ presentation: 'modal' }} />
          <Stack.Screen name="tasks" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
          <Stack.Screen name="stats" />
          <Stack.Screen name="privacy" />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);
```

Key changes:
- Read `theme` from store
- Apply `theme-${theme}` class to `GestureHandlerRootView`
- Replace hardcoded `backgroundColor: '#F8EFD9'` with `className="bg-surface"`
- Set `contentStyle` to transparent so screens inherit theme
- StatusBar adapts to dark theme

- [ ] **Step 2: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: apply theme class on root layout"
```

---

### Task 4: Theme System — Migrate Components to Theme Tokens

**Files:**
- Modify: `src/components/Jar.tsx`
- Modify: `src/components/TaskCard.tsx`
- Modify: `src/components/PrimaryButton.tsx`
- Modify: `src/components/IconButton.tsx`
- Modify: `src/components/Streak.tsx`
- Modify: `src/components/ErrorBoundary.tsx`

- [ ] **Step 1: Migrate Jar.tsx**

Replace `src/components/Jar.tsx` with:

```typescript
import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

export interface JarHandle {
  shake: () => Promise<void>;
}

interface Props {
  taskCount: number;
}

const POT_IMAGE = require('../../assets/logo-transparent.png');

function PaperSlips({ count }: { count: number }) {
  if (count === 0) return null;

  const slips = [
    { rotate: '-18deg', translateX: -24, className: 'bg-surface-hi', height: 30 },
    { rotate: '10deg', translateX: 6, className: 'bg-blush', height: 34 },
    { rotate: '-5deg', translateX: 24, className: 'bg-surface-hi', height: 26 },
  ];

  const visibleCount = Math.min(count, slips.length);

  return (
    <View
      style={{
        position: 'absolute',
        top: 8,
        left: 0,
        right: 0,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        zIndex: 3,
      }}
    >
      {slips.slice(0, visibleCount).map((s, i) => (
        <View
          key={i}
          className={`${s.className} border-2 border-ink`}
          style={{
            position: 'absolute',
            width: 30,
            height: s.height,
            borderRadius: 4,
            transform: [
              { rotate: s.rotate },
              { translateX: s.translateX },
              { translateY: -s.height / 2 },
            ],
          }}
        />
      ))}
    </View>
  );
}

export const Jar = forwardRef<JarHandle, Props>(({ taskCount }, ref) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const resolveRef = useRef<(() => void) | null>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const shake = useCallback(() => {
    return new Promise<void>((resolve) => {
      resolveRef.current = resolve;

      const t = 219;
      const ease = Easing.inOut(Easing.ease);

      scale.value = withSequence(
        withTiming(1.08, { duration: 250, easing: ease }),
        withDelay(t * 16, withTiming(1, { duration: 296, easing: ease })),
      );

      rotation.value = withSequence(
        withTiming(-10, { duration: t, easing: ease }),
        withTiming(10, { duration: t, easing: ease }),
        withTiming(-10, { duration: t, easing: ease }),
        withTiming(10, { duration: t, easing: ease }),
        withTiming(-7, { duration: t, easing: ease }),
        withTiming(7, { duration: t, easing: ease }),
        withTiming(-7, { duration: t, easing: ease }),
        withTiming(7, { duration: t, easing: ease }),
        withTiming(-5, { duration: t, easing: ease }),
        withTiming(5, { duration: t, easing: ease }),
        withTiming(-4, { duration: t, easing: ease }),
        withTiming(4, { duration: t, easing: ease }),
        withTiming(-2, { duration: t, easing: ease }),
        withTiming(2, { duration: t, easing: ease }),
        withTiming(-1, { duration: t, easing: ease }),
        withTiming(0, { duration: t, easing: ease }),
      );

      setTimeout(() => {
        resolveRef.current?.();
        resolveRef.current = null;
      }, t * 16 + 296);
    });
  }, [rotation, scale]);

  useImperativeHandle(ref, () => ({ shake }));

  return (
    <View
      style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}
      accessibilityLabel={`Potinho com ${taskCount} tarefas`}
    >
      <Text
        className="font-display text-accent"
        style={{
          position: 'absolute',
          top: 0,
          left: -20,
          fontSize: 28,
          transform: [{ rotate: '-15deg' }],
        }}
      >
        ✦
      </Text>
      <Text
        className="font-display text-brand"
        style={{
          position: 'absolute',
          top: 30,
          right: -16,
          fontSize: 20,
          transform: [{ rotate: '12deg' }],
        }}
      >
        ✦
      </Text>
      <Text
        className="font-display text-sage"
        style={{
          position: 'absolute',
          bottom: 10,
          left: -24,
          fontSize: 24,
          transform: [{ rotate: '8deg' }],
        }}
      >
        ✦
      </Text>

      <Animated.View style={animatedStyle}>
        <View style={{ position: 'relative' }}>
          <PaperSlips count={taskCount} />
          <Image
            source={POT_IMAGE}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel="Potinho"
          />
        </View>
      </Animated.View>
    </View>
  );
});
Jar.displayName = 'Jar';
```

- [ ] **Step 2: Migrate TaskCard.tsx**

Replace `src/components/TaskCard.tsx` with:

```typescript
import { View, Text } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  text: string;
  accepted: boolean;
  onAccept: () => void;
  onDone: () => void;
  onSkip: () => void;
}

export function TaskCard({ text, accepted, onAccept, onDone, onSkip }: Props) {
  if (accepted) {
    return (
      <View accessibilityLabel={`Tarefa em andamento: ${text}`}>
        <View
          className="bg-ink"
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            right: -5,
            bottom: -5,
            borderRadius: 22,
          }}
        />
        <View
          className="bg-accent border-3 border-ink"
          style={{ borderRadius: 22, padding: 18 }}
        >
          <Text
            className="font-bodyBold text-ink"
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            ✦ Fazendo agora
          </Text>
          <Text
            className="font-display text-ink"
            style={{ fontSize: 24, lineHeight: 28, marginBottom: 14 }}
          >
            {text}
          </Text>
          <View style={{ gap: 8 }}>
            <PrimaryButton onPress={onDone} compact>
              Concluir
            </PrimaryButton>
            <PrimaryButton onPress={onSkip} variant="secondary" compact>
              Desistir
            </PrimaryButton>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View accessibilityLabel={`Sua tarefa é: ${text}`}>
      <View
        className="bg-ink"
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          right: -6,
          bottom: -6,
          borderRadius: 24,
        }}
      />
      <View
        className="bg-surface-hi border-3 border-ink"
        style={{ borderRadius: 24, padding: 22 }}
      >
        <View
          className="bg-accent border-2 border-ink"
          style={{
            position: 'absolute',
            top: -12,
            right: 32,
            width: 56,
            height: 22,
            transform: [{ rotate: '-6deg' }],
          }}
        />

        <Text
          className="font-bodyBold text-brand-dark"
          style={{
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          ✦ Sua tarefa é
        </Text>

        <Text
          className="font-display text-ink"
          style={{ fontSize: 28, lineHeight: 34, marginBottom: 20 }}
        >
          {text}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={onAccept} testID="task-card-accept">
              Fazer
            </PrimaryButton>
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={onSkip} variant="secondary" testID="task-card-skip">
              Depois
            </PrimaryButton>
          </View>
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 3: Migrate PrimaryButton.tsx**

Replace `src/components/PrimaryButton.tsx` with:

```typescript
import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';

interface Props {
  onPress: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  compact?: boolean;
  testID?: string;
  accessibilityHint?: string;
}

export function PrimaryButton({
  onPress,
  children,
  disabled,
  variant = 'primary',
  compact,
  testID,
  accessibilityHint,
}: Props) {
  const fillClasses = {
    primary: disabled ? 'bg-brand/50' : 'bg-brand',
    secondary: disabled ? 'bg-blush/50' : 'bg-blush',
    ghost: 'bg-transparent',
  };
  const textClasses = {
    primary: 'text-surface-hi',
    secondary: 'text-ink',
    ghost: 'text-ink',
  };
  const shadowOffset = 5;

  return (
    <View style={{ position: 'relative', paddingRight: shadowOffset, paddingBottom: shadowOffset }}>
      {!disabled && (
        <View
          className="bg-ink"
          style={{
            position: 'absolute',
            top: shadowOffset,
            left: shadowOffset,
            right: 0,
            bottom: 0,
            borderRadius: 22,
          }}
        />
      )}
      <Pressable
        testID={testID}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        accessibilityHint={accessibilityHint}
      >
        {({ pressed }) => (
          <View
            className={`${fillClasses[variant]} border-3 border-ink`}
            style={{
              borderRadius: 22,
              paddingVertical: compact ? 12 : 16,
              paddingHorizontal: compact ? 20 : 24,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                { translateX: pressed && !disabled ? shadowOffset : 0 },
                { translateY: pressed && !disabled ? shadowOffset : 0 },
              ],
            }}
          >
            <Text
              className={`font-bodyBlack ${textClasses[variant]}`}
              style={{ fontSize: compact ? 16 : 18, letterSpacing: 0.3 }}
            >
              {children}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Migrate IconButton.tsx**

Replace `src/components/IconButton.tsx` with:

```typescript
import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  label: string;
  size?: number;
}

export function IconButton({ icon, onPress, label, size = 48 }: Props) {
  const radius = size * 0.33;
  const shadow = 3;

  return (
    <Pressable onPress={onPress} accessibilityLabel={label} accessibilityRole="button" hitSlop={10}>
      <View style={{ position: 'relative', paddingRight: shadow, paddingBottom: shadow }}>
        <View
          className="bg-ink"
          style={{
            position: 'absolute',
            top: shadow,
            left: shadow,
            right: 0,
            bottom: 0,
            borderRadius: radius,
          }}
        />
        <View
          className="bg-surface-hi border-ink"
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: 2.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name={icon} size={size * 0.48} className="text-ink" />
        </View>
      </View>
    </Pressable>
  );
}
```

- [ ] **Step 5: Migrate Streak.tsx**

Replace `src/components/Streak.tsx` with:

```typescript
import { View, Text } from 'react-native';

interface Props {
  count: number;
}

export function Streak({ count }: Props) {
  if (count === 0) return null;
  return (
    <View style={{ transform: [{ rotate: '-4deg' }] }}>
      <View
        className="bg-ink"
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          right: -3,
          bottom: -3,
          borderRadius: 999,
        }}
      />
      <View
        className="bg-accent border-2 border-ink"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 4,
          paddingHorizontal: 10,
          borderRadius: 999,
        }}
      >
        <Text style={{ fontSize: 14 }}>🔥</Text>
        <Text
          className="font-bodyBlack text-ink"
          style={{ marginLeft: 4, fontSize: 14 }}
        >
          {count} {count === 1 ? 'dia' : 'dias'}
        </Text>
      </View>
    </View>
  );
}
```

- [ ] **Step 6: Commit component migrations**

```bash
git add src/components/Jar.tsx src/components/TaskCard.tsx src/components/PrimaryButton.tsx src/components/IconButton.tsx src/components/Streak.tsx
git commit -m "feat: migrate components to theme tokens"
```

---

### Task 5: Theme System — Migrate All Screens to Theme Tokens

**Files:**
- Modify: `app/index.tsx`
- Modify: `app/onboarding.tsx`
- Modify: `app/add-task.tsx`
- Modify: `app/tasks.tsx`
- Modify: `app/settings.tsx`
- Modify: `app/paywall.tsx`
- Modify: `app/stats.tsx`
- Modify: `app/privacy.tsx`

- [ ] **Step 1: Migrate index.tsx (Home screen)**

Replace all hardcoded colors in `app/index.tsx`. Key replacements:

| Hardcoded | Replacement |
|---|---|
| `backgroundColor: '#F8EFD9'` | `className="bg-surface"` |
| `color: '#B8321E'` | `className="text-brand-dark"` |
| `color: '#231208'` | `className="text-ink"` |
| `color: '#4A2E1E'` | `className="text-ink-soft"` |
| `backgroundColor: '#231208'` | `className="bg-ink"` |
| `backgroundColor: '#89A47C'` | `className="bg-sage"` |
| `color: '#FFFBEF'` | `className="text-surface-hi"` |

Full replacement for `app/index.tsx`:

```typescript
import { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Jar } from '@/components/Jar';
import { TaskCard } from '@/components/TaskCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { IconButton } from '@/components/IconButton';
import { AdBanner } from '@/components/AdBanner';
import { useDrawTask } from '@/hooks/useDrawTask';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';

const POT_IMAGE = require('../assets/logo-transparent.png');

function CelebrationToast({ message }: { message: string }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    const ease = Easing.out(Easing.back(1.5));
    opacity.value = withSequence(
      withTiming(1, { duration: 300, easing: ease }),
      withDelay(1500, withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) })),
    );
    translateY.value = withTiming(0, { duration: 300, easing: ease });
    scale.value = withSequence(
      withTiming(1.05, { duration: 300, easing: ease }),
      withTiming(1, { duration: 200 }),
    );
  }, [opacity, translateY, scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityLabel={message}
      style={[
        animStyle,
        {
          position: 'absolute',
          top: '40%',
          left: 24,
          right: 24,
          alignItems: 'center',
          zIndex: 20,
        },
      ]}
    >
      <View style={{ position: 'relative', paddingRight: 5, paddingBottom: 5 }}>
        <View
          className="bg-ink"
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            right: 0,
            bottom: 0,
            borderRadius: 24,
          }}
        />
        <View
          className="bg-sage border-3 border-ink"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 24,
            gap: 10,
          }}
        >
          <Image source={POT_IMAGE} style={{ width: 28, height: 28 }} resizeMode="contain" />
          <Text className="font-bodyBlack text-surface-hi" style={{ fontSize: 18 }}>
            {message}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function Home() {
  const router = useRouter();
  const onboardingDone = useAppStore((s) => s.onboardingDone);
  const jars = useJarStore((s) => s.jars);
  const jar = jars[0];
  const activeCount = useTaskStore((s) => (jar ? s.activeIn(jar.id).length : 0));

  const { draw, accept, done, skip, drawnTask, isAccepted, isDrawing, jarRef, celebration } = useDrawTask(jar?.id ?? '');

  if (!onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  if (!jar) return null;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {celebration && <CelebrationToast message={celebration} key={celebration} />}

      <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            className="font-bodyBold text-brand-dark"
            style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase' }}
          >
            ✦ {jar.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <IconButton icon="list" onPress={() => router.push('/tasks')} label="Lista de tarefas" />
            <IconButton icon="settings" onPress={() => router.push('/settings')} label="Configurações" />
          </View>
        </View>

        <Text
          className="font-display text-ink"
          style={{ fontSize: 44, lineHeight: 48, letterSpacing: -1, marginTop: 2 }}
        >
          Potinho
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <View accessibilityLabel={`Potinho com ${activeCount} tarefas`}>
          <Jar ref={jarRef} taskCount={activeCount} />
        </View>

        {!drawnTask && (
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <Text
              className="font-bodyBold text-ink-soft"
              style={{ fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' }}
            >
              {activeCount === 0
                ? '— Vazio, adicione algo —'
                : `— ${activeCount} ${activeCount === 1 ? 'coisa' : 'coisas'} pra fazer —`}
            </Text>
          </View>
        )}

        {drawnTask && (
          <View style={{ marginTop: 24, width: '100%' }}>
            <TaskCard
              text={drawnTask.text}
              accepted={isAccepted}
              onAccept={accept}
              onDone={done}
              onSkip={skip}
            />
          </View>
        )}
      </View>

      {!drawnTask && (
        <View style={{ paddingHorizontal: 24, paddingBottom: 16, gap: 12 }}>
          <PrimaryButton onPress={() => router.push('/add-task')} variant="secondary">
            + Criar tarefa
          </PrimaryButton>
          <PrimaryButton
            onPress={draw}
            disabled={activeCount === 0 || isDrawing}
            testID="draw-button"
          >
            {isDrawing ? '...' : 'SORTEAR ✦'}
          </PrimaryButton>
        </View>
      )}

      <AdBanner />
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Migrate settings.tsx**

Replace `app/settings.tsx` with:

```typescript
import type { ReactNode } from 'react';
import { View, Text, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';
import { useAppStore } from '@/stores/appStore';

export default function Settings() {
  const router = useRouter();
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const isPremium = useAppStore((s) => s.isPremium);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const toggleHaptics = useAppStore((s) => s.toggleHaptics);

  const Row = ({
    label,
    right,
    onPress,
  }: {
    label: string;
    right?: ReactNode;
    onPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className="bg-surface-hi border-ink"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderRadius: 18,
        borderWidth: 2.5,
        marginBottom: 10,
      }}
    >
      <Text className="font-bodyBold text-ink" style={{ fontSize: 16 }}>
        {label}
      </Text>
      {right}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View>
          <Text
            className="font-bodyBold text-brand-dark"
            style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase' }}
          >
            ✦ ajustes
          </Text>
          <Text
            className="font-display text-ink"
            style={{ fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
          >
            Configurações
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label="Fechar" />
      </View>

      <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
        <Row
          label="Som do sorteio"
          right={
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ true: '#89A47C', false: '#E8D5B7' }}
              thumbColor="#FFFBEF"
              accessibilityLabel={soundEnabled ? 'Som ativado' : 'Som desativado'}
            />
          }
        />
        <Row
          label="Vibração"
          right={
            <Switch
              value={hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ true: '#89A47C', false: '#E8D5B7' }}
              thumbColor="#FFFBEF"
              accessibilityLabel={hapticsEnabled ? 'Vibração ativada' : 'Vibração desativada'}
            />
          }
        />

        {!isPremium && (
          <Row
            label="✦ Virar premium"
            right={
              <Text
                className="font-bodyBlack text-brand"
                style={{ fontSize: 14, letterSpacing: 1 }}
              >
                R$ 6,90 →
              </Text>
            }
            onPress={() => router.push('/paywall')}
          />
        )}

        {isPremium && (
          <Row
            label="📊 Estatísticas"
            right={<Text className="text-ink-soft" style={{ fontSize: 20 }}>›</Text>}
            onPress={() => router.push('/stats')}
          />
        )}

        <Row
          label="Política de privacidade"
          right={<Text className="text-ink-soft" style={{ fontSize: 20 }}>›</Text>}
          onPress={() => router.push('/privacy')}
        />

        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text
            className="font-bodyBold text-muted"
            style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}
          >
            potinho v1.0 ✦ feito com carinho
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
```

Note: `Switch` `trackColor` and `thumbColor` keep hardcoded values because React Native's `Switch` does not support className for these props.

- [ ] **Step 3: Migrate remaining screens**

Apply the same color replacement pattern to `onboarding.tsx`, `add-task.tsx`, `tasks.tsx`, `paywall.tsx`, `stats.tsx`, and `privacy.tsx`:

**Pattern for all screens:**
- `style={{ ... backgroundColor: '#F8EFD9' }}` on SafeAreaView → `className="flex-1 bg-surface"`
- `color: '#231208'` → `className="... text-ink"`
- `color: '#B8321E'` → `className="... text-brand-dark"`
- `color: '#4A2E1E'` → `className="... text-ink-soft"`
- `color: '#8A7868'` → `className="... text-muted"`
- `color: '#E8503D'` → `className="... text-brand"`
- `color: '#FFFBEF'` → `className="... text-surface-hi"`
- `backgroundColor: '#FFFBEF'` → `className="... bg-surface-hi"`
- `backgroundColor: '#231208'` → `className="... bg-ink"`
- `backgroundColor: '#E8503D'` → `className="... bg-brand"`
- `backgroundColor: '#FFD5C8'` → `className="... bg-blush"`
- `backgroundColor: '#D9A520'` → `className="... bg-accent"`
- `backgroundColor: '#89A47C'` → `className="... bg-sage"`
- `backgroundColor: '#E8D5B7'` → `className="... bg-jar"`
- `borderColor: '#231208'` → `className="... border-ink"`

For each screen, move `color`/`backgroundColor`/`borderColor` from `style={{}}` to `className`, keeping layout props (`fontSize`, `letterSpacing`, `padding`, `margin`, `borderRadius`, `flexDirection`, etc.) in `style`.

- [ ] **Step 4: Run tests**

Run: `npx jest --no-cache`

Expected: All tests pass (tests don't test components directly, so theme changes shouldn't break anything).

- [ ] **Step 5: Commit screen migrations**

```bash
git add app/index.tsx app/onboarding.tsx app/add-task.tsx app/tasks.tsx app/settings.tsx app/paywall.tsx app/stats.tsx app/privacy.tsx
git commit -m "feat: migrate all screens to theme tokens"
```

---

### Task 6: i18n — Setup and Translation Files

**Files:**
- Modify: `package.json`
- Create: `src/locales/pt.json`
- Create: `src/locales/en.json`
- Create: `src/locales/index.ts`

- [ ] **Step 1: Install i18n dependencies**

Run:
```bash
npx expo install expo-localization && npm install i18next react-i18next
```

- [ ] **Step 2: Create Portuguese translation file**

Create `src/locales/pt.json`:

```json
{
  "home": {
    "jarName": "✦ {{name}}",
    "title": "Potinho",
    "draw": "SORTEAR ✦",
    "drawing": "...",
    "addTask": "+ Criar tarefa",
    "empty": "— Vazio, adicione algo —",
    "taskCount_one": "— {{count}} coisa pra fazer —",
    "taskCount_other": "— {{count}} coisas pra fazer —",
    "done": "Feito! 🎉",
    "milestone": "{{count}} tarefas concluídas! 🏆"
  },
  "onboarding": {
    "stepOne": "um",
    "stepTwo": "dois",
    "stepThree": "três",
    "step": "passo {{name}}",
    "title1": "Anote o que\ntá te travando.",
    "body1": "Aquelas tarefinhas que ficam pairando na sua cabeça — joga tudo pro potinho.",
    "title2": "Deixa o\npotinho decidir.",
    "body2": "Em vez de escolher, sorteia. Menos paralisia, mais ação.",
    "title3": "Faça uma\nde cada vez.",
    "body3": "Marca como feito e vê seu streak crescer. Um dia de cada vez.",
    "next": "Próximo →",
    "letsGo": "Bora!",
    "firstTaskKicker": "✦ primeira tarefa",
    "firstTaskTitle": "Qual coisa\nvocê está\nadiando?",
    "firstTaskBody": "Pode ser qualquer coisa pequena. A gente começa por uma só.",
    "firstTaskPlaceholder": "Ex: lavar a louça",
    "start": "Começar ✦",
    "progressDot": "Passo {{current}} de 3"
  },
  "addTask": {
    "kicker": "✦ nova anotação",
    "title": "Joga no potinho",
    "placeholder": "O que está te travando?",
    "inputLabel": "Texto da tarefa",
    "submit": "Adicionar",
    "confirmation": "No potinho!"
  },
  "tasks": {
    "kicker": "✦ suas coisas",
    "title": "Tarefas",
    "tabActive": "No potinho",
    "tabDone": "Feitas",
    "emptyActive": "Nada ainda. Joga algo aí.",
    "emptyDone": "Suas tarefas concluídas aparecem aqui.",
    "last7days": "Últimos 7 dias — Premium libera tudo",
    "hiddenCount_one": "Você tem mais {{count}} tarefa concluída.",
    "hiddenCount_other": "Você tem mais {{count}} tarefas concluídas.",
    "hiddenUpsell": "Premium desbloqueia o histórico completo.",
    "seeMore": "Ver mais →",
    "deleteTitle": "Remover tarefa?",
    "deleteCancel": "Cancelar",
    "deleteConfirm": "Remover",
    "saveEdit": "Salvar edição",
    "cancelEdit": "Cancelar edição",
    "removeTask": "Remover tarefa",
    "editTask": "Editar tarefa"
  },
  "taskCard": {
    "doingNow": "✦ Fazendo agora",
    "yourTask": "✦ Sua tarefa é",
    "finish": "Concluir",
    "giveUp": "Desistir",
    "doIt": "Fazer",
    "later": "Depois",
    "doingLabel": "Tarefa em andamento: {{text}}",
    "drawnLabel": "Sua tarefa é: {{text}}"
  },
  "settings": {
    "kicker": "✦ ajustes",
    "title": "Configurações",
    "sound": "Som do sorteio",
    "soundOn": "Som ativado",
    "soundOff": "Som desativado",
    "vibration": "Vibração",
    "vibrationOn": "Vibração ativada",
    "vibrationOff": "Vibração desativada",
    "premium": "✦ Virar premium",
    "stats": "📊 Estatísticas",
    "privacy": "Política de privacidade",
    "export": "Exportar dados",
    "import": "Importar dados",
    "version": "potinho v1.0 ✦ feito com carinho",
    "close": "Fechar"
  },
  "paywall": {
    "kicker": "✦ potinho premium ✦",
    "title": "Desbloqueia\ntudo.",
    "subtitle": "Seu potinho merece mais.",
    "benefit1": "Sem anúncios, nunca mais",
    "benefit2": "Potinhos ilimitados",
    "benefit3": "Temas visuais extras",
    "benefit4": "Estatísticas detalhadas",
    "benefit5": "Histórico sem limite",
    "buyFor": "Comprar por {{price}}",
    "buying": "...",
    "oneTime": "compra única — sem assinatura",
    "unavailable": "compras indisponíveis neste dispositivo",
    "notNow": "Agora não",
    "restore": "Restaurar compra",
    "restoring": "Restaurando...",
    "purchaseHint": "Compra única de R$ 6,90",
    "successTitle": "Premium ativado! 🎉",
    "successMessage": "Obrigado pelo apoio.",
    "failTitle": "Compra não concluída",
    "restoreSuccess": "Compra restaurada!",
    "restoreSuccessMessage": "Seu Premium foi reativado.",
    "restoreNotFound": "Nenhuma compra encontrada",
    "restoreNotFoundMessage": "Não encontramos uma compra anterior vinculada a esta conta.",
    "restoreError": "Erro",
    "restoreErrorMessage": "Não foi possível restaurar. Tente novamente."
  },
  "stats": {
    "kicker": "✦ seu progresso",
    "title": "Stats",
    "done": "feitas",
    "active": "ativas",
    "streak": "streak",
    "rate": "taxa",
    "byJar": "— por potinho"
  },
  "privacy": {
    "kicker": "✦ legal",
    "title": "Privacidade",
    "lastUpdated": "Última atualização: 11 de abril de 2026",
    "dataTitle": "Dados que coletamos",
    "dataBody": "O Potinho não coleta dados pessoais. Todas as suas tarefas, potinhos e configurações ficam armazenados exclusivamente no seu dispositivo e nunca são enviados a servidores nossos.",
    "adsTitle": "Anúncios",
    "adsBody": "Para usuários da versão gratuita, exibimos anúncios através do Google AdMob. O AdMob pode coletar seu identificador de publicidade (Advertising ID) para fins de personalização e medição. Usuários da versão premium não recebem anúncios e não têm qualquer dado coletado pelo AdMob.",
    "crashTitle": "Relatórios de erro",
    "crashBody": "Utilizamos o Sentry para receber relatórios automáticos de falhas do aplicativo. Esses relatórios incluem informações técnicas sobre o dispositivo (modelo, versão do Android) e o erro, mas não contêm dados pessoais.",
    "purchaseTitle": "Compras",
    "purchaseBody": "Compras são processadas diretamente pelo Google Play. Não temos acesso a dados de pagamento.",
    "contactTitle": "Contato",
    "contactBody": "Para dúvidas, envie e-mail para: potinho@gmail.com"
  },
  "streak": {
    "day_one": "{{count}} dia",
    "day_other": "{{count}} dias"
  },
  "jar": {
    "label": "Potinho com {{count}} tarefas",
    "imageLabel": "Potinho"
  },
  "error": {
    "title": "Opa, algo deu errado.",
    "body": "Reabra o app para tentar de novo."
  },
  "backup": {
    "exportSuccess": "Dados exportados!",
    "importTitle": "Importar dados",
    "importConfirm": "Isso vai substituir todos os seus dados atuais. Continuar?",
    "importCancel": "Cancelar",
    "importConfirmButton": "Importar",
    "importSuccess": "Dados importados com sucesso!",
    "importError": "Erro ao importar",
    "importInvalidFile": "Arquivo inválido. Selecione um backup do Potinho."
  },
  "common": {
    "close": "Fechar",
    "ad": "Anúncio"
  }
}
```

- [ ] **Step 3: Create English translation file**

Create `src/locales/en.json`:

```json
{
  "home": {
    "jarName": "✦ {{name}}",
    "title": "Potinho",
    "draw": "DRAW ✦",
    "drawing": "...",
    "addTask": "+ Add task",
    "empty": "— Empty, add something —",
    "taskCount_one": "— {{count}} thing to do —",
    "taskCount_other": "— {{count}} things to do —",
    "done": "Done! 🎉",
    "milestone": "{{count}} tasks completed! 🏆"
  },
  "onboarding": {
    "stepOne": "one",
    "stepTwo": "two",
    "stepThree": "three",
    "step": "step {{name}}",
    "title1": "Write down what's\nblocking you.",
    "body1": "Those little tasks floating in your head — toss them all into the jar.",
    "title2": "Let the\njar decide.",
    "body2": "Instead of choosing, draw randomly. Less paralysis, more action.",
    "title3": "Do one\nat a time.",
    "body3": "Mark it done and watch your streak grow. One day at a time.",
    "next": "Next →",
    "letsGo": "Let's go!",
    "firstTaskKicker": "✦ first task",
    "firstTaskTitle": "What have you\nbeen putting\noff?",
    "firstTaskBody": "It can be anything small. We start with just one.",
    "firstTaskPlaceholder": "E.g.: do the dishes",
    "start": "Start ✦",
    "progressDot": "Step {{current}} of 3"
  },
  "addTask": {
    "kicker": "✦ new note",
    "title": "Toss it in",
    "placeholder": "What's been blocking you?",
    "inputLabel": "Task text",
    "submit": "Add",
    "confirmation": "In the jar!"
  },
  "tasks": {
    "kicker": "✦ your stuff",
    "title": "Tasks",
    "tabActive": "In the jar",
    "tabDone": "Done",
    "emptyActive": "Nothing yet. Toss something in.",
    "emptyDone": "Your completed tasks will appear here.",
    "last7days": "Last 7 days — Premium unlocks all",
    "hiddenCount_one": "You have {{count}} more completed task.",
    "hiddenCount_other": "You have {{count}} more completed tasks.",
    "hiddenUpsell": "Premium unlocks the full history.",
    "seeMore": "See more →",
    "deleteTitle": "Remove task?",
    "deleteCancel": "Cancel",
    "deleteConfirm": "Remove",
    "saveEdit": "Save edit",
    "cancelEdit": "Cancel edit",
    "removeTask": "Remove task",
    "editTask": "Edit task"
  },
  "taskCard": {
    "doingNow": "✦ Doing now",
    "yourTask": "✦ Your task is",
    "finish": "Done",
    "giveUp": "Give up",
    "doIt": "Do it",
    "later": "Later",
    "doingLabel": "Task in progress: {{text}}",
    "drawnLabel": "Your task is: {{text}}"
  },
  "settings": {
    "kicker": "✦ settings",
    "title": "Settings",
    "sound": "Draw sound",
    "soundOn": "Sound on",
    "soundOff": "Sound off",
    "vibration": "Vibration",
    "vibrationOn": "Vibration on",
    "vibrationOff": "Vibration off",
    "premium": "✦ Go premium",
    "stats": "📊 Statistics",
    "privacy": "Privacy policy",
    "export": "Export data",
    "import": "Import data",
    "version": "potinho v1.0 ✦ made with love",
    "close": "Close"
  },
  "paywall": {
    "kicker": "✦ potinho premium ✦",
    "title": "Unlock\neverything.",
    "subtitle": "Your jar deserves more.",
    "benefit1": "No ads, ever",
    "benefit2": "Unlimited jars",
    "benefit3": "Extra visual themes",
    "benefit4": "Detailed statistics",
    "benefit5": "Unlimited history",
    "buyFor": "Buy for {{price}}",
    "buying": "...",
    "oneTime": "one-time purchase — no subscription",
    "unavailable": "purchases unavailable on this device",
    "notNow": "Not now",
    "restore": "Restore purchase",
    "restoring": "Restoring...",
    "purchaseHint": "One-time purchase",
    "successTitle": "Premium activated! 🎉",
    "successMessage": "Thank you for your support.",
    "failTitle": "Purchase not completed",
    "restoreSuccess": "Purchase restored!",
    "restoreSuccessMessage": "Your Premium has been reactivated.",
    "restoreNotFound": "No purchase found",
    "restoreNotFoundMessage": "We couldn't find a previous purchase linked to this account.",
    "restoreError": "Error",
    "restoreErrorMessage": "Could not restore. Please try again."
  },
  "stats": {
    "kicker": "✦ your progress",
    "title": "Stats",
    "done": "done",
    "active": "active",
    "streak": "streak",
    "rate": "rate",
    "byJar": "— by jar"
  },
  "privacy": {
    "kicker": "✦ legal",
    "title": "Privacy",
    "lastUpdated": "Last updated: April 11, 2026",
    "dataTitle": "Data we collect",
    "dataBody": "Potinho does not collect personal data. All your tasks, jars, and settings are stored exclusively on your device and are never sent to our servers.",
    "adsTitle": "Ads",
    "adsBody": "For free users, we show ads through Google AdMob. AdMob may collect your advertising identifier for personalization and measurement. Premium users don't see ads and have no data collected by AdMob.",
    "crashTitle": "Crash reports",
    "crashBody": "We use Sentry to receive automatic crash reports. These reports include technical device information (model, Android version) and the error, but contain no personal data.",
    "purchaseTitle": "Purchases",
    "purchaseBody": "Purchases are processed directly by Google Play. We don't have access to payment data.",
    "contactTitle": "Contact",
    "contactBody": "For questions, send an email to: potinho@gmail.com"
  },
  "streak": {
    "day_one": "{{count}} day",
    "day_other": "{{count}} days"
  },
  "jar": {
    "label": "Jar with {{count}} tasks",
    "imageLabel": "Jar"
  },
  "error": {
    "title": "Oops, something went wrong.",
    "body": "Reopen the app to try again."
  },
  "backup": {
    "exportSuccess": "Data exported!",
    "importTitle": "Import data",
    "importConfirm": "This will replace all your current data. Continue?",
    "importCancel": "Cancel",
    "importConfirmButton": "Import",
    "importSuccess": "Data imported successfully!",
    "importError": "Import error",
    "importInvalidFile": "Invalid file. Select a Potinho backup."
  },
  "common": {
    "close": "Close",
    "ad": "Ad"
  }
}
```

- [ ] **Step 4: Create i18n configuration**

Create `src/locales/index.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import pt from './pt.json';
import en from './en.json';

const deviceLang = getLocales()[0]?.languageCode ?? 'pt';

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  lng: deviceLang === 'en' ? 'en' : 'pt',
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
});

export default i18n;
```

- [ ] **Step 5: Add i18next mock for tests**

Update `jest.config.js` — add to `moduleNameMapper`:

```javascript
'^i18next$': '<rootDir>/__mocks__/i18next.ts',
'^react-i18next$': '<rootDir>/__mocks__/react-i18next.ts',
'^expo-localization$': '<rootDir>/__mocks__/expo-localization.ts',
```

Create `__mocks__/i18next.ts`:

```typescript
const i18n = {
  use: () => i18n,
  init: () => Promise.resolve(),
  t: (key: string) => key,
  language: 'pt',
};
export default i18n;
```

Create `__mocks__/react-i18next.ts`:

```typescript
export const useTranslation = () => ({
  t: (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`;
    return key;
  },
  i18n: { language: 'pt' },
});
export const initReactI18next = { type: '3rdParty', init: () => {} };
```

Create `__mocks__/expo-localization.ts`:

```typescript
export const getLocales = () => [{ languageCode: 'pt', languageTag: 'pt-BR' }];
```

- [ ] **Step 6: Run tests**

Run: `npx jest --no-cache`

Expected: All existing tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/locales/ __mocks__/i18next.ts __mocks__/react-i18next.ts __mocks__/expo-localization.ts jest.config.js package.json
git commit -m "feat: i18n setup with PT and EN translation files"
```

---

### Task 7: i18n — Wire Translations into Layout and Screens

**Files:**
- Modify: `app/_layout.tsx` (add i18n import)
- Modify: `app/index.tsx`
- Modify: `app/onboarding.tsx`
- Modify: `app/add-task.tsx`
- Modify: `app/tasks.tsx`
- Modify: `app/settings.tsx`
- Modify: `app/paywall.tsx`
- Modify: `app/stats.tsx`
- Modify: `app/privacy.tsx`
- Modify: `src/components/TaskCard.tsx`
- Modify: `src/components/Streak.tsx`
- Modify: `src/components/AdBanner.tsx`
- Modify: `src/components/ErrorBoundary.tsx`
- Modify: `src/components/Jar.tsx`
- Modify: `src/hooks/useDrawTask.ts`

- [ ] **Step 1: Import i18n in _layout.tsx**

Add at the top of `app/_layout.tsx`, right after `import '../global.css';`:

```typescript
import '@/locales';
```

- [ ] **Step 2: Wire translations into screens and components**

For each file, add `import { useTranslation } from 'react-i18next';` and replace hardcoded Portuguese strings with `t('key')` calls.

**Pattern:**
```typescript
// Before:
<Text>Sortear ✦</Text>

// After:
const { t } = useTranslation();
<Text>{t('home.draw')}</Text>
```

**For class components** (ErrorBoundary), use the HOC pattern or keep hardcoded since it's a crash screen.

**For hooks** (useDrawTask.ts), import `i18n` directly:

```typescript
import i18n from '@/locales';

// In the done() function:
if (milestone) {
  showCelebration(i18n.t('home.milestone', { count: milestone }));
} else {
  showCelebration(i18n.t('home.done'));
}
```

**For Jar.tsx** accessibility label:
```typescript
const { t } = useTranslation();
// ...
accessibilityLabel={t('jar.label', { count: taskCount })}
```

**For Streak.tsx:**
```typescript
const { t } = useTranslation();
// ...
{t('streak.day', { count })}
```

**For AdBanner.tsx:**
```typescript
const { t } = useTranslation();
// ...
accessibilityLabel={t('common.ad')}
```

- [ ] **Step 3: Run tests**

Run: `npx jest --no-cache`

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add app/ src/
git commit -m "feat: wire i18n translations into all screens and components"
```

---

### Task 8: Data Export/Import — Backup Service

**Files:**
- Modify: `package.json`
- Create: `src/services/backupService.ts`
- Create: `__tests__/services/backupService.test.ts`

- [ ] **Step 1: Install dependencies**

Run:
```bash
npx expo install expo-file-system expo-sharing expo-document-picker
```

- [ ] **Step 2: Write the failing test**

Create `__tests__/services/backupService.test.ts`:

```typescript
import { useAppStore } from '@/stores/appStore';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { buildExportData, validateBackup } from '@/services/backupService';

beforeEach(() => {
  useAppStore.getState().reset();
  useJarStore.getState().reset();
  useTaskStore.getState().reset();
});

describe('buildExportData', () => {
  it('exports current store state with version and timestamp', () => {
    useJarStore.getState().ensureDefault();
    const jar = useJarStore.getState().jars[0];
    useTaskStore.getState().addTask(jar.id, 'Test task');

    const data = buildExportData();

    expect(data.version).toBe(1);
    expect(data.exportedAt).toBeDefined();
    expect(data.jars).toHaveLength(1);
    expect(data.tasks).toHaveLength(1);
    expect(data.app.soundEnabled).toBe(true);
    expect(data.app.hapticsEnabled).toBe(true);
    expect(data.app.theme).toBe('default');
  });

  it('excludes session state from export', () => {
    const data = buildExportData();
    const app = data.app as Record<string, unknown>;

    expect(app.isPremium).toBeUndefined();
    expect(app.lastDrawId).toBeUndefined();
    expect(app.lastDrawAccepted).toBeUndefined();
    expect(app.drawsSinceLastInterstitial).toBeUndefined();
    expect(app.onboardingDone).toBeUndefined();
  });
});

describe('validateBackup', () => {
  it('accepts valid backup', () => {
    const data = buildExportData();
    expect(validateBackup(data)).toBe(true);
  });

  it('rejects missing version', () => {
    expect(validateBackup({ jars: [], tasks: [], app: {} })).toBe(false);
  });

  it('rejects wrong version', () => {
    expect(validateBackup({ version: 99, jars: [], tasks: [], app: {} })).toBe(false);
  });

  it('rejects non-array jars', () => {
    expect(validateBackup({ version: 1, jars: 'nope', tasks: [], app: {} })).toBe(false);
  });

  it('rejects non-array tasks', () => {
    expect(validateBackup({ version: 1, jars: [], tasks: null, app: {} })).toBe(false);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx jest __tests__/services/backupService.test.ts -v`

Expected: FAIL — `Cannot find module '@/services/backupService'`

- [ ] **Step 4: Implement backupService.ts**

Create `src/services/backupService.ts`:

```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import i18n from '@/locales';
import { useAppStore } from '@/stores/appStore';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';

export interface BackupData {
  version: number;
  exportedAt: string;
  app: {
    streak: { count: number; lastDrawDate: string };
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    theme: string;
  };
  jars: unknown[];
  tasks: unknown[];
}

export function buildExportData(): BackupData {
  const appState = useAppStore.getState();
  const jars = useJarStore.getState().jars;
  const tasks = useTaskStore.getState().tasks;

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: {
      streak: appState.streak,
      soundEnabled: appState.soundEnabled,
      hapticsEnabled: appState.hapticsEnabled,
      theme: appState.theme,
    },
    jars,
    tasks,
  };
}

export function validateBackup(data: unknown): data is BackupData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  if (d.version !== 1) return false;
  if (!Array.isArray(d.jars)) return false;
  if (!Array.isArray(d.tasks)) return false;
  return true;
}

export async function exportData(): Promise<void> {
  const data = buildExportData();
  const json = JSON.stringify(data, null, 2);
  const path = `${FileSystem.cacheDirectory}potinho-backup.json`;

  await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Potinho Backup' });
}

export async function importData(): Promise<boolean> {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });

  if (result.canceled || !result.assets?.[0]) return false;

  const uri = result.assets[0].uri;
  const content = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    Alert.alert(i18n.t('backup.importError'), i18n.t('backup.importInvalidFile'));
    return false;
  }

  if (!validateBackup(parsed)) {
    Alert.alert(i18n.t('backup.importError'), i18n.t('backup.importInvalidFile'));
    return false;
  }

  return new Promise((resolve) => {
    Alert.alert(
      i18n.t('backup.importTitle'),
      i18n.t('backup.importConfirm'),
      [
        { text: i18n.t('backup.importCancel'), style: 'cancel', onPress: () => resolve(false) },
        {
          text: i18n.t('backup.importConfirmButton'),
          style: 'destructive',
          onPress: () => {
            const appState = useAppStore.getState();
            appState.setTheme(parsed.app.theme);
            if (parsed.app.soundEnabled !== appState.soundEnabled) appState.toggleSound();
            if (parsed.app.hapticsEnabled !== appState.hapticsEnabled) appState.toggleHaptics();

            useJarStore.setState({ jars: parsed.jars as never[] });
            useTaskStore.setState({ tasks: parsed.tasks as never[] });

            resolve(true);
          },
        },
      ],
    );
  });
}
```

- [ ] **Step 5: Add mocks for expo modules**

Update `jest.config.js` — add to `moduleNameMapper`:

```javascript
'^expo-file-system$': '<rootDir>/__mocks__/empty.ts',
'^expo-sharing$': '<rootDir>/__mocks__/empty.ts',
'^expo-document-picker$': '<rootDir>/__mocks__/empty.ts',
```

- [ ] **Step 6: Run tests**

Run: `npx jest __tests__/services/backupService.test.ts -v`

Expected: All 5 tests PASS.

- [ ] **Step 7: Run all tests**

Run: `npx jest --no-cache`

Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/services/backupService.ts __tests__/services/backupService.test.ts jest.config.js package.json
git commit -m "feat: backup service with export/import and validation"
```

---

### Task 9: Data Export/Import — Settings UI

**Files:**
- Modify: `app/settings.tsx`

- [ ] **Step 1: Add export and import rows to settings**

Add imports at the top of `app/settings.tsx`:

```typescript
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { exportData, importData } from '@/services/backupService';
```

Add two new `Row` items after the privacy row:

```typescript
<Row
  label={t('settings.export')}
  right={<Text className="text-ink-soft" style={{ fontSize: 20 }}>↗</Text>}
  onPress={() => {
    exportData().catch(() => {});
  }}
/>

<Row
  label={t('settings.import')}
  right={<Text className="text-ink-soft" style={{ fontSize: 20 }}>↙</Text>}
  onPress={async () => {
    const imported = await importData();
    if (imported) {
      Alert.alert(t('backup.importSuccess'));
    }
  }}
/>
```

- [ ] **Step 2: Commit**

```bash
git add app/settings.tsx
git commit -m "feat: export and import data buttons in settings"
```

---

### Task 10: Final Verification

- [ ] **Step 1: Run all tests**

Run: `npx jest --no-cache`

Expected: All tests pass.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`

Expected: No type errors.

- [ ] **Step 3: Verify Expo build config**

Run: `npx expo config --type public`

Expected: Config outputs without errors, shows Firebase plugin.

- [ ] **Step 4: Commit any final fixes if needed**

```bash
git add -A
git commit -m "chore: final verification and fixes"
```
