import { useEffect, useRef, useState } from 'react';

interface RealtimeSpeechOptions {
  /**
   * autoRestart:
   * - true  → mic otomatis hidup lagi setelah selesai bicara (realtime)
   * - false → one-shot (sekali bicara)
   */
  autoRestart?: boolean;
}

export function useSpeechRecognition(
  onText: (text: string) => Promise<void> | void,
  options: RealtimeSpeechOptions = { autoRestart: true }
) {
  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef(false);

  const [listening, setListening] = useState(false);

  // =========================
  // CREATE RECOGNITION
  // =========================
  const createRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this environment');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.continuous = false; // browser lebih stabil false

    recognition.onresult = async (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript && transcript.trim()) {
        await onText(transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('SpeechRecognition error:', event.error);

      if (event.error === 'network') {
        // Electron limitation → jangan matikan app
        setListening(false);
        return;
      }

      setListening(false);
    };

    recognition.onend = () => {
      // 🔥 realtime restart logic
      if (
        options.autoRestart &&
        !isManuallyStoppedRef.current
      ) {
        recognition.start();
      } else {
        setListening(false);
      }
    };

    return recognition;
  };

  // =========================
  // START LISTENING
  // =========================
  const start = () => {
    isManuallyStoppedRef.current = false;

    recognitionRef.current?.stop();
    recognitionRef.current = createRecognition();

    if (!recognitionRef.current) return;

    recognitionRef.current.start();
    setListening(true);
  };

  // =========================
  // STOP LISTENING
  // =========================
  const stop = () => {
    isManuallyStoppedRef.current = true;

    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  };

  // =========================
  // CLEANUP
  // =========================
  useEffect(() => {
    return () => {
      isManuallyStoppedRef.current = true;
      recognitionRef.current?.stop();
    };
  }, []);

  return {
    start,
    stop,
    listening,
  };
}
