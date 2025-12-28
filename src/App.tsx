import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { GameScreen } from '@/components/GameScreen';
import { ArsenalScreen } from '@/components/ArsenalScreen';
import { LiftScreen } from '@/components/LiftScreen';
import { VictoryScreen } from '@/components/VictoryScreen';
import { DeathScreen } from '@/components/DeathScreen';
import { SettingsScreen } from '@/components/SettingsScreen';

function App() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const [showSettings, setShowSettings] = useState(false);

  useKeyboard();

  return (
    <>
      <GameScreen onOpenSettings={() => setShowSettings(true)} />

      {currentScreen === 'arsenal' && <ArsenalScreen />}
      {currentScreen === 'lift' && <LiftScreen />}
      {currentScreen === 'victory' && <VictoryScreen />}
      {currentScreen === 'death' && <DeathScreen />}
      {showSettings && <SettingsScreen onClose={() => setShowSettings(false)} />}
    </>
  );
}

export default App;
