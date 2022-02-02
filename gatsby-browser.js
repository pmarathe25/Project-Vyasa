import { TranslitModeContextProvider } from "./src/components/translitModeSelect"
import * as React from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import "./src/styles/global.css"

export const wrapRootElement = ({ element }) => (
    <TranslitModeContextProvider>{element}</TranslitModeContextProvider>
);
