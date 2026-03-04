/* =========================================
   LWD Chatbot Logic - Full Fixed Version
   ========================================= */

/**
 * Toggles the visibility of the chat window
 */
function getTimedGreeting(lang = 'en') {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const hour = now.getHours();
    
    const isWeekday = day >= 1 && day <= 5;
    const isOpenHours = hour >= 8 && hour < 17;
    const isOfficeOpen = isWeekday && isOpenHours;

    let timeText = "";
    if (hour < 12) timeText = lang === 'en' ? "Good morning! ☀️" : "Magandang umaga! ☀️";
    else if (hour < 18) timeText = lang === 'en' ? "Good afternoon! 🌤️" : "Magandang hapon! 🌤️";
    else timeText = lang === 'en' ? "Good evening! 🌙" : "Magandang gabi! 🌙";

    let statusText = isOfficeOpen 
        ? (lang === 'en' ? "<br>Our office is currently <b>OPEN</b>. How can I help?" : "<br>Ang aming opisina ay <b>BUKAS</b>. Ano po ang maipaglilingkod ko?")
        : (lang === 'en' ? "<br>Our office is currently <b>CLOSED</b>, but I'm here to help!" : "<br>Ang aming opisina ay <b>SARADO</b> na, pero handa akong tumulong!");

    return `${timeText}${statusText}`;
}
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('active');
    
    if (chatWindow.classList.contains('active')) {
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);
    }
}

/**
 * Handles Enter key press in the textarea
 */
function handleKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

/**
 * Facilitates clicking on suggestion buttons
 */
function sendSuggestion(text) {
    const input = document.getElementById('chat-input');
    input.value = text;
    sendMessage();
}

/**
 * Main function to process sending a message
 */
function sendMessage() {
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    const typing = document.getElementById('typing-indicator');
    const suggestionBox = document.getElementById('suggestion-box');
    const userText = input.value.trim();

    if (userText === "") return;

    // Hide suggestions once user starts interacting
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
    }

    // Append User Message
    body.insertAdjacentHTML('beforeend', `<div class="msg user">${userText}</div>`);
    input.value = "";
    input.style.height = 'auto'; 
    body.scrollTop = body.scrollHeight;

    // Show Typing Indicator
    if (typing) {
        typing.style.display = "block";
        body.appendChild(typing); 
        body.scrollTop = body.scrollHeight;
    }

    // Simulate Bot Delay
    setTimeout(() => {
        if (typing) typing.style.display = "none";
        const response = getBotResponse(userText.toLowerCase());
        body.insertAdjacentHTML('beforeend', `<div class="msg bot">${response}</div>`);
        body.scrollTop = body.scrollHeight;
    }, 800);
}

/**
 * Resets the chat to its initial state
 */
function clearChat() {
    const body = document.getElementById('chat-body');
    body.innerHTML = `
        <div class="msg bot">
            Hello! 🌊 I'm your LWD Assistant. How can I assist you with our services today?
        </div>
        <div class="suggestions" id="suggestion-box" style="display: flex; flex-wrap: wrap; gap: 5px; margin-top:10px;">
            <button onclick="sendSuggestion('Office hours')">Office Hours</button>
            <button onclick="sendSuggestion('New Connection')">New Connection</button>
            <button onclick="sendSuggestion('Job vacancies')">Job Vacancies</button>
            <button onclick="sendSuggestion('Contact info')">Contact Us</button>
            <button onclick="sendSuggestion('Partnership')">Partnership</button>
        </div>
        <div id="typing-indicator" class="typing" style="display:none;">Assistant is typing...</div>
    `;
}
function getSimilarity(s1, s2) {
    let longer = s1.length < s2.length ? s2 : s1;
    let shorter = s1.length < s2.length ? s1 : s2;
    if (longer.length === 0) return 1.0;
    
    const editDistance = (a, b) => {
        const costs = [];
        for (let i = 0; i <= a.length; i++) {
            let lastVal = i;
            for (let j = 0; j <= b.length; j++) {
                if (i === 0) costs[j] = j;
                else if (j > 0) {
                    let newVal = costs[j - 1];
                    if (a.charAt(i - 1) !== b.charAt(j - 1))
                        newVal = Math.min(Math.min(newVal, lastVal), costs[j]) + 1;
                    costs[j - 1] = lastVal;
                    lastVal = newVal;
                }
            }
            if (i > 0) costs[b.length] = lastVal;
        }
        return costs[b.length];
    };
    return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
}

