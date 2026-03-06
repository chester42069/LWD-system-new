function getTimedGreeting(lang = 'en') {
    const now = new Date();
    const day = now.getDay(); 
    const hour = now.getHours();
    const isWeekday = day >= 1 && day <= 5;
    const isOpenHours = hour >= 8 && hour < 17;
    const isOfficeOpen = isWeekday && isOpenHours;

    let timeText = "";
    if (hour < 12) {
        timeText = lang === 'en' ? "Good morning! ☀️" : "Magandang umaga! ☀️";
    } else if (hour < 18) {
        timeText = lang === 'en' ? "Good afternoon! 🌤️" : "Magandang hapon! 🌤️";
    } else {
        timeText = lang === 'en' ? "Good evening! 🌙" : "Magandang gabi! 🌙";
    }

    let statusText = isOfficeOpen 
        ? (lang === 'en' ? "<br>Our office is currently <b>OPEN</b>. How can I help?" : "<br>Ang aming opisina ay <b>BUKAS</b>. Ano po ang maipaglilingkod ko?")
        : (lang === 'en' ? "<br>Our office is currently <b>CLOSED</b>, but I'm here to help!" : "<br>Ang aming opisina ay <b>SARADO</b> na sa ngayon, pero handa akong tumulong!");

    return `${timeText}${statusText}`;
}

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        setTimeout(() => { document.getElementById('chat-input').focus(); }, 300);
    }
}

function handleKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function sendSuggestion(text) {
    const input = document.getElementById('chat-input');
    input.value = text;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    const typing = document.getElementById('typing-indicator');
    const suggestionBox = document.getElementById('suggestion-box');
    const userText = input.value.trim();

    if (userText === "") return;
    if (suggestionBox) suggestionBox.style.display = 'none';

    body.insertAdjacentHTML('beforeend', `<div class="msg user">${userText}</div>`);
    input.value = "";
    input.style.height = 'auto';
    body.scrollTop = body.scrollHeight;

    if (typing) {
        typing.style.display = "block";
        body.appendChild(typing);
        body.scrollTop = body.scrollHeight;
    }

    setTimeout(() => {
        if (typing) typing.style.display = "none";
        const response = getBotResponse(userText); 
        body.insertAdjacentHTML('beforeend', `<div class="msg bot">${response}</div>`);
        body.scrollTop = body.scrollHeight;
    }, 800);
}

function clearChat() {
    const body = document.getElementById('chat-body');
    body.innerHTML = `
        <div class="msg bot">Hello! 🌊 I'm your LWD Assistant. How can I assist you with our services today?</div>
        <div class="suggestions" id="suggestion-box" style="display: flex; flex-wrap: wrap; gap: 5px; margin-top:10px;">
            <button onclick="sendSuggestion('Payment Options')">💰 Payment</button>
            <button onclick="sendSuggestion('New Connection')">🚰 New Connection</button>
            <button onclick="sendSuggestion('Contact info')">📞 Contact Us</button>
            <button onclick="sendSuggestion('Office hours')">⏰ Office Hours</button>
        </div>
        <div id="typing-indicator" class="typing" style="display:none;">Assistant is typing...</div>
    `;
}

