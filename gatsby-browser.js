import "./src/styles/global.css"
import { TranslitModeContextProvider } from "./src/components/translitModeContext"
import * as React from "react"

export const wrapRootElement = ({ element }) => (
    <TranslitModeContextProvider>{element}</TranslitModeContextProvider>
);
