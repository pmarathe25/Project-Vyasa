import * as React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { GoSettings } from 'react-icons/go';
import { useLocalStorage } from './localStorage';

export const DEVANAGARI_MODE = 'devanagari';
export const IAST_MODE = 'iast';

export type TranslitMode = typeof DEVANAGARI_MODE | typeof IAST_MODE;

export interface SettingsState {
  translitMode: TranslitMode;
  showTranslation: boolean;
  useDarkMode: boolean;
}

type SettingsAction =
  | { type: 'SET_TRANSLIT_MODE'; payload: TranslitMode }
  | { type: 'SET_SHOW_TRANSLATION'; payload: boolean }
  | { type: 'SET_DARK_MODE'; payload: boolean };

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_TRANSLIT_MODE':
      return { ...state, translitMode: action.payload };
    case 'SET_SHOW_TRANSLATION':
      return { ...state, showTranslation: action.payload };
    case 'SET_DARK_MODE':
      return { ...state, useDarkMode: action.payload };
    default:
      return state;
  }
}

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

const initialState: SettingsState = {
  translitMode: DEVANAGARI_MODE,
  showTranslation: true,
  useDarkMode: getInitialDarkMode(),
};

export const SettingsContext = React.createContext<{
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

export const SettingsContextProvider = (props: { children: React.ReactNode }) => {
  const [translitMode, setTranslitModeStorage] = useLocalStorage<TranslitMode>('translit-mode', DEVANAGARI_MODE);
  const [showTranslation, setShowTranslationStorage] = useLocalStorage('toggle-translation', true);
  const [useDarkMode, setUseDarkModeStorage] = useLocalStorage('toggle-dark-mode', initialState.useDarkMode);

  const [state, dispatch] = React.useReducer(settingsReducer, {
    translitMode,
    showTranslation,
    useDarkMode,
  });

  // Sync state changes to localStorage
  React.useEffect(() => {
    setTranslitModeStorage(state.translitMode);
  }, [state.translitMode, setTranslitModeStorage]);

  React.useEffect(() => {
    setShowTranslationStorage(state.showTranslation);
  }, [state.showTranslation, setShowTranslationStorage]);

  React.useEffect(() => {
    setUseDarkModeStorage(state.useDarkMode);
  }, [state.useDarkMode, setUseDarkModeStorage]);

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
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
  const { state, dispatch } = React.useContext(SettingsContext);

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
                checked={state.translitMode === DEVANAGARI_MODE}
                onChange={(event) => dispatch({ type: 'SET_TRANSLIT_MODE', payload: event.target.value as TranslitMode })}
              />
              <Form.Check
                style={formCheckStyle}
                name="translit-select"
                inline
                type="radio"
                label="IAST"
                value={IAST_MODE}
                checked={state.translitMode === IAST_MODE}
                onChange={(event) => dispatch({ type: 'SET_TRANSLIT_MODE', payload: event.target.value as TranslitMode })}
              />
            </div>
          ) : null}
          {showTranslationButton ? (
            <Form.Check
              style={formCheckStyle}
              type="switch"
              label="Translation"
              checked={state.showTranslation}
              onChange={(event) => dispatch({ type: 'SET_SHOW_TRANSLATION', payload: event.target.checked })}
            />
          ) : null}
          <Form.Check
            style={formCheckStyle}
            type="switch"
            label="Dark Mode"
            checked={state.useDarkMode}
            onChange={(event) => dispatch({ type: 'SET_DARK_MODE', payload: event.target.checked })}
          />
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
};