import React from 'react'
import { Container, Typography, Box } from '@mui/material'

const About = () => {
    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    About the Journal Management System
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to the Reviewer Portal of our Journal Management System. As a reviewer, this platform offers a seamless and organized experience 
                    to manage your review assignments and contribute to the peer review process efficiently and transparently.
                </Typography>
                <Typography variant="body1" paragraph>
                    The system is built to support your essential role in maintaining scholarly integrity — from receiving assignments to submitting detailed, constructive feedback. 
                    You can access manuscripts, communicate with editors, and track the progress of your reviews in one centralized space.
                </Typography>
                <Typography variant="body1" paragraph>
                    Our aim is to minimize administrative burden, promote clear communication, and equip you with intuitive tools for a meaningful and professional reviewing experience.
                </Typography>
                <Typography variant="body1" paragraph>
                    Key features available to you as a reviewer:
                </Typography>
                <ul>
                    <li>Access assigned manuscripts and supporting documents</li>
                    <li>Submit structured, confidential review feedback</li>
                    <li>Track the status of your review assignments</li>
                    <li>Communicate directly with editors for clarifications</li>
                    <li>Manage your reviewing history and preferences</li>
                    <li>Receive notifications for new assignments and deadlines</li>
                    <li>Contribute to transparent and high-quality scholarly publishing</li>
                </ul>
                <Typography variant="body1" paragraph>
                    We value your expertise and dedication, and we're committed to making your reviewing experience as effective and rewarding as possible.
                </Typography>
            </Box>
        </Container>
    )
}

export default About;
