import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../shared/Loading';

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/profile`, {
                    withCredentials: true,
                });
                setUser(response.data.user);
            } catch (error) {
                console.error("Lỗi lấy thông tin cá nhân", error);
            }
        };
        fetchProfile();
    }, []);

    const formatDate = (datestring) => {
        const date = new Date(datestring);
        return date.toLocaleDateString('vi-VN');
    }

    if (!user) return (
        <Loading/>
    );

    return (
        <section className="bg-purple-50 box-border justify-center items-center">
            <div className="rounded-2xl flex p-5 space-x-10 justify-center items-center">
                <div className="md:block lg:block hidden ">
                <img className="rounded-2xl  object-cover object-center"
                         src="https://i.imgur.com/uWIJU3R.png"
                         alt=""/>
                </div>
                <div className="px-4 py-5 sm:p-0">
                    <h2 className="font-bold text-3xl p-10 text-[#002D74]">Thông tin cá nhân</h2>
                    <dl className="sm:divide-y sm:divide-gray-200 border-t border-gray-200 grid grid-rows-3 gap-2">
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Họ và tên
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {user.full_name}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {user.email}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Giới tính
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {user.gender}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Ngày sinh
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {formatDate(user.dob)}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Quốc tịch
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {user.nationality}
                            </dd>

                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Số điện thoại
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {user.phone_number}
                            </dd>

                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Ngày tạo tài khoản
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                {formatDate(user.created_at)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    )
        ;
}

export default Profile;
