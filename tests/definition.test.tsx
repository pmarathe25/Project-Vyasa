import '../jest.setup';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Definition from '../src/components/definition';
import { SettingsContextProvider } from '../src/components/settingsPanel';

const renderDefinition = (word: string) => {
  return render(
    <SettingsContextProvider>
      <Definition word={word} />
    </SettingsContextProvider>
  );
};

describe('Definition component', () => {
  it('renders nothing for unknown words', () => {
    renderDefinition('unknown_word_xyz');
    expect(screen.queryByText('unknown_word_xyz')).not.toBeInTheDocument();
  });

  it('renders definition for known words', () => {
    renderDefinition('dharma');
    expect(screen.getByText(/right|justice|moral|duty/)).toBeInTheDocument();
  });

  it('renders root meaning with link', () => {
    renderDefinition('dharma');
    expect(screen.getByText(/√धृ/)).toBeInTheDocument();
  });
});