import * as React from "react";
import { Form } from "react-bootstrap";
import { useLocalStorage } from "./localStorage";

export const SettingsContext = React.createContext();

export const SettingsContextProvider = (props) => {
    // 0: Devanagari, 1: IAST
    const [translitMode, setTranslitMode] = useLocalStorage("translit-mode", "devanagari");
    const [showTranslation, setShowTranslation] = useLocalStorage("toggle-translation", true);
    const [useDarkMode, setUseDarkMode] = useLocalStorage("toggle-dark-mode", window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <SettingsContext.Provider value={{
            translitMode: translitMode, setTranslitMode: setTranslitMode,
            showTranslation: showTranslation, setShowTranslation: setShowTranslation,
            useDarkMode: useDarkMode, setUseDarkMode: setUseDarkMode,
        }}>
            {props.children}
        </SettingsContext.Provider>
    )
}

export const SettingsPanel = () => {
    const {
        translitMode, setTranslitMode,
        showTranslation, setShowTranslation,
        useDarkMode, setUseDarkMode
    } = React.useContext(SettingsContext);

    const devanagari = "devanagari";
    const iast = "iast";

    const style = { color: "var(--text-primary)", };

    return (
        <Form>
            <Form.Check type="switch" label="Dark Mode" checked={useDarkMode} style={style}
                onChange={(event) => { setUseDarkMode(event.target.checked) }}
            />
            <Form.Check type="switch" label="Translation" checked={showTranslation} style={style}
                onChange={(event) => { setShowTranslation(event.target.checked) }}
            />
            <div>
                <Form.Check name="translit-select" inline type="radio" label="देवनागरी"
                    value={devanagari} checked={translitMode === devanagari} style={style}
                    onChange={(event) => { setTranslitMode(event.target.value) }}
                />
                <Form.Check name="translit-select" inline type="radio" label="IAST"
                    value={iast} checked={translitMode === iast} style={style}
                    onChange={(event) => { setTranslitMode(event.target.value) }}
                />
            </div>
        </Form>
    );
}