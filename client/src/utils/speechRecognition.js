/**
 * Browser Speech Recognition and Speech Synthesis Utility
 * Provides cross-browser voice input and output with robust error handling and fallbacks.
 */

export const isSpeechRecognitionSupported = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const isSpeechSynthesisSupported = () => {
  if (typeof window === 'undefined') return false;
  return Boolean('speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined');
};

/**
 * Text-to-Speech: Speaks the question aloud using browser speech synthesis
 */
export const speakQuestionAloud = (text, { onStart, onEnd, onError } = {}) => {
  if (!isSpeechSynthesisSupported() || !text) {
    if (onEnd) onEnd();
    return null;
  }

  try {
    // Cancel any previous in-flight utterance
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices() || [];
    const preferredVoice =
      voices.find(
        (v) =>
          (v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Samantha') ||
            v.name.includes('David') ||
            v.name.includes('Jenny')) &&
          v.lang.startsWith('en')
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      // Ignore normal interruptions/cancellations
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.warn('SpeechSynthesis error:', e.error);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    console.error('Failed to trigger speech synthesis:', err);
    if (onEnd) onEnd();
    return null;
  }
};

/**
 * Cancels any active speech synthesis
 */
export const cancelSpeechSynthesis = () => {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // safe fallback
    }
  }
};

/**
 * Voice Recognition Controller managing continuous microphone input
 */
export class VoiceRecognitionController {
  constructor({ onTranscriptUpdate, onStateChange, onError } = {}) {
    this.recognition = null;
    this.isListening = false;
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onStateChange = onStateChange;
    this.onError = onError;
    this.shouldKeepListening = false;

    if (isSpeechRecognitionSupported()) {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      try {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.onStateChange) this.onStateChange('listening');
        };

        this.recognition.onresult = (event) => {
          let currentInterim = '';
          const startIndex =
            typeof event.resultIndex === 'number' && event.resultIndex < event.results.length
              ? event.resultIndex
              : 0;

          for (let i = startIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            const transcript = item[0]?.transcript || '';
            if (item.isFinal) {
              const trimmed = transcript.trim();
              if (trimmed) {
                this.finalTranscript += (this.finalTranscript ? ' ' : '') + trimmed;
              }
            } else {
              currentInterim += transcript;
            }
          }

          this.interimTranscript = currentInterim;
          const fullText = (
            this.finalTranscript + (this.interimTranscript ? ' ' + this.interimTranscript : '')
          ).trim();

          if (this.onTranscriptUpdate) {
            this.onTranscriptUpdate({
              final: this.finalTranscript,
              interim: this.interimTranscript,
              fullText,
            });
          }
        };

        this.recognition.onerror = (event) => {
          // 'no-speech' is a normal silence interval, do not treat as fatal error
          if (event.error === 'no-speech') return;

          let friendlyMessage = 'Microphone speech recognition error.';
          if (event.error === 'not-allowed') {
            friendlyMessage = 'Microphone permission was denied. Please allow microphone access or use manual input.';
          } else if (event.error === 'network') {
            friendlyMessage = 'Speech recognition network error. Check your connection or type your response.';
          } else if (event.error === 'audio-capture') {
            friendlyMessage = 'No microphone was detected. Please check your audio input device.';
          }

          if (this.onError) {
            this.onError({
              type: event.error,
              message: friendlyMessage,
            });
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.shouldKeepListening) {
            // Automatically restart if user hasn't explicitly stopped or submitted
            try {
              this.recognition.start();
            } catch {
              if (this.onStateChange) this.onStateChange('idle');
            }
          } else {
            if (this.onStateChange) this.onStateChange('idle');
          }
        };
      } catch (err) {
        console.error('Failed to initialize SpeechRecognition:', err);
      }
    }
  }

  /**
   * Start listening for voice input
   */
  start(initialText = '') {
    if (!this.recognition) return false;
    this.finalTranscript = initialText;
    this.interimTranscript = '';
    this.shouldKeepListening = true;

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      // If already started or restarting
      return true;
    }
  }

  /**
   * Stop listening (user manually stopped or submitted)
   */
  stop() {
    this.shouldKeepListening = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // safe fallback
      }
    }
    this.isListening = false;
  }

  /**
   * Immediate hard cancel / abort (e.g. before AI speaks)
   */
  abort() {
    this.shouldKeepListening = false;
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // safe fallback
      }
    }
    this.isListening = false;
  }

  /**
   * Overwrite current transcript (e.g., from manual edit or clearing)
   */
  setTranscript(text) {
    this.finalTranscript = text;
    this.interimTranscript = '';
    if (this.onTranscriptUpdate) {
      this.onTranscriptUpdate({
        final: this.finalTranscript,
        interim: '',
        fullText: this.finalTranscript,
      });
    }
  }

  /**
   * Clear all transcripts
   */
  clear() {
    this.finalTranscript = '';
    this.interimTranscript = '';
    if (this.onTranscriptUpdate) {
      this.onTranscriptUpdate({
        final: '',
        interim: '',
        fullText: '',
      });
    }
  }
}

export default {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakQuestionAloud,
  cancelSpeechSynthesis,
  VoiceRecognitionController,
};
