import * as React from "react";
import { Nav, ToggleButton } from "react-bootstrap";
import { SettingsContext } from "./settingsContext";


export const TranslationToggle = ({ navExpanded }) => {
    const style = {
        fontSize: "13.75px",
        height: "fit-content",
        marginTop: "auto",
        marginBottom: navExpanded ? "10px" : "auto",
        marginLeft: navExpanded ? 0 : "auto",
        marginRight: navExpanded ? 0 : "auto",
        paddingLeft: "2px", paddingRight: "2px",
        paddingTop: "3px", paddingBottom: "3px",
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
