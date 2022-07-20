import * as React from "react";
import { Nav, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { SettingsContext } from "./settingsPanel";


export const TransliterationModeSelect = ({ navExpanded }) => {
    const style = {
        height: "fit-content",
        marginTop: "auto",
        marginBottom: navExpanded ? "10px" : "auto",
        marginLeft: navExpanded ? "10px" : "15px",
        marginRight: navExpanded ? "0px" : "0px",
    };

    const buttonStyle = {
        paddingLeft: "5px", paddingRight: "5px",
        paddingTop: "1px", paddingBottom: "1px",
    }

    const { translitMode, setTranslitMode } = React.useContext(SettingsContext);

    return (
        <Nav.Item style={style}>
            <ToggleButtonGroup
                type="radio"
                name="options"
                defaultValue={translitMode}
                onChange={(val) => { setTranslitMode(val) }}
                vertical={false}
            >
                <ToggleButton id="translit-select-dev" value="devanagari" size="sm" style={{ ...buttonStyle, fontSize: "16px" }}>
                    देवनागरी
                </ToggleButton>
                <ToggleButton id="translit-select-iast" value="iast" size="sm" style={{ ...buttonStyle, fontSize: "15px" }}>
                    IAST
                </ToggleButton>
            </ToggleButtonGroup>
        </Nav.Item>
    )
}