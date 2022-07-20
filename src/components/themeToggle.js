import * as React from "react";
import { Nav, ToggleButton } from "react-bootstrap";
import { SettingsContext } from "./settingsPanel";


export const ThemeToggle = ({ navExpanded }) => {
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

    const { useDarkMode, setUseDarkMode } = React.useContext(SettingsContext);

    return (
        <Nav.Item style={style}>
            <ToggleButton
                size="sm"
                type="checkbox"
                onClick={() => setUseDarkMode(!useDarkMode)}
                checked={useDarkMode}
                style={style}
            >
                {useDarkMode ? "Disable" : "Enable"} Dark Mode
            </ToggleButton>
        </Nav.Item >
    )
}
