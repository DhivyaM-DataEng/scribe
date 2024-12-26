import { useContext } from 'react';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button, Tooltip } from '@mui/material';

import { NoteContext } from '@/context/note-context/NoteContext';
import { generateHandout } from '@/utils/prompt';

import ControlCard from './ControlCard';

export default function PatientHandoutControls() {
  const {
    soapText,
    selectedLanguage,
    isGeneratingPatientHandout,
    updateIsGeneratingPatientHandout,
    updateHandoutText,
  } = useContext(NoteContext);

  const handleAIHandoutGenerate = async () => {
    if (!soapText) {
      console.log('No SOAP text to generate Handout');
      alert('No text to generate Handout');
    } else {
      updateIsGeneratingPatientHandout(true);
      console.log('Generating Handout from text');

      updateHandoutText('Generating the Handout.Please wait...');
      const handout = await generateHandout(soapText, selectedLanguage);
      updateHandoutText(handout);

      updateIsGeneratingPatientHandout(false);
    }
  };

  return (
    <ControlCard
      title="Patient Handout Options"
      actionButton={
        <Tooltip title={!soapText ? 'Clinical note must not be empty' : 'Generate Handout'} arrow>
          <span style={{ width: '100%' }}>
            <Button
              variant="contained"
              sx={{ alignSelf: 'center', marginLeft: 'auto' }}
              disabled={isGeneratingPatientHandout || !soapText}
              color={isGeneratingPatientHandout ? 'warning' : 'primary'}
              onClick={handleAIHandoutGenerate}
              endIcon={<KeyboardArrowRightIcon />}
              fullWidth={true}
            >
              Generate Handout
            </Button>
          </span>
        </Tooltip>
      }
    >
      <></>
    </ControlCard>
  );
}
