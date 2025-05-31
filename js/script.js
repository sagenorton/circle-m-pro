function loadGoogleMapsApi() {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
        console.warn("Google Maps API is already loaded.");
        return;
    }

    const existingScript = document.querySelector("script[src*='maps.googleapis.com']");
    if (existingScript) {
        console.warn("Google Maps API script already exists.");
        return;
    }

    const apiKey = window.MAPS_API_KEY;
    if (!apiKey || apiKey.includes("%%")) {
        console.error("Google Maps API Key is missing or not replaced correctly.");
        return;
    }

    // Create and append the script asynchronously
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => console.log("Google Maps API successfully loaded.");
    document.head.appendChild(script);
}



/* --------------------- Initialize Google Places Autocomplete -------------------------- */
function initializeAutocomplete() {
    const addressInput = document.getElementById("address");

    if (addressInput) {
        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
            types: ["geocode"] // Suggest only address locations
        });

        // Add event listener to handle when a user selects an address
        autocomplete.addListener("place_changed", function () {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                console.error("No details available for input: " + addressInput.value);
                return;
            }
            // Auto-fill the address input field with the selected place
            addressInput.value = place.formatted_address;
            console.log("Selected Address:", place.formatted_address);
        });

        console.log("Google Places Autocomplete initialized and selection event added.");
    }

}

// Initialize Google Maps API and Autocomplete
window.initMap = function () {
    console.log("Google Maps API loaded successfully.");
    initializeAutocomplete(); // Ensure autocomplete is initialized when Maps API is ready
};




/* --------------------- Material and pricing data -------------------------- */
const materialData = {
    // Soils
    "3_way_garden_soil": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 39.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 47.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    "barrtech": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 39.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 41.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    "bedding_sand": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 21.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 13.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    "bio_infiltration_soil": {
        "sold_by": "yard",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 34.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    "bio_retention_soil": {
        "sold_by": "yard",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 34.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    "bio_retention_soil_no_sandy_loam": {
        "sold_by": "yard",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 34.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    "economy_topsoil": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 12.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 12.00, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    "organic_cert_garden_soil": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 31.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 32.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 24.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 40, "max": 40, "rate": 185}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 50, "max": 50, "rate": 185}
        ]
    },
    "premium_screened_topsoil": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 28.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 24.00, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    "premium_turf": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 30.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 28.00, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    "sandy_loam": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 23.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 21.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "DC PIT", "address": "611 W Denison-Chattaroy Rd, Deer Park, WA 99006", "price": 12.00, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 185}
        ]
    },
    // Sand and Gravel
    "1_minus_crushed_structural": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 11.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "3_minus_crushed_concrete": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 9.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "3_minus_structural_round": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 17.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 9.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "58_114_basalt_minus_gravel": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 25.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 26.25, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Perry PIT", "address": "13302 N Perry St, Spokane, WA 99208", "price": 21.45, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Cooridor PIT", "address": "47.683646613378116, -117.55831219627463", "price": 12.38, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "58_114_granite_minus_gravel": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 22.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 24.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "JMAC PIT", "address": "47.728763, -117.034429", "price": 12.38, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "CDA PIT", "address": "47.716832, -117.035684", "price": 14.85, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "asphalt_grindings": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 38.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 34.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hattenburgs PIT", "address": "47.757245449473906, -117.36542930230672", "price": 29.00, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "c33_sand": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 21.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 13.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "course_sand": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 21.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 13.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "pea_gravel": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 27.25, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 31.25, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Sullivan Pre-Mix PIT", "address": "1902 N Sullivan Rd, Spokane Valley, WA 99216", "price": 18.15, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "sand_gravel_concrete_mix": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 36.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 36.00, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "white_sand": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 97.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Lane Mountain PIT", "address": "3119 WA-231, Valley, WA 99181", "price": 74.00, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    // Rocks
    "1_12_rainbow_river_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 88.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 97.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "1_14_champagne_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 124.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 122.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "White Stone Calcium PIT", "address": "2432 US-395, Chewelah, WA 99109", "price": 102.60, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "1_14_china_white_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 126.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "White Stone Calcium PIT", "address": "2432 US-395, Chewelah, WA 99109", "price": 104.50, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "1_granite_chips": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 42.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "CDA Paving & Concrete PIT", "address": "47.716832, -117.035684", "price": 31.35, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "1_to_3_basalt_chips": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 35.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 39.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "HardRock PIT", "address": "47.339342, -116.827806", "price": 17.10, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "2_blueslate_woodstone": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 77.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 69.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Iron Mountain/Scrivanich PIT", "address": "48.29835281266716, -117.14118002098378", "price": 47.25, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "2_elk_hide": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 58.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 62.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Elk Hide PIT", "address": "47.332319, -116.538415", "price": 31.50, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "34_river_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 35.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 39.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "JMAC PIT", "address": "47.728763, -117.034429", "price": 19.95, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "1_12_river_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 35.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 39.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "JMAC PIT", "address": "47.728763, -117.034429", "price": 19.95, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "2_4_river_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 37.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 40.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "CDA Paving & Concrete PIT", "address": "47.716832, -117.035684", "price": 26.60, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "34_114_basalt_chips": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 35.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 39.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "HardRock PIT", "address": "47.339342, -116.827806", "price": 17.10, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "58_2_2_to_6_riverbed_mix": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 65.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 65.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "autumn_gold": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 74.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 70.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Lane Mountain PIT", "address": "3119 WA-231, Valley, WA 99181", "price": 53.20, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "black_lava_rock": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 124.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 124.50, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "red_lava_rock": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 107.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 107.00, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    // Barks
    "aged_dark_fines": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 35.50, "trucks": ["truck_A", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 36.50, "trucks": ["truck_A", "truck_C"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 27.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 15, "rate": 120}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 70, "max": 70, "rate": 185}
        ]
    },
    "engineered_playground_chips": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 53.00, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 54.00, "trucks": ["truck_A"] },
            { "name": "Premiere PIT", "address": "48.181955, -117.006770", "price": 47.25, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 120}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 185}
        ]
    },
    "fresh_fines": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 32.50, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 33.50, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 27.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 120}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 185}
        ]
    },
    "large_nugget": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 59.00, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 60.00, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 54.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 120}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 185}
        ]
    },
    "medium_fine": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 32.50, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 33.50, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 27.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 120}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 185}
        ]
    },
    "medium_shred": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 28.50, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 29.50, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 22.50, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 120}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 185}
        ]
    },
    "small_nugget": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 91.00, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 90.00, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 85.50, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 120}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 185}
        ]
    },
    // Boulders
    "fractured_granite": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 118.00, "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "New Port Equipment PIT", "address": "328772 U.S. Rte 2, Newport, WA 99156", "price": 93.00, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_E"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_E": [
            {"name": "Transfer Truck", "min": 16, "max": 30, "rate": 185}
        ]
    },
    "round_basalt": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 83.00, "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "Cheney Boulder PIT", "address": "47.46744669160258, -117.545016359873", "price": 75.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_E"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_E": [
            {"name": "Transfer Truck", "min": 16, "max": 30, "rate": 185}
        ]
    },
    "round_granite": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 97.00, "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "Post Falls Pleasant View Interstate PIT", "address": "1545 N Pleasant View Rd, Post Falls, ID 83854", "price": 75.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "JMAC PIT", "address": "47.728763, -117.034429", "price": 75.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_E"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_E": [
            {"name": "Transfer Truck", "min": 16, "max": 30, "rate": 185}
        ]
    },
    "valley_boulders": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 132.00, "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "Weusthoff Excavation PIT", "address": "48.187739, -117.730438", "price": 108.50, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_E"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_E": [
            {"name": "Transfer Truck", "min": 16, "max": 30, "rate": 185}
        ]
    },
    // Deicer Salts
    "bulk_ice_kicker_blue_salt": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 253.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Marietta PIT", "address": "15201 E Marietta Ave, Spokane Valley, WA 99216", "price": 208.50, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "bulk_white_quicksalt": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 225.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Marietta PIT", "address": "15201 E Marietta Ave, Spokane Valley, WA 99216", "price": 184.50, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "deicing_salt_sand_mix": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 48.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 45.00, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    },
    "deicing_salt_sand_torp_mix": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 54.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 51.00, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 120}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 160}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 185}
        ]
    }
};


