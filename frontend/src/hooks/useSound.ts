import { useCallback, useRef, useEffect } from 'react';

interface SoundOptions {
  volume?: number;
  playbackRate?: number;
}

export type SoundType = 
  | 'click'
  | 'hover'
  | 'success'
  | 'error'
  | 'levelUp'
  | 'collect'
  | 'battle'
  | 'mint'
  | 'ambient';

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('soundEnabled');
      this.enabled = stored !== 'false';
      const storedVolume = localStorage.getItem('soundVolume');
      this.volume = storedVolume ? parseFloat(storedVolume) : 0.5;
    }
  }

  preload(type: SoundType, url: string) {
    if (this.sounds.has(type)) return;
    
    const audio = new Audio(url);
    audio.preload = 'auto';
    audio.volume = this.volume;
    this.sounds.set(type, audio);
  }

  play(type: SoundType, options?: SoundOptions) {
    if (!this.enabled) return;

    const audio = this.sounds.get(type);
    if (!audio) return;

    try {
      audio.currentTime = 0;
      audio.volume = options?.volume ?? this.volume;
      audio.playbackRate = options?.playbackRate ?? 1;
      audio.play().catch(() => {});
    } catch (error) {}
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('soundVolume', this.volume.toString());
    this.sounds.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('soundEnabled', enabled.toString());
  }

  getEnabled() {
    return this.enabled;
  }

  getVolume() {
    return this.volume;
  }
}

const soundManager = new SoundManager();

export const useSound = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    soundManager.preload('click', '/sounds/click.mp3');
    soundManager.preload('hover', '/sounds/hover.mp3');
    soundManager.preload('success', '/sounds/success.mp3');
    soundManager.preload('error', '/sounds/error.mp3');
    soundManager.preload('levelUp', '/sounds/levelup.mp3');
    soundManager.preload('collect', '/sounds/collect.mp3');
    soundManager.preload('battle', '/sounds/battle.mp3');
    soundManager.preload('mint', '/sounds/mint.mp3');
  }, []);

  const playSound = useCallback((type: SoundType, options?: SoundOptions) => {
    soundManager.play(type, options);
  }, []);

  const setVolume = useCallback((volume: number) => {
    soundManager.setVolume(volume);
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    soundManager.setEnabled(enabled);
  }, []);

  const getEnabled = useCallback(() => {
    return soundManager.getEnabled();
  }, []);

  const getVolume = useCallback(() => {
    return soundManager.getVolume();
  }, []);

  return {
    playSound,
    setVolume,
    setEnabled,
    getEnabled,
    getVolume,
  };
};
