document.addEventListener('DOMContentLoaded', function() {
    const sheetId = '1nenqQZf4hS7FTXRiL5wBI4afzUSahsEHRV-5xd9fXtQ'; // Google Sheets ID
    const range = 'Sheet1'; // Sheet name or range
    const apiKey = 'YOUR_API_KEY'; // Replace with your API key

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function isTodayOrTomorrow(date) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return date >= today && date < tomorrow;
    }

    function renderMeetings(data) {
        const values = data.values;
        if (values.length > 0) {
            let html = '<table><tr><th>Meeting Topic</th><th>Start Time</th><th>End Time</th><th>Room</th></tr>';
            values.forEach(row => {
                const startTime = new Date(row[1]);
                const endTime = new Date(row[2]);
                if (isTodayOrTomorrow(startTime)) {
                    html += `<tr><td>${row[0]}</td><td>${startTime.toLocaleString()}</td><td>${endTime.toLocaleString()}</td><td>${row[3]}</td></tr>`;
                }
            });
            html += '</table>';
            document.getElementById('meetings').innerHTML = html;
        } else {
            document.getElementById('meetings').innerHTML = 'No meetings found for today or tomorrow.';
        }
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data:', data); // Log data to check the response
            renderMeetings(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('meetings').innerHTML = 'Failed to load data.';
        });
});
