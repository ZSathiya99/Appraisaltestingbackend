import React, { useContext } from 'react'
import VerticalStepper from '../Components/VerticalStepper '
import { Data } from '../Context/Store'
import TeachingForm from '../Components/TeachingForm'

const AppraisalFormPage = () => {
    const { setSelectedTab } = useContext(Data)
    return (
        <>
            {/* <button onClick={() => setSelectedTab("Service")}>Service</button>
            <button onClick={() => setSelectedTab("Research")}>Research</button>
            <button onClick={() => setSelectedTab("Teaching")}>Teaching</button> */}
            <main className="main-container grid grid-cols-12 h-[100vh] p-6 gap-4">
                <VerticalStepper />
                <section className='form-container col-span-9 h-[93vh] overflow-auto'>
                    <TeachingForm />
                </section>
            </main>
        </>
    )
}

export default AppraisalFormPage
