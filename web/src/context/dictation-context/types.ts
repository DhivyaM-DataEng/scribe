import { Microphone, MicrophoneList, MicrophoneProperties } from '@/utils/speech';

export interface DictationContextType {
  currentText: string;
  microphones: MicrophoneList;
  selectedMic: Microphone[MicrophoneProperties.DEVICE_ID];
  isTranscribing: boolean;
  startContinuousDictation: () => void;
  stopDictation: () => void;
  updateSelectedMic: (_value: string) => void;
  getMicrophones: () => void;
}
