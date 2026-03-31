// Dynamically Load Google Maps API
function loadGoogleMapsApi() {
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

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onload = () => console.log("Google Maps API script appended.");
    document.head.appendChild(script);
}

// Autocomplete Setup
function initializeAutocomplete() {
    const addressInput = document.getElementById("address");

    if (addressInput) {
        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
            types: ["geocode"],
        });

        let userInteracted = false;

        addressInput.addEventListener("keydown", () => {
            userInteracted = true;
        });

        autocomplete.addListener("place_changed", function () {
            const place = autocomplete.getPlace();

            if (userInteracted && !place.geometry) {
                console.error("No geometry available for input: " + addressInput.value);
                const addressHelper = document.getElementById("address-help");
                if (addressHelper) {
                    addressHelper.textContent = "Please select a valid address from the suggestions.";
                    addressHelper.style.display = "block";
                }
                return;
            }

            if (place.geometry) {
                addressInput.value = place.formatted_address;
                console.log("Selected Address:", place.formatted_address);
                const addressHelper = document.getElementById("address-help");
                if (addressHelper) addressHelper.style.display = "none";
            }
        });

        console.log("Google Places Autocomplete initialized with interaction safety.");
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
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 41.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 42.74, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    "barrtech": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 41.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 42.16, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    "bedding_sand": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 25.41, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 24.83, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    "bio_infiltration_soil": {
        "sold_by": "yard",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 36.38, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    "bio_retention_soil": {
        "sold_by": "yard",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 40.43, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    "bio_retention_soil_no_sandy_loam": {
        "sold_by": "yard",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 42.16, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    "economy_topsoil": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 17.19, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 14.44, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    "organic_cert_garden_soil": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 33.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 35.23, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 24.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 50, "max": 50, "rate": 200}
        ]
    },
    "premium_screened_topsoil": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 31.19, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 24.83, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    "premium_turf": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 29.45, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 27.14, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    "sandy_loam": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 27.72, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 24.83, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "DC PIT", "address": "611 W Denison-Chattaroy Rd, Deer Park, WA 99006", "price": 12.00, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 20, "rate": 200}
        ]
    },
    // Sand and Gravel
    "1_minus_crushed_structural": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 27.72, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "3_minus_crushed_concrete": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 23.10, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "3_minus_structural_round": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 15.59, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 9.82, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "58_114_basalt_minus_gravel": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 28.88, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 30.03, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Perry PIT", "address": "13302 N Perry St, Spokane, WA 99208", "price": 21.45, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Cooridor PIT", "address": "47.683646613378116, -117.55831219627463", "price": 13.20, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "58_114_granite_minus_gravel": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 27.72, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 30.03, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "JMAC PIT", "address": "47.728763, -117.034429", "price": 12.38, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "CDA PIT", "address": "47.716832, -117.035684", "price": 14.03, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "asphalt_grindings": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 27.14, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 28.88, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hattenburgs PIT", "address": "47.757245449473906, -117.36542930230672", "price": 11.96, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "c33_sand": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 26.57, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 23.10, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "course_sand": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 26.57, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 23.10, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "pea_gravel": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 30.61, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 32.34, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Sullivan Pre-Mix PIT", "address": "1902 N Sullivan Rd, Spokane Valley, WA 99216", "price": 19.80, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "sand_gravel_concrete_mix": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 46.78, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 31.19, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "white_sand": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 87.78, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Lane Mountain PIT", "address": "3119 WA-231, Valley, WA 99181", "price": 61.38, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    // Rocks
    "1_12_rainbow_river_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 114.92, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 128.21, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "1_14_champagne_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 114.35, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 149.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "White Stone Calcium PIT", "address": "2432 US-395, Chewelah, WA 99109", "price": 109.15, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "1_14_china_white_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 118.97, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "White Stone Calcium PIT", "address": "2432 US-395, Chewelah, WA 99109", "price": 111.17, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "1_granite_chips": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 41.58, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "CDA Paving & Concrete PIT", "address": "47.716832, -117.035684", "price": 29.66, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "1_to_3_basalt_chips": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 38.69, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 39.85, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "HardRock PIT", "address": "47.339342, -116.827806", "price": 18.19, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "2_blueslate_woodstone": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 80.85, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 72.77, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Iron Mountain/Scrivanich PIT", "address": "48.29835281266716, -117.14118002098378", "price": 69.30, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "2_elk_hide": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 70.46, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 74.50, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Elk Hide PIT", "address": "47.332319, -116.538415", "price": 34.65, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "34_river_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 40.43, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 42.72, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "JMAC PIT", "address": "47.728763, -117.034429", "price": 23.24, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "1_12_river_rock": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 35.81, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 38.12, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "JMAC PIT", "address": "47.728763, -117.034429", "price": 19.31, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
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
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "34_114_basalt_chips": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 38.69, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 41.58, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "HardRock PIT", "address": "47.339342, -116.827806", "price": 18.19, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "58_2_2_to_6_riverbed_mix": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 64.68, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 57.17, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "autumn_gold": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 82.58, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 76.23, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Lane Mountain PIT", "address": "3119 WA-231, Valley, WA 99181", "price": 46.20, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "black_lava_rock": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 157.66, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 157.66, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "red_lava_rock": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 91.82, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 94.71, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    // Barks
    "aged_dark_fines": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 43.31, "trucks": ["truck_A", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 42.74, "trucks": ["truck_A", "truck_C"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 27.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 15, "rate": 135}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 70, "max": 70, "rate": 200}
        ]
    },
    "engineered_playground_chips": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 60.64, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 58.91, "trucks": ["truck_A"] },
            { "name": "Premiere PIT", "address": "48.181955, -117.006770", "price": 47.25, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 135}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 200}
        ]
    },
    "fresh_fines": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 37.54, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 38.69, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 27.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 135}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 200}
        ]
    },
    "large_nugget": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 61.79, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 62.95, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 54.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 135}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 200}
        ]
    },
    "medium_fine": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 36.96, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 37.54, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 27.00, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 135}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 200}
        ]
    },
    "medium_shred": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 32.34, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 37.54, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 22.50, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 135}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 200}
        ]
    },
    "small_nugget": {
        "sold_by": "yard",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 91.25, "trucks": ["truck_A"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 92.40, "trucks": ["truck_A"] },
            { "name": "Idaho Forest Group PIT", "address": "4447 E Chilco Rd, Athol, ID 83801", "price": 85.50, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_D"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 25, "rate": 135}
        ],
        "truck_D": [
            {"name": "Semi Truck", "min": 100, "max": 100, "rate": 200}
        ]
    },
    // Boulders
    "fractured_granite": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 88.36, "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "New Port Equipment PIT", "address": "328772 U.S. Rte 2, Newport, WA 99156", "price": 59.68, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_E"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_E": [
            {"name": "Transfer Truck", "min": 16, "max": 30, "rate": 200}
        ]
    },
    "round_basalt": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 91.25, "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "Cheney Boulder PIT", "address": "47.46744669160258, -117.545016359873", "price": 57.75, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_E"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_E": [
            {"name": "Transfer Truck", "min": 16, "max": 30, "rate": 200}
        ]
    },
    "round_granite": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 77.96, "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "Post Falls Pleasant View Interstate PIT", "address": "1545 N Pleasant View Rd, Post Falls, ID 83854", "price": 48.13, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "JMAC PIT", "address": "47.728763, -117.034429", "price": 48.13, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_E"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_E": [
            {"name": "Transfer Truck", "min": 16, "max": 30, "rate": 200}
        ]
    },
    "valley_boulders": {
        "sold_by": "ton",
        "locations": [
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 108.57, "trucks": ["truck_A", "truck_B", "truck_E"] },
            { "name": "Weusthoff Excavation PIT", "address": "48.187739, -117.730438", "price": 67.38, "closest_yard": "1208 E Hawthorne Rd, Spokane, WA 99217", "trucks": ["truck_A", "truck_B", "truck_E"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_E": [
            {"name": "Transfer Truck", "min": 16, "max": 30, "rate": 200}
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
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "bulk_white_quicksalt": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 225.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Marietta PIT", "address": "15201 E Marietta Ave, Spokane Valley, WA 99216", "price": 184.50, "closest_yard": "1820 N University Rd, Spokane Valley, WA 99206", "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "deicing_salt_sand_mix": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 48.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 45.00, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
        ]
    },
    "deicing_salt_sand_torp_mix": {
        "sold_by": "ton",
        "locations": [
            { "name": "I90 Yard", "address": "1820 N University Rd, Spokane Valley, WA 99206", "price": 54.00, "trucks": ["truck_A", "truck_B", "truck_C"] },
            { "name": "Hawthorne Yard", "address": "1208 E Hawthorne Rd, Spokane, WA 99217", "price": 51.00, "trucks": ["truck_A", "truck_B", "truck_C"] }
        ],
        "truck_A": [
            {"name": "Small Truck", "min": 1, "max": 8, "rate": 135}
        ],
        "truck_B": [
            {"name": "Solo Truck", "min": 9, "max": 15, "rate": 175}
        ],
        "truck_C": [
            {"name": "Super Truck", "min": 16, "max": 25, "rate": 200}
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

    // Show/hide semi truck option
    const semiTruckOption = document.getElementById("semiTruckOption");
    if (semiTruckOption) {
        if (materialInfo.truck_D && materialInfo.truck_D.length > 0) {
            semiTruckOption.style.display = "block";
        } else {
            semiTruckOption.style.display = "none";
        }
    }

    // ...existing code...
    let minCapacities = materialInfo.locations.flatMap(location =>
        location.trucks
            .map(truckType => materialInfo[truckType] || [])
            .flat()
            .map(truck => truck.min)
            .filter(Boolean)
    );

    let minCapacity = minCapacities.length > 0 ? Math.min(...minCapacities) : 3;
    tonsInput.min = minCapacity;

    tonsInput.placeholder = `Enter amount needed in ${unit}s`;
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
        tonsHelper.textContent = `Please enter a value of 3 or more.`;
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





function isSemiAllowed() {
    const semiCheckbox = document.getElementById("allowSemi");
    return semiCheckbox ? semiCheckbox.checked : true;
}





/* --------------------- Determine the best truck loads for Yards -------------------------- */
async function calculateYardTruckLoads(remaining, materialInfo, location) {
    let yardLoads = [];
    const yardTrucks = [];

    if (!location || !location.trucks || !Array.isArray(location.trucks)) {
        console.error(`ERROR: Invalid or missing truck data for ${location?.name || 'undefined location'}.`);
        return { yardLoads, remaining };
    }

    // Filter out semi trucks if not allowed
    const allowSemi = isSemiAllowed();
    let filteredTrucks = location.trucks.filter(truckType => allowSemi || truckType !== "truck_D");

    filteredTrucks.forEach(truckType => {
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
    let logOutput = "";

    // Ensure we have valid distances
    if (!distances || distances.length === 0) {
        if (!suppressLogs) {
            console.warn(`No distances found for ${yard.name}. Fetching new distances.`);
        }

        if (!addressInput) {
            if (!suppressLogs) {
                console.error("ERROR: addressInput is missing! Cannot fetch distances.");
            }
            return { totalCost: Infinity, detailedCosts: [], location: yard, logOutput };
        }

        // Calculate distances if not available
        distances = await calculateDistances([{ origin: yard.address, destination: addressInput }]);

        if (!distances || distances.length === 0) {
            if (!suppressLogs) {
                console.error(`ERROR: No valid distances retrieved for ${yard.name}.`);
            }
            return { totalCost: Infinity, detailedCosts: [], location: yard, logOutput };
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
            return { totalCost: Infinity, detailedCosts: [], location: yard, logOutput };
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
        return { totalCost: Infinity, detailedCosts: [], location: yard, logOutput };
    }

    // Calculate the cost for each yard load
    for (let load of truckLoadInfo) {
        if (!load.amount || !load.rate) {
            if (!suppressLogs) {
                console.warn("Skipping invalid load data:", load);
            }
            continue;
        }

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
            costPerLoad,
            source: "yard"
        });

        totalCost += costPerLoad;
    }

    if (isNaN(totalCost) || totalCost === 0) {
        if (!suppressLogs) {
            console.error(`ERROR: Total Cost calculation failed for yard ${yard.name}. Returning 'Infinity'.`);
        }
        return { totalCost: Infinity, detailedCosts: [], location: yard, logOutput };
    }

    // Group trucks
    let groupedTrucks = {};
    truckLoadInfo.forEach(load => {
        const truckGroupKey = `${load.truckName}-${load.amount}-${load.rate}`;
        if (!groupedTrucks[truckGroupKey]) {
            groupedTrucks[truckGroupKey] = {
                count: 0,
                amount: load.amount,
                rate: load.rate,
                truckName: load.truckName,
                costPerUnit: (((driveTime * 2 * 1.15 + 36) / 60 * load.rate) / load.amount + yard.price),
                loads: []
            };
        }
        groupedTrucks[truckGroupKey].count++;
        groupedTrucks[truckGroupKey].loads.push(load);
    });

    // Total distance one-way
    let totalDistance = distances.reduce((sum, d) => sum + parseFloat(d.distance.replace(/[^\d.]/g, '')), 0);
    const roundTripDuration = driveTime * 2;
    const roundTripDistance = totalDistance * 2;
    const perTripTime = roundTripDuration + 36;

    const summaryHeader = "===================================";
    const subheader = "-----------------------------------";

    if (!suppressLogs) {
        logOutput += `${summaryHeader}\n\n`;
        logOutput += `YARD CHOSEN:\n${yard.name}, ${yard.address}\n\n`;
        logOutput += `==> BASE PRICE: $${yard.price.toFixed(2)}\n\n`;
        logOutput += `${subheader}\n\n`;

        logOutput += `==> JOURNEY BREAKDOWN:\n`;
        logOutput += `A - Starting At:\n${yard.name}, ${yard.address}\n\n`;
        logOutput += `B - Drop Off At:\n${addressInput}\n\n`;
        logOutput += ` ⤷ Duration to Drop Off: ${driveTime} min\n`;
        logOutput += ` ⤷ Distance to Drop Off: ${totalDistance.toFixed(2)} miles\n\n`;
        logOutput += `\n`;
        logOutput += ` ⤷ Round Trip Duration: ${perTripTime} min\n`;
        logOutput += ` ⤷ Round Trip Distance: ${roundTripDistance.toFixed(2)} miles\n\n`;
    }

    // === DAY SPLITS ===
    const MAX_DAY_MINUTES = 540;
    let dayChunks = [];
    let currentDay = { trips: 0, loads: [], duration: 0, distance: 0, cost: 0 };
    Object.values(groupedTrucks).forEach(truck => {
        for (let i = 0; i < truck.count; i++) {
            const load = truck.loads[i];

            // Recalculate trip time using same logic as original computeYardCosts
            const tripTime = ((driveTime * 2 * 1.15) + 36); // minutes
            const tripDistance = roundTripDistance;

            // Match the main cost formula
            const costPerUnit = (((tripTime / 60) * load.rate) / load.amount) + (yard.price || 0);
            const loadCost = costPerUnit * load.amount;

            if (currentDay.duration + tripTime > MAX_DAY_MINUTES) {
                dayChunks.push({ ...currentDay });
                currentDay = { trips: 0, loads: [], duration: 0, distance: 0, cost: 0 };
            }

            currentDay.trips++;
            currentDay.loads.push(load);
            currentDay.duration += tripTime;
            currentDay.distance += tripDistance;
            currentDay.cost += loadCost;
        }
    });
    if (currentDay.loads.length > 0) dayChunks.push(currentDay);

    // === LOG PER DAY BREAKDOWN ===
    if (!suppressLogs && dayChunks.length > 1) {
        let grandTotalMinutes = 0;
        let grandTotalDistance = 0;
        let grandTotalCost = 0;

        for (let i = 0; i < dayChunks.length; i++) {
            const day = dayChunks[i];
            const loadTotal = day.loads.reduce((sum, l) => sum + l.amount, 0);

            const dayCost = day.loads.reduce((sum, l) => {
                const matched = detailedCosts.find(d => 
                    d.truckName === l.truckName && 
                    d.amount === l.amount && 
                    d.rate === l.rate
                );
                return sum + (matched?.costPerLoad || 0);
            }, 0);

            logOutput += `===== Day ${i + 1} =====\n`;
            logOutput += `Trips: ${day.trips}\n`;
            logOutput += `Load: ${loadTotal} ${materialInfo.sold_by}s\n`;
            logOutput += `Subtotal: $${dayCost.toFixed(2)}\n`;
            logOutput += `Day Distance: ${day.distance.toFixed(2)} miles\n`;
            logOutput += `Day Duration: ${day.duration} min (${(day.duration / 60).toFixed(2)} hrs)\n\n`;

            grandTotalMinutes += day.duration;
            grandTotalDistance += day.distance;
            grandTotalCost += dayCost;
        }

        logOutput += `===== GRAND TOTAL (All Days) =====\n`;
        logOutput += `Total Cost: $${grandTotalCost.toFixed(2)}\n`;
        logOutput += `Total Duration: ${grandTotalMinutes.toFixed(2)} min (${(grandTotalMinutes / 60).toFixed(2)} hrs)\n`;
        logOutput += `Total Distance: ${grandTotalDistance.toFixed(2)} miles\n\n`;

    }

    // Add this only if there was NO day split
    if (dayChunks.length <= 1) {
        const totalTrips = Object.values(groupedTrucks).reduce((sum, truck) => sum + truck.count, 0);

        const roundTripTime = ((driveTime * 2 * 1.15) + 36); // consistent with cost logic
        const roundTripDistance = totalDistance * 2; // assuming totalDistance is one-way

        const totalJourneyTime = roundTripTime * totalTrips;
        const totalJourneyDistance = roundTripDistance * totalTrips;

        logOutput += `TOTAL JOURNEY TIME: ${Math.ceil(totalJourneyTime)} min (${(totalJourneyTime / 60).toFixed(2)} hrs)\n`;
        logOutput += `TOTAL DISTANCE: ${totalJourneyDistance.toFixed(2)} miles\n\n`;
    }

    // === TRUCK BREAKDOWN ===
    if (!suppressLogs) {
        logOutput += `${subheader}\n\nTRUCK(S):\n\n`;

        Object.values(groupedTrucks).forEach(truck => {
            const totalLoad = truck.count * truck.amount;
            logOutput += `${truck.count} ${truck.truckName}(s) of ${truck.amount} ${materialInfo.sold_by}s at $${truck.costPerUnit.toFixed(2)} per ${materialInfo.sold_by}\n\n`;
            logOutput += `==> DETAILS FOR ${truck.truckName}:\n`;
            logOutput += `Total Load: ${totalLoad}\n`;
            logOutput += `Total Trips: ${truck.count}\n\n`;
        });

        logOutput += `${summaryHeader}\n\n`;
    }

    return { totalCost, detailedCosts, location: yard, logOutput };
}






/* --------------------- Determine the best truck loads for Pits -------------------------- */
async function calculatePitTruckLoads(amountNeeded, materialInfo, location, finalClosestYard, distances, addressInput, yardLocations) {
    let pitLoads = [];
    let yardLoads = [];
    let yardAssignment = null;
    let splitPitYardCombo = null;

    console.log(`Processing Pit Trucks for: ${location.name}`);

    if (!location || !location.trucks || !Array.isArray(location.trucks)) {
        console.error(`ERROR: Invalid or missing truck data for ${location?.name || 'undefined location'}.`);
        return { pitLoads, yardLoads: [], totalCost: 0 };
    }

    if (!materialInfo || !materialInfo.locations) {
        console.error("ERROR: Material info is missing or incomplete.");
        return { pitLoads, yardLoads: [], totalCost: 0 };
    }

    // Filter out semi trucks if not allowed
    const allowSemi = isSemiAllowed();
    let filteredTrucks = location.trucks.filter(truckType => allowSemi || truckType !== "truck_D");

    let pitTrucks = [];
    filteredTrucks.forEach(truckType => {
        let trucks = materialInfo[truckType] || [];
        trucks.forEach(truck => pitTrucks.push({ ...truck, type: truckType }));
    });

    if (pitTrucks.length === 0) {
        console.warn(`No available pit trucks for ${location.name} after filtering for semi truck option.`);
        return { pitLoads: [], yardLoads: [], totalCost: 0, splitPitYardCombo: null, groupedTruckLoads: {} };
    }

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

    // Build groupedTruckLoads for PIT trucks (used in display breakdown)
    let groupedTruckLoads = {};
    for (let truckName in groupedLoads) {
        const truckGroup = groupedLoads[truckName];
        truckGroup.forEach(load => {
            const key = `${load.truckName}-${load.rate}`;
            if (!groupedTruckLoads[key]) {
                groupedTruckLoads[key] = {
                    truckName: load.truckName,
                    rate: load.rate,
                    amount: load.max,
                    count: 0,
                    loads: []
                };
            }
            groupedTruckLoads[key].count++;
            groupedTruckLoads[key].loads.push({
                truckName: load.truckName,
                rate: load.rate,
                amount: load.amount,
                max: load.max
            });
        });
    }
    
    for (let truckName in groupedLoads) {
        pitLoads = pitLoads.concat(groupedLoads[truckName]);
    }

    const totalPitLoad = pitLoads.reduce((sum, load) => sum + load.amount, 0);
    const remainingAfterPitLoads = amountNeeded - totalPitLoad;
    const smallestPitMin = Math.min(...pitTrucks.map(t => t.min || Infinity));
    const isRemainingAssignableToYard = remainingAfterPitLoads > 0 && remainingAfterPitLoads < smallestPitMin;

    if (isRemainingAssignableToYard && !splitPitYardCombo) {
        console.log(`✨ Triggering PIT+YARD fallback for leftover ${remainingAfterPitLoads} ${materialInfo.sold_by}s`);

        const yardFallback = await assignToYard(
            remainingAfterPitLoads,
            materialInfo,
            finalClosestYard,
            distances,
            addressInput,
            false
        );

        if (yardFallback && yardFallback.yardLoads?.length) {
            splitPitYardCombo = {
                pitLoads,
                yardLoads: yardFallback.yardLoads,
                totalCost: 0, // computePitCosts will handle true total
                yardCostData: yardFallback.yardCostData,
                location,
                label: "PIT+YARD Split Combo"
            };
        }
    }

    // === PIT+YARD Split Trigger ===
    const pitTrucksMin = pitTrucks.length > 0 ? Math.min(...pitTrucks.map(t => t.min)) : Infinity;

    const smallTruckKeywords = ["small", "solo"];
    const lastPitLoad = pitLoads[pitLoads.length - 1];
    const isSmallOrSoloTruck =
        lastPitLoad &&
        smallTruckKeywords.some(keyword => lastPitLoad.truckName.toLowerCase().includes(keyword));

    const shouldTrySplitCombo =
        (tempRemaining > 0 && tempRemaining < pitTrucksMin) || isSmallOrSoloTruck;

    if (shouldTrySplitCombo) {
        const pitLoadsWithoutLast = [...pitLoads];

        // Remove last if it's small/solo OR under PIT min
        if (
            pitLoadsWithoutLast.length > 0 &&
            (isSmallOrSoloTruck || pitLoadsWithoutLast[pitLoadsWithoutLast.length - 1].amount < pitTrucksMin)
        ) {
            const removed = pitLoadsWithoutLast.pop();
            tempRemaining += removed.amount;
            console.log(`✨ Trying PIT+YARD split due to '${removed.truckName}' with ${removed.amount} ${materialInfo.sold_by}s`);
        }

        const totalPitAmountWithoutLast = pitLoadsWithoutLast.reduce((sum, l) => sum + l.amount, 0);

        const altYard = await assignToYard(
            tempRemaining,
            materialInfo,
            finalClosestYard,
            distances,
            addressInput,
            false
        );

        if (altYard && altYard.yardLoads.length > 0 && isFinite(altYard.totalCost)) {
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
                [],
                0,
                materialInfo,
                yardLocations,
                totalPitAmountWithoutLast
            );

            splitPitYardCombo = {
                pitLoads: pitLoadsWithoutLast,
                yardLoads: altYard.yardLoads,
                totalCost: pitCostData.totalCost + altYard.totalCost,
                label: "PIT+YARD Split Combo",
                location,
                detailedCosts: [
                    ...(pitCostData?.detailedCosts || []),
                    ...(altYard.yardCostData?.detailedCosts || [])
                ],
                logOutput: `${pitCostData?.logOutput || ''}\n\n${altYard.yardCostData?.logOutput || ''}`,
                sourceType: "pit+yard",
                sourceAddress: location.address,
                closestYardAddress: yardLocations[finalClosestYard]
            };
        }
    }

    return {
        pitLoads,
        yardLoads,
        totalCost: yardAssignment ? yardAssignment.totalCost : 0,
        splitPitYardCombo,
        groupedTruckLoads
    };
}







/* --------------------- Assign remaining load to the closest yard -------------------------- */
async function assignToYard(remaining, materialInfo, finalClosestYard, distances, addressInput, suppressLogs = false) {
    if (!suppressLogs) {
        console.log(`Assigning ${remaining} tons to the closest yard: ${finalClosestYard}`);
    }

    // Find which yards actually have this material
    const availableYards = materialInfo.locations.filter(loc => loc.name.toLowerCase().includes("yard"));

    // Check if `finalClosestYard` has the material
    const finalClosestYardLocation = availableYards.find(yard => yard.name === finalClosestYard);

    // If `finalClosestYard` doesn’t have it, find another yard that does
    let assignedYard = finalClosestYardLocation || availableYards[0];

    if (!assignedYard) {
        if (!suppressLogs) {
            console.error(`ERROR: No available yards carry this material.`);
        }
        return { yardLoads: [], totalCost: Infinity };
    }

    // Compute the yard truck loads
    let yardResult = await calculateYardTruckLoads(remaining, materialInfo, assignedYard);

    if (!yardResult || yardResult.yardLoads.length === 0) {
        if (!suppressLogs) {
            console.error(`ERROR: No valid yard loads assigned for remaining ${remaining} tons.`);
        }
        return { yardLoads: [], totalCost: Infinity };
    }

    // Compute costs for the assigned yard
    let yardCostData = await computeYardCosts(
        yardResult.yardLoads,
        assignedYard,
        distances,
        addressInput,
        materialInfo,
        suppressLogs // Pass suppressLogs to suppress assigned yard logs
    );

    if (!yardCostData || isNaN(yardCostData.totalCost)) {
        if (!suppressLogs) {
            console.error(`ERROR: Failed to compute costs for yard ${assignedYard.name}.`);
        }
        return { yardLoads: [], totalCost: Infinity };
    }

    return {
        yardLoads: yardResult.yardLoads,
        totalCost: yardCostData.totalCost,
        yardCostData: yardCostData
    };
}








/* --------------------- Split loads into 9-hour days -------------------------- */
function splitPitLoadsIntoWorkDays(pitLoads, driveTimeYardToPit, driveTimePitToDrop, driveTimeDropToYard, distanceYardToPit, distancePitToDrop, distanceDropToYard) {
    const MAX_MINUTES = 540;
    const days = [];

    const startTripTime = (driveTimeYardToPit + driveTimePitToDrop + driveTimeDropToYard) * 1.15 + 36;
    const repeatTripTime = (driveTimePitToDrop * 2) * 1.15 + 36;

    const startTripDistance = distanceYardToPit + distancePitToDrop + distanceDropToYard;
    const repeatTripDistance = distancePitToDrop * 2;

    let currentDay = {
        loads: [],
        trips: 0,
        duration: 0,
        distance: 0
    };

    for (let i = 0; i < pitLoads.length; i++) {
        const isFirstTrip = currentDay.trips === 0;
        const tripTime = isFirstTrip ? startTripTime : repeatTripTime;
        const tripDistance = isFirstTrip ? startTripDistance : repeatTripDistance;

        if (currentDay.duration + tripTime > MAX_MINUTES) {
            // Push the finished day and reset
            days.push({ ...currentDay });
            currentDay = {
                loads: [pitLoads[i]],
                trips: 1,
                duration: startTripTime,
                distance: startTripDistance
            };
        } else {
            currentDay.loads.push(pitLoads[i]);
            currentDay.trips += 1;
            currentDay.duration += tripTime;
            currentDay.distance += tripDistance;
        }
    }

    if (currentDay.loads.length > 0) {
        days.push({ ...currentDay });
    }

    return days;
}






function getLoadTripTime(isFirstTripOfDay, driveTimeYardToPit, driveTimePitToDrop, driveTimeDropToYard) {
    if (isFirstTripOfDay) {
        // Full first trip: Yard ➝ Pit ➝ Drop ➝ Yard
        return (driveTimeYardToPit + driveTimePitToDrop + driveTimeDropToYard) * 1.15 + 36;
    } else {
        // Repeat trip: Pit ➝ Drop ➝ Pit
        return (driveTimePitToDrop * 2) * 1.15 + 36;
    }
}








/* --------------------- Core function to compute costs for Pits -------------------------- */
async function computePitCosts(pitLoads, pit, distances, addressInput, yardLoads, yardTotalCost, materialInfo, yardLocations, amountNeeded) {
    yardTotalCost = yardTotalCost || 0;
    materialInfo = materialInfo || {};
    amountNeeded = amountNeeded || 0;

    let logOutput = "";
    let totalCost = 0;
    let detailedCosts = [];
    let yardCostData = null;

    let grandTotalMinutes = 0;
    let grandTotalDistance = 0;
    let grandTotalCost = 0;

    if (!pitLoads || pitLoads.length === 0) {
        const msg = `ERROR: No valid pit truck loads found for ${pit.name}`;
        console.error(msg);
        logOutput += msg + "\n";
        return { totalCost: Infinity, logOutput };
    }

    const closestYardData = await getClosestYard(addressInput);
    if (!closestYardData) {
        const msg = "ERROR: Could not determine closest yard.";
        console.error(msg);
        logOutput += msg + "\n";
        return { totalCost: Infinity, logOutput };
    }

    const finalClosestYard = closestYardData.yardName;
    let driveTimeDropToYard = closestYardData.duration;

    if (!yardLocations || !yardLocations[finalClosestYard]) {
        const msg = `ERROR: Yard location not found in yardLocations for ${finalClosestYard}.`;
        console.error(msg);
        logOutput += msg + "\n";
        return { totalCost: Infinity, logOutput };
    }

    let driveTimeYardToPit = distances.find(d => d.from.includes(pit.closest_yard) || d.to.includes(pit.closest_yard))?.duration;
    let driveTimePitToDrop = distances.find(d => d.from.trim() === pit.address.trim())?.duration;

    if (!driveTimeYardToPit || !driveTimePitToDrop) {
        const msg = `ERROR: Missing drive time for ${pit.name}.`;
        console.error(msg);
        logOutput += msg + "\n";
        return { totalCost: Infinity, logOutput };
    }

    let groupedTruckLoads = {};

    pitLoads.forEach(load => {
        const key = `${load.truckName}-${load.amount}-${load.rate}`;
        if (!groupedTruckLoads[key]) {
            groupedTruckLoads[key] = {
                truckName: load.truckName,
                amount: load.amount,
                rate: load.rate,
                count: 0,
                loads: []
            };
        }
        groupedTruckLoads[key].count++;
        groupedTruckLoads[key].loads.push(load);
    });

    // Find the distance from the yard to the pit
    let distanceYardToPitEntry = distances.find(d => 
    d.from.trim() === pit.closest_yard.trim() && d.to.trim() === pit.address.trim()
    );
    let distanceYardToPit = distanceYardToPitEntry ? parseFloat(distanceYardToPitEntry.distance.replace(/[^\d.]/g, '')) : 0;

    // Log an error if the distance is not found
    if (!distanceYardToPitEntry) {
    console.error(`ERROR: Could not find distance from yard (${pit.closest_yard}) to pit (${pit.address}).`);
    }

    // Find the distance from the pit to the drop-off location
    let distancePitToDropEntry = distances.find(d => 
    d.from.trim() === pit.address.trim() && d.to.trim() === addressInput.trim()
    );
    let distancePitToDrop = distancePitToDropEntry ? parseFloat(distancePitToDropEntry.distance.replace(/[^\d.]/g, '')) : 0;

    // Log an error if the distance is not found
    if (!distancePitToDropEntry) {
    console.error(`ERROR: Could not find distance from pit (${pit.address}) to drop-off (${addressInput}).`);
    }

    // Find the distance from the drop-off location to the yard
    let distanceDropToYardEntry = distances.find(d => 
        d.from.trim().toLowerCase() === addressInput.trim().toLowerCase() &&
        d.to.trim().toLowerCase() === yardLocations[finalClosestYard].trim().toLowerCase()
    );
    
    if (!distanceDropToYardEntry) {
        console.warn(`Distance from drop-off (${addressInput}) to yard (${finalClosestYard}) not found. Calculating...`);
        const newDistances = await calculateDistances([
            { origin: addressInput, destination: yardLocations[finalClosestYard] }
        ]);
        distances = distances.concat(newDistances);
    
        // Recheck for the distance after recalculating
        distanceDropToYardEntry = distances.find(d => 
            d.from.trim().toLowerCase() === addressInput.trim().toLowerCase() &&
            d.to.trim().toLowerCase() === yardLocations[finalClosestYard].trim().toLowerCase()
        );
    }
    
    let distanceDropToYard = distanceDropToYardEntry ? parseFloat(distanceDropToYardEntry.distance.replace(/[^\d.]/g, '')) : 0;
    
    // Log an error if the distance is still not found
    if (!distanceDropToYardEntry) {
        console.error(`ERROR: Could not find or calculate distance from drop-off (${addressInput}) to yard (${finalClosestYard}).`);
        console.log("Available Distances:", distances.map(d => `From: ${d.from}, To: ${d.to}`));
    }

    // === Check if total journey time exceeds 9 hours and split into days ===
    const MAX_MINUTES = 540;

    const estimatedTrips = pitLoads.length;
    const estStartTime = (driveTimeYardToPit + driveTimePitToDrop + driveTimeDropToYard) * 1.15 + 36;
    const estMidTime = (driveTimePitToDrop * 2) * 1.15 + 36;

    let estTime = 0;
    if (estimatedTrips > 0) {
        estTime += estStartTime;
        estTime += estMidTime * (estimatedTrips - 1);
    }

    let dayChunks = [];
    if (estTime > MAX_MINUTES) {
        dayChunks = splitPitLoadsIntoWorkDays(
            pitLoads,
            driveTimeYardToPit,
            driveTimePitToDrop,
            driveTimeDropToYard,
            distanceYardToPit,
            distancePitToDrop,
            distanceDropToYard
        );
    }

    const summaryHeader = "===================================";
    const subheader = "-----------------------------------";
    logOutput += `${summaryHeader}\n`;
    logOutput += `\n`;
    logOutput += `PIT Chosen:\n`;
    logOutput += `${pit.name}, ${pit.address}\n`;
    logOutput += `\n`;
    logOutput += `==> BASE PRICE: $${pit.price.toFixed(2)}\n`;
    logOutput += `\n`;
    logOutput += `${subheader}\n`;
    logOutput += `\n`;
        logOutput += `==> JOURNEY BREAKDOWN:\n`;
        logOutput += `A - Starting from:\n`;
        logOutput += `${pit.closest_yard}\n`;
        logOutput += `\n`;
        logOutput += `B - Going to Pit:\n`;
        logOutput += `${pit.name}, ${pit.address}\n`;
        logOutput += ` ⤷ Duration: ${driveTimeYardToPit} min\n`;
        logOutput += ` ⤷ Distance: ${distanceYardToPit} miles\n`;
        logOutput += `\n`;
        logOutput += `C - Drop off at:\n`;
        logOutput += `${addressInput}\n`;
        logOutput += ` ⤷ Duration: ${driveTimePitToDrop} min\n`;
        logOutput += ` ⤷ Distance: ${distancePitToDrop} miles\n`;
        logOutput += `\n`;
        logOutput += `D - Ending at: ${finalClosestYard}\n`;
        logOutput += ` ⤷ Duration: ${driveTimeDropToYard} min\n`;
        logOutput += ` ⤷ Distance: ${distanceDropToYard} miles\n`;
        logOutput += `\n`;
        // === Display the base route (one full round trip) regardless of day split ===
        const singleRouteTime = (driveTimeYardToPit + driveTimePitToDrop + driveTimeDropToYard) * 1.15 + 36;
        const singleRouteDistance = distanceYardToPit + distancePitToDrop + distanceDropToYard;

        logOutput += `ROUTE (One Full Round Trip):\n`;
        logOutput += `⤷ Duration: ${Math.ceil(singleRouteTime)} min (${(singleRouteTime / 60).toFixed(2)} hrs)\n`;
        logOutput += `⤷ Distance: ${singleRouteDistance.toFixed(2)} miles\n\n`;

        // Calculate total journey time and distance for all trips
        const totalTrips = Object.values(groupedTruckLoads).reduce((sum, group) => sum + group.count, 0);

        const startLeg = driveTimeYardToPit;
        const repeatLegs = (totalTrips - 1) * (driveTimePitToDrop * 2);
        const finalTrip = driveTimePitToDrop + driveTimeDropToYard;

        const totalJourneyTime = (startLeg + repeatLegs + finalTrip) * 1.15 + (36 * totalTrips);

        const totalJourneyDistance = 
            distanceYardToPit + 
            (distancePitToDrop * 2 * (totalTrips - 1)) +
            distancePitToDrop + 
            distanceDropToYard;

        if (dayChunks.length === 0) {
            logOutput += `\n`;
            logOutput += `TOTAL JOURNEY TIME: ${Math.ceil(totalJourneyTime)} min (${(totalJourneyTime / 60).toFixed(2)} hrs)\n`;
            logOutput += `TOTAL DISTANCE: ${totalJourneyDistance.toFixed(2)} miles\n\n`;
        }

    if (dayChunks.length > 0) {

        for (let i = 0; i < dayChunks.length; i++) {
            const day = dayChunks[i];

            let daySubtotal = 0;
            for (let l = 0; l < day.loads.length; l++) {
                const load = day.loads[l];
                const isFirstTrip = l === 0;
                const tripTime = getLoadTripTime(isFirstTrip, driveTimeYardToPit, driveTimePitToDrop, driveTimeDropToYard);
                const timeInHours = tripTime / 60;
                const hourlyRateCost = timeInHours * load.rate;
                const costPerUnit = (hourlyRateCost / load.amount) + (pit.price || 0);
                const loadCost = costPerUnit * load.amount;
                daySubtotal += loadCost;

                detailedCosts.push({
                    truckName: load.truckName,
                    rate: load.rate,
                    amount: load.amount,
                    costPerUnit,
                    costPerLoad: loadCost,
                    source: "pit"
                });
            }

            const dayLoad = day.loads.reduce((sum, load) => sum + load.amount, 0);

            logOutput += `\n`;
            logOutput += `${subheader}\n`;
            logOutput += `\n`;

            logOutput += `===== Day ${i + 1} =====\n`;
            logOutput += `Trips: ${day.trips}\n`;
            logOutput += `Load: ${dayLoad} ${materialInfo.sold_by}s\n`;
            logOutput += `Subtotal: $${daySubtotal.toFixed(2)}\n`;
            logOutput += `Day Distance: ${day.distance.toFixed(2)} miles\n`;
            logOutput += `Day Duration: ${day.duration.toFixed(2)} min (${(day.duration / 60).toFixed(2)} hrs)\n\n`;

            grandTotalMinutes += day.duration;
            grandTotalDistance += day.distance;
            grandTotalCost += daySubtotal;
        }

        logOutput += `\n`;
        logOutput += `${subheader}\n`;
        logOutput += `\n`;

        logOutput += `===== GRAND TOTAL (All Days - Pit Only) =====\n`;
        logOutput += `Total Cost: $${grandTotalCost.toFixed(2)}\n`;
        logOutput += `Total Duration: ${grandTotalMinutes.toFixed(2)} min (${(grandTotalMinutes / 60).toFixed(2)} hrs)\n`;
        logOutput += `Total Distance: ${grandTotalDistance.toFixed(2)} miles\n\n`;

        const truckGroups = {};
        detailedCosts
        .filter(load => load.source === "pit")
        .forEach(load => {
            const key = `${load.truckName}-${load.amount}-${load.rate}`;
            if (!truckGroups[key]) {
            truckGroups[key] = {
                truckName: load.truckName,
                amount: load.amount,
                rate: load.rate,
                loads: [],
            };
            }
            truckGroups[key].loads.push(load);
        });

        for (const key in truckGroups) {
            const group = truckGroups[key];
            const { truckName, amount, loads } = group;
            const truckTrips = loads.length;
            const truckTotalLoad = loads.reduce((sum, load) => sum + load.amount, 0);
            const truckTotalCost = loads.reduce((sum, load) => sum + load.costPerLoad, 0);
            const avgCostPerUnit = truckTotalCost / truckTotalLoad;

            logOutput += `${subheader}\n`;
            logOutput += `\n`;
            logOutput += `TRUCK(S):\n\n`;

            logOutput += `${truckTrips} ${truckName}(s) of ${amount} ${materialInfo.sold_by}s at $${avgCostPerUnit.toFixed(2)} per ${materialInfo.sold_by}\n\n`;
            logOutput += `==> DETAILS FOR ${truckName}:\n`;
            logOutput += `Total Load: ${truckTotalLoad}\n`;
            logOutput += `Total Trips: ${truckTrips}\n\n`;
        }

        logOutput += `${summaryHeader}\n\n`;
    }

    if (dayChunks.length === 0) {
        for (const key in groupedTruckLoads) {
            const group = groupedTruckLoads[key];
            const { truckName, amount, rate, count } = group;

            const truckTrips = count;
            const truckTotalLoad = count * amount;

            let truckTotalDriveTime = driveTimeYardToPit + (driveTimePitToDrop * (truckTrips * 2 - 1)) + driveTimeDropToYard;
            let truckAdjustedTravelTime = truckTotalDriveTime * 1.15;
            let truckTotalJourneyTime = truckAdjustedTravelTime + (36 * truckTrips);

            let costPerUnit = (((truckTotalJourneyTime / 60) * rate) / truckTotalLoad) + (pit.price || 0);

            if (isNaN(costPerUnit) || !isFinite(costPerUnit)) {
                const errMsg = `ERROR: Invalid costPerUnit for ${truckName}. Defaulting to $0.`;
                console.error(errMsg);
                costPerUnit = 0;
            }

            let costPerLoad = costPerUnit * amount;
            let groupCost = costPerLoad * count;
            totalCost += groupCost;

            logOutput += `${subheader}\n`;
            logOutput += `\n`;
            logOutput += `TRUCK(S):\n\n`;

            logOutput += `${count} ${truckName}(s) of ${amount} ${materialInfo.sold_by}s at $${costPerUnit.toFixed(2)} per ${materialInfo.sold_by}\n`;
            logOutput += `\n`;
            logOutput += `==> DETAILS FOR ${truckName}:\n`;
            logOutput += `Total Load: ${truckTotalLoad}\n`;
            logOutput += `Total Trips: ${truckTrips}\n`;
            logOutput += `\n`;

            // Add each load to detailed costs
            group.loads.forEach(load => {
                detailedCosts.push({
                    truckName: load.truckName,
                    rate: load.rate,
                    amount: load.amount,
                    costPerUnit,
                    costPerLoad: costPerUnit * load.amount,
                    source: "pit"
                });
            });
        }

        logOutput += `${summaryHeader}\n\n`;
    }

    if (yardLoads.length > 0) {
        const msg = `Processing overflow yard loads separately to ensure correct yard calculation.`;
        console.log(msg);

        let assignedYard = materialInfo.locations.find(yard => yard.name === finalClosestYard);
        if (!assignedYard) {
            const errMsg = `ERROR: Could not find assigned yard (${finalClosestYard}) in material locations.`;
            console.error(errMsg);
            return { totalCost: Infinity, detailedCosts: [], location: pit, pitLoads, yardLoads, logOutput };
        }

        let yardDistances = await calculateDistances([{ origin: assignedYard.address, destination: addressInput }]);

        yardCostData = await computeYardCosts(yardLoads, assignedYard, yardDistances, addressInput, materialInfo);

        if (yardCostData?.detailedCosts?.length > 0) {
            detailedCosts = detailedCosts.concat(yardCostData.detailedCosts);

            if (!yardCostData.totalCost || isNaN(yardCostData.totalCost)) {
                yardCostData.totalCost = yardCostData.detailedCosts.reduce(
                    (sum, load) => sum + (load.costPerLoad || 0),
                    0
                );
            }
        }
    }

    if (yardCostData?.logOutput) {
        logOutput += yardCostData.logOutput;
    }

    // Always calculate pit and yard subtotals from detailedCosts
    const pitSubtotal = detailedCosts
        .filter(load => load.source === "pit")
        .reduce((sum, load) => sum + (load.costPerLoad || 0), 0);

    const yardSubtotal = detailedCosts
        .filter(load => load.source === "yard")
        .reduce((sum, load) => sum + (load.costPerLoad || 0), 0);

    // Combine them into the final total
    totalCost = pitSubtotal + yardSubtotal;
    
    console.log(logOutput);

    return { totalCost, detailedCosts, location: pit, pitLoads, yardLoads, yardCostData, logOutput, groupedTruckLoads };
}






/* --------------------- Main function to calculate costs -------------------------- */
async function calculateCost() {
    const addressInput = document.getElementById('address')?.value || '';
    const selectedMaterial = document.getElementById('material')?.value || '';
    const amountNeeded = parseFloat(document.getElementById('tonsNeeded')?.value || 0);
    const materialInfo = materialData[selectedMaterial];

    // Safeguard to ensure materialInfo is available
    if (!materialInfo) {
        console.error(`No material info found for the selected material: ${selectedMaterial}`);
        alert("Selected material info is not available.");
        return;
    }

    // Default to 'unit' if 'sold_by' is not available
    const unit = materialInfo.sold_by || 'unit';   


    if (!selectedMaterial || !addressInput || isNaN(amountNeeded) || amountNeeded <= 0) {
        console.warn("calculateCost() called too early or with incomplete inputs. Skipping.");
        return;
    }    

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

    // Iterate through each location to calculate costs
    for (let location of materialInfo.locations) {
        let isYard = location.name.toLowerCase().includes("yard");

            if (isYard) {
                let { yardLoads } = await calculateYardTruckLoads(amountNeeded, materialInfo, location);
                let distances = await calculateDistances([{ origin: location.address, destination: addressInput }]);
                let yardCosts = await computeYardCosts(yardLoads, location, distances, addressInput, materialInfo);
                console.log(`YARD OPTION: ${location.name}, Total Cost: $${yardCosts.totalCost.toFixed(2)}`);
                console.log(yardCosts.logOutput);
                costResults.push(yardCosts);

            } else {
                let pitResult = await calculatePitTruckLoads(amountNeeded, materialInfo, location, finalClosestYard, [], addressInput, yardLocations);
                console.log("🚧 splitPitYardCombo Test Output:", pitResult.splitPitYardCombo);
                let { pitLoads, yardLoads, totalCost } = pitResult;
                
                if (pitLoads.length > 0) {
                    const pitTotal = pitLoads.reduce((sum, l) => sum + l.amount, 0);

                    if (pitTotal < amountNeeded) {
                        console.warn(`⚠️ Skipping PIT-only result for ${location.name} — only delivers ${pitTotal} of ${amountNeeded} required.`);
                    } else {
                        const distances = await calculateDistances([
                            { origin: location.closest_yard, destination: location.address },
                            { origin: location.address, destination: addressInput },
                            { origin: addressInput, destination: finalClosestYardLocation.address }
                        ]);

                        const pitCosts = await computePitCosts(
                            pitLoads,
                            location,
                            distances,
                            addressInput,
                            yardLoads,
                            totalCost,
                            materialInfo,
                            yardLocations,
                            amountNeeded
                        );

                        if (pitCosts.totalCost > 0) {
                            console.log(`PIT OPTION: ${location.name}, Total Cost: $${pitCosts.totalCost.toFixed(2)}`);
                            console.log(pitCosts.logOutput);
                            costResults.push(pitCosts);
                        }
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

    // Sort by total cost (cheapest first)
    costResults.sort((a, b) => a.totalCost - b.totalCost);
    
    // Display the cheapest result
    const cheapest = costResults[0];
    if (cheapest) {
        displayResults(cheapest.totalCost, cheapest.detailedCosts, unit, cheapest.logOutput);
    
        // Add this to print the breakdown at the end of the console output
        if (cheapest.logOutput) {
            console.log("===== CHEAPEST OPTION BREAKDOWN =====\n" + cheapest.logOutput);
        } else {
            console.log("===== CHEAPEST OPTION BREAKDOWN =====\nNo breakdown available.");
        }
    }

}






/* --------------------- Display the results on the page -------------------------- */
function displayResults(totalCost, detailedCosts, unit) {
    const loadDetailsSection = document.getElementById('loadDetails');
    const totalCostElement = document.getElementById('totalCost');

    if (!loadDetailsSection || !totalCostElement) {
        console.error("ERROR: One or more display elements are missing!");
        return;
    }

    // Clear previous results
    loadDetailsSection.innerHTML = '';

    // Filter valid loads
    if (!detailedCosts || !Array.isArray(detailedCosts) || detailedCosts.length === 0) {
        console.error("ERROR: No valid detailed costs passed to `displayResults()`.", detailedCosts);
        return;
    }
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

    // Group the loads by truck type and source
    const groupedTrucks = { pit: {}, yard: {} };
    detailedCosts.forEach(load => {
        const source = load.source === "yard" ? "yard" : "pit";
        const truckGroupKey = `${load.truckName}-${load.amount}-${load.rate}`;
        if (!groupedTrucks[source][truckGroupKey]) {
            groupedTrucks[source][truckGroupKey] = {
                truckName: load.truckName,
                amount: load.amount,
                loads: []
            };
        }
        groupedTrucks[source][truckGroupKey].loads.push(load);
    });

    // Show truck group subtotals for PIT and YARD (always show both if present)
    ['pit', 'yard'].forEach(source => {
        const trucks = groupedTrucks[source];
        if (Object.keys(trucks).length > 0) {
            Object.values(trucks).forEach(truck => {
                const { truckName, amount, loads } = truck;
                const truckTrips = loads.length;
                const truckTotalLoad = loads.reduce((sum, load) => sum + load.amount, 0);
                const truckTotalCost = loads.reduce((sum, load) => sum + load.costPerLoad, 0);
                const avgCostPerUnit = truckTotalCost / truckTotalLoad;

                const line = document.createElement('p');
                line.textContent = `${truckTrips} ${truckName}(s) of ${amount} ${unit}s at $${avgCostPerUnit.toFixed(2)} per ${unit}`;
                loadDetailsSection.appendChild(line);
            });
        }
    });

    // Show total cost (use computed value unless it's missing or obviously wrong)
    let fallbackTotal = detailedCosts.reduce((sum, load) => sum + (load.costPerLoad || 0), 0);
    let isValidComputedTotal = totalCost !== null && totalCost !== undefined && isFinite(totalCost) && totalCost > 0;

    const displayTotal = isValidComputedTotal ? totalCost : fallbackTotal;
    totalCostElement.value = "$" + displayTotal.toFixed(2);

    if (!isValidComputedTotal) {
        console.warn("⚠️ Using fallback totalCost from detailedCosts.");
    }
}







/* --------------------- Event Listeners -------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    updateUnitRestrictions();

    // Load the Google Maps API
    loadGoogleMapsApi();

    // Store original material locations for resetting
    const originalMaterialLocations = JSON.parse(JSON.stringify(materialData));

    // Setup event listener for changes in the selected material
    const materialSelect = document.getElementById("material");
    if (materialSelect) {
        materialSelect.addEventListener("change", updateUnitRestrictions);
    }

    // Setup event listener for input validation on the "tonsNeeded" input
    const tonsInput = document.getElementById("tonsNeeded");
    const helperText = document.getElementById("tons-help");
    if (tonsInput && helperText) {
        tonsInput.addEventListener("input", function () {
            const selectedMaterial = document.getElementById("material")?.value || '';
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
        });
    }

    // Add event listener for the semi truck checkbox to trigger recalculation
    const semiCheckbox = document.getElementById("allowSemi");
    if (semiCheckbox) {
        semiCheckbox.addEventListener("change", () => {
            const tons = parseFloat(document.getElementById("tonsNeeded")?.value || 0);
            const address = document.getElementById("address")?.value || "";
            if (address && !isNaN(tons) && tons > 0) {
                calculateCost();
            }
        });
    }

    // Add event listener for form submission to prevent the default form behavior and refresh functions
    const form = document.getElementById("calcForm");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            // Reset materialInfo.locations to the original state before filtering pits/yards
            Object.keys(materialData).forEach(key => {
                materialData[key].locations = JSON.parse(JSON.stringify(originalMaterialLocations[key].locations));
            });

            // Call the cost calculation function
            calculateCost();
        });
    }

    const routeTriggerInputs = [
        "address", 
        "material", 
        "tonsNeeded"
    ];
    
    routeTriggerInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", () => {
                const tons = parseFloat(document.getElementById("tonsNeeded")?.value || 0);
                const address = document.getElementById("address")?.value || "";
    
                // Avoid premature calculations
                if (address && !isNaN(tons) && tons > 0) {
                    calculateCost(); // This will refresh the maps
                }
            });
        }
    });
});