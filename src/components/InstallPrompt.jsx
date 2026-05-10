import { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('install-dismissed') === '1'
  );

  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!prompt || dismissed) return null;

  const install = async () => {
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setPrompt(null);
    else dismiss();
  };

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('install-dismissed', '1');
  };

  return (
    <div className="install-banner">
      <div className="install-banner__icon">📲</div>
      <div className="install-banner__text">
        <strong>Add VendaPal to your phone</strong>
        <span>Use it anytime, even without internet</span>
      </div>
      <div className="install-banner__actions">
        <button className="btn btn--primary btn--sm" onClick={install}>Install</button>
        <button className="btn btn--ghost btn--sm" onClick={dismiss}>Later</button>
      </div>
    </div>
  );
}
