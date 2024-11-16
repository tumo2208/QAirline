import './Home.css';

function Home() {
    const booking = document.querySelector(".booking")
    const checkin = document.querySelector(".checkin");
    const myBooking = document.querySelector(".myBooking");
    return (
        <div className="Home">
            <div className="section1 flex flex-wrap items-center bg-cover bg-center"
                 style={{backgroundImage: "url('/images/background.png')", height: "600px"}}>
                <div className="pl-6 pr-6 pb-6 flex justify-center items-center" style={{flex:6}}>
                    <div className="mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-around text-center mb-4">
                            <button className="booking text-blue-700 font-bold pb-2 border-b-4 border-blue-700">✈️ Đặt vé</button>
                            <button className="checkin text-gray-500 font-bold pb-2 lg:hover:border-b-4 lg:hover:text-blue-700 lg:hover:border-blue-700">🛂 Làm thủ tục</button>
                            <button className="myBooking text-gray-500 font-bold pb-2 lg:hover:border-b-4 lg:hover:text-blue-700 lg:hover:border-blue-700">🎫 Quản lý đặt chỗ</button>
                        </div>

                        <form className="space-y-2">
                            <div className="space-x-4">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="trip-type" className="form-radio text-yellow-500" checked/>
                                    <span className="ml-1 text-gray-600 text-sm font-medium">Một chiều</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input type="radio" name="trip-type" className="form-radio text-yellow-500"/>
                                    <span className="ml-1 text-gray-600 text-sm font-medium">Khứ hồi</span>
                                </label>
                            </div>

                            <div className="flex gap-2">
                                <div style={{flex:5}}>
                                    <label className="text-gray-600 text-sm font-medium"> Điểm khởi hành</label>
                                    <input type="text"
                                           className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm"/>
                                </div>
                                <div style={{flex:3}}>
                                    <label className="text-gray-600 text-sm font-medium"> Ngày đi</label>
                                    <input type="date"
                                           className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm"/>
                                </div>
                            </div>


                            <div className="flex gap-2">
                                <div style={{flex:5}}>
                                    <label className="text-gray-600 text-sm font-medium"> Điểm đến</label>
                                    <input type="text"
                                           className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm"/>
                                </div>
                                <div style={{flex:3}}>
                                    <label className="text-gray-600 text-sm font-medium"> Ngày về</label>
                                    <input type="date"
                                           className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm"/>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div style={{flex: 1}}>
                                    <label className="text-gray-600 text-sm font-medium"> Hạng vé</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm">
                                        <option value="1">Hạng Phổ thông</option>
                                        <option value="3">Hạng Thương gia</option>
                                    </select>
                                </div>
                                <div style={{flex: 1}}>
                                    <label className="text-gray-600 text-sm font-medium"> Số hành khách</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <a href="#" className="hover:underline text-sm text-blue-700 mr-2">Mã khuyến mại</a>
                                <div className="flex items-center bg-white rounded p-1 text-gray-700">
                                    <span className="mr-1">🏷️</span>
                                    <input type="text"
                                           className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm"/>
                                </div>
                            </div>

                            <button
                                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg p-3">
                                Tìm chuyến bay
                            </button>
                        </form>
                    </div>
                </div>
                <div  style={{flex:5}}></div>
            </div>

            <div className="section3 max-w-screen-xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-black mb-4">
                    ✈️ Chuyến Bay Ưa Thích Hàng Đầu
                </h1>

                <div className="domestic">
                    <h2 className="text-3xl font-bold text-purple-700 mb-4 mt-4">Nội Địa</h2>
                    <div className="flex space-x-4 mb-6">
                        {['Hanoi', 'Da Nang', 'Da Lat', 'Ho Chi Minh City', 'Phu Quoc'].map(
                            (country) => (
                                <button
                                    key={country}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-full hover:bg-blue-200 focus:bg-blue-300"
                                >
                                    {country}
                                </button>
                            )
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                route: 'Hanoi - Ho Chi Minh City',
                                destination: 'Ho Chi Minh City',
                                date: '9 November 2024',
                                price: '1.193.005 VND',
                                type: 'MỘT CHIỀU',
                            },
                            {
                                route: 'Ho Chi Minh City - Phu Quoc',
                                destination: 'Phu Quoc',
                                date: '28 November 2024',
                                price: '691.525 VND',
                                type: 'KHỨ HỒI',
                            },
                            {
                                route: 'Hanoi - Da Nang',
                                destination: 'Da Nang',
                                date: '28 November 2024',
                                price: '691.525 VND',
                                type: 'MỘT CHIỀU',
                            },
                            {
                                route: 'Ho Chi Minh City - Hanoi',
                                destination: 'Hanoi',
                                date: '9 November 2024',
                                price: '1.193.005 VND',
                                type: 'KHỨ HỒI',
                            },
                        ].map((flight, index) => (
                            <div
                                key={index}
                                className="shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer lg:hover:scale-105"
                                style={{backgroundColor: "#ececec"}}
                            >
                                <img src={`images/places/${flight.destination}.jpg`} alt={flight.route}
                                     className="w-full h-48 object-cover"/>
                                <div className="p-4">
                  <span className="text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-md">
                    {flight.type}
                  </span>
                                    <h2 className="mt-1 text-lg font-bold text-gray-800">{flight.route}</h2>
                                    <p className="text-sm text-gray-500">{flight.date}</p>
                                    <p className="mt-1 text-red-600 font-semibold">{flight.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center items-center">
                        <button
                            className="bg-blue-600 text-white font-semibold py-2 px-4 mt-4 rounded flex items-center hover:bg-blue-700">
                            Xem thêm
                            <span className="ml-2">&rarr;</span>
                        </button>
                    </div>
                </div>

                <div className="foreign">
                    <h2 className="text-3xl font-bold text-purple-700 mb-4 mt-4">Quốc Tế</h2>
                    <div className="flex space-x-4 mb-6">
                        {['Tokyo', 'Singapore', 'Paris', 'Seoul', 'London'].map(
                            (country) => (
                                <button
                                    key={country}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-full hover:bg-blue-200 focus:bg-blue-300"
                                >
                                    {country}
                                </button>
                            )
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                route: 'Hanoi - Tokyo',
                                destination: 'Tokyo',
                                date: '9 November 2024',
                                price: '1.193.005 VND',
                                type: 'MỘT CHIỀU',
                            },
                            {
                                route: 'Hanoi - Singapore',
                                destination: 'Singapore',
                                date: '1 December 2024',
                                price: '647.745 VND',
                                type: 'MỘT CHIỀU',
                            },
                            {
                                route: 'Ho Chi Minh City - Seoul',
                                destination: 'Seoul',
                                date: '9 November 2024',
                                price: '1.193.005 VND',
                                type: 'KHỨ HỒI',
                            },
                            {
                                route: 'Ho Chi Minh City - Paris',
                                destination: 'Paris',
                                date: '28 November 2024',
                                price: '691.525 VND',
                                type: 'KHỨ HỒI',
                            },
                        ].map((flight, index) => (
                            <div
                                key={index}
                                className="shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer lg:hover:scale-105"
                                style={{backgroundColor: "#ececec"}}
                            >
                                <img src={`images/places/${flight.destination}.jpg`} alt={flight.route}
                                     className="w-full h-48 object-cover"/>
                                <div className="p-4">
                  <span className="text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-md">
                    {flight.type}
                  </span>
                                    <h2 className="mt-1 text-lg font-bold text-gray-800">{flight.route}</h2>
                                    <p className="text-sm text-gray-500">{flight.date}</p>
                                    <p className="mt-1 text-red-600 font-semibold">{flight.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            className="bg-blue-600 text-white font-semibold py-2 px-4 mt-4 rounded flex items-center hover:bg-blue-700">
                            Xem thêm
                            <span className="ml-2">&rarr;</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="section3 max-w-screen-xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-black mb-4">
                    📍Điểm Đến Hấp Dẫn
                </h1>
                <div className="slider flex items-center justify-center relative w-[1140px] h-[400px] overflow-hidden shadow-lg">
                    <div className="slide-track flex space-x-2 animate-scroll bg-cover relative" style={{width: 'calc(400px * 18)'}}>
                        <div className="w-[400px] h-[400px] bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Phu Quoc.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Phú Quốc</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Hanoi.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Hà Nội</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Da Nang.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Đà Nẵng</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Ho Chi Minh City.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">TP. Hồ Chí Minh</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Seoul.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Seoul</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Da Nang.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Đà Nẵng</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Moscow.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Moscow</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Singapore.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Singapore</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Paris.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Paris</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Phu Quoc.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Phú Quốc</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Da Lat.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Đà Lạt</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Tokyo.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Tokyo</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Da Lat.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Đà Lạt</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Paris.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Paris</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Hoi An.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Hội An</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Singapore.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Singapore</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Hanoi.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Hà Nội</p>
                            </div>
                        </div>
                        <div className="w-[400px] h-[400px] rounded-lg bg-cover bg-center relative"
                             style={{backgroundImage: "url('/images/places/Tokyo.jpg')"}}>
                            <div
                                className="absolute bottom-4 left-4 bg-red-600 bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                <p className="text-lg font-semibold">Tokyo</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center mt-8 mb-2">
                    <button type="button"
                            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-125 px-5 py-2.5 text-center">
                        Khám phá ngay
                        <span className="ml-2">&rarr;</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home;