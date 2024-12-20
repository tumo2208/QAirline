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
                const filtered = suggestions.filter((item) => {
                    if (!onlyPlaces) {
                        return (
                            item.city.toLowerCase().includes(query) ||
                            item.name.toLowerCase().includes(query) ||
                            item.airport_code.toLowerCase().includes(query)
                        );
                    } else {
                        return (
                            item.city.toLowerCase().includes(query)
                        )
                    }
                });

                update(query ? filtered : suggestions);
            },
            render: (item) => {
                const div = document.createElement("div");
                if (!onlyPlaces) {
                    div.textContent = `[${item.airport_code}] Sân bay ${item.name}, ${item.city}`;
                } else {
                    div.textContent = `${item.city}`;
                }                
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
                return div;
            },
            onSelect: (item) => {
                inputRef.current.valueOf = `${item.city}`;
                const suggestions_items = document.querySelectorAll(".suggestions-items");
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
