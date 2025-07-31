import { useState } from 'react'
import { Data } from './Store.js'

export const DataProvider = ({ children }) => {
    const [step, setStep] = useState(1);
    const [selectedTab, setSelectedTab] = useState("Research");

    return (
        <Data.Provider value={{ step, setStep, selectedTab, setSelectedTab }}>
            {children}
        </Data.Provider>
    )
}