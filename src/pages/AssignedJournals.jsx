import React, { useContext } from 'react';
import EmptyMessage from '../components/EmptyMessage';
import ReviewerAssignedJournals from '../components/ReviewerAssignedJournals';
import { contextProviderDeclare } from '../store/ContextProvider';

const AssignedJournals=()=>{
    const getContextProvider=useContext(contextProviderDeclare);
    const {journalReview}=getContextProvider;

    console.log(journalReview);
    return(
        <>
            {journalReview.length===0 ? <EmptyMessage/> : <ReviewerAssignedJournals journalReview={journalReview}/>}
        </>
    )
}

export default AssignedJournals;