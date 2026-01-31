import { useEffect, useState } from 'react';

export default function Translate() {
  const [text, setText] = useState('');

  useEffect(() => {
    console.log('[popup] mounted');

    if (!window.system?.onSetText) {
      console.warn('[popup] preload not ready');
      console.log('off');

      return;
    }

    const off = window.system.onSetText((value) => {
      console.log('[popup] received:', value);
      setText(value);
    });
    console.log('off', off);
    return off;
  }, []);
  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        padding: '12px',
        borderRadius: '10px',
        fontSize: '13px',
        maxWidth: '340px',
        pointerEvents: 'none',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      {text || 'Translating…'}
    </div>
  );
}
