function csvToJson(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, key, i) => {
            obj[key.trim()] = values[i].trim();
            return obj;
        }, {});
    });
}

// Update the fetch URL to ensure it works with the local file
async function fetchAndDisplayData(selectedNeighborhood, selectedTree) {
    let response;
    try {
        response = await fetch('./treesCDN.csv'); // Ensure the file is in the same folder
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        const hood = tree.neighborhood || null;
        const type = tree.treeType || null;
        if (!hood || !type) {
            console.warn('Malformed tree data:', tree);
            return;
        }
        if (!neighborhoodTreeCounts[hood]) {
        return;
    }
    const csvText = await response.text();
    const data = csvToJson(csvText);
        const hood = tree.neighborhood;
        const type = tree.treeType;

        if (hood && type) { // Ensure both properties exist
            if (!neighborhoodTreeCounts[hood]) {
                neighborhoodTreeCounts[hood] = {};
            }
            if (!neighborhoodTreeCounts[hood][type]) {
                neighborhoodTreeCounts[hood][type] = 0;
            }
            neighborhoodTreeCounts[hood][type]++;
        }
        if (!neighborhoodTreeCounts[hood][type]) {
            neighborhoodTreeCounts[hood][type] = 0;
        }
        neighborhoodTreeCounts[hood][type]++;
    };

    // Get the max for comparison
    const max = Math.max(
        ...Object.values(neighborhoodTreeCounts).flatMap(treeCounts =>
            Object.values(treeCounts)
        )
    );

    // Get the count for the selected neighborhood and tree type
    const count =
        (neighborhoodTreeCounts[selectedNeighborhood] &&
            neighborhoodTreeCounts[selectedNeighborhood][selectedTree]) ||
        0;
    const risk = Math.round((count / max) * 100);

    // Update the DOM
    document.getElementById('treeCount').textContent = count;
    document.getElementById('percentageRisk').textContent = `${risk}% more likely`;
}


  // Event listener for form submission
  document.getElementById('treeForm').addEventListener('submit', event => {
    event.preventDefault();
    const selectedNeighborhood = document.getElementById('neighborhood').value;
    const selectedTree = document.getElementById('treeType').value;
    fetchAndDisplayData(selectedNeighborhood, selectedTree);
  });

fetchAndDisplayData();