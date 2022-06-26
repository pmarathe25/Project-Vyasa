import * as React from "react";


export const SettingsContext = React.createContext({
    translitMode: 0, setTranslitMode: () => { },
    showTranslation: true, setShowTranslation: () => { },
});

export const SettingsContextProvider = (props) => {
    // 0: Devanagari, 1: IAST
    const [translitMode, setTranslitMode] = React.useState(0);
    const [showTranslation, setShowTranslation] = React.useState(true);

    return (
        <SettingsContext.Provider value={{
            translitMode: translitMode, setTranslitMode: setTranslitMode,
            showTranslation: showTranslation, setShowTranslation: setShowTranslation,
        }}>
            {props.children}
        </SettingsContext.Provider>
    )
}
