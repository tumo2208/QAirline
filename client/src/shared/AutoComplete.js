import React, { useEffect, useRef } from "react";
import autocompleter from "autocompleter";

export function AutocompleteInput({ suggestions , style, value, onChange, onlyPlaces}) {
    const inputRef = useRef("");

    useEffect(() => {
        autocompleter({
            input: inputRef.current,
            click: e => e.fetch(),
            keyup: e => e.fetch(),
            minLength: 0,
            fetch: (text, update) => {
                const query = text.toLowerCase();
                let domestic = [];
                let international = [];

                suggestions.forEach((item) => {
                    const matches = !onlyPlaces
                        ? item.city.toLowerCase().includes(query) ||
                        item.name.toLowerCase().includes(query) ||
                        item.airport_code.toLowerCase().includes(query)
                        : item.city.toLowerCase().includes(query);

                    if (matches) {
                        if (item.country.toLowerCase() === "vietnam") {
                            domestic.push({ ...item, groupHeaderShown: false });
                        } else {
                            international.push({ ...item, groupHeaderShown: false });
                        }
                    }
                });

                if (domestic.length > 0) {
                    domestic[0].groupHeaderShown = true;
                }
                if (international.length > 0) {
                    international[0].groupHeaderShown = true;
                }

                update([...domestic, ...international]);
            },

            render: (item) => {
                const container = document.createElement("div");

                // Add header
                if (item.groupHeaderShown) {
                    const header = document.createElement("div");
                    header.textContent = item.country === "Vietnam" ? "Trong nước" : "Nước ngoài";
                    header.className = "headerName font-bold text-gray-700 px-4 py-2 bg-gray-100";
                    container.appendChild(header);
                }

                // Render item
                const div = document.createElement("div");
                if (!onlyPlaces)
                    div.textContent = `[${item.airport_code}] Sân bay ${item.name}, ${item.city}`;
                else
                    div.textContent = `${item.city}`;
                div.className = `
                    suggestions-items
                    px-4 py-2
                    text-sm
                    border
                    border-gray-200
                    cursor-pointer
                    bg-sky-50
                    hover:bg-sky-200
                    hover:text-gray-900
                `;

                container.appendChild(div);

                return container;
            },

            onSelect: (item, event) => {
                inputRef.current.valueOf = `${item.city}`;
                const suggestions_items = document.querySelectorAll(".suggestions-items, .headerName");
                suggestions_items.forEach((item) => {
                    item.className = "hidden";
                })
                onChange({target : { value: item.city} });
            },
        });
    }, [suggestions, onChange, onlyPlaces]);

    return (
        <input
            ref={inputRef}
            type="text"
            className={style}
            value={value}
            onChange={onChange}
        />
    );
}
