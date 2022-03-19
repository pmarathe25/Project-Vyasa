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

    const style = {
        paddingBottom: navExpanded ? "10px" : 0,
        height: "fit-content",
        marginTop: "auto", marginBottom: "auto",
        marginLeft: navExpanded ? 0 : "auto",
        marginRight: navExpanded ? 0 : "auto"
    };

    return (
        <Nav.Item style={style}>
            <TranslitModeContext.Consumer>
                {({ mode, setMode }) =>
                    <ToggleButtonGroup
                        type="radio"
                        name="options"
                        defaultValue={mode}
                        onChange={(val) => { setMode(val) }}
                        vertical={false}
                    >
                        <ToggleButton id="translit-select-dev" value={0} size="sm">
                            <p style={{ fontSize: "16px" }}>
                                {devanagari}
                            </p>
                        </ToggleButton>
                        <ToggleButton id="translit-select-iast" value={1} size="sm">
                            <p style={{ fontSize: "15px" }}>
                                IAST
                            </p>
                        </ToggleButton>
                    </ToggleButtonGroup>
                }
            </TranslitModeContext.Consumer >
        </Nav.Item>
    )
}

