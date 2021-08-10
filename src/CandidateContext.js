import { createContext, useState } from "react";

export const CandidateCoxtent = createContext();
export function CandidateProvider(props) {

    const [candidateToUpdate, setCandidateToUpdate] = useState({
        name : "",
        number: 0,
        gender:"",
        states:"",
        party:""
    })
    
    return (
        <CandidateCoxtent.Provider value={[candidateToUpdate, setCandidateToUpdate]}>
            {props.children}
        </CandidateCoxtent.Provider>
    )
}