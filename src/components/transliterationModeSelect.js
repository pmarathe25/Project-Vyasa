import * as React from "react";
import { Nav, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { SettingsContext } from "./settingsContext";


export const TransliterationModeSelect = ({ navExpanded }) => {
    const style = {
        paddingBottom: navExpanded ? "10px" : 0,
        height: "fit-content",
        marginTop: "auto", marginBottom: "auto",
        marginLeft: navExpanded ? 0 : "auto",
        marginRight: navExpanded ? 0 : "auto"
    };

    return (
        <Nav.Item style={style}>
            <SettingsContext.Consumer>
                {({ translitMode, setTranslitMode }) =>
                    <ToggleButtonGroup
                        type="radio"
                        name="options"
                        defaultValue={translitMode}
                        onChange={(val) => { setTranslitMode(val) }}
                        vertical={false}
                    >
                        <ToggleButton id="translit-select-dev" value={0} size="sm">
                            <p style={{ fontSize: "16px" }}>
                                देवनागरी
                            </p>
                        </ToggleButton>
                        <ToggleButton id="translit-select-iast" value={1} size="sm">
                            <p style={{ fontSize: "15px" }}>
                                IAST
                            </p>
                        </ToggleButton>
                    </ToggleButtonGroup>
                }
            </SettingsContext.Consumer >
        </Nav.Item>
    )
}