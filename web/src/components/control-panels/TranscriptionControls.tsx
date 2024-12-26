import { useContext, useState } from 'react';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { DictationContext } from '@/context/dictation-context/DictationContext';
import { NoteContext } from '@/context/note-context/NoteContext';
import { SupportedLanguages } from '@/context/note-context/types';

import ConsentModal from '../modals/ConsentModal';
import ControlCard from './ControlCard';

export default function TranscriptionControls() {
  const truncate = useMediaQuery('(max-width: 410px)');
  const truncateXs = useMediaQuery('(max-width: 340px)');
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const { isGeneratingClinicalNote, selectedLanguage, updateSelectedLanguage } =
    useContext(NoteContext);

  const {
    microphones,
    selectedMic,
    isTranscribing,
    startContinuousDictation,
    stopDictation,
    updateSelectedMic,
    getMicrophones,
  } = useContext(DictationContext);

  const defaultLanguages = Object.values(SupportedLanguages);

  const handleMicButtonClick = () => {
    if (isTranscribing) {
      stopDictation();
    } else {
      toggleConsentModal();
    }
  };

  const toggleConsentModal = () => {
    setConsentModalOpen(!consentModalOpen);
  };

  return (
    <>
      <ConsentModal
        isOpen={consentModalOpen}
        toggleModal={toggleConsentModal}
        startRecording={startContinuousDictation}
      />
      <ControlCard
        title="Transcription Options"
        actionButton={
          <Tooltip
            title={!selectedMic ? 'Select a microphone' : isTranscribing ? 'Stop' : 'Start'}
            arrow
          >
            <span style={{ width: '100%' }}>
              <Button
                variant="contained"
                color={isTranscribing ? 'warning' : 'primary'}
                startIcon={isTranscribing ? <MicOffIcon /> : <MicIcon />}
                onClick={handleMicButtonClick}
                fullWidth={true}
                disabled={selectedMic ? false : true}
              >
                {isTranscribing ? 'Stop Listening' : 'Start Listening'}
              </Button>
            </span>
          </Tooltip>
        }
      >
        <>
          <FormControl
            size="small"
            sx={{
              minWidth: '9rem',
              width: '100%',
            }}
          >
            <InputLabel id="microphone-select-label">Microphone</InputLabel>
            <Select
              labelId="microphone-select-label"
              id="microphone-select"
              value={selectedMic}
              onChange={(event) => {
                if (microphones.length === 0) {
                  return;
                }
                updateSelectedMic(event.target.value);
              }}
              onOpen={() => {
                getMicrophones();
              }}
              size="small"
              disabled={isTranscribing || isGeneratingClinicalNote}
              label="Microphone"
              fullWidth={true}
            >
              {microphones.length > 0 &&
                microphones.map((mic) => (
                  <MenuItem key={mic.deviceId} value={mic.deviceId}>
                    <Typography
                      width={truncateXs ? '10rem' : truncate ? '12.5rem' : '100%'}
                      noWrap
                      overflow="ellipsis"
                    >
                      {mic.label || mic.deviceId}
                    </Typography>
                  </MenuItem>
                ))}
              {microphones.length <= 0 && (
                <Tooltip title="Have you allowed permission?">
                  <span>
                    <MenuItem disabled key="no-mic" value="">
                      <Typography fontStyle="italic">No microphones found.</Typography>
                    </MenuItem>
                  </span>
                </Tooltip>
              )}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={selectedLanguage}
              onChange={(event) => {
                updateSelectedLanguage(event.target.value as SupportedLanguages);
              }}
              size="small"
              fullWidth={true}
              disabled={isTranscribing || isGeneratingClinicalNote}
              label="Language"
            >
              {defaultLanguages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      </ControlCard>
    </>
  );
}
