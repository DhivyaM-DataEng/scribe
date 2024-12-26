import { useContext, useState } from 'react';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';

import { NoteContext } from '@/context/note-context/NoteContext';
import { AvailableNoteTemplateNames } from '@/types';
import { generateSOAPNotes } from '@/utils/prompt';

import ControlCard from './ControlCard';

export default function ClinicalNoteControls() {
  const [selectedNoteTemplate, setSelectedNoteTemplate] = useState<AvailableNoteTemplateNames>(
    AvailableNoteTemplateNames.GENERIC,
  );

  const availableNoteTemplates = Object.values(AvailableNoteTemplateNames);

  const {
    isGeneratingClinicalNote,
    updateIsGeneratingClinicalNote,
    selectedLanguage,
    startTime,
    endTime,
    noteText,
    updateSoapText,
  } = useContext(NoteContext);

  const handleAIGenerate = async () => {
    if (noteText === '') {
      console.log('No text to generate SOAP note');
      alert('No text to generate SOAP note');
    } else {
      updateIsGeneratingClinicalNote(true);
      console.log('Generating SOAP note from text');

      updateSoapText('Generating the note. Please wait...');
      const soap_note = await generateSOAPNotes({
        transcription: noteText,
        language: selectedLanguage,
        startTime,
        endTime,
        template: selectedNoteTemplate,
      });
      updateSoapText(soap_note);

      updateIsGeneratingClinicalNote(false);
    }
  };

  const handleNoteTemplateChange = (event: SelectChangeEvent<AvailableNoteTemplateNames>) => {
    event.preventDefault();
    setSelectedNoteTemplate(() => event.target.value as AvailableNoteTemplateNames);
  };

  return (
    <ControlCard
      title="Clinical Note Options"
      actionButton={
        <Tooltip
          title={!noteText.trim() ? 'Transcript must not be empty' : 'AI Generate SOAP'}
          arrow
        >
          <span style={{ width: '100%' }}>
            <Button
              variant="contained"
              disabled={isGeneratingClinicalNote || !noteText.trim()}
              color={isGeneratingClinicalNote ? 'warning' : 'primary'}
              onClick={handleAIGenerate}
              endIcon={<KeyboardArrowRightIcon />}
              fullWidth={true}
            >
              AI Generate
            </Button>
          </span>
        </Tooltip>
      }
    >
      <FormControl size="small">
        <InputLabel id="style-select-label">Note Template</InputLabel>
        <Select
          labelId="template-select-label"
          id="template-select"
          value={selectedNoteTemplate}
          onChange={handleNoteTemplateChange}
          size="small"
          fullWidth={true}
          disabled={isGeneratingClinicalNote}
          label="Note Template"
        >
          {availableNoteTemplates.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ControlCard>
  );
}
