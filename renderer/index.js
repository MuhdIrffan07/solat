const fetchBtn = document.getElementById('fetchBtn');
const cityInput = document.getElementById('cityInput');
const prayerResults = document.getElementById('prayerResults');
const countdownDisplay = document.getElementById('countdownDisplay');

let countdownInterval = null;

// Smart mapping from friendly city names to JAKIM zone codes
const cityToZoneMap = {
    // JOHOR
    "johor bahru": "JHR01", "jb": "JHR01", "pasir gudang": "JHR01", "iskandar puteri": "JHR01",
    "kluang": "JHR02", "pontian": "JHR02",
    "batu pahat": "JHR03", "muar": "JHR03", "tangkak": "JHR03",
    "segamat": "JHR04", "gemas johor": "JHR04",
    "kota tinggi": "JHR05", "mersing": "JHR05",
    
    // KEDAH
    "kota setar": "KDH01", "alor setar": "KDH01", "kubang pasu": "KDH01", "pokok sena": "KDH01",
    "jitra": "KDH02",
    "langkawi": "KDH03",
    "padang terap": "KDH04", "sik": "KDH04",
    "yan": "KDH05", "pendang": "KDH05",
    "merbok": "KDH06", "sungai petani": "KDH06", "kuala muda": "KDH06",
    "kulim": "KDH07", "bandar baharu": "KDH07",
    "baling": "KDH08",

    // KELANTAN
    "kota bharu": "KTN01", "bachok": "KTN01", "pasir mas": "KTN01", "tumpat": "KTN01", "tanah merah": "KTN01", "machang": "KTN01", "cherang ruku": "KTN01", "jeli": "KTN01", "kuala krai": "KTN01",
    "gua musang": "KTN03",

    // MELAKA
    "melaka": "MLK01", "malacca": "MLK01", "alor gajah": "MLK01", "johol": "MLK01", "jasin": "MLK01", "bandar melaka": "MLK01",

    // NEGERI SEMBILAN
    "tampin": "NSN01", "jelebu": "NSN01",
    "seremban": "NSN02", "port dickson": "NSN02", "rembau": "NSN02",
    "kuala pilah": "NSN03", "jempol": "NSN03",

    // PAHANG
    "pulau tioman": "PHG01", "tioman": "PHG01",
    "kuantan": "PHG02", "pekan": "PHG02", "rompin": "PHG02",
    "jerantut": "PHG03", "temerloh": "PHG03", "maran": "PHG03", "bera": "PHG03", "mentakab": "PHG03",
    "bentong": "PHG04", "raub": "PHG04", "lipis": "PHG04",
    "cameron highlands": "PHG05", "genting highlands": "PHG05", "bukit tinggi": "PHG05",

    // PERAK
    "ipoh": "PRK01", "batu gajah": "PRK01", "kuala kangsar": "PRK01", "kampar": "PRK01",
    "taiping": "PRK02", "kamunting": "PRK02", "bagan serai": "PRK02", "parit buntar": "PRK02", "selama": "PRK02",
    "lenggong": "PRK03", "gerik": "PRK03", "pengkalan hulu": "PRK03",
    "temengor": "PRK04", "pulau bandar": "PRK04",
    "tapah": "PRK05", "bidor": "PRK05", "sungkai": "PRK05", "slim river": "PRK05", "tanjung malim": "PRK05",
    "lumut": "PRK06", "sitiawan": "PRK06", "manjung": "PRK06", "pangkor": "PRK06", "beruas": "PRK06",
    "parit": "PRK07", "bota": "PRK07", "kampung gajah": "PRK07", "seri iskandar": "PRK07",
    "teluk intan": "PRK08", "hutan melintang": "PRK08", "bagan datuk": "PRK08", "kampung teluk": "PRK08",

    // PERLIS
    "perlis": "PLS01", "kangar": "PLS01", "padang besar": "PLS01", "arau": "PLS01",

    // PULAU PINANG (PENANG)
    "penang": "PNG01", "pulau pinang": "PNG01", "george town": "PNG01", "jelutong": "PNG01", "balik pulau": "PNG01", "butterworth": "PNG01", "bukit mertajam": "PNG01", "nibong tebal": "PNG01", "kepala batas": "PNG01",

    // SABAH
    "sandakan": "SBH01", "sukau": "SBH01", "batu sapi": "SBH01",
    "pahst": "SBH02", "tawau": "SBH02", "semporna": "SBH02", "kunak": "SBH02", "lahad datu": "SBH02", "tungku": "SBH02",
    "kota kinabalu": "SBH03", "penampang": "SBH03", "tuaran": "SBH03", "kota belud": "SBH03", "papar": "SBH03", "putatan": "SBH03", "ranau": "SBH03",
    "kudat": "SBH04", "kota marudu": "SBH04", "pitas": "SBH04", "islands": "SBH04",
    "beaufort": "SBH05", "kuala penyu": "SBH05", "sipitang": "SBH05",
    "tenom": "SBH06", "keningau": "SBH06", "tambunan": "SBH06", "nabawan": "SBH06",
    "beluran": "SBH07", "telupid": "SBH07", "kinabatangan": "SBH07", "san": "SBH07",
    "mabuan": "SBH08", "pensiangan": "SBH08", "malalap": "SBH08", "long pasia": "SBH08",

    // SARAWAK
    "limbang": "SWK01", "lawas": "SWK01", "trusan": "SWK01",
    "miri": "SWK02", "niah": "SWK02", "bekenu": "SWK02", "marudi": "SWK02",
    "bintulu": "SWK03", "tubau": "SWK03", "tawau sarawak": "SWK03", "belaga": "SWK03",
    "sibu": "SWK04", "kanowit": "SWK04", "selangau": "SWK04", "mukah": "SWK04", "dalat": "SWK04", "matu": "SWK04", "daro": "SWK04",
    "sarikei": "SWK05", "bintangor": "SWK05", "meradong": "SWK05", "pakan": "SWK05", "julau": "SWK05",
    "sri aman": "SWK06", "lubok antu": "SWK06", "betong": "SWK06", "saratok": "SWK06", "kabong": "SWK06", "roban": "SWK06",
    "kuching": "SWK07", "samarahan": "SWK07", "serian": "SWK07", "bau": "SWK07", "sematan": "SWK07", "lundu": "SWK07", "simunjan": "SWK07", "asajaya": "SWK07", "sebuyau": "SWK07", "kapit": "SWK07", "song": "SWK07", "belaga": "SWK07",

    // SELANGOR
    "shah alam": "SGR01", "petaling jaya": "SGR01", "pj": "SGR01", "klang": "SGR01", "gombak": "SGR01", "hulu langat": "SGR01", "ampang": "SGR01", "rawang": "SGR01", "selayang": "SGR01", "kajang": "SGR01", "serdang": "SGR01", "subang jaya": "SGR01", "beranang": "SGR01",
    "hulu selangor": "SGR02", "kuala selangor": "SGR02", "batang kali": "SGR02", "tanjung karang": "SGR02", "bestari jaya": "SGR02",
    "sabak bernam": "SGR03", "sungai besar": "SGR03", "kuala langat": "SGR03", "banting": "SGR03", "sepang": "SGR03", "klia": "SGR03", "cyberjaya": "SGR03", "salak tinggi": "SGR03",

    // TERENGGANU
    "kuala terengganu": "TRG01", "marang": "TRG01", "kuala nerus": "TRG01",
    "besut": "TRG02", "setiu": "TRG02",
    "hulu terengganu": "TRG03",
    "dungun": "TRG04", "kemaman": "TRG04",

    // WILAYAH PERSEKUTUAN (KL, PUTRAJAYA, LABUAN)
    "kuala lumpur": "WLY01", "kl": "WLY01", "putrajaya": "WLY01", "cyberjaya kl": "WLY01",
    "labuan": "WLY02"
};

