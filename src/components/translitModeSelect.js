import React from "react";

export const TranslitModeContext = React.createContext({ mode: 0, setMode: () => { } });

export const TranslitModeContextProvider = (props) => {
    const [mode, setMode] = React.useState(0);

    return (
        <TranslitModeContext.Provider value={{ mode: mode, setMode: setMode }}>
            {props.children}
        </TranslitModeContext.Provider>
    )
}

export const TransliterationModeSelect = () => {
    // 0: Devanagari, 1: IAST
    return (
        <TranslitModeContext.Consumer>
            {({ mode, setMode }) =>
                <div>
                    <button onClick={() => { setMode(0) }} style={{ opacity: mode === 0 ? 1.0 : 0.6 }}>
                        Devanagari
                    </button>
                    <button onClick={() => { setMode(1) }} style={{ opacity: mode === 1 ? 1.0 : 0.6 }}>
                        IAST
                    </button>
                </div >
            }
        </TranslitModeContext.Consumer>
    )
}

