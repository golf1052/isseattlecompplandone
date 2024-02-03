try {
    fetch('https://api.github.com/repos/golf1052/isseattlecompplandone')
    .then((response) => response.json())
    .then((json) => {
        document.getElementById('lastUpdated').innerText = `Last page updated: ${new Date(json.pushed_at).toLocaleString()}`;
    });
} catch (err) {
}

function getTimeSuffix(time) {
    if (time === 1) {
        return '';
    } else {
        return 's';
    }
}

function main() {
    const currentDate = new Date();
    const endOf2024 = new Date('2024-12-31T23:59:59');
    const endOfCurrentMonth = new Date(currentDate.getTime());
    endOfCurrentMonth.setDate(1);
    endOfCurrentMonth.setHours(23, 59, 59);
    endOfCurrentMonth.setMonth(currentDate.getMonth() + 1);
    endOfCurrentMonth.setDate(0);
    const monthLeft = endOfCurrentMonth - currentDate;
    const daysInMonthLeft = Math.floor(monthLeft / (1000 * 60 * 60 * 24));
    const hoursInMonthLeft = Math.floor((monthLeft / (1000 * 60 * 60)) % 24);
    const minutesInMonthLeft = Math.floor((monthLeft / (1000 * 60)) % 60);
    const secondsInMonthLeft = Math.floor((monthLeft / 1000) % 60);
    const timeLeft = endOf2024 - currentDate;
    const percentOfYearLeft = timeLeft / (1000 * 60 * 60 * 24 * 366); // 2024 is a leap year
    const monthsLeft = endOf2024.getMonth() - currentDate.getMonth();
    let text = '';
    if (monthsLeft > 0) { text += `${monthsLeft} month${getTimeSuffix(monthsLeft)} `; }
    if (daysInMonthLeft > 0) { text += `${daysInMonthLeft} day${getTimeSuffix(daysInMonthLeft)} `; }
    if (hoursInMonthLeft > 0) { text += `${hoursInMonthLeft} hour${getTimeSuffix(hoursInMonthLeft)} `; }
    if (minutesInMonthLeft > 0) { text += `${minutesInMonthLeft} minute${getTimeSuffix(minutesInMonthLeft)} `; }
    text += `${secondsInMonthLeft} second${getTimeSuffix(secondsInMonthLeft)} `;
    text += 'remaining';
    document.getElementById('timeRemaining').innerText = text;

    document.body.style.background = Color.mix('crimson', '#00964D', percentOfYearLeft);
}

setInterval(() => {
    main()
}, 1000);

main();
