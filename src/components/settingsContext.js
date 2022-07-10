import * as React from "react";
import { useLocalStorage } from "./localStorage";

export const SettingsContext = React.createContext();

export const SettingsContextProvider = (props) => {
    // 0: Devanagari, 1: IAST
    const [translitMode, setTranslitMode] = useLocalStorage("translit-mode", "devanagari");
    const [showTranslation, setShowTranslation] = useLocalStorage("toggle-translation", true);

    return (
        <SettingsContext.Provider value={{
            translitMode: translitMode, setTranslitMode: setTranslitMode,
            showTranslation: showTranslation, setShowTranslation: setShowTranslation,
        }}>
            {props.children}
        </SettingsContext.Provider>
    )
}
