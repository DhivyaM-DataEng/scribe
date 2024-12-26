export enum SupportedLanguages {
  EN = 'en-CA',
  FR = 'fr-CA',
}

export enum NoteTextNames {
  NOTE = 'noteText',
  SOAP = 'soapText',
  HANDOUT = 'handoutText',
}

export interface NoteContextType {
  selectedLanguage: SupportedLanguages;
  startTime: Date | null;
  endTime: Date | null;
  [NoteTextNames.NOTE]: string;
  [NoteTextNames.SOAP]: string;
  [NoteTextNames.HANDOUT]: string;
  isGeneratingClinicalNote: boolean;
  isGeneratingPatientHandout: boolean;
  updateSelectedLanguage: (_value: SupportedLanguages) => void;
  updateStartTime: (_value: Date) => void;
  updateEndTime: (_value: Date) => void;
  updateNoteText: (_value: string) => void;
  addNoteText: (_value: string) => void;
  updateSoapText: (_value: string) => void;
  updateHandoutText: (_value: string) => void;
  updateIsGeneratingClinicalNote: (_value: boolean) => void;
  updateIsGeneratingPatientHandout: (_value: boolean) => void;
  clearAllText: () => void;
}
