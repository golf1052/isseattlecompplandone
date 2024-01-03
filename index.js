try {
    fetch('https://api.github.com/repos/golf1052/isseattlecompplandone')
    .then((response) => response.json())
    .then((json) => {
        document.getElementById('lastUpdated').innerText = `Last page updated: ${new Date(json.pushed_at).toLocaleString()}`;
    });
} catch (err) {
}

function main() {
    const currentDate = new Date();
    const endOf2024 = new Date('2024-12-31T23:59:59');
    const timeLeft = endOf2024 - currentDate;
    const percentOfYearLeft = timeLeft / (1000 * 60 * 60 * 24 * 366); // 2024 is a leap year
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutesLeft = Math.floor((timeLeft / (1000 * 60)) % 60);
    const secondsLeft = Math.floor((timeLeft / 1000) % 60);
    document.getElementById('timeRemaining').innerText = `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s remaining`;

    document.body.style.background = Color.mix('crimson', '#00964D', percentOfYearLeft);
}

setInterval(() => {
    main()
}, 1000);

main();
