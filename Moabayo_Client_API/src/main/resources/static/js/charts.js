document.addEventListener("DOMContentLoaded", async () => {
    // API 호출
    const ageData = await fetch("/csv/age").then(res => res.json());
    const regionData = await fetch("/csv/region").then(res => res.json());
    const timeData = await fetch("/csv/time").then(res => res.json());

    // ==============================
    // 1️⃣ 연령/성별 그룹화 후 합계 & 상위 5개
    // ==============================
    const ageGrouped = {};
    ageData.forEach(d => {
        const key = `${d.age}(${d.gender})`;
        ageGrouped[key] = (ageGrouped[key] || 0) + d.card_TOTAL;
    });

    const ageTop5 = Object.entries(ageGrouped)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // ==============================
    // 2️⃣ 지역 그룹화 후 합계 & 상위 5개
    // ==============================
    const regionGrouped = {};
    regionData.forEach(d => {
        const key = d.sido;
        regionGrouped[key] = (regionGrouped[key] || 0) + d.card_TOTAL;
    });

    const regionTop5 = Object.entries(regionGrouped)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // ==============================
    // 3️⃣ 시간대 그룹화 후 합계 & 상위 5개
    // ==============================
    const timeGrouped = {};
    timeData.forEach(d => {
        const key = d.time;
        timeGrouped[key] = (timeGrouped[key] || 0) + d.card_TOTAL;
    });

    const timeTop5 = Object.entries(timeGrouped)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // ==============================
    // Chart.js로 그리기
    // ==============================
    new Chart(document.getElementById("ageChart"), {
        type: 'bar',
        data: {
            labels: ageTop5.map(d => d[0]),
            datasets: [{
                label: '카드 사용량',
                data: ageTop5.map(d => d[1]),
                backgroundColor: 'rgba(75,192,192,0.6)'
            }]
        }
    });

    new Chart(document.getElementById("regionChart"), {
        type: 'bar',
        data: {
            labels: regionTop5.map(d => d[0]),
            datasets: [{
                label: '카드 사용량',
                data: regionTop5.map(d => d[1]),
                backgroundColor: 'rgba(153,102,255,0.6)'
            }]
        }
    });

    new Chart(document.getElementById("timeChart"), {
        type: 'bar',
        data: {
            labels: timeTop5.map(d => d[0]),
            datasets: [{
                label: '카드 사용량',
                data: timeTop5.map(d => d[1]),
                backgroundColor: 'rgba(255,159,64,0.6)'
            }]
        }
    });
});
