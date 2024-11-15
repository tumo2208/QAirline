import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/profile`, {
                    withCredentials: true,
                });
                console.log(response.data.user);
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const formatDate = (datestring) => {
        const date = new Date(datestring);
        return date.toLocaleDateString('vi-VN');
    }

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>Thông tin của {user.full_name}</h2>
            <p>Email: {user.email}</p>
            <p>Giới tính: {user.gender}</p>
            <p>Ngày sinh: {formatDate(user.dob)}</p>
            <p>Quốc tịch: {user.nationality}</p>
            <p>Số hộ chiếu: {user.passport}</p>
            <p>Số điện thoại: {user.phone_number}</p>
            <p>Ngày tạo tài khoản: {formatDate(user.created_at)}</p>
        </div>
    );
}

export default Profile;
