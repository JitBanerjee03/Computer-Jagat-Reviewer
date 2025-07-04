import { useContext, useEffect, useState } from "react";
import ReviewerProfile from "../components/ReviewerProfile";
import { contextProviderDeclare } from "../store/ContextProvider";

const Account=()=>{
    const getContextObject=useContext(contextProviderDeclare);
    const {reviewer}=getContextObject;
    const [reviewerDetails,setReviewerDetails]=useState({});
    console.log(reviewer);
    useEffect(()=>{
        if (!reviewer?.reviewer_id) return; //check if author is available before making the API call
        const getUserProfileDetails=async()=>{
            const reviewerResponse=await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/get-profile/${reviewer.reviewer_id}/`,{
                method:"GET",
                headers:{
                    "content-type":"application/json"
                }
            })

            const reviewerData=await reviewerResponse.json();
            console.log(reviewerData);
            setReviewerDetails(reviewerData);
        }

        getUserProfileDetails();
    },[]);

    return (
        <ReviewerProfile reviewer={reviewerDetails}/>
    )
}

export default Account;