import { registerSW } from 'virtual:pwa-register';

type UpdateFn = (reloadPage?: boolean) => Promise<void>;
type ChangeListener = () => void;

export class ClassSw {
  private updateSW: UpdateFn | null = null;

  private valueIsUpdateAvailable = false;
  private valueIsOfflineReady = false;
  private valueIsNeedRefresh = false;
  private valueNewVersion: string | null = null;

  private listeners: ChangeListener[] = [];

  init(options?: { immediate?: boolean }) {
    if (this.updateSW) return;

    this.updateSW = registerSW({
      immediate: options?.immediate,
      onNeedRefresh: () => void this.handleNeedRefresh(),
      onOfflineReady: () => void this.handleOfflineReady(),
    });
  }

  async updateApp(reloadPage = true) {
    try {
      if (typeof this.updateSW === 'function') {
        await this.updateSW(reloadPage);
      }
    } catch {
      console.warn('updateSW() called before SW initialized');
    }
  }

  get isUpdateAvailable() {
    return this.valueIsUpdateAvailable;
  }

  get isOfflineReady() {
    return this.valueIsOfflineReady;
  }

  get isNeedRefresh() {
    return this.valueIsNeedRefresh;
  }

  get newVersion() {
    return this.valueNewVersion;
  }

  subscribe(cb: ChangeListener) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch {
        /* ignore listener errors */
      }
    });
  }

  private async handleNeedRefresh() {
    // помечаем, что есть новая версия для апдейта
    this.valueIsUpdateAvailable = true;
    this.notify();

    try {
      const res = await fetch('/build-info.txt');
      const text = await res.text();
      const versionLine = text.split('\n').find((l) => l.startsWith('version:'));
      const version = versionLine?.split(':')[1].trim() ?? 'unknown';
      this.valueNewVersion = version;
      this.valueIsNeedRefresh = true;
    } catch {
      this.valueNewVersion = 'unknown';
      this.valueIsNeedRefresh = true;
    }

    this.notify();
  }

  private handleOfflineReady() {
    this.valueIsOfflineReady = true;
    this.valueIsNeedRefresh = false;
    this.notify();
  }
}
