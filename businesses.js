//======================================================
// WorkBridge Africa
// businesses.js
// Part 1
//======================================================


//==============================
// SUPABASE
//==============================

const SUPABASE_URL =
"https://razemjveqtmnutvluxab.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_2utxbSM-OS6QTitKo6MobA_spBvL_2r";

const supabase =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


//==============================
// DOM
//==============================

const businessGrid =
document.getElementById("businessGrid");

const businessCount =
document.getElementById("businessCount");

const searchForm =
document.getElementById("searchForm");

const searchInput =
document.getElementById("searchInput");

const loadMoreBtn =
document.getElementById("loadMoreBtn");

const menuButton =
document.getElementById("menuButton");

const mobileMenu =
document.getElementById("mobileMenu");


//==============================
// MOBILE MENU
//==============================

menuButton?.addEventListener(
"click",
()=>{

    mobileMenu?.classList.toggle(
        "active"
    );

});


//==============================
// PAGINATION
//==============================

let page = 0;

const PAGE_SIZE = 20;

let currentKeyword = "";
//======================================================
// Part 2
// LOAD BUSINESSES
//======================================================

async function loadBusinesses(reset = false){

    if(reset){

        page = 0;
        businessGrid.innerHTML = "";

    }

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
    .from("businesses")
    .select("*",{count:"exact"})
    .eq("status","active");

    if(currentKeyword !== ""){

        query = query.ilike(
            "business_name",
            `%${currentKeyword}%`
        );

    }

    const { data, error, count } = await query
    .order("featured_until",{
        ascending:false,
        nullsFirst:false
    })
    .order("verified",{
        ascending:false
    })
    .order("created_at",{
        ascending:false
    })
    .range(from,to);

    if(error){

        console.error(error);

        businessGrid.innerHTML =
        "<p>Unable to load businesses.</p>";

        return;

    }

    if(reset){

        businessCount.textContent =
        count ?? 0;

    }

    if(!data || data.length===0){

        if(reset){

            businessGrid.innerHTML =
            "<p>No businesses found.</p>";

        }

        loadMoreBtn.style.display="none";

        return;

    }

    renderBusinesses(data);

    page++;

    loadMoreBtn.style.display =
    data.length < PAGE_SIZE ? "none" : "inline-flex";

        }

//======================================================
// Part 3
// RENDER BUSINESSES
//======================================================

function renderBusinesses(businesses){

businesses.forEach(business=>{

const featured =

business.featured_until &&

new Date(business.featured_until) > new Date();


const verified =
business.verified === true;


businessGrid.innerHTML += `

<article class="business-card">

<div class="business-image">

<img

src="${business.logo_url || "assets/default-business.jpg"}"

alt="${business.business_name}">

</div>

<div class="business-content">

<div class="business-badges">

${featured ? `

<span class="featured-badge">

⭐ Sponsored

</span>

` : ""}

${verified ? `

<span class="verified-badge">

<i class="fa-solid fa-circle-check"></i>

Verified

</span>

` : ""}

</div>

<span class="business-category">

${

Array.isArray(business.categories)

?

business.categories[0]

:

"Business"

}

</span>

<h3>

${business.business_name}

</h3>

<p>

${

business.description

?

business.description.substring(0,120)

:

"No description available."

}

...

</p>

<div class="business-location">

<i class="fa-solid fa-location-dot"></i>

${business.state},

${business.country}

</div>

<div class="business-contact">

<a href="tel:${business.phone}">

Call

</a>

<a href="business.html?slug=${business.slug}">

View

</a>

</div>

</div>

</article>

`;

});

}
//======================================================
// Part 4
// SEARCH + LOAD MORE + START
//======================================================


//==============================
// SEARCH
//==============================

searchForm?.addEventListener(
"submit",
(e)=>{

e.preventDefault();

currentKeyword =
searchInput.value.trim();

loadBusinesses(true);

}
);


//==============================
// LOAD MORE
//==============================

loadMoreBtn?.addEventListener(
"click",
()=>{

loadBusinesses();

}
);


//==============================
// IMAGE FALLBACK
//==============================

document.addEventListener(

"error",

(event)=>{

const element =
event.target;

if(element.tagName === "IMG"){

element.src =
"assets/default-business.jpg";

}

},

true

);


//==============================
// PAGE LOAD
//==============================

document.addEventListener(

"DOMContentLoaded",

()=>{

const params =
new URLSearchParams(
window.location.search
);

currentKeyword =
params.get("q") || "";

if(searchInput){

searchInput.value =
currentKeyword;

}

loadBusinesses(true);

}

);

//======================================================
// END
//======================================================
