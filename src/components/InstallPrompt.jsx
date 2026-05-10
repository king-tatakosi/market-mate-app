import { useState, useEffect } from 'react';

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone =
  window.navigator.standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches;

export function InstallPrompt() {
  const [androidPrompt, setAndroidPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    const ts = localStorage.getItem('install-dismissed');
    if (!ts) return false;
    return Date.now() - parseInt(ts, 10) < 30 * 24 * 60 * 60 * 1000;
  });

  useEffect(() => {
    if (isIOS) return;
    const handler = e => {
      e.preventDefault();
      setAndroidPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isStandalone || dismissed) return null;
  if (!isIOS && !androidPrompt) return null;

  const installAndroid = async () => {
    androidPrompt.prompt();
    const { outcome } = await androidPrompt.userChoice;
    if (outcome === 'accepted') setAndroidPrompt(null);
    else dismiss();
  };

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('install-dismissed', Date.now().toString());
  };

  return (
    <div className="install-banner">
      <div className="install-banner__icon">📲</div>
      <div className="install-banner__text">
        {isIOS ? (
          <>
            <strong>Add VendaPal to your home screen</strong>
            <span>Tap the <strong>Share</strong> button then <strong>Add to Home Screen</strong></span>
          </>
        ) : (
          <>
            <strong>Add VendaPal to your phone</strong>
            <span>Use it anytime, even without internet</span>
          </>
        )}
      </div>
      <div className="install-banner__actions">
        {isIOS ? (
          <button className="btn btn--ghost btn--sm" onClick={dismiss}>Got it</button>
        ) : (
          <>
            <button className="btn btn--primary btn--sm" onClick={installAndroid}>Install</button>
            <button className="btn btn--ghost btn--sm" onClick={dismiss}>Later</button>
          </>
        )}
      </div>
    </div>
  );
}
