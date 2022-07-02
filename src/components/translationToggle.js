import * as React from "react";
import { Nav, ToggleButton } from "react-bootstrap";
import { SettingsContext } from "./settingsContext";


export const TranslationToggle = ({ navExpanded }) => {
    const style = {
        width: "fit-content",
        minWidth: "110px",
        height: "fit-content",
        marginBottom: navExpanded ? "10px" : "unset",
        marginLeft: navExpanded ? "3px" : "unset",
        paddingLeft: "2px", paddingRight: "2px",
        paddingTop: "2px", paddingBottom: "2px",
        fontSize: "13.75px"
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
