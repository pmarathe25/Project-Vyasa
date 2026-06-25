import '../jest.setup';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTransliterate } from '../src/components/transliterationHook';
import { SettingsContextProvider } from '../src/components/settingsPanel';

const TestComponent = ({ text }: { text: string }) => {
  const transliterated = useTransliterate(text);
  return <div data-testid="output">{transliterated}</div>;
};

const renderTransliteration = (text: string) => {
  return render(
    <SettingsContextProvider>
      <TestComponent text={text} />
    </SettingsContextProvider>
  );
};

describe('useTransliterate hook', () => {
  it('transliterates to Devanagari by default', () => {
    renderTransliteration('dharma');
    expect(screen.getByTestId('output')).toHaveTextContent('धर्म');
  });

  it('transliterates compound words', () => {
    renderTransliteration('dharma karma');
    expect(screen.getByTestId('output')).toHaveTextContent('धर्म कर्म');
  });

  it('handles newlines', () => {
    renderTransliteration('dharma\nkarma');
    expect(screen.getByTestId('output')).toHaveTextContent('धर्म');
    expect(screen.getByTestId('output')).toHaveTextContent('कर्म');
  });
});