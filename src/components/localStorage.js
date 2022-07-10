import * as React from "react";

export const useLocalStorage = (key, defaultValue) => {
    if (typeof (localStorage.getItem(key)) === "undefined") {
        localStorage.setItem(key, JSON.stringify(defaultValue));
    }

    const [value, setValue] = React.useState(JSON.parse(localStorage.getItem(key)) ?? defaultValue);

    React.useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}