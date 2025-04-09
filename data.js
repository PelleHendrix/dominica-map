// Kleuren voor elke dag
const DAY_COLORS = {
    day1: '#FF5252', // Rood
    day2: '#536DFE', // Blauw
    day3: '#FF9800', // Oranje
    day4: '#4CAF50'  // Groen
};

// Kleuren voor type activiteit
const ACTIVITY_COLORS = {
    swim: '#00BCD4',    // Zwemmen/Snorkelen - Cyaan
    hike: '#8BC34A',    // Wandelen/Hiken - Lichtgroen
    culture: '#9C27B0', // Cultuur/Historisch - Paars 
    nature: '#4CAF50',  // Natuur/Uitzicht - Groen
    relax: '#FF9800',   // Relaxen/Strand - Oranje
    travel: '#607D8B'   // Vervoer/Transport - Grijs
};

// Reisdata op basis van de geoptimaliseerde reisplanning
const reisdata = {
    day1: { // 11 April - Donderdag: Oostkust & Kalinago-territorium
        title: "Dag 1: Oostkust & Kalinago-territorium",
        color: DAY_COLORS.day1,
        waypoints: [
            { name: "Douglas-Charles Airport (Melville Hall)", lat: 15.5469, lng: -61.3000, description: "08:00 - Aankomst Dominica + ophalen huurauto", activityType: "travel" },
            { name: "Kalinago Barana Aute (Tour Boeken)", lat: 15.5024, lng: -61.2609, description: "10:30 - Kalinago Barana Aute (1,5 u incl. reistijd)", activityType: "culture" },
            { name: "Rosalie Bay (airbnb)", lat: 15.37278, lng: -61.255388, description: "13:30 - Inchecken bij accommodatie + korte rustpauze (30 min)", directMapLink: "https://www.google.com/maps/place/15%C2%B022'22.0%22N+61%C2%B015'19.4%22W/@15.3728088,-61.258013,1107m/data=!3m1!1e3!4m4!3m3!8m2!3d15.37278!4d-61.255388?entry=ttu&g_ep=EgoyMDI1MDQwNi4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D", activityType: "relax" },
            { name: "Emerald Pool (Koop een weekpass)", lat: 15.396053, lng: -61.321976, description: "14:30 - Emerald Pool (1,5 u incl. rit + bezoek)", activityType: "swim" },
            { name: "Rosalie Bay - Schildpadden spotten", lat: 15.3768, lng: -61.2520, description: "Beste tijd: 's avonds tussen 19:00–22:30", activityType: "nature" }
        ],
        route: [
            { lat: 15.5469, lng: -61.3000 }, // Vliegveld
            { lat: 15.5024, lng: -61.2609 }, // Kalinago Barana Aute
            { lat: 15.37278, lng: -61.255388 }, // Rosalie Bay
            { lat: 15.396053, lng: -61.321976 }, // Emerald Pool
            { lat: 15.3768, lng: -61.2520 }  // Rosalie Bay - Schildpadden spotten
        ],
        routeMapLink: "https://www.google.com/maps/dir/Douglas-Charles+Airport,+Dominica/Kalinago+Barana+Aute,+Dominica/Rosalie+Bay,+Dominica/Emerald+Pool,+Dominica/Rosalie+Bay,+Dominica/"
    },
    
    day2: { // 12 April - Vrijdag: Morne Trois Pitons NP & Titou Gorge
        title: "Dag 2: Morne Trois Pitons NP & Titou Gorge",
        color: DAY_COLORS.day2,
        waypoints: [
            { name: "Rosalie Bay", lat: 15.37278, lng: -61.255388, description: "07:30 - Vertrek naar Freshwater Lake", activityType: "travel" },
            { name: "Freshwater Lake", lat: 15.3123, lng: -61.3009, description: "09:30 - Freshwater Lake Hike (1 u)", activityType: "hike" },
            { name: "Titou Gorge", lat: 15.3175, lng: -61.3393, description: "11:00 - Titou Gorge (1 u)", activityType: "nature" },
            { name: "Middleham Falls", lat: 15.3269, lng: -61.3483, description: "12:30 - Middleham Falls (2 u incl. hike en reistijd)", activityType: "nature" },
            { name: "Trafalgar Falls", lat: 15.3165, lng: -61.3402, description: "14:30 - Trafalgar Falls (1 u incl. bezoek en rit)", activityType: "nature" },
            { name: "Ti Kwen Glo Cho / Tia's Spa", lat: 15.3210, lng: -61.3357, description: "16:00 - Ti Kwen Glo Cho spa (1,5 u ontspannen)", activityType: "relax" },
            { name: "Canefield (airbnb)", lat: 15.328927, lng: -61.3881073, description: "18:00 - Inchecken bij accommodatie in Canefield", directMapLink: "https://www.google.com/maps/place/15%C2%B019'44.1%22N+61%C2%B023'17.2%22W/@15.328927,-61.3906822,1068m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d15.328927!4d-61.3881073?entry=ttu&g_ep=EgoyMDI1MDQwNi4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D", activityType: "travel" }
        ],
        route: [
            { lat: 15.37278, lng: -61.255388 }, // Rosalie Bay
            { lat: 15.3123, lng: -61.3009 }, // Freshwater Lake
            { lat: 15.3175, lng: -61.3393 }, // Titou Gorge
            { lat: 15.3269, lng: -61.3483 }, // Middleham Falls
            { lat: 15.3165, lng: -61.3402 }, // Trafalgar Falls
            { lat: 15.3210, lng: -61.3357 }, // Ti Kwen Glo Cho spa
            { lat: 15.328927, lng: -61.3881073 } // Canefield
        ],
        routeMapLink: "https://www.google.com/maps/dir/Rosalie+Bay,+Dominica/Freshwater+Lake,+Dominica/Titou+Gorge,+Laudat,+Dominica/Middleham+Falls,+Dominica/Trafalgar+Falls,+Dominica/Ti+Kwen+Glo+Cho,+Wotten+Waven,+Dominica/Canefield,+Dominica/"
    },
    
    day3: { // 13 April - Zaterdag: Zuidwestkust & snorkelen
        title: "Dag 3: Zuidwestkust & snorkelen",
        color: DAY_COLORS.day3,
        waypoints: [
            { name: "Canefield", lat: 15.328927, lng: -61.3881073, description: "08:30 - Vertrek naar Champagne Reef", activityType: "travel" },
            { name: "Champagne Reef", lat: 15.2608, lng: -61.3731, description: "09:15 - Snorkelen bij Champagne Reef (2 u)", activityType: "swim" },
            { name: "Roseau", lat: 15.3017, lng: -61.3881, description: "11:45 - Lunch in Roseau (1,5 u)", activityType: "relax" },
            { name: "Old Market", lat: 15.2984, lng: -61.3871, description: "13:15 - Bezoek de Old Market in Roseau (1 u)", activityType: "culture" },
            { name: "Scotts Head Punt", lat: 15.2209, lng: -61.3688, description: "14:45 - Snorkelen & uitzichtpunt Scotts Head (2 u) en terug naar Canefield", activityType: "swim" }
        ],
        route: [
            { lat: 15.328927, lng: -61.3881073 }, // Canefield
            { lat: 15.2608, lng: -61.3731 }, // Champagne Reef
            { lat: 15.3017, lng: -61.3881 }, // Roseau
            { lat: 15.2984, lng: -61.3871 }, // Old Market
            { lat: 15.2209, lng: -61.3688 }  // Scotts Head Punt
        ],
        routeMapLink: "https://www.google.com/maps/dir/Canefield,+Dominica/Champagne+Reef,+Pointe+Michel,+Dominica/Roseau,+Dominica/Old+Market+of+Roseau,+Dominica/Scotts+Head+Point,+Dominica/Canefield,+Dominica/"
    },
    
    day4: { // 14 April - Zondag: Noordkust & Indian River
        title: "Dag 4: Noordkust & Indian River",
        color: DAY_COLORS.day4,
        waypoints: [
            { name: "Canefield", lat: 15.328927, lng: -61.3881073, description: "07:30 - Vertrek naar Mero Beach", activityType: "travel" },
            { name: "Mero Beach", lat: 15.4189776, lng: -61.4296712, description: "08:15 - Mero Beach (relaxen & zwemmen, 1,5 u)", activityType: "swim" },
            { name: "Indian River (Tour boeken)", lat: 15.5781, lng: -61.4611, description: "10:30 - Indian River Tour met gids (1,5 u)", activityType: "nature" },
            { name: "Fort Shirley & Cabrits National Park", lat: 15.5864, lng: -61.4720, description: "12:30 - Fort Shirley & Cabrits National Park (1,5 u)", activityType: "culture" },
            { name: "Cold Soufrière", lat: 15.6193787, lng: -61.4398718, description: "14:30 - Cold Soufrière (rijden + bezoek, 1 u)", activityType: "nature" },
            { name: "Batibou Bay", lat: 15.5965354, lng: -61.3696011, description: "15:45 - Batibou Bay (zwemmen & relaxen, 1 u)", activityType: "swim" },
            { name: "vertrek: Douglas-Charles Airport", lat: 15.5469, lng: -61.3000, description: "17:15 - Aankomst luchthaven en vertrek", activityType: "travel" }
        ],
        route: [
            { lat: 15.328927, lng: -61.3881073 }, // Canefield
            { lat: 15.4189776, lng: -61.4296712 }, // Mero Beach
            { lat: 15.5781, lng: -61.4611 }, // Indian River
            { lat: 15.5864, lng: -61.4720 }, // Fort Shirley & Cabrits National Park
            { lat: 15.6193787, lng: -61.4398718 }, // Cold Soufrière
            { lat: 15.5965354, lng: -61.3696011 }, // Batibou Bay
            { lat: 15.5469, lng: -61.3000 }  // Luchthaven
        ],
        routeMapLink: "https://www.google.com/maps/dir/Canefield,+Dominica/Mero+Beach,+Dominica/Indian+River,+Portsmouth,+Dominica/Fort+Shirley,+Cabrits+National+Park,+Dominica/Cold+Soufriere,+Dominica/Batibou+Bay,+Dominica/Douglas-Charles+Airport,+Dominica/"
    }
};

// Let op: Bovenstaande locaties en routes zijn inschattingen
// Vervang deze met de juiste coördinaten uit je reisplan 