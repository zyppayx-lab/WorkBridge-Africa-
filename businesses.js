//======================================================
// WorkBridge Africa
// businesses.js (Part 1)
//======================================================

//==============================
// SUPABASE
//==============================

const SUPABASE_URL = "https://razemjveqtmnutvluxab.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2utxbSM-OS6QTitKo6MobA_spBvL_2r";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

//==============================
// DOM
//==============================

const businessGrid =
document.getElementById("businessGrid");

const resultCount =
document.getElementById("resultCount");

const emptyState =
document.getElementById("emptyState");

const searchForm =
document.getElementById("searchForm");

const searchInput =
document.getElementById("searchInput");

const countryFilter =
document.getElementById("countryFilter");

const stateFilter =
document.getElementById("stateFilter");

const categoryFilter =
document.getElementById("categoryFilter");

const sortFilter =
document.getElementById("sortFilter");

const previousPage =
document.getElementById("previousPage");

const nextPage =
document.getElementById("nextPage");

const pageNumber =
document.getElementById("pageNumber");

//==============================
// MOBILE MENU
//==============================

const menuButton =
document.getElementById("menuButton");

const mobileMenu =
document.getElementById("mobileMenu");

menuButton?.addEventListener("click",()=>{

    mobileMenu.classList.toggle("active");

});

//==============================
// PAGINATION
//==============================

const PAGE_SIZE = 12;

let currentPage = 1;

let totalBusinesses = 0;

//==============================
// URL PARAMETERS
//==============================

const params =
new URLSearchParams(window.location.search);

searchInput.value =
params.get("search") || "";

if(params.get("country")){

    countryFilter.value =
    params.get("country");

}

if(params.get("category")){

    categoryFilter.value =
    params.get("category");

}

//==============================
// LOAD FILTERS
//==============================

async function loadFilters(){

    // Countries

    const {

        data:countries

    } = await supabase

    .from("businesses")

    .select("country,state,categories")

    .eq("status","active");

    if(!countries) return;

    const countrySet = new Set();

    const stateSet = new Set();

    const categorySet = new Set();

    countries.forEach(item=>{

        if(item.country){

            countrySet.add(item.country);

        }

        if(item.state){

            stateSet.add(item.state);

        }

        if(Array.isArray(item.categories)){

            item.categories.forEach(category=>{

                if(category){

                    categorySet.add(category);

                }

            });

        }

    });

    [...countrySet]
    .sort()
    .forEach(country=>{

        countryFilter.innerHTML +=

`<option value="${country}">

${country}

</option>`;

    });

    [...stateSet]
    .sort()
    .forEach(state=>{

        stateFilter.innerHTML +=

`<option value="${state}">

${state}

</option>`;

    });

    [...categorySet]
    .sort()
    .forEach(category=>{

        categoryFilter.innerHTML +=

`<option value="${category}">

${category}

</option>`;

    });

}

//==============================
// BUILD QUERY
//==============================

function buildQuery(){

    let query =

    supabase

    .from("businesses")

    .select("*",{count:"exact"})

    .eq("status","active");

    // Search

    if(searchInput.value.trim()){

        const keyword =

        searchInput.value.trim();

        query = query.or(

`business_name.ilike.%${keyword}%,
description.ilike.%${keyword}%,
keywords.cs.{${keyword}}`

        );

    }

    // Country

    if(countryFilter.value){

        query = query.eq(

            "country",

            countryFilter.value

        );

    }

    // State

    if(stateFilter.value){

        query = query.eq(

            "state",

            stateFilter.value

        );

    }

    // Category

    if(categoryFilter.value){

        query = query.contains(

            "categories",

            [categoryFilter.value]

        );

    }

    return query;

}
//======================================================
// businesses.js (Part 2)
//======================================================

//==============================
// LOAD BUSINESSES
//==============================

async function loadBusinesses(){

    businessGrid.innerHTML =

    `<p class="loading">Loading businesses...</p>`;

    emptyState.classList.add("hidden");

    let query = buildQuery();

    //==========================
    // SORTING
    //==========================

    switch(sortFilter.value){

        case "featured":

            query = query

            .order(
                "featured_until",
                {
                    ascending:false,
                    nullsFirst:false
                }
            )

            .order(
                "created_at",
                {
                    ascending:false
                }
            );

            break;

        case "popular":

            query = query

            .order(
                "views",
                {
                    ascending:false
                }
            );

            break;

        case "name":

            query = query

            .order(
                "business_name",
                {
                    ascending:true
                }
            );

            break;

        default:

            query = query

            .order(
                "created_at",
                {
                    ascending:false
                }
            );

    }

    //==========================
    // PAGINATION
    //==========================

    const from =

    (currentPage - 1)

    * PAGE_SIZE;

    const to =

    from + PAGE_SIZE - 1;

    const {

        data,

        error,

        count

    }

    = await query.range(from,to);

    if(error){

        businessGrid.innerHTML =

        "<p>Unable to load businesses.</p>";

        console.error(error);

        return;

    }

    totalBusinesses = count || 0;

    resultCount.textContent =

    `${totalBusinesses} Businesses`;

    pageNumber.textContent =

    `Page ${currentPage}`;

    previousPage.disabled =

    currentPage === 1;

    nextPage.disabled =

    to + 1 >= totalBusinesses;

    if(!data.length){

        businessGrid.innerHTML = "";

        emptyState.classList.remove("hidden");

        return;

    }

    businessGrid.innerHTML = "";

    data.forEach(renderBusinessCard);

}

