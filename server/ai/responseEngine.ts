/**
 * FlyRank AI Intelligence & Fallback Response Engine
 * 
 * Provides rich, domain-specific responses for frequent flyer status analytics,
 * alliance cross-mapping, airport lounge access, status run calculations,
 * and general assistance. Guarantees 100% response delivery even when 
 * upstream AI APIs hit rate limits or quota boundaries.
 */

export function generateAssistantResponse(userPrompt: string): string {
  const query = userPrompt.toLowerCase().trim();

  // 1. Greetings & Introductions
  if (/^(hello|hi|hey|greetings|hola|good morning|good afternoon|good evening)\b/.test(query) || query.length < 4) {
    return `Hello! I am **FlyRank AI** — your elite status analytics and flight intelligence assistant.

How can I help you today? Here are a few things I specialize in:

- **Alliance Cross-Mapping**: Map status tiers across Star Alliance, Oneworld, and SkyTeam.
- **Qualification Strategy**: Calculate MQMs, EQMs, Tier Points, and minimum spend requirements.
- **Airport & Lounge Intelligence**: Rules for Star Alliance Gold, Oneworld Emerald/Sapphire, and SkyTeam Elite Plus access.
- **SEO & Web Performance**: Execute live on-demand SEO audits for any website URL.

Feel free to ask a question or select one of the prompt suggestions below!`;
  }

  // 2. Alliance Mapping
  if (query.includes("alliance") || query.includes("oneworld") || query.includes("star alliance") || query.includes("skyteam")) {
    return `### ✈️ Global Airline Alliance Tier Cross-Mapping

Here is the authoritative cross-mapping guide across the three major global airline alliances:

| Tier Level | Star Alliance | Oneworld | SkyTeam | Key Perks |
| :--- | :--- | :--- | :--- | :--- |
| **Top Tier** | **Star Alliance Gold** | **Oneworld Emerald** | **SkyTeam Elite Plus** | First/Business Lounge Access, Priority Check-in, Extra Baggage (+20kg / +1 bag), Priority Boarding |
| **Mid Tier** | **Star Alliance Silver** | **Oneworld Sapphire** | **SkyTeam Elite** | Priority Reservation Standby, Priority Waitlist |
| **Base Tier** | Member | Member | Member | Standard mileage accrual & redemption |

#### Key Differences & Access Rules:
1. **Oneworld Emerald**: Unlocks First Class lounges across member airlines (e.g. BA Concorde/First, Qantas First Lounge), even when flying Economy.
2. **Star Alliance Gold**: Provides international Business Class lounge access for the member + 1 guest on the same flight.
3. **SkyTeam Elite Plus**: Offers priority security, priority baggage handling, and lounge access on international itineraries.`;
  }

  // 3. Delta / Status Qualification
  if (query.includes("delta") || query.includes("medallion") || query.includes("qualification") || query.includes("mqm") || query.includes("mqd")) {
    return `### 📊 Delta Air Lines Medallion Qualification Thresholds

Delta SkyMiles qualification is based on **MQDs (Medallion Qualifying Dollars)**:

| Tier Level | Required MQDs | Key Privileges |
| :--- | :--- | :--- |
| **Silver Medallion** | $5,000 MQDs | Unlimited Space-Available First Class Upgrades (24 hrs out), Free Checked Bag |
| **Gold Medallion** | $10,000 MQDs | Upgrades at 72 hrs, SkyTeam Elite Plus Status, SkyPriority Boarding |
| **Platinum Medallion** | $15,000 MQDs | Upgrades at 120 hrs, Choice Benefits (Regional Upgrade Certificates), Fee Waivers |
| **Diamond Medallion** | $28,000 MQDs | Highest Upgrade Priority, Global Upgrade Certificates (GUCs), Executive Choice Perks |

#### Top Optimization Tips:
- **Delta Sync / Credit Cards**: Earning MQD Boosts via the Delta Reserve or Platinum American Express cards ($1 MQD per $10 or $20 spent).
- **Partner Flights**: Booking long-haul flights on partner airlines (KLM, Air France, Virgin Atlantic) where MQDs are calculated as a percentage of distance flown rather than ticket price.`;
  }

  // 4. BA Executive Club / Mileage Run
  if (query.includes("ba") || query.includes("british") || query.includes("tier point") || query.includes("mileage run")) {
    return `### 🛫 British Airways Executive Club & Mileage Run Strategy

British Airways uses a **Tier Point (TP)** system. Status levels reset annually on your membership anniversary:

- **Bronze (Oneworld Ruby)**: 300 Tier Points + 2 eligible BA flights
- **Silver (Oneworld Sapphire)**: 600 Tier Points + 4 eligible BA flights *(Unlocks Business Lounge Access worldwide)*
- **Gold (Oneworld Emerald)**: 1,500 Tier Points + 4 eligible BA flights *(Unlocks First Class Lounge Access worldwide)*

#### Optimized Mileage Run Routes:
1. **US Transcontinental (AA Business)**: JFK–LAX or MIA–LAX earns **140 TPs** per sector in First/Business (**280 TPs** roundtrip).
2. **Europe Short-Haul Plus**: Sofia (SOF), Bucharest (OTP), or Reykjavik (KEF) in Club Europe earn **80 TPs** per sector (**160 TPs** roundtrip).
3. **Qatar Airways Business**: EU–DOH–SE Asia earns **140 + 140 = 280 TPs** each way (**560 TPs** total roundtrip), nearly securing Silver status in one trip!`;
  }

  // 5. Lounge Access
  if (query.includes("lounge") || query.includes("access") || query.includes("club")) {
    return `### 🏛️ Airport Lounge Access Rules & Guidelines

Lounge access depends on your ticket class, elite status, and alliance membership:

#### 1. Star Alliance Gold
- Access to any **Star Alliance Gold Lounge** when departing on a Star Alliance operating flight in any class of service.
- **Guest Policy**: Allowed **1 guest** traveling on the same Star Alliance flight.
- *Note*: US carrier domestic restrictions apply (e.g. United MileagePlus Premier 1K members only get United Club access on international itineraries).

#### 2. Oneworld Sapphire & Emerald
- **Sapphire**: Access to any Oneworld Business Class lounge with 1 guest.
- **Emerald**: Access to any Oneworld **First Class** or Business Class lounge with 1 guest.

#### 3. Premium Credit Cards
- **Amex Platinum**: Access to Centurion Lounges, Priority Pass, and Delta Sky Clubs (when flying Delta).
- **Capital One Venture X**: Access to Capital One Lounges and Plaza Premium.`;
  }

  // 6. Default Knowledge Helper
  return `### ✈️ FlyRank Intelligence Assistant

Thank you for your query regarding **"${userPrompt}"**.

Here is a summary of relevant insights and recommendations:

- **Status Computation**: Ensure your flights are credited to the program with the highest multiplier for your ticket brand and booking code.
- **Alliance Benefits**: Remember that status perks like priority baggage and lounge access extend across all member airlines in Star Alliance, Oneworld, and SkyTeam.
- **Optimization Strategy**: Always verify whether distance-based partner crediting yields more elite qualifying metrics than spend-based revenue crediting.

If you have a specific airline (e.g. Delta, United, British Airways, Lufthansa) or a website URL to audit for SEO, please let me know!`;
}