/**
 * 2. CLEANER: Strips Tagalog/English fillers 
 * Focuses on the "meat" of the question.
 */
function cleanInput(text) {
    const fillers = /\b(po|opo|yung|yong|ung|ang|mga|na|ng|sa|ba|kasi|lang|naman|namin|natin|ko|nyo|mo|i|the|a|an)\b/g;
    return text.toLowerCase()
               .replace(fillers, "")
               .replace(/[^\w\s]/gi, "")
               .trim();
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

/**
 * Brain of the chatbot: Matches keywords to responses
 */
function getBotResponse(input) {
    // 1. PRE-PROCESS INPUT
    // We use the cleaned input for matching to avoid punctuation issues
    const cleanUserText = input.toLowerCase().trim();

    // 2. COMPREHENSIVE WORD LISTS
    const tlWords = [
        'po', 'ba', 'na', 'ng', 'ang', 'sa', 'mga', 'opo', 'ito', 'nyo', 'namin', 'natin', 'ko', 'mo', 'lng', 'nmn', 'lang', 'naman',
        'magkano', 'ano', 'bakit', 'bayad', 'metro', 'paano', 'meron', 'wala', 'wla', 'tubig', 'tulo', 'mhal', 'saan', 'mahina', 
        'pakabit', 'anyare', 'dumi', 'madumi', 'nakaabot', 'paliwanag', 'gabi', 'umaga', 'hapon', 'opisina', 'pumunta', 'personal',
        'linya', 'koneksyon', 'pagbasa', 'mataas', 'mahal', 'tumaas', 'nawalan', 'putol', 'hinay', 'pasukan', 'malabo', 'madilaw', 
        'dilaw', 'buhangin', 'marumi', 'kalawang', 'maputi', 'maulap', 'napuputulan', 'tinatag', 'trabaho', 'tawag', 'numero', 'salamat',
        'walang tubig'
    ];
    
    const enWords = [
        'the', 'is', 'are', 'was', 'were', 'my', 'your', 'from', 'this', 'that',
        'how', 'payment', 'where', 'why', 'what', 'water', 'bill', 'office', 'hours', 'location', 'address', 'apply', 'new', 
        'connection', 'job', 'hiring', 'vacancy', 'contact', 'number', 'manager', 'leak', 'problem', 'high', 'options', 
        'personal', 'cash', 'check', 'soa', 'statement', 'account', 'step', 'search', 'select', 'amount', 'receipt', 
        'commercial', 'technical', 'collection', 'board', 'directors', 'officials', 'purpose', 'minimum', 'charge', 
        'reconnection', 'policy', 'busy', 'neighbor', 'reading', 'cubic', 'liters', 'emergency', 'breakdown', 'pressure', 
        'rush', 'quality', 'brown', 'white', 'cloudy', 'muddy', 'sediments', 'bubbles', 'safe', 'partnership', 'career', 'thanks',
        'maintenance', 'interruption'
    ];

    let tlScore = 0;
    let enScore = 0;
    const words = cleanUserText.split(/\s+/);

    words.forEach(word => {
        const cleanWord = word.replace(/[^\w\s]/gi, "");
        if (tlWords.includes(cleanWord)) tlScore++;
        if (enWords.includes(cleanWord)) enScore++;
    });

    // 3. THE BUTTON FIX (Enhanced Force Language)
    // List specific phrases used in buttons to guarantee language detection
    const forceTL = ["paano magbayad", "bagong koneksyon", "kontakin kami", "oras ng opisina", "kulay kalawang", "maputi ang tubig"];
    const forceEN = ["payment options", "new connection", "contact info", "office hours", "brown water", "white water"];

    if (forceTL.some(t => cleanUserText.includes(t))) tlScore += 20;
    if (forceEN.some(e => cleanUserText.includes(e))) enScore += 20;

    const lang = (tlScore >= enScore && tlScore > 0) ? 'tl' : 'en';

    const library = {
       paymentOptions: {
            kw: ["paano magbayad", "how to pay", "payment", "saan magbabayad", "options", "water bill", "bayad", "pay"],
            en: `<b>Where would you like to pay?</b><br><br>
                Please select your preferred method:<br><br>
                <div class="suggestions">
                    <button onclick="sendSuggestion('LARC Office')">🏢 Pay at LARC Office</button>
                    <button onclick="sendSuggestion('GCash')">📱 Pay via GCash</button>
                </div>`,
            tl: `<b>Saan niyo po gustong magbayad?</b><br><br>
                Pumili ng paraan ng pagbabayad:<br><br>
                <div class="suggestions">
                    <button onclick="sendSuggestion('LARC Office')">🏢 LARC Office</button>
                    <button onclick="sendSuggestion('GCash')">📱 Sa GCash App</button>
                </div>`
        },
        larcOffice: {
            kw: ["larc office", "office pay", "pumunta", "opisina", "personal", "LARC Office"],
            en: `<b>Paying at LARC Office:</b><br><br>
                📍 <b>Address:</b> 5524 Manila South Rd, Brgy. Maahas, Los Baños.<br>
                ⏰ <b>Hours:</b> Mon-Fri, 8AM-5PM (No Noon Break).<br><br>
                • We accept <b>Cash</b> and <b>Check</b> payments.<br>
                • Please bring your <b>Statement of Account (SOA)</b> for faster service.`,
            tl: `<b>Pagbabayad sa LARC Office:</b><br><br>
                📍 <b>Address:</b> 5524 Manila South Rd, Brgy. Maahas, Los Baños.<br>
                ⏰ <b>Oras:</b> Mon-Fri, 7AM-4PM (Walang Noon Break).<br><br>
                • Tumatanggap kami ng <b>Cash</b> o <b>Tseke</b>.<br>
                • Mangyaring dalhin ang inyong <b>Statement of Account (SOA)</b> para sa mabilis na transaksyon.`
        },
        gcash: {
            kw: ["gcash", "maya", "step", "pambayad","GCash"],
            en: `<b>How to pay via GCash (Step-by-Step):</b><br><br>
                1. On the GCash Home screen, tap <b>“Bills”</b>.<br>
                2. Under Categories, tap <b>“Water Utilities”</b>.<br>
                3. Search/Select <b>“LARC”</b> or <b>“Laguna Water District Aquatech”</b>.<br>
                4. Input the <b>EXACT AMOUNT</b>, your <b>Account Number</b>, and <b>Name</b>.<br>
                5. Save your transaction receipt.<br><br>
                ⚠️ <b>Note:</b> It takes 3 business days to reflect. Pay 3 days early to avoid disconnection.`,
            tl: `<b>Paano magbayad sa GCash (Step-by-Step):</b><br><br>
                1. Sa Home screen ng GCash, i-tap ang <b>“Bills”</b>.<br>
                2. Sa ilalim ng Categories, i-tap ang <b>“Water Utilities”</b>.<br>
                3. I-search at piliin ang <b>“LARC”</b> o <b>“Laguna Water District Aquatech”</b>.<br>
                4. Ilagay ang <b>EXACT AMOUNT</b>, <b>Account Number</b>, at <b>Pangalan</b>.<br>
                5. I-save ang inyong transaction receipt.<br><br>
                ⚠️ <b>Paalala:</b> 3 business days bago mag-reflect ang bayad. Magbayad 3 araw bago ang due date para hindi maputulan.`
        },
        aboutLARC: {
            kw: ["ginagawa ng larc", "ginagwa ng larc", "ano ang larc", "what is larc", "larc function"],
            en: "<b>What does LARC do?</b><br>Laguna Aquatech (LARC) handles the <b>commercial and technical operations</b>. This includes billing, collection, new connections, leak repairs, and direct customer service inquiries.",
            tl: "<b>Ano ang ginagawa ng LARC?</b><br>Ang LARC ang nangangasiwa sa <b>commercial at technical operations</b>. Kasama rito ang billing, paniningil ng bayad, bagong koneksyon (new connection), pagkukumpuni ng mga leak, at customer service."
        },
        board: {
            kw: ["board", "directors", "sino ang mga board", "board members","bod", "officials", "namumuno"],
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
         aboutLWD: {
            kw: ["ano ang ginagawa", "ginagwa", "ano ang lwd", "ano ang laguna water district", "functions of lwd", "purpose", "what is"],
            en: "<b>What does Laguna Water District (LWD) do?</b><br>LWD is responsible for ensuring the quality of water supply, conducting water analysis, and overseeing the partnership with LARC to enhance facilities and services for the community.",
            tl: "<b>Ano ang ginagawa ng Laguna Water District (LWD)?</b><br>Ang LWD ang naninigurado sa kalidad ng inyong tubig (water analysis), nangangasiwa sa partnership sa LARC, at sumisiguro na maayos ang pasilidad at serbisyo para sa lahat."
         },
            noSolution: {
            kw: ["pare-pareho", "walang solusyon", "walang kwenta", "problema",
                 "no solution", "same problem"],
            en: "<b>The problems are always the same with no solution.</b><br>We understand your frustration. Please know that we are actively working on system improvements to provide a more permanent solution.",
            tl: "<b>Pare-pareho ang problema walang solusyon.</b><br>Nauunawaan po namin kayo. Ginagawan naman po natin ito ng solution sa kasalukuyan at nagsisikap kaming mapabuti ang serbisyo."
         },
         billingPolicy: {
            kw: ["minimum", "minimun", "reconnection", "re-connection", "hindi ginagamit", "bakit may bayad"],
            en: "<b>Minimum Charge & Reconnection Fee:</b> These policies and fees are implemented by <b>Laguna Aquatech (LARC)</b>. They handle all billing regulations. Please visit their office or call (049) 536-0661 for a detailed explanation.",
            tl: "<b>Bakit may Minimum Charge at Reconnection Fee?</b><br>Ang mga policy na ito ay diretso sa ilalim ng <b>Laguna Aquatech (LARC)</b>. Sila lamang po ang makakapag-paliwanag ng detalye tungkol sa mga fees na ito. Maaari po kayong tumawag sa (049) 536-0661."
         },
            busyCS: {
            kw: ["nasagot", "customer service", "cannot reach", "walang sumasagot", "busy", "hindi sumasagot", "sumasagot"],
            en: "<b>Why is Customer Service not answering?</b><br>There are times when many people are calling at the same time. Please try again in a few minutes or send us an email at ogm@laguna-water.com.",
            tl: "<b>Bakit hindi nasagot ang customer service?</b><br>May mga oras po na nagkakasabay-sabay ang tawag ng mga tao kaya hindi agad ma-entertain ang lahat. Maaari pong subukan muli pagkalipas ng ilang minuto."
        },  
        neighborBill: {
            kw: ["kapitbahay", "kapit bahay", "iniwan", "nawawala", "hindi nakakaabot", "neighbor"],
            en: "<b>Why is the bill left with a neighbor?</b><br>The bill may not be reaching the concessionaire directly if the location is hard to access. Please contact us to verify your delivery address.",
            tl: "<b>Bakit iniiwan sa kapitbahay ang bill?</b><br>Kaya hindi nila makita ang kanilang bill dahil maaaring hindi makapasok ang reader o hindi nakakaabot sa mismong concessionaire ang bill."
        },
        meterReading: {
            kw: ["how to read meter", "paano magbasa ng metro", "meter reading", "pagbasa", "metro"],
            en: `<b>How to Read Your Meter:</b><br><br>
                1. ⬛ <b>Black Numbers:</b> These are <b>Cubic Meters ($\text{m}^3$)</b>. This is what we use for your bill.<br>
                2. 🟥 <b>Red Numbers:</b> These are <b>Liters</b>. Ignore these when checking your monthly consumption.<br><br>
                
                <br>💡 <b>Tip:</b> If the small gears are moving while all faucets are closed, you have a leak!`,
            tl: `<b>Paano Magbasa ng Metro:</b><br><br>
                1. ⬛ <b>Itim na Numero:</b> Ito ang <b>Cubic Meters ($\text{m}^3$)</b>. Ito ang binabayaran niyo sa bill.<br>
                2. 🟥 <b>Pulang Numero:</b> Ito ay <b>Liters</b> lamang. Hindi ito isinasama sa billing.<br><br>
                
                <br>💡 <b>Tip:</b> Kung umiikot ang maliliit na gear kahit sarado lahat ng gripo, may leak kayo!`
        },
        noWater: {
            kw: ["no water", "wala tubig", "walang tubig", "wla", "tulo", "natulo", "nawalan", "putol", "bakit walang tubig"],
            en: "<b>No Water:</b> This may be due to emergency repairs/breakdown at the pump station. Please check our FB page or call (049) 536-0661 for updates.",
            tl: "<b>Walang Tubig:</b> Nagkaroon po ng emergency breakdown o repair sa pump station. I-check ang aming FB page o tumawag sa (049) 536-0661 para sa status."
        },
        highBill: {
            kw: ["high bill", "mataas ang bill", "bakit mahal", "tumaas ang bill", "mahal ang bill", "taas ng bill"],
            en: "<b>Why is my bill high?</b><br>• <b>Leaks:</b> Check for hidden leaks in toilets or faucets.<br>• <b>Meter Test:</b> If the meter spins while all taps are closed, there is a leak.<br>• <b>Fees:</b> Ensure you've factored in Septage and Environmental fees.",
            tl: "<b>Bakit mataas ang bill?</b><br>• <b>Leaks:</b> I-check kung may tagas sa banyo o gripo.<br>• <b>Meter Test:</b> Kung umiikot ang metro kahit sarado lahat ng gripo, may leak.<br>• <b>Fees:</b> Tandaan na kasama sa bill ang Septage at Environmental fees."
        },
        delayedBill: {
            kw: ["delayed", "hindi dumating", "anyare", "bakit wala ang bill", "wala pang bill", "late bill", "nawawalang bill"],
            en: "<b>Bill Issues:</b> Monthly bills may be delayed due to adjusted meter reading schedules or delivery issues. To get your current balance, please contact LARC Customer Service at (049) 536-0661.",
            tl: "<b>Isyu sa Bill:</b> Maaaring maantala ang bill dahil sa bagong schedule ng meter reading. Maaari ninyong itanong ang inyong balance sa LARC Customer Service sa (049) 536-0661."
        },
        lowPressure: {
            kw: ["mahina", "low pressure", "hinay", "weak", "pressure", "pasukan"],
            en: "<b>Low Pressure:</b> Due to lack of supply or simultaneous usage during rush/school hours. Pump stations are on standby to boost supply.",
            tl: "<b>Bakit mahina ang tubig?</b><br>Dahil sa kakulangan ng supply o sabay-sabay na paggamit kapag rush hour. May mga nakaabang na pump station na tutulong para mapalakas ang supply."
        },
          dirtyWater: {
            kw: ["madumi", "dirty", "malabo", "madilaw", "dilaw", "yellow", "buhangin", "sand", "amoy", "marumi", "dumi"],
            en: `<b>Water Quality Issue:</b> Let's check the color. Is it <b>brownish</b> or <b>white/cloudy</b>?<br><br>
                <div class="quick-actions">
                    <button onclick="sendSuggestion('Brown water')">🟤 Brownish/Muddy</button>
                    <button onclick="sendSuggestion('White water')">⚪ White/Cloudy</button>
                </div>`,
            tl: `<b>Problema sa Tubig:</b> Alamin natin ang kulay. Ang tubig ba ay <b>kulay kalawang</b> o <b>maputi/maulap</b>?<br><br>
                <div class="quick-actions">
                    <button onclick="sendSuggestion('Kulay kalawang')">🟤 Kulay Kalawang</button>
                    <button onclick="sendSuggestion('Maputi ang tubig')">⚪ Maputi/Maulap</button>
                </div>`
        },
        brownWater: {
            kw: ["Brown water", "kulay kalawang", "kalawang", "putik", "Kulay kalawang"],
            en: `<b>Brownish Water:</b> This is usually caused by mineral sediments or recent pipe repairs.<br><br>✅ <b>Solution:</b> Let your faucet flow for 3–5 minutes until it clears. If it stays brown, contact us.<br><br>`,
            tl: `<b>Kulay Kalawang:</b> Sanhi ito ng latak ng minerals o katatapos na repair sa tubo.<br><br>✅ <b>Solusyon:</b> Patuluin ang tubig sa gripo ng 3–5 minuto hanggang luminaw. Kung madumi pa rin, i-report sa amin.<br><br>`
        },
        whiteWater: {
            kw: ["White water", "Maputi ang tubig", "maputi", "bubbles", "maulap"],
            en: `<b>White/Cloudy Water:</b> This is just <b>entrapped air</b> (bubbles) due to high pressure. It is 100% safe.<br><br>✅ <b>Test:</b> Pour it in a glass. If it clears from the bottom up, it is just air.<br><br> `,
            tl: `<b>Maputi/Maulap na Tubig:</b> Ito ay <b>hangin (air bubbles)</b> lamang dahil sa pressure sa tubo. Safe po ito.<br><br>✅ <b>Test:</b> Isalin sa baso. Kung luminaw mula sa ilalim paakyat, hangin lang ito.<br><br> `
        },
        gcashDisconnection: {
            kw: ["gcash", "maya", "napuputulan", "bayad na", "reflect"],
            en: "<b>GCash Payment:</b> It takes <b>3 business days</b> for GCash payments to reflect. Please pay at least 3 days before the due date to avoid disconnection.",
            tl: "<b>GCash Payment:</b> <b>3 days</b> pa po bago mag-reflect ang bayad. Kadalasan ay napuputulan dahil hindi pa po nakikita ang payment sa system."
        },
        partnership: {
            kw: ["partnership", "larc", "tinatag", "purpose", "relationship"],
            en: "<b>LWD & LARC Partnership:</b> To improve the water system of Laguna Water District (LWD), enhance facilities, and reduce Non-Revenue Water (NRW).",
            tl: "<b>Layunin ng Partnership:</b> Upang mapabuti ang water system ng LWD at ma-enhance ang mga pasilidad para matiyak ang mataas na kalidad na serbisyo."
        },
        newConn: {
            kw: ["new connection", "apply", "install", "magpakabit", "linya", "koneksyon"],
            en: "<b>How to apply:</b><br>1. Get form from LARC.<br>2. Fill out and attach Land Title.<br>3. Submit to LARC.<br>4. Wait for inspector.<br>5. Pay Fee at LARC.",
            tl: "<b>Paano magpakabit?</b><br>1. Kumuha ng form sa LARC.<br>2. Fill-upan at i-attach ang titulo.<br>3. I-pasa sa LARC.<br>4. Antayin ang inspector.<br>5. Bayaran ang fee sa LARC."
        },
        office: {
            kw: ["hours", "open", "location", "address", "saan", "oras", "bukas", "opisina"],
            en: "<b>Mon-Fri, 8AM-5PM (No Noon Break)</b>. Located at 5524 Manila South Rd, Brgy. Maahas.",
            tl: "<b>Mon-Fri, 8AM-5PM (Walang Noon Break)</b>. Matatagpuan sa 5524 Manila South Rd, Brgy. Maahas."
        },
        jobs: {
            kw: ["job", "hiring", "vacancy", "trabaho", "career"],
            en: "<b>Vacancies:</b><br>1. SR. WATER MAINTENANCE MAN B (SG 10) - Deadline: Nov 15, 2025<br>2. PRIVATE SECRETARY C (SG 11) - Deadline: Feb 15, 2026<br>Email: <b>ogm@laguna-water.com</b>",
            tl: "<b>Trabaho:</b><br>1. SR. WATER MAINTENANCE MAN B (SG 10) - Deadline: Nov 15, 2025<br>2. PRIVATE SECRETARY C (SG 11) - Deadline: Feb 15, 2026<br>Mag-email sa: <b>ogm@laguna-water.com</b>"
        },
        contact: {
            kw: ["contact", "phone", "number", "email", "call", "tawag", "numero"],
            en: "<b>Contact Us:</b> (049) 536-0661 | ogm@laguna-water.com",
            tl: "<b>Kontakin Kami:</b> (049) 536-0661 | ogm@laguna-water.com"
        },
        manager: {
            kw: ["manager", "lapis", "gm", "head"],
            en: "The General Manager of LWD is <b>Engr. Joel M. Lapis</b>.",
            tl: "Ang General Manager ng LWD ay si <b>Engr. Joel M. Lapis</b>."
        },
        greeting: {
            kw: ["hi", "hello", "hey", "kumusta", "kamusta", "uy", "oy", "magandang", "hola", "morning"],
            en: getTimedGreeting('en'),
            tl: getTimedGreeting('tl')
        },
        thanks: {
            kw: ["salamat", "thank", "thanks", "ty", "ok", "okay", "sige"],
            en: "You're welcome! Is there anything else?",
            tl: "Walang anuman! May maipaglilingkod pa ba ako?"
        }
    };

   // SEARCH LOGIC
    // 4. SEARCH LOGIC (Matches keywords)
    for (let key in library) {
        if (library[key].kw.some(word => cleanUserText.includes(word))) {
            return library[key][lang];
        }
    }

    // 5. DYNAMIC FALLBACK
    const fallbackTitle = lang === 'en' 
        ? "I'm not sure I understand. Would you like to check one of these?" 
        : "Paumanhin, hindi ko po nakuha ang inyong tanong. Nais niyo bang i-check ang mga ito?";

    const labels = lang === 'en' ? {
        btn1: 'Payment Options',
        btn2: 'New Connection',
        btn3: 'Contact info',
        btn4: 'Office Hours',
    } : {
        btn1: 'Paano magbayad',
        btn2: 'Bagong Koneksyon',
        btn3: 'Kontakin Kami',
        btn4: 'Oras ng Opisina',
    };

    return `
        ${fallbackTitle}<br><br>
        <div class="suggestions">
            <button onclick="sendSuggestion('${labels.btn1}')">${labels.btn1}</button>
            <button onclick="sendSuggestion('${labels.btn2}')">${labels.btn2}</button>
            <button onclick="sendSuggestion('${labels.btn3}')">${labels.btn3}</button>
            <button onclick="sendSuggestion('${labels.btn4}')">${labels.btn4}</button>
        </div>
    `; }