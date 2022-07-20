import * as React from "react";
import { Dropdown, Form } from "react-bootstrap";
import { GoSettings } from "react-icons/go";
import { useLocalStorage } from "./localStorage";

export const DEVANAGARI_MODE = "devanagari";
export const IAST_MODE = "iast";

export const SettingsContext = React.createContext({
    translitMode: DEVANAGARI_MODE, setTranslitMode: () => { },
    showTranslation: true, setShowTranslation: () => { },
    useDarkMode: false, setUseDarkMode: () => { },
});

export const SettingsContextProvider = (props) => {
    const [translitMode, setTranslitMode] = useLocalStorage("translit-mode", DEVANAGARI_MODE);
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

export const SettingsPanel = ({ show, setShow, variant, showTranslitButton, showTranslationButton }) => {
    const {
        translitMode, setTranslitMode,
        showTranslation, setShowTranslation,
        useDarkMode, setUseDarkMode
    } = React.useContext(SettingsContext);

    return (
        <Dropdown onToggle={() => setShow(!show)} show={show}>
            <Dropdown.Toggle variant={variant}>
                <GoSettings size={20} />
            </Dropdown.Toggle>
            <Dropdown.Menu variant={variant} renderOnMount={true} style={{
                backgroundColor: "var(--navbar-background)",
                color: "var(--text-primary)",
                paddingLeft: "20px",
                paddingBottom: "0px",
            }}>
                <Form>
                    {
                        showTranslitButton ?
                            <div style={{ display: "flex" }}>
                                <Form.Check name="translit-select" inline type="radio" label="देवनागरी"
                                    value={DEVANAGARI_MODE} checked={translitMode === DEVANAGARI_MODE}
                                    onChange={(event) => { setTranslitMode(event.target.value) }}
                                />
                                <Form.Check name="translit-select" inline type="radio" label="IAST"
                                    value={IAST_MODE} checked={translitMode === IAST_MODE}
                                    onChange={(event) => { setTranslitMode(event.target.value) }}
                                />
                            </div>
                            :
                            <></>
                    }
                    {
                        showTranslationButton ?
                            <Form.Check type="switch" label="Translation" checked={showTranslation}
                                onChange={(event) => { setShowTranslation(event.target.checked) }}
                            />
                            :
                            <></>
                    }
                    <Form.Check type="switch" label="Dark Mode" checked={useDarkMode}
                        onChange={(event) => { setUseDarkMode(event.target.checked) }}
                    />
                </Form>
            </Dropdown.Menu>
        </Dropdown>
    );
}