fetchBtn.addEventListener('click', () => {
    const userInput = cityInput.value.trim().toLowerCase();
    
    if (!userInput) {
        alert('Please enter a city name.');
        return;
    }

    let zoneCode = cityToZoneMap[userInput];
    if (!zoneCode) {
        zoneCode = userInput.toUpperCase();
    }

    const apiUrl = `https://api.waktusolat.app/v2/solat/${zoneCode}`;

    prayerResults.innerHTML = `<p>Searching prayer times for "${cityInput.value}"...</p>`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Location not found');
            return response.json();
        })
        .then(data => {
            if (data && data.prayers && data.prayers.length > 0) {
                const today = new Date();
                const dayIndex = today.getDate() - 1;
                
                const todayData = data.prayers[dayIndex] || data.prayers[0]; 

                const displayLocation = cityInput.value.toUpperCase();

                const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = today.toLocaleDateString('en-US', dateOptions);
                
                const hijriDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(today);

                const formatTime = (timestamp) => {
                    if (!timestamp) return 'N/A';
                    const date = new Date(timestamp * 1000);
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                };

                prayerResults.innerHTML = `
                    <div style="background: rgba(255,255,255,0.08); padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
                        <p style="margin: 0; font-size: 1.05em;"><strong>📅 Date:</strong> ${formattedDate}</p>
                        <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #9ca3af;">🌙 ${hijriDate}</p>
                        <p style="margin: 8px 0 0 0; color: #a7f3d0;"><strong>📍 Location:</strong> ${displayLocation} (Zone: ${data.zone || zoneCode})</p>
                    </div>
                    <ul id="prayerList">
                        <li data-prayer="imsak"><span>Imsak</span> <strong>${formatTime(todayData.imsak)}</strong></li>
                        <li data-prayer="syuruk"><span>Syuruk</span> <strong>${formatTime(todayData.syuruk)}</strong></li>
                        <li data-prayer="fajr"><span>Subuh (Fajr)</span> <strong>${formatTime(todayData.fajr)}</strong></li>
                        <li data-prayer="dhuhr"><span>Zohor (Dhuhr)</span> <strong>${formatTime(todayData.dhuhr)}</strong></li>
                        <li data-prayer="asr"><span>Asar (Asr)</span> <strong>${formatTime(todayData.asr)}</strong></li>
                        <li data-prayer="maghrib"><span>Maghrib</span> <strong>${formatTime(todayData.maghrib)}</strong></li>
                        <li data-prayer="isha"><span>Isyak (Isha)</span> <strong>${formatTime(todayData.isha)}</strong></li>
                    </ul>
                `;

                // Highlight the next upcoming prayer in the schedule
                const nowInSeconds = Math.floor(Date.now() / 1000);
                let nextPrayerElement = null;
                if (nowInSeconds < todayData.fajr) nextPrayerElement = document.querySelector('[data-prayer="fajr"]');
                else if (nowInSeconds < todayData.dhuhr) nextPrayerElement = document.querySelector('[data-prayer="dhuhr"]');
                else if (nowInSeconds < todayData.asr) nextPrayerElement = document.querySelector('[data-prayer="asr"]');
                else if (nowInSeconds < todayData.maghrib) nextPrayerElement = document.querySelector('[data-prayer="maghrib"]');
                else if (nowInSeconds < todayData.isha) nextPrayerElement = document.querySelector('[data-prayer="isha"]');
                else nextPrayerElement = document.querySelector('[data-prayer="fajr"]');

                if (nextPrayerElement) {
                    nextPrayerElement.classList.add('next-prayer-highlight');
                }

                runSuggestionLogic();
                runMultiPrayerCountdown(todayData);
            } else {
                prayerResults.innerHTML = `<p style="color: #ef4444;">No prayer data found for "${cityInput.value}".</p>`;
            }
        })
        .catch(error => {
            console.error('API Error:', error);
            prayerResults.innerHTML = `<p style="color: #ef4444;">Location not recognized. Try typing "Kuala Lumpur" or "Shah Alam".</p>`;
        });
});

