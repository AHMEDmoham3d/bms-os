import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeechState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
}

export const useSpeechRecognition = (lang: string = 'ar-SA') => {
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    transcript: '',
    isSupported: false,
    error: null,
  });
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const isSupported = !!SpeechRecognitionAPI;
    
    setState(prev => ({ ...prev, isSupported }));
    
    if (isSupported) {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = lang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setState({ isListening: true, transcript: '', isSupported, error: null });
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = state.transcript;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        setState(prev => ({ ...prev, transcript: finalTranscript + interimTranscript }));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        let errorMsg = 'خطأ في التعرف على الصوت';
        if (event.error === 'not-allowed') {
          errorMsg = 'السماح بالميكروفون مطلوب';
        } else if (event.error === 'no-speech') {
          errorMsg = 'لم يتم اكتشاف كلام';
        }
        setState(prev => ({ ...prev, isListening: false, error: errorMsg }));
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [lang, state.transcript]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      recognitionRef.current.start();
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const insertText = (text: string, editableRef: React.RefObject<HTMLDivElement>) => {
    if (editableRef.current) {
      editableRef.current.focus();
      document.execCommand('insertText', false, text);
    }
  };

  return {
    ...state,
    startListening,
    stopListening,
    insertText,
    clearTranscript: () => setState(prev => ({ ...prev, transcript: '' })),
  };
};

