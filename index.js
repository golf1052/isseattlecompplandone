const openHouseLocations = [
    {
        name: "Loyal Heights Community Center",
        dateTimeStart: "2024-03-15T01:00Z",
        dateTimeEnd: "2024-03-15T02:30Z",
        address: "2101 NW 77th St, Seattle, WA 98117",
        latitude: 47.684665,
        longitude: -122.382744,
        link: "https://engage.oneseattleplan.com/en/events/71e28fb8-71b7-43b9-bc27-e8dc2375a34f"
    },
    {
        name: "Cleveland High School",
        dateTimeStart: "2024-03-20T01:00Z",
        dateTimeEnd: "2024-03-20T02:30Z",
        address: "5511 15th Ave S, Seattle, WA 98108",
        latitude: 47.55206,
        longitude: -122.3139367,
        link: "https://engage.oneseattleplan.com/en/events/f7fdda2f-b073-4deb-82a4-0b5cf17b2e3f"
    },
    {
        name: "Nathan Hale High School",
        dateTimeStart: "2024-03-27T01:00Z",
        dateTimeEnd: "2024-03-27T02:30Z",
        address: "10750 30th Ave NE, Seattle, WA 98125",
        latitude: 47.707584,
        longitude: -122.294138,
        link: "https://engage.oneseattleplan.com/en/events/ac4031e3-efb8-400a-a70d-752d39a9fd9d"
    },
    {
        name: "Chief Sealth International High School",
        dateTimeStart: "2024-04-04T01:00Z",
        dateTimeEnd: "2024-04-04T02:30Z",
        address: "2600 SW Thistle St, Seattle, WA 98126",
        latitude: 47.529597,
        longitude: -122.365955,
        link: "https://engage.oneseattleplan.com/en/events/9bda0a8e-6808-439b-b96d-cee1ccf55b27"
    },
    {
        name: "Garfield Community Center",
        dateTimeStart: "2024-04-17T01:00Z",
        dateTimeEnd: "2024-04-17T02:30Z",
        address: "2323 E Cherry St, Seattle, WA 98122",
        latitude: 47.607594,
        longitude: -122.302258,
        link: "https://engage.oneseattleplan.com/en/events/acd83225-84c9-4246-8ca1-501f1541b343"
    },
    {
        name: "Eckstein Middle School",
        dateTimeStart: "2024-04-26T01:00Z",
        dateTimeEnd: "2024-04-26T02:30Z",
        address: "3003 NE 75th St, Seattle, WA 98115",
        latitude: 47.682284,
        longitude: -122.294994,
        link: "https://engage.oneseattleplan.com/en/events/990cf7e9-8a67-4a61-83ac-9861fd9777d7"
    },
    {
        name: "Seattle City Hall",
        dateTimeStart: "2024-05-01T01:00Z",
        dateTimeEnd: "2024-05-01T02:30Z",
        address: "601 5th Ave, Seattle, WA 98104",
        latitude: 47.6037753,
        longitude: -122.3297049,
        link: "https://engage.oneseattleplan.com/en/events/fcdad573-6ea8-47a1-bb70-288b84e0eaae"
    },
    {
        name: "Virtual",
        dateTimeStart: "2024-05-03T01:00Z",
        dateTimeEnd: "2024-05-03T02:30Z",
        address: "Virtual",
        link: "https://engage.oneseattleplan.com/en/events/b921aa90-42aa-4461-9ed6-350619e72f63"
    }
];

function showNearestOpenHouse() {
    if (navigator.geolocation) {
        new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve(position);
            }, (error) => {
                reject(error);
            });
        })
        .then((position) => {
            const now = new Date();
            const locations = openHouseLocations
                .slice()
                .filter((location) => {
                    const start = new Date(location.dateTimeStart);
                    return start > now;
                })
                .sort((a, b) => {
                    if (!a.latitude) {
                        return 1;
                    } else {
                        const distanceA = haversineDistance(position.coords.latitude, position.coords.longitude, a.latitude, a.longitude);
                        const distanceB = haversineDistance(position.coords.latitude, position.coords.longitude, b.latitude, b.longitude);
                        return distanceA - distanceB;
                    }
                });
            if (locations.length > 0) {
                const nearestLocation = locations[0];
                document.getElementById('nearestOpenHouseHeader').innerHTML = 'Comment on the draft plan at your nearest open house';
                document.getElementById('nearestOpenHouseList').removeAttribute('hidden');
                document.getElementById('nearestOpenHouseName').innerHTML = `<a href="${nearestLocation.link}" target="_blank">${nearestLocation.name}</a>`;
                const startDateTime = new Date(nearestLocation.dateTimeStart);
                const endDateTime = new Date(nearestLocation.dateTimeEnd);
                const dateString = startDateTime.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                const startTimeString = startDateTime.toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit'
                });
                const endTimeString = endDateTime.toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit'
                });
                document.getElementById('nearestOpenHouseDateTime').innerText = `Date: ${dateString} - ${startTimeString} - ${endTimeString}`;
                document.getElementById('nearestOpenHouseAddress').innerText = `Address: ${nearestLocation.address}`;
                document.getElementById('nearestOpenHouseLink').innerHTML = `<a href="${nearestLocation.link}" target="_blank">More info</a>`;
                const event = ics.createEvent({
                    start: startDateTime.getTime(),
                    end: endDateTime.getTime(),
                    title: `One Seattle Plan Open House: ${nearestLocation.name}`,
                    description: nearestLocation.link,
                    location: nearestLocation.address,
                    geo: { lat: nearestLocation.latitude, lon: nearestLocation.longitude },
                    url: nearestLocation.link
                });
                const filename = 'OneSeattlePlanOpenHouse.ics';
                const file = new File([event.value], filename, { type: 'text/calendar' });
                const url = URL.createObjectURL(file);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = filename;
                anchor.innerText = 'Add to calendar';
                document.getElementById('nearestOpenHouseAddToCalendar').append(anchor);
            }
        });
    } else {
    }
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Calculates the distance between two points in kilometers.
function haversineDistance(lat1, lon1, lat2, lon2) {
    // Earth's radius in kilometers
    const R = 6371;
  
    // Difference of latitudes and longitudes
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    // Apply the haversine formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
  
    // Return the distance
    return d;
}

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
showNearestOpenHouse();
