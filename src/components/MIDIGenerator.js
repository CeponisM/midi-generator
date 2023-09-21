import React, { useState } from 'react';
import { generateMIDIFile } from '../utils/musicLogic';

const Dropdown = ({ id, label, options, setSelected }) => {
  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <div className="dropdown">
      <label htmlFor={id}>{label}</label>
      <select id={id} onChange={handleChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const MIDIGenerator = () => {
  const [key, setKey] = useState('C');
  const [style, setStyle] = useState('Major');
  const [length, setLength] = useState('8');

  const handleGenerateMIDI = () => {
    const midiDataUri = generateMIDIFile(key, style, length);
    if (!midiDataUri) {
      alert('Failed to generate MIDI file. Please check the console for more details.');
      return;
    }

    const a = document.createElement('a');
    a.href = midiDataUri;
    a.download = 'generated-midi-file.mid';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      {/* Key Dropdown */}
      <Dropdown
        id="key"
        label="Select Key:"
        options={['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']}
        setSelected={setKey}
      />
      {/* Style Dropdown */}
      <Dropdown
        id="style"
        label="Select Scale Type:"
        options={['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian', 'Harmonic Minor']}
        setSelected={setStyle}
      />
      {/* Length Dropdown */}
      <Dropdown
        id="length"
        label="Select Bar Length:"
        options={[...Array(16).keys()].map((i) => i + 1)}
        setSelected={setLength}
      />
      <button onClick={handleGenerateMIDI}>Generate MIDI</button>
    </div>
  );
};

export default MIDIGenerator;