function getBotResponse(input) {
    // 1. CLEAN INPUT
    const cleanUserText = input.toLowerCase().replace(/[?.,!]/g, '').trim();
    const words = cleanUserText.split(/\s+/);

    // 2. TAGALOG DETECTION (Expanded to include words found in buttons)
    const tlMarkers = [
        'po', 'ba', 'na', 'ng', 'ang', 'sa', 'mga', 'opo', 'ano', 'saan', 
        'bakit', 'paano', 'kailan', 'sino', 'kamusta', 'salamat', 'ko', 'yung',
        'mo', 'ako', 'kami', 'tayo', 'kayo', 'sila', 'ito', 'iyan', 'doon', 
        'rito', 'nito', 'lang', 'naman', 'pala', 'kasi', 'mismo', 'meron', 'wala',
        'ayos', 'ayusin', 'naka', 'nag', 'mag', 'kakabit', 'bayad', 'tubig',
        'kulay', 'maputi', 'mabilis', 'matagal', 'paano',
    ];
    
    let isTagalog = words.some(word => tlMarkers.includes(word));
    const lang = isTagalog ? 'tl' : 'en';
 
    const library = {
        billingPolicy: {
        kw: ["minimum", "reconnection", "re-connection", "hindi ginagamit", "charge", "bakit may bayad", "minimum charge", "reconnection fee", "bakit may minimum charge", "bakit may reconnection fee"],
        en: "<b>Minimum Charge & Reconnection Fee:</b> These policies and fees are implemented by <b>Laguna Aquatech</b>. They handle all billing regulations. Please visit their office or call (049) 536-0661 for a detailed explanation.",
        tl: "<b>Bakit may Minimum Charge at Reconnection Fee?</b><br>Ang mga policy na ito ay sa ilalim ng <b>Laguna Aquatech</b>. Sila lamang po ang makakapag-paliwanag ng detalye. Maaari po kayong tumawag sa (049) 536-0661."
    },
    paymentOptions: {
        kw: ["how to pay", "payment", "where to pay", "options", "water bill", "pay", "magbayad", "saan magbabayad", "bayad", "paano mag bayad ng bills", "paano magbayad", "paano mag bayad", "paano magbayad ng bill"],
        en: `<b>Where would you like to pay?</b><br><br>
            Please select your preferred method:<br><br>
            <div class="suggestions">
                <button onclick="sendSuggestion('Laguna Aquatech Office')">🏢 Pay at Laguna Aquatech Office</button>
                <button onclick="sendSuggestion('GCash')">📱 Pay via GCash</button>
            </div>`,
        tl: `<b>Saan niyo po gustong magbayad?</b><br><br>
            Pumili ng paraan ng pagbabayad:<br><br>
            <div class="suggestions">
                <button onclick="sendSuggestion('Sa Laguna Aquatech Office')">🏢 Laguna Aquatech Office</button>
                <button onclick="sendSuggestion('Magbayad sa GCash')">📱 Sa GCash App</button>
            </div>`
    },
    office_info: {
        kw: ["laguna aquatech office", "sa laguna aquatech office", "office pay", "pumunta sa opisina", "walk-in", "address", "maahas"],
        en: `<b>Paying at Laguna Aquatech Office:</b><br><br>
            📍 <b>Address:</b> 5524 Manila South Rd, Brgy. Maahas, Los Baños.<br>
            ⏰ <b>Hours:</b> Mon-Fri 7am-4pm, Sat 8am-12pm.<br><br>
            ✅ <b>Required for Due Dates:</b> If today is your due date, pay here in-person.`,
        tl: `<b>Pagbabayad sa Laguna Aquatech Office:</b><br><br>
            📍 <b>Address:</b> 5524 Manila South Rd, Brgy. Maahas, Los Baños.<br>
            ⏰ <b>Oras:</b> Mon-Fri 7am-4pm, Sabado 8am-12pm.<br><br>
            ✅ <b>Due Date:</b> Kung due date na ngayon, dito po dapat magbayad walk-in.`
    },
    gcash: {
        kw: ["gcash", "magbayad sa gcash", "maya", "step", "pambayad sa gcash", "bills via gcash"],
        en: `<b>How to pay via GCash (Step-by-Step):</b><br><br>
            1. On the GCash Home screen, tap <b>"Bills"</b>.<br>
            2. Under Categories, tap <b>"Water Utilities"</b>.<br>
            3. Search/Select <b>"Laguna Aquatech"</b>.<br>
            4. Input the <b>EXACT AMOUNT</b>, your <b>Account Number</b>, and <b>Name</b>.<br>
            5. Save your transaction receipt.<br><br>
            ⚠️ <b>IMPORTANT:</b> GCash is <b>NOT accepted on or after the due date</b>. If your bill is due today or overdue, please pay <b>in-person (walk-in)</b> at the Laguna Aquatech Office to avoid disconnection.<br><br>
            <i>Note: It takes 3 business days to reflect.</i>`,
        tl: `<b>Paano magbayad sa GCash (Step-by-Step):</b><br><br>
            1. Sa Home screen ng GCash, i-tap ang <b>“Bills”</b>.<br>
            2. Sa ilalim ng Categories, i-tap ang <b>“Water Utilities”</b>.<br>
            3. I-search at piliin ang <b>“Laguna Aquatech”</b>.<br>
            4. Ilagay ang <b>EXACT AMOUNT</b>, <b>Account Number</b>, at <b>Pangalan</b>.<br>
            5. I-save ang inyong transaction receipt.<br><br>
            ⚠️ <b>MAHALAGANG PAALALA:</b> Hindi na tinatanggap ang bayad sa GCash kapag <b>due date na o lampas na sa due date</b>. Kung due date na, magbayad nang <b>in-person (walk-in)</b> sa Laguna Aquatech Office.<br><br>
            <i>Paalala: 3 business days bago mag-reflect ang bayad.</i>`
    },
    LagunaAquatechVslwd: {
        kw: ["difference", "magkaiba", "pagkakaiba", "vs", "compare", "roles", "pinagkaiba", "pag kakaiba", "lwd at laguna aquatech", "difference between lwd and laguna aquatech"],
        en: `<b>Difference between LWD and Laguna Aquatech:</b><br><br>
            • <b>LWD:</b> The Owner & Regulator (Quality control).<br>
            • <b>Laguna Aquatech:</b> The Operator (Billing & Repairs).<br><br>
            <i>LWD checks the water; Aquatech sends the bill.</i>`,
        tl: `<b>Pagkakaiba ng LWD at Laguna Aquatech:</b><br><br>
            • <b>LWD:</b> Ang Tagapangasiwa o Regulator (Quality control).<br>
            • <b>Laguna Aquatech:</b> Ang Tagapamahala ng Serbisyo (Billing at Repairs).<br><br>
            <i>Ang LWD ang sumusuri sa tubig; ang Aquatech ang nagpapadala ng bill.</i>`
    },
    aboutLWD: {
        kw: ["ano ang lwd", "about lwd", "laguna water district", "ano ang tungkulin ng lwd", "ano ang ginagawa", "what is lwd", "what does lwd do", "what is laguna water district", "what does laguna water district do", "tungkulin ng lwd"],
        en: "<b>What does Laguna Water District (LWD) do?</b><br>LWD is the <b>government regulator</b>. They ensure water quality through analysis and oversee the partnership with Laguna Aquatech to protect consumers.",
        tl: "<b>Ano ang ginagawa ng Laguna Water District (LWD)?</b><br>Ang LWD ang <b>government regulator</b>. Sila ang sumusuri sa kalidad ng tubig (water analysis) at naniniguradong maayos ang serbisyo ng Laguna Aquatech para sa publiko."
    },
    about_aquatech: {
        kw: ["ano ang laguna aquatech", "what is laguna aquatech", "about the company", "tungkulin ng laguna aquatech", "ano ginagawa ng laguna aquatech", "what does laguna aquatech do"],    
        en: "<b>What is Laguna Aquatech?</b><br>It is the service operator handling billing and repairs.",
        tl: "<b>Ano ang Laguna Aquatech?</b><br>Sila ang operator na namamahala sa billing at repairs."
    },
    board: {
        kw: ["board", "directors", "sino ang mga board", "board members", "bod", "officials", "namumuno", "board of directors", "lupon ng mga direktor", "sino ang mga namumuno", "sino ang mga board of directors"],
        en: `<b>Board of Directors:</b><br>
            • <b>Dr. Marina A. Alipon</b> (Chairperson - Business Sector)<br>
            • <b>Gen. Edwin I. Corvera</b> (Vice Chairperson - Civic Sector)<br>
            • <b>Dr. Segfredo R. Serrano</b> (Corporate Secretary - Education Sector)<br>
            • <b>Divina Gracia R. Caldo</b> (Member - Women's Sector)<br>
            • <b>Engr. King A. Sanchez</b> (Member - Professional Sector)`,
        tl: `<b>Mga Lupon ng Direktor:</b><br>
            • <b>Dr. Marina A. Alipon</b> (Chairperson - Business Sector)<br>
            • <b>Gen. Edwin I. Corvera</b> (Vice Chairperson - Civic Sector)<br>
            • <b>Dr. Segfredo R. Serrano</b> (Corporate Secretary - Education Sector)<br>
            • <b>Divina Gracia R. Caldo</b> (Member - Women's Sector)<br>
            • <b>Engr. King A. Sanchez</b> (Member - Professional Sector)`
    },
    noSolution: {
        kw: ["pare-pareho", "walang solusyon", "walang kwenta", "problema", "no solution", "same problem", "same issues", "pareho parin", "bakit walang solusyon", "bakit walang kwenta"],
        en: "<b>The problems are always the same with no solution.</b><br>We understand your frustration. Please know that we are actively working on system improvements to provide a more permanent solution.",
        tl: "<b>Pare-pareho ang problema walang solusyon.</b><br>Nauunawaan po namin kayo. Ginagawan naman po natin ito ng solution sa kasalukuyan at nagsisikap kaming mapabuti ang serbisyo."
    },
    busyCS: {
        kw: ["nasagot", "customer service", "answering", "cannot reach", "walang sumasagot", "busy", "hindi sumasagot", "sumasagot", "bakit walang sumasagot", "bakit hindi nasagot", "hindi maabot"],
        en: "<b>Why is Customer Service not answering?</b><br>There are times when many people are calling at the same time. Please try again in a few minutes or send us an email at ogm@laguna-water.com.",
        tl: "<b>Bakit hindi nasagot ang customer service?</b><br>May mga oras po na nagkakasabay-sabay ang tawag kaya hindi agad ma-entertain ang lahat. Maaari pong subukan muli pagkalipas ng ilang minuto."
    },
    neighborBill: {
        kw: ["kapitbahay", "kapit bahay", "iniwan", "nawawala", "hindi nakakaabot", "neighbor", "bill left with neighbor", "bakit iniwan sa kapitbahay", "bakit nawawala ang bill", "bakit hindi nakakaabot ang bill"],
        en: "<b>Why is the bill left with a neighbor?</b><br>The bill may not be reaching    the concessionaire directly if the location is hard to access. Please contact us to verify your delivery address.",
        tl: "<b>Bakit iniiwan sa kapitbahay ang bill?</b><br>Maaaring hindi makapasok ang reader o hindi nakakaabot sa mismong concessionaire ang bill dahil sa lokasyon. I-report po ito sa amin."
    },
    noWater: {
        kw: ["no water", "wala tubig", "walang tubig", "wla", "tulo", "natulo", "nawalan", "putol", "bakit walang tubig", "bakit wla tubig"],
        en: "<b>No Water:</b> This may be due to emergency repairs/breakdown at the pump station. Please check our FB page or call (049) 536-0661 for updates.",
        tl: "<b>Walang Tubig:</b> Nagkaroon po ng emergency breakdown o repair sa pump station. I-check ang aming FB page o tumawag sa (049) 536-0661 para sa status."
    },
    highBill: {
        kw: ["high bill", "mataas ang bill", "bakit mahal", "tumaas ang bill", "mahal ang bill", "taas ng bill", "bill is high", "bakit tumaas ang bill", "bakit mahal ang bill", "bakit mataas ang babayadan ko"],
        en: "<b>Why is my bill high?</b><br>• <b>Leaks:</b> Check for hidden leaks in toilets or faucets.<br>• <b>Meter Test:</b> If the meter spins while all taps are closed, there is a leak.<br>• <b>Fees:</b> Ensure you've factored in Septage and Environmental fees.",
        tl: "<b>Bakit mataas ang bill?</b><br>• <b>Leaks:</b> I-check kung may tagas sa banyo o gripo.<br>• <b>Meter Test:</b> Kung umiikot ang metro kahit sarado lahat ng gripo, may leak.<br>• <b>Fees:</b> Kasama sa bill ang Septage at Environmental fees."
    },
    delayedBill: {
        kw: ["delayed", "hindi dumating", "anyare", "bakit wala ang bill", "wala pang bill", "late bill", "nawawalang bill", "walang dumating", "bakit delayed ang bill", "bakit wala pang bill"],
        en: "<b>Bill Issues:</b> Monthly bills may be delayed due to adjusted meter reading schedules. To get your current balance, please contact Laguna Aquatech at (049) 536-0661.",
        tl: "<b>Isyu sa Bill:</b> Maaaring maantala ang bill dahil sa bagong schedule ng meter reading. Maaari ninyong itanong ang inyong balance sa (049) 536-0661."
    },
    lowPressure: {
        kw: ["mahina", "low pressure", "hinay", "weak", "pressure", "pasukan", "bakit mahina ang tubig", "bakit hinay ang tubig", "bakit low pressure", "low"],
        en: "<b>Low Pressure:</b> Due to lack of supply or simultaneous usage during rush hours. Pump stations are on standby to boost supply.",
        tl: "<b>Bakit mahina ang tubig?</b><br>Dahil sa kakulangan ng supply o sabay-sabay na paggamit kapag rush hour. May mga pump station na naka-standby para tumulong."
    },
    dirtyWater: {
        kw: ["madumi", "dirty", "malabo", "madilaw", "dilaw", "yellow", "buhangin", "sand", "amoy", "marumi", "dumi", "kulay", "maputi", "malabo", "white"],
        en: `<b>Water Quality Issue:</b> Let's check the color. Is it <b>brownish</b> or <b>white/cloudy</b>?<br><br>
            <div class="suggestions">
                <button onclick="sendSuggestion('Brown water')">🟤 Brownish/Muddy</button>
                <button onclick="sendSuggestion('White water')">⚪ White/Cloudy</button>
            </div>`,
        tl: `<b>Problema sa Tubig:</b> Alamin natin ang kulay. Ang tubig ba ay <b>kulay kalawang</b> o <b>maputi/maulap</b>?<br><br>
            <div class="suggestions">
                <button onclick="sendSuggestion('Kulay kalawang')">🟤 Kulay Kalawang</button>
                <button onclick="sendSuggestion('Maputi ang tubig')">⚪ Maputi/Maulap</button>
            </div>`
    },
    brownWater: {
        kw: ["brown water", "kulay kalawang", "kalawang", "putik"],
        en: `<b>Brownish Water:</b> This is usually caused by mineral sediments or recent pipe repairs.<br><br>✅ <b>Solution:</b> Let your faucet flow for 3–5 minutes until it clears. If it stays brown, contact us.`,
        tl: `<b>Kulay Kalawang:</b> Sanhi ito ng latak ng minerals o katatapos na repair sa tubo.<br><br>✅ <b>Solusyon:</b> Patuluin ang tubig sa gripo ng 3–5 minuto hanggang luminaw. Kung madumi pa rin, i-report sa amin.`
    },
    whiteWater: {
        kw: ["white water", "maputi ang tubig", "maputi", "bubbles", "maulap"],
        en: `<b>White/Cloudy Water:</b> This is usually caused by air or water treatment. 
            <br><br><b>Please observe:</b> Pour the water in a glass. How long does it stay white?
            <br><br>
            <div class="suggestions">
                <button onclick="sendSuggestion('Clears quickly')">⏱️ Clears quickly</button>
                <button onclick="sendSuggestion('Stays white')">⏳ Stays white / cloudy</button>
            </div>`, // FIXED: Buttons now send English text in the EN section
        tl: `<b>Maputi/Maulap na Tubig:</b> Ito ay maaaring sanhi ng hangin o chemical treatment. 
            <br><br><b>Subukan ito:</b> Isalin ang tubig sa baso. Gaano ito katagal bago luminaw?
            <br><br>
            <div class="suggestions">
                <button onclick="sendSuggestion('Mabilis luminaw')">⏱️ Mabilis luminaw</button>
                <button onclick="sendSuggestion('Matagal luminaw')">⏳ Matagal bago luminaw</button>
            </div>` // FIXED: Buttons send Tagalog text in the TL section
    },
    whiteWaterQuick: {
        kw: ["mabilis luminaw", "clears quickly", "mabilis"], 
        en: `✅ <b>Result: Safe (Air Bubbles)</b><br><br>
            If it clears from the bottom up in a few seconds, it is just <b>due to high pressure</b>. It is 100% safe to use.`,
        tl: `✅ <b>Resulta: Safe (Hangin Lang)</b><br><br>
            Kung lumilinaw ito mula sa ilalim paakyat sa loob ng ilang segundo, ito ay <b>high pressure</b> lamang. Safe po itong gamitin.`
    },
    whiteWaterLong: {
        kw: ["matagal luminaw", "stays white", "matagal"],
        en: `⚠️ <b>Result: Possible Overdosing</b><br><br>
            If it stays white for a long time, it may be due to <b>overdosing of chemicals</b>. 
            <br><br>Please report this to <b>(049) 536-0661</b> so we can check your area.`,
        tl: `⚠️ <b>Resulta: Posibleng Overdosing</b><br><br>
            Kung matagal bago luminaw, maaaring ito ay <b>overdosing ng chemicals</b> sa paglilinis.
            <br><br>I-report po ito agad sa <b>(049) 536-0661</b> para ma-inspect ang inyong lugar.`
    },
    partnership: {
        kw: ["partnership", "laguna aquatech", "tinatag", "purpose", "relationship", "layunin ng partnership", "ano ang partnership", "ano ang layunin ng partnership"],
        en: "<b>LWD & Laguna Aquatech Partnership:</b> To improve the water system of Laguna Water District (LWD), enhance facilities, and reduce Non-Revenue Water (NRW).",
        tl: "<b>Layunin ng Partnership:</b> Upang mapabuti ang water system ng LWD at ma-enhance ang mga pasilidad para matiyak ang mataas na kalidad na serbisyo."
    },
   newConn: {
        // FOCUS: Applying and first-time installation
        kw: ["new connection", "apply", "magpakabit", "mag pakabit", "magpagkabit", "application", "requirements", "magkano magpakabit", "installation fee", "bagong linya", "bagong koneksyon", "paano magpakabit", "paano mag apply ng bagong linya", "paano mag apply ng bagong koneksyon"],
        en: `<b>How to apply for a New Connection:</b><br><br>
            📋 <b>Requirements:</b><br>
            • Accomplished Application Form<br>
            • Photocopy of one (1) valid ID with three (3) specimen signatures<br>
            • Photocopy of any of the following: <i>Land Title, Deed of Absolute Sale, or Contract to Sell</i><br>
            • <i>Note: If none of the above are available, a <b>Notarized Waiver of Rights</b> is required.</i><br><br>
            🔄 <b>The Process:</b><br>
            1. <b>Submit:</b> Pass requirements to the LARC Office.<br>
            2. <b>Inspection:</b> LARC will visit to verify compliance.<br>
            3. <b>Payment:</b> Wait for a call/text before settling the fee.<br>
            4. <b>Installation:</b> Water meter will be installed within 2 to 3 weeks after payment.<br><br>
            💰 <b>Installation Fees:</b><br>
            • <b>Residential:</b> ₱7,800 (with title) | ₱8,300 (no title)<br>
            • <b>Commercial:</b> ₱7,800 (with title) | ₱11,300 (no title)`,
        tl: `<b>Paano magpakabit ng Bagong Linya (New Connection):</b><br><br>
            📋 <b>Mga Requirements:</b><br>
            • Accomplished Application Form<br>
            • Photocopy ng isang (1) valid ID na may tatlong (3) specimen signatures<br>
            • Photocopy ng alinman sa mga ito: <i>Land Title, Deed of Absolute Sale, o Contract to Sell</i><br>
            • <i>Paalala: Kung wala ang mga nabanggit, kailangan ng <b>Notarized Waiver of Rights</b>.</i><br><br>
            🔄 <b>Ang Proseso:</b><br>
            1. <b>Pagpasa:</b> Ibigay ang requirements sa LARC Office.<br>
            2. <b>Inspeksyon:</b> Pupunta ang LARC sa inyong lugar para sa verification.<br>
            3. <b>Pagbabayad:</b> Antayin ang tawag o text bago magbayad.<br>
            4. <b>Koneksyon:</b> Ikakabit ang water meter sa loob ng 2 hanggang 3 linggo matapos magbayad.<br><br>
            💰 <b>Bayad sa Pagpapakabit:</b><br>
            • <b>Residential:</b> ₱7,800 (may titulo) | ₱8,300 (walang titulo)<br>
            • <b>Commercial:</b> ₱7,800 (may titulo) | ₱11,300 (walang titulo)`
    },
    disconnection: {
        // FOCUS: The ACT of cutting water (Unpaid or Voluntary)
        kw: ["disconnection", "putol", "mapuputulan", "naputulan", "pumutol", "disconnect", "pinutol", "bakit naputol", "bakit walang tubig", "naka-disconnect", "paano mag-disconnect", "paano mag putol", "paano mag disconnect", "paano mag pa putol ng tubig"],
        en: `<b>Disconnection Policy:</b><br><br>
            ⚠️ <b>Disconnection due to Unpaid Bills:</b><br>
            • Your line will be disconnected after <b>two (2) months</b> of unpaid bills.<br><br>
            📝 <b>Customer-Requested Disconnection:</b><br>
            • You may request to have your meter disconnected.<br>
            • <b>Requirement:</b> All unpaid bills must be settled before the request.<br>
            • <b>Timeline:</b> Disconnection is completed within <b>24 hours</b> after the request.<br><br>
            🚫 <b>Important Note:</b><br>
            If a line remains disconnected for <b>five (5) years</b>, the water meter will be pulled out (meter pull-out).`,
        tl: `<b>Polisiya sa Pagkakaputol:</b><br><br>
            ⚠️ <b>Pagputol dahil sa Hindi Pagbabayad:</b><br>
            • Mapuputulan ng tubig matapos ang <b>dalawang (2) buwan</b> na hindi nababayarang bills.<br><br>
            📝 <b>Request ng Customer (Voluntary):</b><br>
            • Maaaring mag-request na ipaputol ang metro.<br>
            • <b>Requirement:</b> Kailangang bayaran muna ang lahat ng utang bago ang request.<br>
            • <b>Timeline:</b> Mapuputol ang linya sa loob ng <b>24 oras</b> matapos ang request.<br><br>
            🚫 <b>Mahalagang Paalala:</b><br>
            Kung ang linya ay disconnected na sa loob ng <b>limang (5) taon</b>, ang water meter ay tuluyan nang bubunutin (meter pull-out).`
    },
    reconnection: {
        // FOCUS: Getting water BACK (Process, Fees, SOA)
        kw: ["reconnection", "re-connection", "reconnect", "ikabit ulit", "ulit", "paano magpakabit ulit", "soa", "statement of account", "reconnection fee", "ulit",  "magkano reconnection", "pabalik ng tubig", "ibalik ang tubig","reconnect", "paano mag reconnect", "paano mag pakabit ulit"],
        en: `<b>How to Reconnect your Water Service:</b><br><br>
            1. 📄 <b>Provide SOA:</b> Obtain your Statement of Account (SOA) from the Laguna Aquatech office.<br>
            2. 💳 <b>Settle Balance:</b> Pay all unpaid bills and the reconnection fee (₱280.00).<br>
            3. ⏳ <b>Timeline:</b> Your water service will be reconnected within <b>24 hours</b> after the payment is settled.`,
        tl: `<b>Paano Magpa-reconnect ng Tubig:</b><br><br>
            1. 📄 <b>Kumuha ng SOA:</b> Humingi ng Statement of Account (SOA) sa opisina ng Laguna Aquatech.<br>
            2. 💳 <b>Magbayad:</b> Bayaran ang lahat ng hindi nabayarang bills at ang reconnection fee (₱280.00).<br>
            3. ⏳ <b>Timeline:</b> Maibabalik ang inyong serbisyo ng tubig sa loob ng <b>24 oras</b> matapos makapagbayad.`
    },
    office: {
        kw: ["hours", "open", "location", "address", "saan", "oras", "bukas", "opisina", "where", "office", "hour", "location", "address", "saan ang opisina", "saan ang office", "saan ang location"],
        en: "<b>Mon-Fri, 8AM-5PM (No Noon Break)</b>. Located at 5524 Manila South Rd, Brgy. Maahas.",
        tl: "<b>Mon-Fri, 8AM-5PM (Walang Noon Break)</b>. Matatagpuan sa 5524 Manila South Rd, Brgy. Maahas."
    },
    contact: {
        kw: ["contact", "phone", "number", "email", "call", "tawag", "numero", "email", "contact number", "contact info", "how to contact", "paano kontakin", "paano tawagan", "paano mag email"],
        en: "<b>Contact Us:</b> (049) 536-0661 | ogm@laguna-water.com",
        tl: "<b>Kontakin Kami:</b> (049) 536-0661 | ogm@laguna-water.com"
    },
    complaint: {
        kw: ["reklamo", "complaint", "ireklamo", "mali", "report", "file complaint", "paano mag reklamo", "paano mag file ng complaint", "bakit mali", "bakit may reklamo", "paano mag report", "paano mag file ng report"],
        en: `<b>How to file a complaint:</b><br><br>
            1. 📝 <b>Formal Letter:</b> Send a letter addressed to the General Manager.<br>
            2. 📧 <b>Email:</b> Send details to <b>ogm@laguna-water.com</b>.<br>
            3. 📞 <b>Hotline:</b> Call (049) 536-0661 for technical issues.<br><br>
            Please include your <b>Account Number</b> and <b>Contact Details</b>.`,
        tl: `<b>Paano mag-file ng reklamo:</b><br><br>
            1. 📝 <b>Pormal na Sulat:</b> Magpadala ng sulat para sa General Manager.<br>
            2. 📧 <b>Email:</b> Ipadala ang detalye sa <b>ogm@laguna-water.com</b>.<br>
            3. 📞 <b>Hotline:</b> Tumawag sa (049) 536-0661 para sa mga isyung teknikal.<br><br>
            Siguraduhing kasama ang inyong <b>Account Number</b> at <b>Contact Details</b>.`
    },
    history: {
        kw: ["history of lwd", "history ng lwd", "kasaysayan ng lwd", "background ng lwd", "tungkol sa lwd", "lwd history"],
        en: `<b>History of LWD:</b><br><br>
            • <b>1920s:</b> Started as Los Baños Waterworks.<br>
            • <b>1977:</b> Formed as an independent district.<br>
            • <b>1982:</b> Renamed <b>Laguna Water District</b>.<br>
            • <b>1992:</b> Declared a GOCC.<br>
            • <b>2015:</b> Partnered with <b>Laguna Aquatech</b>.<br>
            • <b>2024:</b> <b>Manila Water (MWPV)</b> took over operations.`,
        tl: `<b>Kasaysayan ng LWD:</b><br><br>
            • <b>1920s:</b> Nagsimula bilang Los Baños Waterworks.<br>
            • <b>1977:</b> Opisyal na naging Los Baños Water District.<br>
            • <b>1982:</b> Pinangalanang <b>Laguna Water District</b>.<br>
            • <b>1992:</b> Naging Government Corporation (GOCC).<br>
            • <b>2015:</b> Itinatag ang partnership sa <b>Laguna Aquatech</b>.<br>
            • <b>2024:</b> Ang <b>Manila Water (MWPV)</b> na ang nangangasiwa.`
    },
    jvHistory: {
        kw: ["history of jv", "history ng jv", "kasaysayan ng jv", "tungkol sa jv", "jva history", "jv agreement"],
        en: `<b>History of the Joint Venture (JV):</b><br><br>
            • <b>May 2015:</b> Unsolicited proposal submitted to LWD.<br>
            • <b>Aug 2015:</b> Proposal accepted.<br>
            • <b>Sept 2015:</b> Awarded after competitive challenge.<br>
            • <b>Nov 3, 2015:</b> <b>Joint Venture Agreement (JVA)</b> signed, creating <b>Laguna Aquatech</b>.<br>
            • <b>Goal:</b> 25-year partnership for 24-hour water supply.`,
        tl: `<b>Kasaysayan ng Joint Venture (JV):</b><br><br>
            • <b>Mayo 2015:</b> Isinumite ang mungkahi sa LWD.<br>
            • <b>Agosto 2015:</b> Tinanggap ang mungkahi.<br>
            • <b>Set 2015:</b> Iginawad ang proyekto matapos ang challenge.<br>
            • <b>Nob 3, 2015:</b> Nilagdaan ang <b>Joint Venture Agreement (JVA)</b> at itinatag ang <b>Laguna Aquatech</b>.<br>
            • <b>Layunin:</b> 25-taong pakikipagtulungan para sa 24-oras na tubig.`
    },
    manager: {
        kw: ["manager", "lapis", "gm", "head"],
        en: "The General Manager of LWD is <b>Engr. Joel M. Lapis</b>.",
        tl: "Ang General Manager ng LWD ay si <b>Engr. Joel M. Lapis</b>."
    },
    greeting: {
        kw: ["hi", "hello", "hey", "kumusta", "kamusta", "uy", "oy", "magandang", "hola", "morning", "afternoon", "evening", "good morning", "good afternoon", "good evening", "magandang umaga", "magandang hapon", "magandang gabi"],
        en: getTimedGreeting('en'),
        tl: getTimedGreeting('tl')
    },
    thanks: {
        kw: ["salamat", "thank", "thanks", "ty", "ok", "okay", "sige", "thanks!", "thank you", "salamat!", "sige salamat", "sige salamat!", "ok salamat", "okay salamat", "sige ok", "sige okay", "sige ty", "sige thanks", "sige thank you"],
        en: "You're welcome! Is there anything else?",
        tl: "Walang anuman! May maipaglilingkod pa ba ako?"
    }
};

    // 3. EXACT MATCH SEARCH
    for (let key in library) {
        if (library[key].kw.some(k => k.toLowerCase() === cleanUserText)) {
            return library[key][lang];
        }
    }

    // 4. PARTIAL MATCH SEARCH
    for (let key in library) {
        if (library[key].kw.some(k => cleanUserText.includes(k.toLowerCase()))) {
            return library[key][lang];
        }
    }

    // 5. DYNAMIC FALLBACK
    const labels = lang === 'en' ? {
        title: "I'm not sure about that. Try these:",
        btn1: 'LWD vs Aquatech', btn2: 'History of LWD', btn3: 'Payment Options'
    } : {
        title: "Paumanhin, hindi ko po naintindihan. Subukan ang mga ito:",
        btn1: 'Pagkakaiba ng LWD at Aquatech', btn2: 'Kasaysayan ng LWD', btn3: 'Paano magbayad'
    };

    return `${labels.title}<br><br>
        <div class="suggestions">
            <button onclick="sendSuggestion('${labels.btn1}')">⚖️ ${labels.btn1}</button>
            <button onclick="sendSuggestion('${labels.btn2}')">📜 ${labels.btn2}</button>
            <button onclick="sendSuggestion('${labels.btn3}')">💰 ${labels.btn3}</button>
        </div>`;
}
