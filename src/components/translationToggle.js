import * as React from "react";
import { Nav, ToggleButton } from "react-bootstrap";
import { SettingsContext } from "./settingsContext";


export const TranslationToggle = ({ navExpanded }) => {
    const style = {
        fontSize: "15px",
        height: "fit-content",
        marginTop: "auto",
        marginBottom: navExpanded ? "10px" : "auto",
        marginLeft: navExpanded ? 0 : "auto",
        marginRight: navExpanded ? 0 : "auto",
    };

    return (
        <Nav.Item style={style}>
            <SettingsContext.Consumer>
                {({ showTranslation, setShowTranslation }) =>
                    <ToggleButton
                        size="sm"
                        type="checkbox"
                        onClick={() => setShowTranslation(!showTranslation)}
                        checked={showTranslation}
                        style={style}
                    >
                        {showTranslation ? "Hide" : "Show"} Translation
                    </ToggleButton>
                }
            </SettingsContext.Consumer >
        </Nav.Item >
    )
}