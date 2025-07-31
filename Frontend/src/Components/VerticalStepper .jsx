import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import { Data } from '../Context/Store';

const steps = [
    { id: 1, label: 'Teaching Performance', value: 'Teaching' },
    { id: 2, label: 'Research Performance', value: 'Research' },
    { id: 3, label: 'Service Performance', value: 'Service' },
];

const stepIndexMap = {
    Teaching: 0,
    Research: 1,
    Service: 2,
};

// ✅ Custom dotted connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.vertical}`]: {
        marginLeft: 0, // remove default spacing
    },
    [`& .${stepConnectorClasses.line}`]: {
        marginLeft: 16, // align exactly with the icon center (width/2 of 32px circle)
        borderLeftStyle: 'dotted',
        borderLeftWidth: 2,
        minHeight: 86,
    },
}));

// ✅ Custom step icon component
const CustomStepIcon = (props) => {
    const { active, icon } = props;
    return (
        <div
            className={`flex items-center justify-center w-8 h-8 rounded-full font-bold 
        ${active ? 'bg-black text-white' : 'bg-gray-400 text-black'}`}
        >
            {icon}
        </div>
    );
};

const VerticalStepper = () => {
    const { selectedTab } = useContext(Data);

    return (
        <div className="main-container col-span-3 p-4 h-[93vh] bg-[#D6D6D6] border border-gray-400 rounded-xl">
            <div className="header mb-4">
                <h1 className="text-lg">Step 1</h1>
                <p className="text-[#5d666e] text-sm mt-2">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </p>
            </div>
            <Box sx={{ width: '100%', marginTop: "40px" }}>
                <Stepper
                    activeStep={stepIndexMap[selectedTab]}
                    orientation="vertical"
                    connector={<CustomConnector />}
                >
                    {steps.map((step) => (
                        <Step key={step.id}>
                            <StepLabel
                                StepIconComponent={CustomStepIcon}
                                sx={{ '.MuiStepLabel-label': { fontSize: '1.25rem' } }} // text-xl = 1.25rem
                            >
                                {step.label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </div>
    );
};

export default VerticalStepper;
