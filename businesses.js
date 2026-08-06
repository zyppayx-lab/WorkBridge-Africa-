//======================================================
// WorkBridge Africa
// businesses.js
//======================================================


//==============================
// SUPABASE
//==============================

const SUPABASE_URL =
"https://razemjveqtmnutvluxab.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhemVtanZlcXRtbnV0dmx1eGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTE4MTMsImV4cCI6MjEwMTMyNzgxM30.e7JhaJ6DEZsH3WNUYGjdk8TvdsITNDKgLIzkbcLk-Yw";

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

mobileMenu.classList.toggle(
"active"
);

});


//==============================
// PAGINATION
//==============================

let page = 0;

const PAGE_SIZE = 20;

let keyword = "";
//======================================================
// LOAD BUSINESSES
//======================================================

async function loadBusinesses(reset = false){

if(reset){

page = 0;

businessGrid.innerHTML = "";

}


let query =

supabase

.from("businesses")

.select("*")

.eq("status","active")

.order(
"featured_until",
{
ascending:false,
nullsFirst:false
}
)

.order(
"verified",
{
ascending:false
}
)

.order(
"created_at",
{
ascending:false
}
)

.range(
page * PAGE_SIZE,
(page * PAGE_SIZE) + PAGE_SIZE - 1
);


if(keyword){

query = query.or(

`business_name.ilike.%${keyword}%,
description.ilike.%${keyword}%,
state.ilike.%${keyword}%,
country.ilike.%${keyword}%`

);

}


const {

data,
error

}

=

await query;


if(error){

console.error(error);

businessGrid.innerHTML =

"<p>Unable to load businesses.</p>";

return;

}


if(reset){

businessGrid.innerHTML = "";

}


renderBusinesses(data);


page++;


if(data.length < PAGE_SIZE){

loadMoreBtn.style.display = "none";

}else{

loadMoreBtn.style.display = "inline-flex";

}

}
//======================================================
// RENDER + EVENTS
//======================================================

function renderBusinesses(businesses){

businesses.forEach(business=>{

const featured =

business.featured_until &&

new Date(business.featured_until) > new Date();

businessGrid.innerHTML += `

<div class="business-card">

<div class="business-image">

<img
src="${business.logo_url || 'assets/default-business.jpg'}"
alt="${business.business_name}">

</div>

<div class="business-content">

<div class="business-badges">

${featured ? `
<span class="featured-badge">
⭐ Sponsored
</span>
` : ""}

${business.verified ? `
<span class="verified-badge">
<i class="fa-solid fa-circle-check"></i>
Verified
</span>
` : ""}

</div>

<span class="business-category">

${business.categories?.[0] || "Business"}

</span>

<h3>

${business.business_name}

</h3>

<p>

${business.description || ""}

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
View Business
</a>

</div>

</div>

</div>

`;

});

}


//==============================
// SEARCH
//==============================

searchForm?.addEventListener(
"submit",
(e)=>{

e.preventDefault();

keyword = searchInput.value.trim();

loadBusinesses(true);

});


//==============================
// LOAD MORE
//==============================

loadMoreBtn?.addEventListener(
"click",
()=>{

loadBusinesses();

});


//==============================
// IMAGE FALLBACK
//==============================

document.addEventListener(
"error",
(event)=>{

if(event.target.tagName==="IMG"){

event.target.src =
"assets/default-business.jpg";

}

},
true
);


//==============================
// START
//==============================

document.addEventListener(
"DOMContentLoaded",
()=>{

const params =
new URLSearchParams(window.location.search);

keyword =
params.get("q") || "";

searchInput.value =
keyword;

loadBusinesses(true);

});

//======================================================
// END
//======================================================
