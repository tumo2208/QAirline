import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function FlightSelection() {
    const { state } = useLocation();
    const { flights, tripType } = state;
    const navigate = useNavigate();

    const [showOutbound, setShowOutbound] = useState(true);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);

    let outboundFlights = [];
    let returnFlights = [];

    if (tripType === "round-trip") {
        outboundFlights = flights?.outboundFlights || [];
        returnFlights = flights?.returnFlights || [];
    } else if (tripType === "one-way") {
        outboundFlights = flights || [];
    }

    const handleSelect = (flight, classType) => {
        if (showOutbound) {
            setSelectedOutbound({
                flight,
                classType,
            });
        } else {
            setSelectedReturn({
                flight,
                classType,
            });
        }
    };

    const navigateToPassengers = (selectedFlights) => {
        navigate("/booking/passengers", { state: { flights: selectedFlights } });
    }

    const handleNext = () => {
        if (tripType === "one-way") {
            if (!selectedOutbound) {
                alert("Please select your flight.");
                return;
            }
            navigateToPassengers({ outbound: selectedOutbound });
        } else if (tripType === "round-trip") {
            if (showOutbound) {
                if (!selectedOutbound) {
                    alert("Please select your outbound flight.");
                    return;
                }
                setShowOutbound(false);
            } else {
                if (!selectedReturn) {
                    alert("Please select your return flight.");
                    return;
                }
                navigateToPassengers({ outbound: selectedOutbound, return: selectedReturn });
            }
        }
    }

    const handleBack = () => {
        setShowOutbound(true);
    };

    const totalCost =
        (selectedOutbound?.flight?.available_seats.find((seat) => seat.class_type === selectedOutbound.classType)?.price || 0) +
        (selectedReturn?.flight?.available_seats.find((seat) => seat.class_type === selectedReturn.classType)?.price || 0);

    return (
        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "65%" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    {showOutbound ? "Outbound Flights" : "Return Flights"}
                </h2>
                {showOutbound ? (
                    <>
                        {outboundFlights.length > 0 ? (
                            outboundFlights.map((flight) => (
                                <FlightCard key={flight.flight_number} flight={flight} onSelect={handleSelect} />
                            ))
                        ) : (
                            <p>No flights are available for the outbound route.</p>
                        )}
                    </>
                ) : (
                    <>
                        {returnFlights.length > 0 ? (
                            returnFlights.map((flight) => (
                                <FlightCard key={flight.flight_number} flight={flight} onSelect={handleSelect} />
                            ))
                        ) : (
                            <p>No flights are available for the return route.</p>
                        )}
                    </>
                )}
            </div>

            {outboundFlights.length > 0 && (
                <div
                    style={{
                        width: "30%",
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        height: "fit-content",
                    }}
                >
                    <h3>Selected Flights</h3>
                    {selectedOutbound && (
                        <p>
                            Outbound: {selectedOutbound.flight.flight_number} ({selectedOutbound.classType})
                        </p>
                    )}
                    {selectedReturn && (
                        <p>
                            Return: {selectedReturn.flight.flight_number} ({selectedReturn.classType})
                        </p>
                    )}
                    <h4>Total Cost: {totalCost.toLocaleString("en-US", { style: "currency", currency: "VND" })}</h4>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "20px",
                        }}
                    >
                        {tripType === "round-trip" && !showOutbound && (
                            <button
                                onClick={handleBack}
                                style={{
                                    marginTop: "20px",
                                    padding: "10px 20px",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    display: "block",
                                }}
                            >
                                Back to Outbound Flights
                            </button>
                        )}
                        <button
                            onClick={handleNext}
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
                            {tripType === "one-way" ? "Confirm Selection" : showOutbound ? "Next to Return Flights" : "Confirm Selection"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function FlightCard({ flight, onSelect }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "15px",
            }}
        >
            <p>
                <strong>Flight Number:</strong> {flight.flight_number}
            </p>
            <p>
                <strong>Departure:</strong> {flight.departure_airport.city} -{" "}
                {new Date(flight.departure_time).toLocaleString()}
            </p>
            <p>
                <strong>Arrival:</strong> {flight.arrival_airport.city} -{" "}
                {new Date(flight.arrival_time).toLocaleString()}
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
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "VND" }).format(seat.price)}
                    </span>
                    <button
                        onClick={() => onSelect(flight, seat.class_type)}
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
    );
}

export default FlightSelection;