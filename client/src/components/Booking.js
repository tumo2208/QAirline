import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function Booking() {
    const { state } = useLocation();
    const { flights, tripType } = state;

    const [showOutbound, setShowOutbound] = useState(true);

    let outboundFlights = [];
    let returnFlights = [];

    if (tripType === "round-trip") {
        outboundFlights = flights?.outboundFlights || [];
        returnFlights = flights?.returnFlights || [];
    } else if (tripType === "one-way") {
        outboundFlights = flights || [];
    }

    // Handle flight selection
    const handleSelect = (flight, classType) => {
        console.log(`Selected flight: ${flight.flight_number}, Class: ${classType}`);
        alert(`Selected flight: ${flight.flight_number}, Class: ${classType}`);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "36px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                }}
            >
                Flight Results
            </h2>

            {/* Flight Direction */}
            <p
                style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "20px",
                }}
            >
                {showOutbound
                    ? `Outbound: ${outboundFlights[0]?.departure_airport?.city || "Depart"} → ${outboundFlights[0]?.arrival_airport?.city || "Arrive"}`
                    : `Return: ${returnFlights[0]?.departure_airport?.city || "Arrive"} → ${returnFlights[0]?.arrival_airport?.city || "Depart"}`}
            </p>

            {showOutbound ? (
                // Show Outbound Flights
                <>
                    {outboundFlights && outboundFlights.length > 0 ? (
                        <>
                            <h3>Outbound Flights</h3>
                            {outboundFlights.map((flight) => (
                                <div
                                    key={flight.flight_number}
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        marginBottom: "15px",
                                    }}
                                >
                                    <p>
                                        <strong>Số hiệu chuyến bay:</strong>{" "}
                                        {flight.flight_number}
                                    </p>
                                    <p>
                                        <strong>Điểm đi:</strong>{" "}
                                        {flight.departure_airport.city} -{" "}
                                        {new Date(
                                            flight.departure_time
                                        ).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Điểm đến:</strong>{" "}
                                        {flight.arrival_airport.city} -{" "}
                                        {new Date(
                                            flight.arrival_time
                                        ).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Prices:</strong>
                                    </p>
                                    {flight.available_seats.map((seat) => (
                                        <div
                                            key={seat._id.$oid}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                margin: "10px 0",
                                            }}
                                        >
                                            <span>
                                                {seat.class_type}:{" "}
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(seat.price)}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleSelect(
                                                        flight,
                                                        seat.class_type
                                                    )
                                                }
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: "#007bff",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </>
                    ) : (
                        <p style={{ textAlign: "center", color: "#555" }}>
                            Không có máy bay nào phù hợp yêu cầu của bạn
                        </p>
                    )}
                    {tripType === "round-trip" && (
                        <button
                            onClick={() => setShowOutbound(false)}
                            style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Next
                        </button>
                    )}
                </>
            ) : (
                // Show Return Flights
                <>
                    {returnFlights && returnFlights.length > 0 ? (
                        <>
                            <h3>Return Flights</h3>
                            {returnFlights.map((flight) => (
                                <div
                                    key={flight.flight_number}
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        marginBottom: "15px",
                                    }}
                                >
                                    <p>
                                        <strong>Số hiệu chuyến bay:</strong>{" "}
                                        {flight.flight_number}
                                    </p>
                                    <p>
                                        <strong>Điểm đi:</strong>{" "}
                                        {flight.departure_airport.city} -{" "}
                                        {new Date(
                                            flight.departure_time
                                        ).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Điểm đến:</strong>{" "}
                                        {flight.arrival_airport.city} -{" "}
                                        {new Date(
                                            flight.arrival_time
                                        ).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Prices:</strong>
                                    </p>
                                    {flight.available_seats.map((seat) => (
                                        <div
                                            key={seat._id.$oid}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                margin: "10px 0",
                                            }}
                                        >
                                            <span>
                                                {seat.class_type}:{" "}
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(seat.price)}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleSelect(
                                                        flight,
                                                        seat.class_type
                                                    )
                                                }
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: "#28a745",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </>
                    ) : (
                        <p style={{ textAlign: "center", color: "#555" }}>
                            Không có máy bay nào phù hợp yêu cầu của bạn
                        </p>
                    )}
                    <button
                        onClick={() => setShowOutbound(true)}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Back
                    </button>
                </>
            )}
        </div>
    );
}

export default Booking;