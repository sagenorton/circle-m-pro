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
async function updateUnitRestrictions() {
    const materialSelect = document.getElementById("material");
    const selectedOption = materialSelect.options[materialSelect.selectedIndex];
    const selectedMaterial = selectedOption.value;
    const unit = selectedOption.getAttribute("data-unit");
    const tonsInput = document.getElementById("tonsNeeded");

    // Fetch material info from backend function
    const materialInfo = await fetch('/.netlify/functions/materials?material=' + encodeURIComponent(selectedMaterial))
    .then(res => res.json())
    .catch(err => {
        console.error("Failed to fetch material data:", err);
        return null;
    });

    if (!materialInfo || materialInfo.error) {
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






/* --------------------- Main function to calculate costs -------------------------- */
async function calculateCost() {
    const addressInput = document.getElementById('address').value;
    const selectedMaterial = document.getElementById('material').value;
    const amountNeeded = parseFloat(document.getElementById('tonsNeeded').value);

    const materialInfo = await fetch('/.netlify/functions/materials?material=' + encodeURIComponent(selectedMaterial))
    .then(res => res.json())
    .catch(err => {
        console.error("Failed to fetch material data:", err);
        return null;
    });

    if (!materialInfo) {
        console.error("No material info returned. Aborting calculation.");
        return;
    }

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

    // Iterate through each location to calculate costs
    for (let location of materialInfo.locations) {
        let isYard = location.name.toLowerCase().includes("yard");

        if (isYard) {
            let { yardLoads } = await calculateYardTruckLoads(amountNeeded, materialInfo, location);
            let distances = await calculateDistances([{ origin: location.address, destination: addressInput }]);
            
            let yardCosts = await fetch('/.netlify/functions/calculateCost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'yard',
                    truckLoadInfo: yardLoads,
                    yard: location,
                    distances,
                    addressInput,
                    materialKey: selectedMaterial,
                    suppressLogs: false
                })
            }).then(res => res.json());

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

                let pitCosts = await fetch('/.netlify/functions/calculateCost', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'pit',
                        pitLoads,
                        pit: location,
                        distances,
                        addressInput,
                        yardLoads,
                        yardTotalCost: totalCost,
                        materialKey: selectedMaterial,
                        yardLocations,
                        amountNeeded,
                        suppressLogs: false
                    })
                }).then(res => res.json());

                if (pitCosts.totalCost > 0) {
                    console.log(`PIT OPTION: ${location.name}, Total Cost: $${pitCosts.totalCost.toFixed(2)}`);
                    console.log(pitCosts.logOutput);
                    costResults.push(pitCosts);
                }                
            }

            // Inject PIT+YARD Split Combo from pitResult if it exists
            if (pitResult.splitPitYardCombo && isFinite(pitResult.splitPitYardCombo.totalCost)) {
                pitResult.splitPitYardCombo.location = location;
                pitResult.splitPitYardCombo.sourceType = "pit+yard";
                pitResult.splitPitYardCombo.sourceAddress = location.address;

                console.log(`Evaluated PIT+YARD Split Combo at ${location.name} - sending to backend`);

                let splitCombo = await fetch('/.netlify/functions/calculateCost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'pit',
                    pit: location,
                    pitLoads: pitResult.splitPitYardCombo.pitLoads,
                    yardLoads: pitResult.splitPitYardCombo.yardLoads,
                    yardTotalCost: pitResult.splitPitYardCombo.yardLoads.reduce((sum, d) => sum + (d.costPerLoad || (d.amount * d.rate)), 0),
                    addressInput,
                    distances: await calculateDistances([
                    { origin: location.closest_yard, destination: location.address },
                    { origin: location.address, destination: addressInput },
                    { origin: addressInput, destination: finalClosestYardLocation.address }
                    ]),
                    materialKey: selectedMaterial,
                    yardLocations,
                    amountNeeded,
                    suppressLogs: false
                })
                }).then(res => res.json());

                costResults.push(splitCombo);
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

            const yardCost = await fetch('/.netlify/functions/calculateCost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'yard',
                    truckLoadInfo: bComboLoads,
                    yard: location,
                    distances,
                    addressInput,
                    materialKey: selectedMaterial,
                    suppressLogs: false
                })
            }).then(res => res.json());
    
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

    // Load the Google Maps API
    loadGoogleMapsApi();

    // Setup event listener for changes in the selected material
    const materialSelect = document.getElementById("material");
    materialSelect.addEventListener("change", updateUnitRestrictions);

    // Setup event listener for input validation on the "tonsNeeded" input
    const tonsInput = document.getElementById("tonsNeeded");
    const helperText = document.getElementById("tons-help");
    tonsInput.addEventListener("input", async function () {
        const selectedMaterial = document.getElementById("material").value;
        const materialInfo = await fetch('/.netlify/functions/materials?material=' + encodeURIComponent(selectedMaterial))
        .then(res => res.json())
        .catch(err => {
            console.error("Failed to fetch material data:", err);
            return null;
        });

        if (!materialInfo) return;

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

    // Add event listener for form submission to prevent the default form behavior and refresh functions
    const form = document.getElementById("calcForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Call the cost calculation function
        calculateCost();
    });
});