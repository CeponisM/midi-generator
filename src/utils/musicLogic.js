import * as Scale from "tonal-scale";
import { get as getChord } from '@tonaljs/chord';
import { fromRomanNumerals } from '@tonaljs/progression';
import { names as getRomanNumeralNames } from 'tonal-roman-numeral';
import MidiWriter from 'midi-writer-js';

// Define a set of possible chord progressions
const romanNumeralNames = getRomanNumeralNames();
const possibleProgressions = romanNumeralNames.map(name => [name + 'Maj7', name + 'm7', name + '7']);

// Define a set of possible rhythm styles
const rhythms = ['4', '8', '16', '32'];

export const generateMIDIFile = (key, style, length) => {
  let scaleType = style.toLowerCase(); // Set scaleType to the style parameter

  // Generate the scale notes
  const scaleNotes = Scale.notes(key, scaleType).map(note => note + '4'); // Transpose to the desired key and add octave

  console.log('Scale Notes:', scaleNotes);

  // Create a new track with midi-writer-js
  const track = new MidiWriter.Track();

  // Randomly select a chord progression from the possible progressions
  const romanNumeralProgression = possibleProgressions[Math.floor(Math.random() * possibleProgressions.length)];

  // Convert the Roman numeral progression to actual chords based on the key
  const chordProgression = fromRomanNumerals(key, romanNumeralProgression);

  // Ensure that the progression starts on the root note
  chordProgression.unshift(key + scaleType);

// Assume a 4/4 time signature
const beatsPerMeasure = 4;

// Calculate the total number of beats for the desired length in measures
const totalBeats = length * beatsPerMeasure;

// For each chord in the progression
for (let i = 0; i < totalBeats; i++) {
  // Get the notes of the chord
  const chordName = chordProgression[i % chordProgression.length];
  const chordNotes = getChord(chordName).notes.map(note => note + '4');

  // Add a lower bass part for the chord
  const bassNote = chordNotes[0]; // Take the root note as the bass note
  let bassNoteOctave;
  if (bassNote.length === 3) {
    // If the note has a sharp or flat
    bassNoteOctave = parseInt(bassNote.charAt(2));
  } else {
    // If the note does not have a sharp or flat
    bassNoteOctave = parseInt(bassNote.charAt(1));
  }
  console.log(bassNoteOctave);

  const bassNoteAdjustedOctave = bassNote.charAt(0) + bassNoteOctave; // Adjusted octave for the bass

  // Add all notes of the chord (including bass note) as a single event to create a polyphonic sound
  const chordNotesWithBass = [...chordNotes, bassNoteAdjustedOctave];

  // Create a new note event with a duration of one beat ("1")
  const noteEvent = new MidiWriter.NoteEvent({ pitch: chordNotesWithBass, duration: '1' });

  console.log('Note Event:', noteEvent);

  track.addEvent(noteEvent);
}

// Ensure that the first note of the MIDI file is the root note of the key
const rootNoteEvent = new MidiWriter.NoteEvent({ pitch: [key + '4'], duration: '1' });
track.events.unshift(rootNoteEvent);

// Create a data URI for the MIDI file
const writer = new MidiWriter.Writer([track]);
const midiDataUri = writer.dataUri();

console.log('MIDI Data URI:', midiDataUri);

return midiDataUri;
};