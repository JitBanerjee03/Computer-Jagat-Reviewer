import { createContext, useEffect, useReducer, useState } from "react";

export const contextProviderDeclare = createContext({
    isloggedIn: Boolean,
    setLoggedIn: () => {},
    setReviewer: () => {},
    reviewer: {},
    journalReview: [],
    setjournalReview: () => {}
});

const journalReviewReducer = (state, action) => action.payload;

export const ContextProvider = ({ children }) => {
    const [isloggedIn, setLoggedIn] = useState(false);
    const [reviewer, setReviewer] = useState({});
    const [journalReview, dispatchReview] = useReducer(journalReviewReducer, []);
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('logout') === 'true') {
            /*localStorage.removeItem('jwtToken');
            window.close(); // Close the tab after clearing token
            console.log('Hello from the Reviewer !');
            return;*/
            
            localStorage.removeItem("jwtToken");

            // 👇 wipe query string so no token can sneak back
            window.history.replaceState({}, document.title, window.location.pathname);

            setTimeout(() => window.close(), 500);
            return;
        }

        const urlToken = urlParams.get('token');
        const localToken = localStorage.getItem('jwtToken');

        if (urlToken && !localToken) {
            localStorage.setItem('jwtToken', urlToken);
            console.log('Reviewer: Token stored from URL parameter');
        }

        const token = urlToken || localToken;

        if (!token) {
            window.location.href = 'https://computer-jagat.vercel.app/login';
            return;
        }

        const validateAndInitialize = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/validate-token/`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) throw new Error('Invalid token');

                const data = await response.json();
                setReviewer(data);
                setLoggedIn(true);

                if (data.reviewer_id) {
                    await setjournalReview(data.reviewer_id);
                }

            } catch (error) {
                console.error("Reviewer: Token validation error:", error);
                localStorage.removeItem('jwtToken');
                window.location.href = 'https://computer-jagat.vercel.app/login';
            }
        };

        validateAndInitialize();

        if (urlToken) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Cross-tab logout sync
        const storageListener = (e) => {
            if (e.key === 'logout-event') {
                localStorage.removeItem('jwtToken');
                window.location.href = 'https://computer-jagat.vercel.app/login';
            }
        };
        window.addEventListener('storage', storageListener);
        return () => window.removeEventListener('storage', storageListener);
    }, []);    
    
    const setjournalReview = async (reviewerId) => {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/reviewer/${reviewerId}/assignments/`,
            { headers: { "content-type": "application/json" } }
        );
        const data = await response.json();
        dispatchReview({ type: "SET_JOURNAL_REVIEW", payload: data });
    };

    return (
        <contextProviderDeclare.Provider value={{
            isloggedIn, setLoggedIn, setReviewer,
            reviewer, journalReview, setjournalReview
        }}>
            {children}
        </contextProviderDeclare.Provider>
    );
};