// Suggestion Logic using Control Statements
function runSuggestionLogic() {
    const currentHour = new Date().getHours();
    let suggestion = "";

    if (currentHour < 5) {
        suggestion = "It's early morning. Consider performing Tahajjud prayers before Subuh!";
    } else if (currentHour >= 5 && currentHour < 12) {
        suggestion = "Morning hours: A great time for Quran recitation and starting your work with intention.";
    } else if (currentHour >= 12 && currentHour < 16) {
        suggestion = "Midday hours: Prepare for Zohor and take a brief break to refresh your wudhu.";
    } else if (currentHour >= 16 && currentHour < 19) {
        suggestion = "Evening hours: Prepare for Asar and take a brief break to refresh your wudhu.";
    } else if (currentHour >= 20 && currentHour < 21) {
        suggestion = "Late Evening hours: Prepare for Maghrib/Isyak and take a brief break to refresh your wudhu.";
    } else {
        suggestion = "Night Hours: Quran Recitation and take a rest to summarize your day!";
    }

    // Outputting to the new suggestion card
    document.getElementById('suggestionBox').innerHTML = `
        <p style="color: #d1fae5; font-size: 1.1em; line-height: 1.5; margin: 0;">
            ${suggestion}
        </p>
    `;

    // Store suggestions in Local Storage
    let history = JSON.parse(localStorage.getItem('suggestionHistory')) || [];
    history.push({
        location: cityInput.value,
        suggestion: suggestion,
        date: new Date().toLocaleString()
    });
    if(history.length > 5) history.shift(); 
    localStorage.setItem('suggestionHistory', JSON.stringify(history));
}

// Live Multi-Prayer Countdown Timer
function runMultiPrayerCountdown(todayData) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    const prayers = [
        { name: "Subuh (Fajr)", timestamp: todayData.fajr },
        { name: "Zohor (Dhuhr)", timestamp: todayData.dhuhr },
        { name: "Asar (Asr)", timestamp: todayData.asr },
        { name: "Maghrib", timestamp: todayData.maghrib },
        { name: "Isyak (Isha)", timestamp: todayData.isha }
    ];

    const updateTimer = () => {
        const nowInSeconds = Math.floor(Date.now() / 1000);
        
        const justPassedPrayer = prayers.find(p => nowInSeconds >= p.timestamp && nowInSeconds < p.timestamp + 10);

        if (justPassedPrayer) {
            countdownDisplay.innerHTML = `🔔<span style="color: #10b981; font-size: 1.1em;"><strong>It is time for ${justPassedPrayer.name}!</strong></span>`;
            return; 
        }

        let nextPrayer = prayers.find(p => p.timestamp > nowInSeconds);

        if (!nextPrayer) {
            nextPrayer = { 
                name: "Subuh (Fajr) Tomorrow", 
                timestamp: todayData.fajr + 86400 
            };
        }

        const diffSeconds = nextPrayer.timestamp - nowInSeconds;

        const hoursLeft = Math.floor(diffSeconds / 3600);
        const minsLeft = Math.floor((diffSeconds % 3600) / 60);
        const secsLeft = diffSeconds % 60;

        countdownDisplay.innerHTML = `Next Prayer: <strong>${nextPrayer.name}</strong> in <strong>${hoursLeft}h ${minsLeft}m ${secsLeft}s</strong>`;
    };

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
}