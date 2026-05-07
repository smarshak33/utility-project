async function fetchAndDisplayData(neighborhood, treeType) {
    try {
        const response = await fetch('treesCDN.json');
        const data = await response.json();

        const filteredTrees = data.filter(tree => 
            tree.nta_name && tree.spc_common &&
            tree.nta_name.toLowerCase() === neighborhood.toLowerCase() && 
            tree.spc_common.toLowerCase() === treeType.toLowerCase()
        );

        const treeCount = filteredTrees.length;

        console.log(`Total number of trees: ${treeCount}`);
        document.getElementById('treeCount').innerHTML = `<strong>${neighborhood}</strong> has <strong>${treeCount}</strong> <strong>${treeType}</strong> trees.`;

        // Get count of all trees of the specified type for all of NYC
        // const maxNYC = data.filter(tree => 
        //             tree.spc_common && tree.spc_common.toLowerCase() === treeType.toLowerCase()
        //         ).length;
        //         console.log(`Total number of ${treeType} trees in NYC: ${maxNYC}`);

        // Get the borough of the selected neighborhood
        const selectedBorough = filteredTrees.length > 0 ? filteredTrees[0].borough : null;

        // Get count of all trees of the specified type in the selected borough
        const maxBoro = selectedBorough ? data.filter(tree => 
            tree.borough && tree.spc_common &&
            tree.borough.toLowerCase() === selectedBorough.toLowerCase() &&
            tree.spc_common.toLowerCase() === treeType.toLowerCase()
        ).length : 0;

        console.log(`Total number of ${treeType} trees in ${selectedBorough}: ${maxBoro}`);

        document.getElementById('infoBox');
        infoBox.style.padding = '10px';
        document.getElementById('percentageRisk').innerHTML = `You are <strong>${Math.round((treeCount / maxBoro) * 100)}%</strong> more likely to sneeze in <strong>${neighborhood}</strong> than in the rest of <strong>${selectedBorough}</strong>.`;
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }

}

async function displayTopThreeNeighborhoods(treeType) {
    try {
        const response = await fetch('treesCDN.json');
        const data = await response.json();

        // Group and count trees by neighborhood for the selected tree type
        const neighborhoodCounts = data.reduce((acc, tree) => {
            if (tree.spc_common && tree.spc_common.toLowerCase() === treeType.toLowerCase() && tree.nta_name) {
                acc[tree.nta_name] = (acc[tree.nta_name] || 0) + 1;
            }
            return acc;
        }, {});

        // Sort neighborhoods by tree count and get the top three
        const topThree = Object.entries(neighborhoodCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        // Create the title
        const title = document.createElement('h3');
        title.innerHTML = `Top neighborhoods with the most <strong>${treeType}</strong> trees:`;

        // Create the table
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th style="text-align: left;">Neighborhood</th>
                    <th>Tree Count</th>
                </tr>
            </thead>
            <tbody>
                ${topThree.map(([neighborhood, treeCount]) => `
                    <tr>
                        <td>${neighborhood}</td>
                        <td style="text-align: center;">${treeCount}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        // Append the title and table to the document
        const resultContainer = document.getElementById('resultContainer');
        if (resultContainer) {
            resultContainer.innerHTML = ''; // Clear any existing content
            resultContainer.appendChild(title);
            resultContainer.appendChild(table);
        } else {
            console.error("Element with ID 'resultContainer' not found in the DOM.");
        }
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}

document.getElementById('submit').addEventListener('click', () => {
    const selectedTree = document.getElementById('treeDropdown').value;
    displayTopThreeNeighborhoods(selectedTree);
});

document.getElementById('submit').addEventListener('click', event => {
    console.log("Submit button clicked");
    event.preventDefault();
    const selectedNeighborhood = document.getElementById('ntaDropdown').value;
    const selectedTree = document.getElementById('treeDropdown').value;

    console.log(`Neighborhood: ${selectedNeighborhood}`);
    console.log(`Tree Type: ${selectedTree}`);

    fetchAndDisplayData(selectedNeighborhood, selectedTree);
});