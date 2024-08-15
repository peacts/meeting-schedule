document.addEventListener('DOMContentLoaded', function() {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1nenqQZf4hS7FTXRiL5wBI4afzUSahsEHRV-5xd9fXtQ/gviz/tq?gid=367284454&headers=1&tqx=out:json';

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
        try {
            const jsonData = JSON.parse(data.substr(47).slice(0, -2)); // Remove unnecessary parts
            const rows = jsonData.table.rows;
            if (rows.length > 0) {
                let html = '<table><tr><th>เรื่องการประชุม</th><th>วัน เวลา: เริ่ม</th><th>วัน เวลา: สิ้นสุด</th><th>ห้องประชุม</th></tr>';
                rows.forEach(row => {
                    const columns = row.c;
                    const startTime = new Date(columns[1].v);
                    const endTime = new Date(columns[2].v);
                    if (isTodayOrTomorrow(startTime)) {
                        html += `<tr><td>${columns[0].v}</td><td>${startTime.toLocaleString('th-TH')}</td><td>${endTime.toLocaleString('th-TH')}</td><td>${columns[3].v}</td></tr>`;
                    }
                });
                html += '</table>';
                document.getElementById('meetings').innerHTML = html;
            } else {
                document.getElementById('meetings').innerHTML = 'ไม่พบการประชุมสำหรับวันนี้หรือพรุ่งนี้.';
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            document.getElementById('meetings').innerHTML = 'ไม่สามารถประมวลผลข้อมูลได้.';
        }
    }

    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {
            console.log('Data received:', data); // Log data to check the response
            renderMeetings(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('meetings').innerHTML = 'ไม่สามารถโหลดข้อมูลได้.';
        });
});