//==============================
// RENDER CARD
//==============================

function renderBusinessCard(

    business

){

    const featured =

    business.featured_until &&

    new Date(

        business.featured_until

    ) > new Date();

    const card =

    document.createElement("article");

    card.className =

    "business-card";

    card.innerHTML =

`
<div class="business-image">

<img

src="${business.logo_url ||

'assets/default-business.webp'}"

alt="${business.business_name}"

loading="lazy">

${featured ?

'<span class="featured-badge"><i class="fa-solid fa-star"></i> Featured</span>'

:

''}

${business.verified ?

'<span class="verified-badge"><i class="fa-solid fa-check"></i></span>'

:

''}

</div>

<div class="business-content">

<span class="business-category">

${business.categories?.[0] ||

'Business'}

</span>

<h3>

${business.business_name}

</h3>

<p class="business-description">

${

(business.description ||

'')

.substring(0,130)

}

...

</p>

<div class="business-location">

<i class="fa-solid fa-location-dot"></i>

<span>

${business.state},

${business.country}

</span>

</div>

<div class="business-phone">

<i class="fa-solid fa-phone"></i>

<a href="tel:${business.phone}">

${business.phone}

</a>

</div>

${
business.whatsapp ?

`

<div class="business-whatsapp">

<i class="fa-brands fa-whatsapp"></i>

<a

target="_blank"

href="https://wa.me/${business.whatsapp.replace(/\D/g,'')}">

Chat on WhatsApp

</a>

</div>

`

:

""
}

<div class="business-footer">

<div class="business-views">

<i class="fa-solid fa-eye"></i>

${business.views || 0}

</div>

<a

class="view-business"

href="business.html?slug=${business.slug}">

View Business

</a>

</div>

</div>

`;

    businessGrid.appendChild(card);

}

//==============================
// PAGINATION
//==============================

previousPage.onclick = async ()=>{

    if(currentPage===1)

        return;

    currentPage--;

    await loadBusinesses();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};

nextPage.onclick = async ()=>{

    if(

        currentPage * PAGE_SIZE

        >=

        totalBusinesses

    )

    return;

    currentPage++;

    await loadBusinesses();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};
//======================================================
// businesses.js (Part 3)
//======================================================

//==============================
// UPDATE URL
//==============================

function updateURL(){

    const url = new URL(window.location);

    if(searchInput.value.trim()){

        url.searchParams.set(
            "search",
            searchInput.value.trim()
        );

    }else{

        url.searchParams.delete("search");

    }

    if(countryFilter.value){

        url.searchParams.set(
            "country",
            countryFilter.value
        );

    }else{

        url.searchParams.delete("country");

    }

    if(stateFilter.value){

        url.searchParams.set(
            "state",
            stateFilter.value
        );

    }else{

        url.searchParams.delete("state");

    }

    if(categoryFilter.value){

        url.searchParams.set(
            "category",
            categoryFilter.value
        );

    }else{

        url.searchParams.delete("category");

    }

    if(sortFilter.value !== "latest"){

        url.searchParams.set(
            "sort",
            sortFilter.value
        );

    }else{

        url.searchParams.delete("sort");

    }

    history.replaceState(
        {},
        "",
        url
    );

}

//==============================
// FILTER EVENTS
//==============================

async function reload(){

    currentPage = 1;

    updateURL();

    await loadBusinesses();

}

searchForm?.addEventListener(

"submit",

async(e)=>{

    e.preventDefault();

    await reload();

});

countryFilter.addEventListener(

"change",

reload

);

stateFilter.addEventListener(

"change",

reload

);

categoryFilter.addEventListener(

"change",

reload

);

sortFilter.addEventListener(

"change",

reload

);

//==============================
// BUSINESS CLICK
//==============================

document.addEventListener(

"click",

async(event)=>{

    const button =

    event.target.closest(

        ".view-business"

    );

    if(!button) return;

    event.preventDefault();

    const href =

    button.getAttribute("href");

    const slug =

    href.split("=")[1];

    try{

        // Find business

        const {

            data:business

        }

        = await supabase

        .from("businesses")

        .select("id,views")

        .eq("slug",slug)

        .single();

        if(business){

            await supabase

            .from("businesses")

            .update({

                views:

                (business.views || 0) + 1

            })

            .eq(

                "id",

                business.id

            );

        }

    }catch(err){

        console.error(err);

    }

    window.location.href = href;

});

//==============================
// MOBILE MENU
//==============================

document.addEventListener(

"click",

(event)=>{

    if(

        !mobileMenu.contains(event.target)

        &&

        !menuButton.contains(event.target)

    ){

        mobileMenu.classList.remove(

            "active"

        );

    }

});

//==============================
// RESTORE URL FILTERS
//==============================

const sortValue =

params.get("sort");

if(sortValue){

    sortFilter.value =

    sortValue;

}

const stateValue =

params.get("state");

if(stateValue){

    stateFilter.value =

    stateValue;

}

//==============================
// INITIALIZE
//==============================

async function initialize(){

    await loadFilters();

    await loadBusinesses();

}

initialize();

//======================================================
// END businesses.js
//======================================================
