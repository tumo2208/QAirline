import React from "react";

function BookingInfo({ outboundFlight, returnFlight, tripType, passengers }) {
    const outboundCost = outboundFlight?.flight?.available_seats.find(seat => seat.class_type === outboundFlight.classType)?.price || 0;
    const returnCost = returnFlight?.flight?.available_seats.find(seat => seat.class_type === returnFlight.classType)?.price || 0;

    const totalCost = (outboundCost + returnCost) * (passengers.adults + passengers.children + 0.1 * passengers.infants);
    return (
        <div className="sticky top-20 my-8 max-w-sm justify-center mx-auto bg-white">
            <div className="bg-blue-800 text-white text-center font-bold py-2 rounded-t-lg">
                THÔNG TIN ĐẶT CHỖ
            </div>
            <div>
                <div className="bg-gray-100 text-gray-800 mx-3 font-bold py-2 mt-3 px-3 rounded-md">
                    Số hành khách
                </div>
                <div className="text-right space-y-2 text-sm my-3 pr-5">
                    <p>Người lớn x {passengers.adults}</p>
                    {passengers.children > 0 && (
                        <p>Trẻ em x {passengers.children}</p>
                    )}
                    {passengers.infants > 0 && (
                        <p>Trẻ sơ sinh x {passengers.infants}</p>
                    )}
                </div>
            </div>
            <div>
                <div className="bg-purple-100 text-gray-800 font-bold py-2 px-3">
                    Chuyến đi
                </div>
                {outboundFlight?.flight?.flight_number && (
                    <div className="px-4 py-2">
                        <div>
                            <div>
                                <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                    Mã số chuyến bay
                                </div>
                                <div className="text-right text-sm my-3 pr-5">
                                    <p>{outboundFlight?.flight?.flight_number}</p>
                                </div>
                            </div>
                            <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                Chặng
                            </div>
                            <div className="text-right text-sm my-3 pr-5">
                                <p>{outboundFlight?.flight?.departure_airport_id} &rarr; {outboundFlight?.flight?.arrival_airport_id}</p>
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                Thời gian
                            </div>
                            <div className="text-right text-sm my-3 pr-5">
                                <p>{convertDateFormat(outboundFlight.flight?.departure_time)}, {new Date(outboundFlight.flight?.departure_time).toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })} &rarr; {new Date(outboundFlight.flight?.arrival_time).toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}</p>
                            </div>
                        </div>

                        <div>
                            <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                Giá vé
                            </div>
                            <div className="flex items-center justify-end py-2 space-x-8 text-sm mb-3">
                                <div className="space-y-2">
                                    <p>Vé
                                        hạng {outboundFlight.classType === "Economy" ? "Phổ thông" : "Thương gia"} x {passengers.adults + passengers.children}</p>
                                    {passengers.infants > 0 && (
                                        <p>Vé trẻ sơ sinh x {passengers.infants}</p>
                                    )}
                                </div>
                                <div className="space-y-2 font-semibold">
                                    <p>{new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "VND"
                                    }).format(outboundCost * (passengers.adults + passengers.children))}</p>
                                    {passengers.infants > 0 && (
                                        <p>{new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "VND"
                                        }).format(outboundCost * passengers.infants * 0.1)}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {tripType === "round-trip" && returnFlight && (
                <div>
                    <div className="bg-green-100 text-gray-800 font-bold py-2 px-3">
                        Chuyến về
                    </div>
                    {returnFlight.flight?.flight_number && (
                        <div className="px-4 py-2">
                            <div>
                                <div>
                                    <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                        Mã số chuyến bay
                                    </div>
                                    <div className="text-right text-sm my-3 pr-5">
                                        <p>{returnFlight?.flight?.flight_number}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                    Chặng
                                </div>
                                <div className="text-right text-sm my-3 pr-5">
                                    <p>{returnFlight?.flight?.departure_airport_id} &rarr; {returnFlight?.flight?.arrival_airport_id}</p>
                                </div>
                            </div>
                            <div>
                                <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                    Thời gian
                                </div>
                                <div className="text-right text-sm my-3 pr-5">
                                    <p>{convertDateFormat(returnFlight.flight?.departure_time)}, {new Date(returnFlight.flight?.departure_time).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })} &rarr; {new Date(returnFlight.flight?.arrival_time).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}</p>
                                </div>
                            </div>

                            <div>
                                <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                    Giá vé
                                </div>
                                <div className="flex items-center justify-end space-x-8 py-2 text-sm mb-3">
                                    <div className="space-y-2">
                                        <p>Vé
                                            hạng {returnFlight.classType === "Economy" ? "Phổ thông" : "Thương gia"} x {passengers.adults + passengers.children}</p>
                                        {passengers.infants > 0 && (
                                            <p>Vé trẻ sơ sinh x {passengers.infants}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2 font-semibold">
                                        <p>{new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "VND"
                                        }).format(returnCost * (passengers.adults + passengers.children))}</p>
                                        {passengers.infants > 0 && (
                                            <p>{new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "VND"
                                            }).format(returnCost * passengers.infants * 0.1)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="flex justify-between bg-blue-800 text-white px-5 font-bold py-2 text-lg rounded-b-lg">
                <p className="text-left">Tổng tiền</p>
                <span className="text-right">{new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "VND"
                }).format(totalCost)}</span>
            </div>
        </div>
    )
}

function convertDateFormat(timeInput) {
    const date = new Date(timeInput);


    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export default BookingInfo;