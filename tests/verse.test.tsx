import '../jest.setup';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Verse from '../src/components/verse';
import { SettingsContextProvider, SettingsContext, DEVANAGARI_MODE } from '../src/components/settingsPanel';

const mockWordByWord = [
  [
    ['dharma', 'duty', 'dharma', 'Nominative Singular Masculine'],
    ['karma', 'action', 'karma', 'Nominative Singular Masculine'],
    ['|', null, null, null],
  ],
];

const mockVerse = {
  text: 'dharma karma',
  wordByWord: mockWordByWord,
  translation: 'Duty and action',
};

const renderVerse = (contextValue?: Partial<React.Context<typeof SettingsContext>>) => {
  return render(
    <SettingsContextProvider>
      <Verse {...mockVerse} />
    </SettingsContextProvider>
  );
};

describe('Verse component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders verse text in Devanagari', () => {
    renderVerse();
    expect(screen.getByText('धर्म कर्म')).toBeInTheDocument();
  });

  it('shows word-by-word when clicked', () => {
    renderVerse();
    const verseText = screen.getByText('धर्म कर्म');
    fireEvent.click(verseText);
    expect(screen.getByText('duty')).toBeInTheDocument();
    expect(screen.getByText('action')).toBeInTheDocument();
  });

  it('has clickable text with proper role', () => {
    renderVerse();
    const verseText = screen.getByRole('button', { name: /धर्म कर्म/ });
    expect(verseText).toBeInTheDocument();
  });

  it('supports keyboard activation', () => {
    renderVerse();
    const verseText = screen.getByRole('button', { name: /धर्म कर्म/ });
    fireEvent.keyDown(verseText, { key: 'Enter' });
    expect(screen.getByText('duty')).toBeInTheDocument();
  });
});