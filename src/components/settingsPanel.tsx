import * as React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { GoSettings } from 'react-icons/go';
import { useLocalStorage } from './localStorage';

export const DEVANAGARI_MODE = 'devanagari';
export const IAST_MODE = 'iast';

export type TranslitMode = typeof DEVANAGARI_MODE | typeof IAST_MODE;

export interface SettingsContextValue {
  translitMode: TranslitMode;
  setTranslitMode: (mode: TranslitMode) => void;
  showTranslation: boolean;
  setShowTranslation: (show: boolean) => void;
  useDarkMode: boolean;
  setUseDarkMode: (use: boolean) => void;
}

export const SettingsContext = React.createContext<SettingsContextValue>({
  translitMode: DEVANAGARI_MODE,
  setTranslitMode: () => {},
  showTranslation: true,
  setShowTranslation: () => {},
  useDarkMode: false,
  setUseDarkMode: () => {},
});

export const SettingsContextProvider = (props: { children: React.ReactNode }) => {
  const [translitMode, setTranslitMode] = useLocalStorage<TranslitMode>('translit-mode', DEVANAGARI_MODE);
  const [showTranslation, setShowTranslation] = useLocalStorage('toggle-translation', true);
  const [useDarkMode, setUseDarkMode] = useLocalStorage(
    'toggle-dark-mode',
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );

  return (
    <SettingsContext.Provider
      value={{
        translitMode,
        setTranslitMode,
        showTranslation,
        setShowTranslation,
        useDarkMode,
        setUseDarkMode,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};

interface SettingsPanelProps {
  show: boolean;
  setShow: (show: boolean) => void;
  variant?: 'light' | 'dark';
  showTranslitButton: boolean;
  showTranslationButton: boolean;
}

export const SettingsPanel = ({
  show,
  setShow,
  variant,
  showTranslitButton,
  showTranslationButton,
}: SettingsPanelProps) => {
  const {
    translitMode,
    setTranslitMode,
    showTranslation,
    setShowTranslation,
    useDarkMode,
    setUseDarkMode,
  } = React.useContext(SettingsContext);

  const formCheckStyle = { paddingTop: '3px', paddingBottom: '5px' };

  return (
    <Dropdown
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: 'var(--navbar-background)',
      }}
      onToggle={() => setShow(!show)}
      show={show}
    >
      <Dropdown.Toggle variant={variant} style={{ backgroundColor: 'var(--navbar-background)' }}>
        <GoSettings size={20} />
      </Dropdown.Toggle>
      <Dropdown.Menu
        variant={variant}
        renderOnMount={true}
        style={{
          backgroundColor: 'var(--navbar-background)',
          color: 'var(--text-primary)',
          fontSize: 'var(--secondary-font-size)',
          paddingLeft: '20px',
          paddingBottom: '0px',
        }}
      >
        <Form>
          {showTranslitButton ? (
            <div style={{ display: 'flex' }}>
              <Form.Check
                style={formCheckStyle}
                name="translit-select"
                inline
                type="radio"
                label="देवनागरी"
                value={DEVANAGARI_MODE}
                checked={translitMode === DEVANAGARI_MODE}
                onChange={(event) => setTranslitMode(event.target.value as TranslitMode)}
              />
              <Form.Check
                style={formCheckStyle}
                name="translit-select"
                inline
                type="radio"
                label="IAST"
                value={IAST_MODE}
                checked={translitMode === IAST_MODE}
                onChange={(event) => setTranslitMode(event.target.value as TranslitMode)}
              />
            </div>
          ) : null}
          {showTranslationButton ? (
            <Form.Check
              style={formCheckStyle}
              type="switch"
              label="Translation"
              checked={showTranslation}
              onChange={(event) => setShowTranslation(event.target.checked)}
            />
          ) : null}
          <Form.Check
            style={formCheckStyle}
            type="switch"
            label="Dark Mode"
            checked={useDarkMode}
            onChange={(event) => setUseDarkMode(event.target.checked)}
          />
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
};