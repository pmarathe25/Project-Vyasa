import * as React from "react";
import { Nav, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
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

export const TransliterationModeSelect = ({ navExpanded }) => {
    const devanagari = useTransliterate("daivanaagarii");

    const baseStyle = {
        paddingBottom: navExpanded ? "10px" : 0,
        height: "fit-content",
        marginTop: "auto", marginBottom: "auto"
    };
    const translitSpaceStyle = navExpanded ? baseStyle : { ...baseStyle, marginLeft: "40%", marginRight: "50%" };

    return (
        <Nav.Item style={translitSpaceStyle}>
            <TranslitModeContext.Consumer>
                {({ mode, setMode }) =>
                    <ToggleButtonGroup
                        type="radio"
                        name="options"
                        defaultValue={mode}
                        onChange={(val) => { setMode(val) }}
                        vertical={false}
                    >
                        <ToggleButton id="translit-select-dev" value={0}>
                            <p style={{ fontSize: (mode === 1 ? "16px" : "18px"), minWidth: "80px" }}>
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
            </TranslitModeContext.Consumer >
        </Nav.Item>

    )
}