const truckNames = {
    "truck_A": "Small Truck",
    "truck_B": "Solo Truck",
    "truck_C": "Super Truck",
    "truck_D": "Semi Truck",
    "truck_E": "Transfer Truck"
};

const yardLocations = {
    "I90 Yard": "1820 N University Rd, Spokane Valley, WA 99206",
    "Hawthorne Yard": "1208 E Hawthorne Rd, Spokane, WA 99217"
};





/* --------------------- Function to update unit restrictions dynamically -------------------------- */
function updateUnitRestrictions() {
    const materialSelect = document.getElementById("material");
    const selectedOption = materialSelect.options[materialSelect.selectedIndex];
    const selectedMaterial = selectedOption.value;
    const unit = selectedOption.getAttribute("data-unit");
    const tonsInput = document.getElementById("tonsNeeded");

    // Get material info
    const materialInfo = materialData[selectedMaterial];
    if (!materialInfo) {
        console.error(`Material info not found for ${selectedMaterial}`);
        return;
    }

    // Ensure minCapacities pulls all valid truck data
    let minCapacities = materialInfo.locations.flatMap(location =>
        location.trucks
            .map(truckType => materialInfo[truckType] || [])
            .flat()
            .map(truck => truck.min)
            .filter(Boolean)
    );

    // Ensure minCapacities has at least one valid entry before setting min value
    let minCapacity = minCapacities.length > 0 ? Math.min(...minCapacities) : 3;
    tonsInput.min = minCapacity;

    tonsInput.placeholder = `Enter amount needed in ${unit}s`;

    const semiOptionDiv = document.getElementById("semiTruckOption");
    const allowSemiCheckbox = document.getElementById("allowSemi");

    // Check if any location for the selected material supports truck_D (semi)
    const hasSemi = materialInfo.locations.some(loc => loc.trucks.includes("truck_D"));

    if (hasSemi) {
        semiOptionDiv.style.display = "block";
    } else {
        semiOptionDiv.style.display = "none";
        allowSemiCheckbox.checked = true; // Default to allow if not shown
    }
}






/* --------------------- Validate user inputs -------------------------- */
function validateInput(tonsNeeded, dropOffAddress) {
    const addressField = document.getElementById("address");
    const tonsField = document.getElementById("tonsNeeded");
    const addressHelper = document.getElementById("address-help");
    const tonsHelper = document.getElementById("tons-help");

    // Reset previous errors
    addressField.style.border = "";
    tonsField.style.border = "";
    addressHelper.style.display = "none";
    tonsHelper.style.display = "none";

    // Validate drop-off address
    if (!dropOffAddress.trim()) {
        addressField.style.border = "2px solid red";
        addressHelper.style.display = "block";
        addressHelper.textContent = "Please enter a valid drop-off address.";
        return false;
    }

    // Validate tons/yards needed
    const min = parseInt(tonsField.min);
    if (isNaN(tonsNeeded) || tonsNeeded < min ) {
        tonsField.style.border = "2px solid red";
        tonsHelper.style.display = "block";
        tonsHelper.textContent = `Please enter a value of ${min} or more.`;
        return false;
    }

    return true;
}





