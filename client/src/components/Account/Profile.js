import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../shared/Loading';

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        full_name: '',
        email: '',
        gender: '',
        dob: '',
        nationality: '',
        phone_number: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
                    withCredentials: true,
                });
                setUser(response.data.user);
                setUpdatedUser(response.data.user);
            } catch (error) {
                console.error('Lỗi lấy thông tin cá nhân', error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const formatDate = (datestring) => {
        const date = new Date(datestring);
        return date.toLocaleDateString('vi-VN');
    };

    const handleUpdate = async () => {
        setError('');
        setSuccess('');

        const changes = Object.keys(updatedUser).reduce((acc, key) => {
            if (updatedUser[key] !== user[key]) {
                acc[key] = updatedUser[key];
            }
            return acc;
        }, {});

        if (Object.keys(changes).length === 0) {
            setError('Không có thay đổi nào được thực hiện');
            setTimeout(() => {
                setError('');
            }, 2000);
            setIsEditing(false);
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/update`,
                updatedUser,
                {
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                setSuccess(response.data.message);
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
                setUser(response.data.user);
                setUpdatedUser(response.data.user);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Lỗi cập nhật thông tin cá nhân', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
                setTimeout(() => {
                    setError('');
                }, 2000);
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại.');
                setTimeout(() => {
                    setError('');
                }, 2000);
            }
            setUpdatedUser(user);
            setIsEditing(false);
        }
    };

    if (!user) return <Loading />;

    return (
        <section className="bg-purple-50 box-border justify-center items-center">
            <div className="rounded-2xl flex p-5 space-x-10 justify-center items-center">
                <div className="md:block lg:block hidden">
                    <img
                        className="rounded-2xl object-cover object-center"
                        src="https://i.imgur.com/uWIJU3R.png"
                        alt=""
                    />
                </div>
                <div className="px-4 py-5 sm:p-0">
                    <h2 className="font-bold text-3xl p-10 text-[#002D74]">
                        Thông tin cá nhân
                    </h2>

                    <dl className="sm:divide-y sm:divide-gray-200 border-t border-gray-200 grid grid-rows-3 gap-2">
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={updatedUser.full_name}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                ) : (
                                    user.full_name
                                )}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={updatedUser.email}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                ) : (
                                    user.email
                                )}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={updatedUser.gender}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                ) : (
                                    user.gender
                                )}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Ngày sinh</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="dob"
                                        value={updatedUser.dob}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                ) : (
                                    formatDate(user.dob)
                                )}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Quốc tịch</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={updatedUser.nationality}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                ) : (
                                    user.nationality
                                )}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={updatedUser.phone_number}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                ) : (
                                    user.phone_number
                                )}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Ngày tạo tài khoản</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {formatDate(user.created_at)}
                            </dd>
                        </div>
                    </dl>

                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {success && <div className="text-green-500 mb-4">{success}</div>}

                    <button
                        className="ml-6 px-4 py-2 bg-blue-600 text-white rounded-md"
                        onClick={() => {
                            if (isEditing) {
                                handleUpdate();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                    >
                        {isEditing ? 'Lưu' : 'Chỉnh sửa'}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Profile;
