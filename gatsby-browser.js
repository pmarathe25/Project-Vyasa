import { SettingsContextProvider } from "./src/components/settingsPanel"
import * as React from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import "./src/styles/global.css"

export const wrapRootElement = ({ element }) => (
    <SettingsContextProvider>
        {element}
    </SettingsContextProvider>
);
