import React, { useEffect, useRef } from "react";
import autocompleter from "autocompleter";

export function AutocompleteInput({ suggestions , style}) {
    const inputRef = useRef(null);

    useEffect(() => {
        autocompleter({
            input: inputRef.current,
            fetch: (text, update) => {
                const query = text.toLowerCase();
                const filtered = suggestions.filter((item) => {
                    return (
                        item.city.toLowerCase().includes(query) ||
                        item.name.toLowerCase().includes(query) ||
                        item.airport_code.toLowerCase().includes(query)
                    );
                });

                update(query ? filtered : suggestions);
            },
            render: (item) => {
                const div = document.createElement("div");
                div.textContent = `[${item.airport_code}] Sân bay ${item.name}, ${item.city}`
                div.className = `
                    suggestions-items
                    px-4 py-2
                    text-sm
                    border
                    border-gray-200
                    cursor-pointer
                    bg-gray-300
                    hover:bg-gray-400
                    hover:text-gray-900
                `;
                return div;
            },
            onSelect: (item) => {
                inputRef.current.value = `${item.city} (${item.airport_code})`;
                const suggestions_items = document.querySelectorAll(".suggestions-items");
                suggestions_items.forEach((item) => {
                    item.className = "hidden";
                })
            },
        });
    }, [suggestions]);

    return (
        <input
            ref={inputRef}
            type="text"
            className={style}
        />
    );
}
