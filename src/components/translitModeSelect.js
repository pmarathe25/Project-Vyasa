import React from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useTransliterate } from "./transliterationHook";

export const TranslitModeContext = React.createContext({ mode: 0, setMode: () => { } });

export const TranslitModeContextProvider = (props) => {
    // 0: Devanagari, 1: IAST
    const [mode, setMode] = React.useState(0);

    return (
        <TranslitModeContext.Provider value={{ mode: mode, setMode: setMode }}>
            {props.children}
        </TranslitModeContext.Provider>
    )
}

export const TransliterationModeSelect = () => {
    const devanagari = useTransliterate("daivanaagarii");

    return (
        <TranslitModeContext.Consumer>
            {({ mode, setMode }) =>
                <ToggleButtonGroup type="radio" name="options" defaultValue={mode} onChange={(val) => { setMode(val) }} vertical={false}>
                    <ToggleButton id="translit-select-dev" value={0}>
                        <p style={{ fontSize: (mode === 1 ? "16px" : "18px") }}>
                            {devanagari}
                        </p>
                    </ToggleButton>
                    <ToggleButton id="translit-select-iast" value={1}>
                        <p style={{ fontSize: "16px" }}>
                            IAST
                        </p>
                    </ToggleButton>
                </ToggleButtonGroup>
            }
        </TranslitModeContext.Consumer>
    )
}

