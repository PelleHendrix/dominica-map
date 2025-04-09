// Kleuren voor elke dag
const DAY_COLORS = {
    day1: '#FF5252', // Rood
    day2: '#536DFE', // Blauw
    day3: '#FF9800', // Oranje
    day4: '#4CAF50'  // Groen
};

// Reisdata op basis van de geoptimaliseerde reisplanning
const reisdata = {
    day1: { // 11 April - Donderdag: Oostkust & Kalinago-territorium
        title: "Dag 1: Oostkust & Kalinago-territorium",
        color: DAY_COLORS.day1,
        waypoints: [
            { name: "Douglas-Charles Airport (Melville Hall)", lat: 15.5469, lng: -61.3000, description: "08:00 - Aankomst Dominica + ophalen huurauto" },
            { name: "Kalinago Barana Aute", lat: 15.5024, lng: -61.2609, description: "10:30 - Kalinago Barana Aute (1,5 u incl. reistijd)" },
            { name: "Lunchpauze onderweg", lat: 15.4750, lng: -61.2550, description: "12:30 - Lunchpauze onderweg (1 u)" },
            { name: "Rosalie Bay (airbnb)", lat: 15.37278, lng: -61.255388, description: "13:30 - Inchecken bij accommodatie + korte rustpauze (30 min)", directMapLink: "https://www.google.com/maps/place/15%C2%B022'22.0%22N+61%C2%B015'19.4%22W/@15.3728088,-61.258013,1107m/data=!3m1!1e3!4m4!3m3!8m2!3d15.37278!4d-61.255388?entry=ttu&g_ep=EgoyMDI1MDQwNi4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D" },
            { name: "Emerald Pool", lat: 15.396053, lng: -61.321976, description: "14:30 - Emerald Pool (1,5 u incl. rit + bezoek)" },
            { name: "Rosalie Bay - Schildpadden spotten", lat: 15.3768, lng: -61.2520, description: "20:00 - Schildpadden spotten op het strand (1-1,5 u)" }
        ],
        route: [
            { lat: 15.5469, lng: -61.3000 }, // Vliegveld
            { lat: 15.5024, lng: -61.2609 }, // Kalinago Barana Aute
            { lat: 15.4750, lng: -61.2550 }, // Lunchpauze
            { lat: 15.37278, lng: -61.255388 }, // Rosalie Bay
            { lat: 15.396053, lng: -61.321976 }, // Emerald Pool
            { lat: 15.3768, lng: -61.2520 }  // Rosalie Bay - Schildpadden spotten
        ],
        routeMapLink: "https://www.google.com/maps/dir/Douglas-Charles+Airport,+Dominica/Kalinago+Barana+Aute,+Dominica/15.4750,-61.2550/Rosalie+Bay,+Dominica/Emerald+Pool,+Dominica/Rosalie+Bay,+Dominica/"
    },
    
    day2: { // 12 April - Vrijdag: Morne Trois Pitons NP & Titou Gorge
        title: "Dag 2: Morne Trois Pitons NP & Titou Gorge",
        color: DAY_COLORS.day2,
        waypoints: [
            { name: "Rosalie Bay", lat: 15.37278, lng: -61.255388, description: "07:30 - Vertrek naar Salton Waterfalls" },
            { name: "Salton Waterfalls", lat: 15.3842194, lng: -61.3578295, description: "08:00 - Salton Waterfalls (1 u incl. bezoek)" },
            { name: "Freshwater Lake", lat: 15.3123, lng: -61.3009, description: "09:30 - Freshwater Lake Hike (1 u)" },
            { name: "Titou Gorge", lat: 15.3175, lng: -61.3393, description: "11:00 - Titou Gorge (1 u)" },
            { name: "Middleham Falls", lat: 15.3269, lng: -61.3483, description: "12:30 - Middleham Falls (2 u incl. hike en reistijd)" },
            { name: "Trafalgar Falls", lat: 15.3165, lng: -61.3402, description: "14:30 - Trafalgar Falls (1 u incl. bezoek en rit)" },
            { name: "Ti Kwen Glo Cho / Tia's Spa", lat: 15.3210, lng: -61.3357, description: "16:00 - Ti Kwen Glo Cho spa (1,5 u ontspannen)" },
            { name: "Canefield (airbnb)", lat: 15.328927, lng: -61.3881073, description: "18:00 - Inchecken bij accommodatie in Canefield", directMapLink: "https://www.google.com/maps/place/15%C2%B019'44.1%22N+61%C2%B023'17.2%22W/@15.328927,-61.3906822,1068m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d15.328927!4d-61.3881073?entry=ttu&g_ep=EgoyMDI1MDQwNi4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D" }
        ],
        route: [
            { lat: 15.37278, lng: -61.255388 }, // Rosalie Bay
            { lat: 15.3842194, lng: -61.3578295 }, // Salton Waterfalls
            { lat: 15.3123, lng: -61.3009 }, // Freshwater Lake
            { lat: 15.3175, lng: -61.3393 }, // Titou Gorge
            { lat: 15.3269, lng: -61.3483 }, // Middleham Falls
            { lat: 15.3165, lng: -61.3402 }, // Trafalgar Falls
            { lat: 15.3210, lng: -61.3357 }, // Ti Kwen Glo Cho spa
            { lat: 15.328927, lng: -61.3881073 } // Canefield
        ],
        routeMapLink: "https://www.google.com/maps/dir/Rosalie+Bay,+Dominica/Salton+Waterfalls,+Dominica/Freshwater+Lake,+Dominica/Titou+Gorge,+Laudat,+Dominica/Middleham+Falls,+Dominica/Trafalgar+Falls,+Dominica/Ti+Kwen+Glo+Cho,+Wotten+Waven,+Dominica/Canefield,+Dominica/"
    },
    
    day3: { // 13 April - Zaterdag: Zuidwestkust & snorkelen
        title: "Dag 3: Zuidwestkust & snorkelen",
        color: DAY_COLORS.day3,
        waypoints: [
            { name: "Canefield", lat: 15.328927, lng: -61.3881073, description: "08:00 - Vertrek naar Champagne Reef" },
            { name: "Champagne Reef", lat: 15.2608, lng: -61.3731, description: "08:30 - Snorkelen bij Champagne Reef (1,5 u)" },
            { name: "Roseau", lat: 15.3017, lng: -61.3881, description: "10:30 - Lunch in Roseau (1 u)" },
            { name: "Old Market", lat: 15.2984, lng: -61.3871, description: "11:30 - Bezoek de Old Market in Roseau (45 min)" },
            { name: "Scotts Head", lat: 15.2258, lng: -61.3667, description: "13:00 - Vertrek naar Scotts Head (45 min rijden)" },
            { name: "Scotts Head Punt", lat: 15.2209, lng: -61.3688, description: "13:45 - Snorkelen & uitzichtpunt Scotts Head (1,5 u) en terug naar Canefield" }
        ],
        route: [
            { lat: 15.328927, lng: -61.3881073 }, // Canefield
            { lat: 15.2608, lng: -61.3731 }, // Champagne Reef
            { lat: 15.3017, lng: -61.3881 }, // Roseau
            { lat: 15.2984, lng: -61.3871 }, // Old Market
            { lat: 15.2258, lng: -61.3667 }, // Scotts Head
            { lat: 15.2209, lng: -61.3688 }  // Scotts Head Punt
        ],
        routeMapLink: "https://www.google.com/maps/dir/Canefield,+Dominica/Champagne+Reef,+Pointe+Michel,+Dominica/Roseau,+Dominica/Old+Market+of+Roseau,+Dominica/Scotts+Head,+Dominica/Scotts+Head+Point,+Dominica/Canefield,+Dominica/"
    },
    
    day4: { // 14 April - Zondag: Noordkust & Indian River
        title: "Dag 4: Noordkust & Indian River",
        color: DAY_COLORS.day4,
        waypoints: [
            { name: "Canefield", lat: 15.328927, lng: -61.3881073, description: "07:00 - Vroeg vertrek naar Mero Beach" },
            { name: "Mero Beach", lat: 15.4189776, lng: -61.4296712, description: "07:30 - Mero Beach (relaxen & zwemmen, 1 u)" },
            { name: "Portsmouth", lat: 15.5758, lng: -61.4564, description: "09:00 - Aankomst Portsmouth" },
            { name: "Indian River", lat: 15.5781, lng: -61.4611, description: "09:00 - Indian River Tour met gids (1,5 u)" },
            { name: "Fort Shirley & Cabrits National Park", lat: 15.5864, lng: -61.4720, description: "10:30 - Fort Shirley & Cabrits National Park (1,5 u)" },
            { name: "Cold Soufrière", lat: 15.6193787, lng: -61.4398718, description: "12:00 - Cold Soufrière (30 min rijden + korte stop, 30 min)" },
            { name: "Batibou Bay", lat: 15.5965354, lng: -61.3696011, description: "13:00 - Batibou Bay (30 min rijden, 1,5 u zwemmen & relaxen)" },
            { name: "vertrek: Douglas-Charles Airport", lat: 15.5469, lng: -61.3000, description: "17:30 - Aankomst luchthaven en vertrek" }
        ],
        route: [
            { lat: 15.328927, lng: -61.3881073 }, // Canefield
            { lat: 15.4189776, lng: -61.4296712 }, // Mero Beach
            { lat: 15.5758, lng: -61.4564 }, // Portsmouth
            { lat: 15.5781, lng: -61.4611 }, // Indian River
            { lat: 15.5864, lng: -61.4720 }, // Fort Shirley & Cabrits National Park
            { lat: 15.6193787, lng: -61.4398718 }, // Cold Soufrière
            { lat: 15.5965354, lng: -61.3696011 }, // Batibou Bay
            { lat: 15.5469, lng: -61.3000 }  // Luchthaven
        ],
        routeMapLink: "https://www.google.com/maps/dir/Canefield,+Dominica/Mero+Beach,+Dominica/Portsmouth,+Dominica/Indian+River,+Portsmouth,+Dominica/Fort+Shirley,+Cabrits+National+Park,+Dominica/Cold+Soufriere,+Dominica/Batibou+Bay,+Dominica/Douglas-Charles+Airport,+Dominica/"
    }
};

// Let op: Bovenstaande locaties en routes zijn inschattingen
// Vervang deze met de juiste coördinaten uit je reisplan 