/* --------------------- Calculate distances using Google Distance Matrix API -------------------------- */
async function calculateDistances(routes) {
    const service = new google.maps.DistanceMatrixService();
    const addressHelper = document.getElementById("address-help");

    let results = [];

    // Create promises for each route to calculate distances
    const distancePromises = routes.map(route =>
        new Promise((resolve) => {
            service.getDistanceMatrix({
                origins: [route.origin],
                destinations: [route.destination],
                travelMode: "DRIVING",
                unitSystem: google.maps.UnitSystem.IMPERIAL
            }, (response, status) => {
                if (status === "OK") {
                    const result = response.rows[0].elements[0];
                    if (result.status === "OK") {
                        resolve({
                            from: route.origin,
                            to: route.destination,
                            distance: result.distance.text,
                            duration: Math.ceil(result.duration.value / 60) // Convert duration to minutes
                        });
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            });
        })
    );

    try {
        // Wait for all distance calculations to complete
        results = await Promise.all(distancePromises);
        results = results.filter(Boolean); // Remove failed calculations

        if (!results || results.length === 0) {
            console.error("No valid distances returned from Google API.");
            return [];
        }

        return results;
    } catch (error) {
        console.error("Error calculating distances:", error);
        addressHelper.textContent = "Error calculating distances. Try again.";
        addressHelper.style.display = "block";
        return [];
    }
}






/* --------------------- Get the closest yard location to the drop-off address -------------------------- */
async function getClosestYard(dropOffAddress) {
    // Check if the drop-off address is provided
    if (!dropOffAddress) {
        console.error("Error: getClosestYard called without a valid drop-off address.");
        return null;
    }

    // Define the yard locations with their addresses
    const yardLocations = {
        "I90 Yard": "1820 N University Rd, Spokane Valley, WA 99206",
        "Hawthorne Yard": "1208 E Hawthorne Rd, Spokane, WA 99217"
    };

    // Create routes for each yard location from the drop-off address
    let routes = Object.entries(yardLocations).map(([name, address]) => ({
        origin: dropOffAddress,
        destination: address,
        yardName: name
    }));

    // Calculate distances for the routes
    let distances = await calculateDistances(routes);

    // Check if distances were returned
    if (!distances || distances.length === 0) {
        console.error("No distances returned. Unable to determine closest yard.");
        return null;
    }

    // Map distances to include numeric distance and yard details
    distances = distances.map((d, index) => ({
        ...d,
        numericDistance: parseFloat(d.distance.replace(/[^\d.]/g, '')),
        yardName: routes[index].yardName,
        yardAddress: routes[index].destination
    }));

    // Find the closest yard based on numeric distance
    let closestYard = distances.reduce((min, curr) =>
        curr.numericDistance < min.numericDistance ? curr : min
    );

    console.log('Closest Yard to Drop-off Location:', closestYard.yardName);

    // Return the details of the closest yard
    return {
        yardName: closestYard.yardName,
        yardAddress: closestYard.yardAddress,
        duration: closestYard.duration,
        distance: closestYard.numericDistance
    };
}





/* --------------------- Determine the best truck loads for Yards -------------------------- */
async function calculateYardTruckLoads(remaining, materialInfo, location) {
    let yardLoads = [];
    const yardTrucks = [];

    if (!location || !location.trucks || !Array.isArray(location.trucks)) {
        console.error(`ERROR: Invalid or missing truck data for ${location?.name || 'undefined location'}.`);
        return { yardLoads, remaining };
    }

    location.trucks.forEach(truckType => {
        let trucks = materialInfo[truckType] || [];
        trucks.forEach(truck => yardTrucks.push({ ...truck, type: truckType }));
    });

    if (yardTrucks.length === 0) {
        console.error(`No yard trucks available for ${location.name}.`);
        return { yardLoads, remaining };
    }

    yardTrucks.sort((a, b) => b.max - a.max);

    const originalRemaining = remaining;

    while (remaining > 0) {
        let bestYardTruck = yardTrucks.find(truck => remaining >= truck.min) || yardTrucks[0];

        if (!bestYardTruck) {
            console.error(`No suitable yard truck found for ${remaining} tons.`);
            break;
        }

        let loadAmount = Math.min(bestYardTruck.max, remaining);
        remaining -= loadAmount;

        yardLoads.push({
            truckName: bestYardTruck.name,
            amount: loadAmount,
            rate: bestYardTruck.rate
        });

        if (remaining <= 0) break;
    }

    // STEP 2: Add special Truck B + B combo as alternative, if valid
    const truckBOptions = (materialInfo["truck_B"] || []).filter(t => t.name === "Solo Truck");
    const hasTruckB = location.trucks.includes("truck_B") && truckBOptions.length > 0;

    const withinSpecialRange = (
        (materialInfo.sold_by === "yard" && originalRemaining >= 20 && originalRemaining <= 30) ||
        (materialInfo.sold_by === "ton" && originalRemaining >= 25 && originalRemaining <= 30)
    );

    if (hasTruckB && withinSpecialRange) {
        const truckB = truckBOptions[0];

        let combo = [];
        let tempRemaining = originalRemaining;

        const fullB = truckB.max;
        let secondB = Math.min(fullB, tempRemaining - fullB);

        if (tempRemaining >= truckB.min + truckB.min && secondB >= truckB.min) {
            combo.push({ truckName: truckB.name, amount: fullB, rate: truckB.rate });
            combo.push({ truckName: truckB.name, amount: secondB, rate: truckB.rate });

            console.log(`Evaluating special B+B yard combo for ${location.name}:`, combo);

            // Store alternative load plan to compare in `calculateCost`
            if (!location.alternativeCombos) location.alternativeCombos = [];
            location.alternativeCombos.push({ yardLoads: combo });
        }
    }

    // Cache original combo as usual
    location.precomputedYardLoads = yardLoads;
    console.log(`Yard Truck Loads for ${location.name}:`, yardLoads);

    return { yardLoads, remaining };
}







/* --------------------- Core function to calculate costs for Yards -------------------------- */
async function computeYardCosts(truckLoadInfo, yard, distances, addressInput, materialInfo, suppressLogs = false) {
    let totalCost = 0;
    let detailedCosts = [];

    // Ensure we have valid distances
    if (!distances || distances.length === 0) {
        if (!suppressLogs) {
            console.warn(`No distances found for ${yard.name}. Fetching new distances.`);
        }

        if (!addressInput) {
            if (!suppressLogs) {
                console.error("ERROR: addressInput is missing! Cannot fetch distances.");
            }
            return { totalCost: Infinity, detailedCosts: [], location: yard };
        }

        // Calculate distances if not available
        distances = await calculateDistances([{ origin: yard.address, destination: addressInput }]);

        if (!distances || distances.length === 0) {
            if (!suppressLogs) {
                console.error(`ERROR: No valid distances retrieved for ${yard.name}.`);
            }
            return { totalCost: Infinity, detailedCosts: [], location: yard };
        }
    }

    // Check if initial drive time is available, if not, find it from distances
    if (!yard.initialDriveTime) {
        let driveTimeEntry = distances.find(d =>
            d.from.trim().toLowerCase() === yard.address.trim().toLowerCase() ||
            d.to.trim().toLowerCase() === yard.address.trim().toLowerCase()
        );

        if (!driveTimeEntry) {
            if (!suppressLogs) {
                console.error(`ERROR: Could not find matching drive time for yard ${yard.name}`);
            }
            return { totalCost: Infinity, detailedCosts: [], location: yard };
        }

        yard.initialDriveTime = driveTimeEntry.duration;
    }

    let driveTime = yard.initialDriveTime || 0;

    if (!driveTime) {
        let driveTimeEntry = distances.find(d =>
            d.from.trim().toLowerCase() === yard.address.trim().toLowerCase() ||
            d.to.trim().toLowerCase() === yard.address.trim().toLowerCase()
        );

        if (driveTimeEntry) {
            driveTime = driveTimeEntry.duration;
            yard.initialDriveTime = driveTime;
        }
    }

    if (!truckLoadInfo || !Array.isArray(truckLoadInfo) || truckLoadInfo.length === 0) {
        if (!suppressLogs) {
            console.error(`ERROR: No valid truck loads for ${yard.name}.`);
        }
        return { totalCost: Infinity, detailedCosts: [], location: yard };
    }

    // Calculate the cost for each yard load
    for (let load of truckLoadInfo) {
        if (!load.amount || !load.rate) {
            if (!suppressLogs) {
                console.warn("Skipping invalid load data:", load);
            }
            continue;
        }

        // Calculate cost per unit and cost per load
        if (!load.amount || isNaN(load.amount) || !load.rate || isNaN(load.rate)) {
            if (!suppressLogs) {
                console.error(`ERROR: Invalid truck load data for ${load.truckName}:`, load);
            }
            continue;
        }

        let costPerUnit = (((((driveTime * 2 * 1.15) + 36) / 60) * load.rate) / (load.amount || 1)) + (yard.price || 0);

        if (isNaN(costPerUnit) || !isFinite(costPerUnit)) {
            if (!suppressLogs) {
                console.error(`ERROR: Invalid costPerUnit for ${load.truckName}. Defaulting to $0.`);
            }
            costPerUnit = 0;
        }

        let costPerLoad = costPerUnit * load.amount;
        detailedCosts.push({
            truckName: load.truckName,
            rate: load.rate,
            amount: load.amount,
            costPerUnit,
            costPerLoad
        });

        totalCost += costPerLoad;
    }

    if (isNaN(totalCost) || totalCost === 0) {
        if (!suppressLogs) {
            console.error(`ERROR: Total Cost calculation failed for yard ${yard.name}. Returning 'Infinity'.`);
        }
        return { totalCost: Infinity, detailedCosts: [], location: yard };
    }

    // Suppress logs if suppressLogs is true
    if (!suppressLogs) {
        console.log("===================================");
        console.log("Yard Calculation:");
        console.log(`Yard Chosen: ${yard.name}, ${yard.address}`);
        console.log(`Base Price: $${yard.price}`);
        console.log(`Duration to Drop Off: ${driveTime} min`);
        console.log(`Round Trip Duration: ${(driveTime * 2).toFixed(2)} min`);
        console.log(`Number of Trips: ${truckLoadInfo.length}`);
        console.log(`Total Duration: ${(truckLoadInfo.length * driveTime * 2).toFixed(2)} min`);
    }

    // Group trucks and suppress logs if needed
    let groupedTrucks = {};
    truckLoadInfo.forEach(load => {
        const truckGroupKey = `${load.truckName}-${load.amount}-${load.rate}`;
        if (!groupedTrucks[truckGroupKey]) {
            groupedTrucks[truckGroupKey] = {
                count: 0,
                amount: load.amount,
                costPerUnit: (((driveTime * 2 * 1.15 + 36) / 60 * load.rate) / load.amount + yard.price),
                truckName: load.truckName
            };
        }
        groupedTrucks[truckGroupKey].count++;
    });

    if (!suppressLogs) {
        // Log grouped trucks
        Object.values(groupedTrucks).forEach(truck => {
            console.log(`  • ${truck.count} ${truck.truckName}(s) of ${truck.amount} ${materialInfo.sold_by}s at $${truck.costPerUnit.toFixed(2)} per ${materialInfo.sold_by}`);
        });

        console.log(`\nFinal Total: $${totalCost.toFixed(2)}`);
        console.log("===================================");
    }

    return { totalCost, detailedCosts, location: yard };
}






/* --------------------- Determine the best truck loads for Pits -------------------------- */
async function calculatePitTruckLoads(amountNeeded, materialInfo, location, finalClosestYard, distances, addressInput) {
    let pitLoads = [];
    let yardLoads = [];
    let yardAssignment = null;

    console.log(`Processing Pit Trucks for: ${location.name}`);

    if (!location || !location.trucks || !Array.isArray(location.trucks)) {
        console.error(`ERROR: Invalid or missing truck data for ${location?.name || 'undefined location'}.`);
        return { pitLoads, yardLoads: [], totalCost: 0 };
    }

    if (!materialInfo || !materialInfo.locations) {
        console.error("ERROR: Material info is missing or incomplete.");
        return { pitLoads, yardLoads: [], totalCost: 0 };
    }

    let pitTrucks = [];
    location.trucks.forEach(truckType => {
        let trucks = materialInfo[truckType] || [];
        trucks.forEach(truck => pitTrucks.push({ ...truck, type: truckType }));
    });

    // Sort pit trucks by max capacity (largest trucks first)
    pitTrucks.sort((a, b) => b.max - a.max);

    // === Special Case: Add Truck B + Truck B Combo if Applicable ===
    const truckBInfo = pitTrucks.find(truck => truck.name.toLowerCase().includes("b"));
    const isWithinSpecialRange = (
        (materialInfo.sold_by === "yard" && amountNeeded >= 20 && amountNeeded <= 30) ||
        (materialInfo.sold_by === "ton" && amountNeeded >= 25 && amountNeeded <= 30)
    );    

    if (isWithinSpecialRange && truckBInfo) {
        const firstLoad = truckBInfo.max;
        const secondLoad = amountNeeded - firstLoad;

        if (secondLoad > 0 && secondLoad >= truckBInfo.min && secondLoad <= truckBInfo.max) {
            console.log("Evaluating alternative Truck B + B combo at PIT:", location.name);
            pitLoads.push(
                { truckName: truckBInfo.name, amount: firstLoad, rate: truckBInfo.rate, max: truckBInfo.max },
                { truckName: truckBInfo.name, amount: secondLoad, rate: truckBInfo.rate, max: truckBInfo.max }
            );
        }
    }

    // === Standard Grouping Logic ===
    let groupedLoads = {};
    let tempRemaining = amountNeeded;

    while (tempRemaining > 0) {
        let bestPitTruck = pitTrucks.find(truck => tempRemaining >= truck.min);

        if (!bestPitTruck) {
            bestPitTruck = pitTrucks[0];
            if (tempRemaining < bestPitTruck.min) {
                console.warn(`Remaining ${tempRemaining} tons does not meet any pit truck's minimum. Assigning to the yard: ${finalClosestYard}`);
                break;
            }
        }

        let loadAmount = Math.min(bestPitTruck.max, tempRemaining);
        tempRemaining -= loadAmount;

        if (!groupedLoads[bestPitTruck.name]) {
            groupedLoads[bestPitTruck.name] = [];
        }

        groupedLoads[bestPitTruck.name].push({
            truckName: bestPitTruck.name,
            amount: loadAmount,
            rate: bestPitTruck.rate,
            max: bestPitTruck.max
        });
    }

    for (let truckName in groupedLoads) {
        pitLoads = pitLoads.concat(groupedLoads[truckName]);
    }

    // Assign remaining to yard if needed
    if (tempRemaining > 0) {
        yardAssignment = await assignToYard(
            tempRemaining,
            materialInfo,
            finalClosestYard,
            distances,
            addressInput,
            true
        );
        yardLoads = yardAssignment ? yardAssignment.yardLoads : [];
    }

    console.log(`Completed Pit Load Calculation for: ${location.name}, remaining = ${tempRemaining}`);

    // Check if the last load is a small truck or solo truck
    let splitPitYardCombo = null;

    const lastPitLoad = pitLoads[pitLoads.length - 1];
    const usesSmallOrSolo = lastPitLoad && (
        lastPitLoad.truckName.toLowerCase().includes("small") ||
        lastPitLoad.truckName.toLowerCase().includes("solo")
    );

    const pitLoadsWithoutLast = pitLoads.slice(0, -1);
    const totalPitAmountWithoutLast = pitLoadsWithoutLast.reduce((sum, load) => sum + load.amount, 0);
    const possibleSplitAmount = amountNeeded - totalPitAmountWithoutLast;

    if (usesSmallOrSolo && possibleSplitAmount > 0 && possibleSplitAmount <= 15) {
        const altYard = await assignToYard(
            possibleSplitAmount,
            materialInfo,
            finalClosestYard,
            distances,
            addressInput,
            false
        );

        if (altYard && altYard.yardLoads.length > 0 && isFinite(altYard.totalCost)) {
            // Compute PIT details only for the trimmed pitLoads
            const pitDistances = await calculateDistances([
                { origin: location.closest_yard, destination: location.address },
                { origin: location.address, destination: addressInput },
                { origin: addressInput, destination: yardLocations[finalClosestYard] }
            ]);

            const pitCostData = await computePitCosts(
                pitLoadsWithoutLast,
                location,
                pitDistances,
                addressInput,
                [], // no yardLoads for this PIT portion
                0,
                materialInfo,
                yardLocations,
                totalPitAmountWithoutLast
            );

            // Merge outputs for accurate display and breakdown
            splitPitYardCombo = {
                pitLoads: pitLoadsWithoutLast,
                yardLoads: altYard.yardLoads,
                totalCost: pitCostData.totalCost + altYard.totalCost,
                label: "PIT+YARD Split Combo",
                location: location,
                detailedCosts: [
                    ...(pitCostData?.detailedCosts || []),
                    ...(altYard.yardCostData?.detailedCosts || [])
                ],
                logOutput: `${pitCostData?.logOutput || ''}\n\n${altYard.yardCostData?.logOutput || ''}`
            };

            splitPitYardCombo.sourceType = "pit+yard";
            splitPitYardCombo.sourceAddress = location.address;
            splitPitYardCombo.closestYardAddress = yardLocations[finalClosestYard];

        }
    }

    return {
        pitLoads,
        yardLoads,
        totalCost: yardAssignment ? yardAssignment.totalCost : 0,
        splitPitYardCombo
    };
}







/* --------------------- Assign remaining load to the closest yard -------------------------- */
async function assignToYard(remaining, materialInfo, finalClosestYard, distances, addressInput, suppressLogs = false) {
    if (!suppressLogs) {
        console.log(`Assigning ${remaining} tons to the closest yard: ${finalClosestYard}`);
    }

    // Find which yards actually have this material
    const availableYards = materialInfo.locations.filter(loc => loc.name.includes("Yard"));

    // Check if `finalClosestYard` has the material
    const finalClosestYardHasMaterial = availableYards.some(yard => yard.name === finalClosestYard);

    // If `finalClosestYard` doesn’t have it, find another yard that does
    let assignedYard = finalClosestYardHasMaterial ? finalClosestYard : null;

    if (!assignedYard) {
        // Pick the only other yard available
        let alternativeYard = availableYards.find(yard => yard.name !== finalClosestYard);

        if (alternativeYard) {
            assignedYard = alternativeYard.name;
            if (!suppressLogs) {
                console.log(`${finalClosestYard} does NOT have this material. Using alternative yard: ${assignedYard}`);
            }
        } else {
            if (!suppressLogs) {
                console.error(`ERROR: No available yards carry this material.`);
            }
            return { yardLoads: [], totalCost: Infinity };
        }
    }

    // Assign the remaining load to the correct yard
    if (!suppressLogs) {
        console.log(`Assigning remaining ${remaining} tons to: ${assignedYard}`);
    }
    let yardLocation = materialInfo.locations.find(loc => loc.name === assignedYard);
    if (!yardLocation) {
        if (!suppressLogs) {
            console.error(`ERROR: Could not find yard address for ${assignedYard}.`);
        }
        return { yardLoads: [], totalCost: Infinity };
    }

    // Compute the yard truck loads
    let yardResult = await calculateYardTruckLoads(remaining, materialInfo, yardLocation);

    // Compute costs for the assigned yard, passing suppressLogs flag
    let yardCostData = await computeYardCosts(
        yardResult.yardLoads,
        yardLocation,
        distances,
        addressInput,
        materialInfo,
        suppressLogs // Pass suppressLogs to suppress assigned yard logs
    );

    return {
        yardLoads: yardResult.yardLoads,
        totalCost: yardCostData.totalCost,
        yardCostData: yardCostData
    };
}








/* --------------------- Core function to compute costs for Pits -------------------------- */
async function computePitCosts(pitLoads, pit, distances, addressInput, yardLoads, yardTotalCost, materialInfo, yardLocations, amountNeeded) {

    // Ensure these values are defined to prevent errors
    yardTotalCost = yardTotalCost || 0;
    materialInfo = materialInfo || {};
    amountNeeded = amountNeeded || 0;


    // Check if there are valid pit truck loads
    if (!pitLoads || pitLoads.length === 0) {
        console.error(`ERROR: No valid pit truck loads found for ${pit.name}`);
        return { totalCost: Infinity };
    }

    // Get the closest yard data based on distance (not material availability)
    const closestYardData = await getClosestYard(addressInput);
    if (!closestYardData) {
    console.error("ERROR: Could not determine closest yard.");
    return { totalCost: Infinity };
    }

    const finalClosestYard = closestYardData.yardName;
    let driveTimeDropToYard = closestYardData.duration;

    // Ensure yardLocations is defined before using it
    if (!yardLocations || !yardLocations[finalClosestYard]) {
    console.error(`ERROR: Yard location not found in yardLocations for ${finalClosestYard}.`);
    return { totalCost: Infinity };
    }

    let totalCost = 0;
    let detailedCosts = [];

    // Find the drive times for the journey
    let driveTimeYardToPit = distances.find(d => d.from.includes(pit.closest_yard) || d.to.includes(pit.closest_yard))?.duration;
    let driveTimePitToDrop = distances.find(d => d.from.trim() === pit.address.trim())?.duration;

    if (!driveTimeYardToPit || !driveTimePitToDrop) {
        console.error(`ERROR: Missing drive time for ${pit.name}.`);
        return;
    }

    // Calculate the total load amount and the number of trips needed
    const totalLoadAmount = pitLoads.reduce((sum, load) => sum + load.amount, 0);
    let tripCount = Math.ceil(totalLoadAmount / pitLoads[0].max);

    // Calculate the total drive time for all trips
    let totalDriveTime = driveTimeYardToPit + (driveTimePitToDrop * (tripCount * 2 - 1)) + driveTimeDropToYard;

    // Adjust the travel time with a multiplier
    let adjustedTravelTime = totalDriveTime * 1.15;

    // Calculate the final total journey time including load/unload time
    let totalJourneyTime = adjustedTravelTime + (36 * tripCount);

    lastJourneyTime = totalJourneyTime;

    // Calculate the cost for each pit load
    pitLoads.forEach(load => {
        if (!load.amount || isNaN(load.amount) || !load.rate || isNaN(load.rate)) {
            console.error(`ERROR: Invalid pit load found:`, load);
            return;
        }

        let costPerUnit = (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0);

        if (isNaN(costPerUnit) || !isFinite(costPerUnit)) {
            console.error(`ERROR: Invalid costPerUnit for ${load.truckName}. Defaulting to $0.`);
            costPerUnit = 0;
        }

        let costPerLoad = costPerUnit * load.amount;

        detailedCosts.push({
            truckName: load.truckName,
            rate: load.rate,
            amount: load.amount,
            costPerUnit,
            costPerLoad
        });

        totalCost += costPerLoad;
    });   

    let yardCostData = null;

    if (yardLoads.length > 0) {
        console.log(`Processing overflow yard loads separately to ensure correct yard calculation.`);
    
        let assignedYard = materialInfo.locations.find(yard => yard.name === finalClosestYard);
        if (!assignedYard) {
            console.error(`ERROR: Could not find assigned yard (${finalClosestYard}) in material locations.`);
            return { totalCost: Infinity, detailedCosts: [], location: pit, pitLoads, yardLoads };
        }
    
        // Compute distances for yard separately
        let yardDistances = await calculateDistances([{ origin: assignedYard.address, destination: addressInput }]);
    
        // Ensure correct yard pricing is used
        let yardCostData = await computeYardCosts(yardLoads, assignedYard, yardDistances, addressInput, materialInfo);
    
        detailedCosts = detailedCosts.concat(yardCostData.detailedCosts);
        totalCost += yardCostData.totalCost;
    }    
    
    console.log("===================================");
    console.log("Pit Calculations:");
    console.log(`Pit:`);
    console.log(`  Starting from: ${pit.closest_yard}`);
    console.log(`  Going to Pit: ${pit.name}, ${pit.address}`);
    console.log(`  Duration/Distance: ${driveTimeYardToPit} min`);
    console.log(`  Drop off at: ${addressInput}`);
    console.log(`  Duration/Distance: ${driveTimePitToDrop} min`);
    console.log(`  Number of trips: ${tripCount}`);
    console.log(`  Ending at: ${finalClosestYard}`);
    console.log(`  Duration/Distance: ${driveTimeDropToYard} min`);
    console.log(`  Total Duration: ${totalJourneyTime.toFixed(2)} min`);
    
    // Group trucks
    let groupedTrucks = {};
    pitLoads.forEach(load => {
        const truckGroupKey = `${load.truckName}-${load.amount}-${load.rate}`;
        if (!groupedTrucks[truckGroupKey]) {
            groupedTrucks[truckGroupKey] = {
                count: 0,
                amount: load.amount,
                costPerUnit: (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0),
                truckName: load.truckName
            };
        }
        groupedTrucks[truckGroupKey].count++;
    });
    
    // Log grouped trucks
    console.log(`  Truck(s):`);
    Object.values(groupedTrucks).forEach(truck => {
        console.log(`    - ${truck.count} ${truck.truckName}(s) of ${truck.amount} ${materialInfo.sold_by}s at $${truck.costPerUnit.toFixed(2)} per ${materialInfo.sold_by}`);
    });
    
    console.log(`  Amount from pit: ${totalLoadAmount} ${materialInfo.sold_by}s`);
    console.log(`  Base Price: $${pit.price}`);
    console.log(`\nFinal Total: $${totalCost.toFixed(2)}`);
    console.log("===================================");

    return { totalCost, detailedCosts, location: pit, pitLoads, yardLoads, yardCostData };
}






/* --------------------- Main function to calculate costs -------------------------- */
async function calculateCost() {
    const addressInput = document.getElementById('address').value;
    const selectedMaterial = document.getElementById('material').value;
    const amountNeeded = parseFloat(document.getElementById('tonsNeeded').value);
    const materialInfo = materialData[selectedMaterial];
    const unit = materialInfo?.sold_by || 'unit';

    // Validate user input
    if (!validateInput(amountNeeded, addressInput)) {
        console.error("Validation failed. Aborting calculation.");
        return;
    }

    // Get the closest yard based on distance
    let closestYardData = await getClosestYard(addressInput);
    if (!closestYardData || !closestYardData.yardName) {
        console.error("ERROR: Could not determine closest yard.");
        return;
    }

    let finalClosestYard = closestYardData.yardName;
    let finalClosestYardLocation = {
        name: finalClosestYard,
        address: yardLocations[finalClosestYard]
    };

    let costResults = [];

    // Truck B+B Custom Combo Logic
    let evaluateTruckBCombo = false;
    const supportsTruckB = materialInfo?.truck_B && materialInfo.truck_B.length > 0;

    if (materialInfo.sold_by === "yard") {
        evaluateTruckBCombo = supportsTruckB && amountNeeded >= 20 && amountNeeded <= 30;
    } else if (materialInfo.sold_by === "ton") {
        evaluateTruckBCombo = supportsTruckB && amountNeeded >= 25 && amountNeeded <= 30;
    }

    // Check if the amount needed is below all pit minimums
    let pitMinCapacities = materialInfo.locations
        .filter(loc => !loc.name.toLowerCase().includes("yard"))
        .flatMap(loc => loc.trucks.flatMap(truckType => materialInfo[truckType] || []).map(truck => truck.min))
        .filter(min => typeof min === 'number' && !isNaN(min));

    let minPitCapacity = pitMinCapacities.length > 0 ? Math.min(...pitMinCapacities) : null;

    if (minPitCapacity !== null && amountNeeded < minPitCapacity) {
        console.log(`User input (${amountNeeded} tons) is below all pit minimums (${minPitCapacity} tons). Skipping pits.`);
        materialInfo.locations = materialInfo.locations.filter(loc => loc.name.toLowerCase().includes("yard"));
    }

    const allowSemi = document.getElementById("allowSemi")?.checked ?? true;

    if (!allowSemi) {
        materialInfo.locations = materialInfo.locations.filter(loc => {
            // Keep if it has any truck type other than truck_D
            return loc.trucks.some(truck => truck !== "truck_D");
        });
    }

    // Iterate through each location to calculate costs
    for (let location of materialInfo.locations) {
        let isYard = location.name.toLowerCase().includes("yard");

        if (isYard) {
            let { yardLoads } = await calculateYardTruckLoads(amountNeeded, materialInfo, location);
            let distances = await calculateDistances([{ origin: location.address, destination: addressInput }]);
            let yardCosts = await computeYardCosts(yardLoads, location, distances, addressInput, materialInfo);
            costResults.push(yardCosts);
        } else {
            let pitResult = await calculatePitTruckLoads(amountNeeded, materialInfo, location, finalClosestYard, [], addressInput);
            let { pitLoads, yardLoads, totalCost } = pitResult;

            if (pitLoads.length > 0) {
                let distances = await calculateDistances([
                    { origin: location.closest_yard, destination: location.address },
                    { origin: location.address, destination: addressInput },
                    { origin: addressInput, destination: finalClosestYardLocation.address }
                ]);

                let pitCosts = await computePitCosts(pitLoads, location, distances, addressInput, yardLoads, totalCost, materialInfo, yardLocations, amountNeeded);
                if (pitCosts.totalCost > 0) {
                    console.log(`PIT OPTION: ${location.name}, Total Cost: $${pitCosts.totalCost.toFixed(2)}`);
                    console.log(pitCosts.logOutput);
                    costResults.push(pitCosts);
                }                
            }

            // Inject PIT+YARD Split Combo from pitResult if it exists
            if (pitResult.splitPitYardCombo && isFinite(pitResult.splitPitYardCombo.totalCost)) {
                pitResult.splitPitYardCombo.location = location; // needed for log + draw
                pitResult.splitPitYardCombo.sourceType = "pit+yard";
                pitResult.splitPitYardCombo.sourceAddress = location.address;
            
                console.log(`Evaluated PIT+YARD Split Combo at ${location.name} - $${pitResult.splitPitYardCombo.totalCost.toFixed(2)}`);
                costResults.push(pitResult.splitPitYardCombo);
            }            

        }
    }

    if (evaluateTruckBCombo) {
        for (let location of materialInfo.locations) {
            let hasTruckB = location.trucks.includes("truck_B");
            if (!hasTruckB) continue;
    
            let truckB = (materialInfo.truck_B || []).find(t => t.max === 15);
            if (!truckB) continue;
    
            const firstLoad = {
                truckName: truckB.name,
                rate: truckB.rate,
                amount: truckB.max
            };
            const secondAmount = Math.min(truckB.max, Math.max(0, amountNeeded - truckB.max));
    
            if (secondAmount < truckB.min || secondAmount > truckB.max) continue;
    
            const secondLoad = {
                truckName: truckB.name,
                rate: truckB.rate,
                amount: secondAmount
            };
    
            const bComboLoads = [firstLoad, secondLoad];
    
            let distances = await calculateDistances([{ origin: location.address, destination: addressInput }]);
            const yardCost = await computeYardCosts(bComboLoads, location, distances, addressInput, materialInfo);
    
            if (yardCost.totalCost && isFinite(yardCost.totalCost)) {
                yardCost.label = "B+B Combo"; // optional for display clarity
                console.log(`Evaluated B+B combo at ${location.name} - $${yardCost.totalCost.toFixed(2)}`);
                costResults.push(yardCost);
            }
        }
    } 

    costResults = costResults.filter(result => result && !isNaN(result.totalCost));

    if (costResults.length === 0) {
        console.error("ERROR: No valid cost calculations available. Aborting process.");
        return;
    }

    // Find the cheapest total cost
    let cheapest = costResults.reduce((min, curr) => (curr.totalCost < min.totalCost ? curr : min));
    console.log(`Cheapest Option: ${cheapest.location.name}, Total Cost: $${cheapest.totalCost.toFixed(2)}`);
    console.log("Final breakdown for split combo:", cheapest.detailedCosts);
    
    displayResults(cheapest.totalCost, cheapest.detailedCosts, unit, cheapest.yardCostData);
}






/* --------------------- Display the results on the page -------------------------- */
function displayResults(totalCost, detailedCosts, unit, yardCostData = null) {
    const detailSection = document.getElementById('loadDetails');
    const totalCostElement = document.getElementById('totalCost');

    // Check if the necessary elements are present
    if (!detailSection || !totalCostElement) {
        console.error("ERROR: One or more display elements are missing!");
        return;
    }

    // Clear previous results
    detailSection.innerHTML = ''; 
    let groupedTrucks = {};

    // Group the detailed costs by truck type, amount, and rate
    console.log("Debugging `displayResults()`:");
    console.log("Total Cost:", totalCost);
    console.log("Detailed Costs Array:", detailedCosts);
    
    if (!detailedCosts || !Array.isArray(detailedCosts) || detailedCosts.length === 0) {
        console.error("ERROR: No valid detailed costs passed to `displayResults()`.", detailedCosts);
        return;
    }
    
    // Ensure all loads have valid cost calculations before displaying
    detailedCosts = detailedCosts.filter(load => 
        load.amount && 
        load.rate && 
        !isNaN(load.costPerUnit) && 
        !isNaN(load.costPerLoad)
    );
    
    if (detailedCosts.length === 0) {
        console.error("ERROR: All truck load calculations resulted in invalid values.");
        return;
    }
    
    // Ensure pit loads are included
    detailedCosts.forEach(load => {
        console.log(`Valid truck cost: ${load.truckName} - ${load.amount} tons at $${load.costPerUnit.toFixed(2)} per ton.`);

        const truckName = load.truckName;
        const truckGroupKey = `${truckName}-${load.amount}-${load.rate}`;

        if (!groupedTrucks[truckGroupKey]) {
            groupedTrucks[truckGroupKey] = {
                count: 0,
                amount: load.amount,
                costPerUnit: load.costPerUnit,
                truckName: truckName
            };
        }

        groupedTrucks[truckGroupKey].count++;
    });

    // Add to UI
    Object.values(groupedTrucks).forEach(truck => {
        let detail = document.createElement('p');
        detail.textContent = `${truck.count} ${truck.truckName}(s) of ${truck.amount} ${unit}s at $${truck.costPerUnit.toFixed(2)} per ${unit}`;
        detailSection.appendChild(detail);

        console.log(`${truck.count} ${truck.truckName}(s) of ${truck.amount} tons at $${truck.costPerUnit.toFixed(2)} per ton`);
    });

    // Add yard cost to total cost if yardCostData exists
    if (yardCostData && yardCostData.totalCost) {
        console.log(`Adding yard cost: $${yardCostData.totalCost.toFixed(2)} to total cost.`);
        totalCost += yardCostData.totalCost;
    }

    // Prevent NaN or undefined total cost issues
    if (isNaN(totalCost) || totalCost === undefined) {
        console.error("ERROR: Total cost is invalid. Defaulting to $0.00.");
        totalCost = 0;
    }

    // Display total cost
    totalCostElement.value = "$" + totalCost.toFixed(2);
    console.log(`Total Cost: $${totalCost.toFixed(2)}`);
}







/* --------------------- Event Listeners -------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    updateUnitRestrictions();
    loadGoogleMapsApi();

    const originalMaterialLocations = JSON.parse(JSON.stringify(materialData));
    const materialSelect = document.getElementById("material");
    const tonsInput = document.getElementById("tonsNeeded");
    const addressInput = document.getElementById("address");
    const allowSemiCheckbox = document.getElementById("allowSemi");
    const helperText = document.getElementById("tons-help");
    const form = document.getElementById("calcForm");

    // Debounce helper to avoid excessive calls
    let debounceTimer;
    function debounceCalculate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            // Reset materialInfo.locations to the original state before filtering pits/yards
            Object.keys(materialData).forEach(key => {
                materialData[key].locations = JSON.parse(JSON.stringify(originalMaterialLocations[key].locations));
            });
            calculateCost();
        }, 250); // adjust delay as needed
    }

    materialSelect.addEventListener("change", () => {
        updateUnitRestrictions();
        debounceCalculate();
    });

    tonsInput.addEventListener("input", function () {
        const selectedMaterial = materialSelect.value;
        const materialInfo = materialData[selectedMaterial];
        const unit = materialInfo?.sold_by || 'unit';
        const min = parseInt(this.min);
        const value = parseFloat(this.value);

        if (value < min) {
            helperText.style.display = "block";
            helperText.textContent = `Please enter a value of at least ${min} ${unit}s.`;
        } else {
            helperText.style.display = "none";
        }
        debounceCalculate();
    });

    if (addressInput) {
        addressInput.addEventListener("input", debounceCalculate);
    }
    if (allowSemiCheckbox) {
        allowSemiCheckbox.addEventListener("change", debounceCalculate);
    }

    // Keep manual submit for accessibility
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        Object.keys(materialData).forEach(key => {
            materialData[key].locations = JSON.parse(JSON.stringify(originalMaterialLocations[key].locations));
        });
        calculateCost();
    });
});