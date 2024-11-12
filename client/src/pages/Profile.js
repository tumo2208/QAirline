import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

function Profile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/${username}/profile`, {
                    headers: { 'x-auth-token': token }
                });
                setUser(response.data);
            } catch (err) {
                window.location.href = `http://localhost:3001/login`;
            }
        };
        fetchProfile();
    }, [username]);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>Profile of {user.full_name}</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Gender: {user.gender}</p>
            <p>Age: {user.age}</p>
            <p>Nationality: {user.nationality}</p>
        </div>
    );
}

export default Profile;
