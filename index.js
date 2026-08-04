//======================================================
// WorkBridge Africa
// index.js (Part 1)
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

const featuredBusinesses =
document.getElementById("featuredBusinesses");

const latestJobs =
document.getElementById("latestJobs");

const recentBusinesses =
document.getElementById("recentBusinesses");

const categoriesGrid =
document.getElementById("categoriesGrid");

const countriesGrid =
document.getElementById("countriesGrid");

const businessCount =
document.getElementById("businessCount");

const jobCount =
document.getElementById("jobCount");

const searchForm =
document.getElementById("searchForm");

const searchInput =
document.getElementById("searchInput");

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
// SEARCH
//==============================

searchForm?.addEventListener(
"submit",
(e)=>{

    e.preventDefault();

    const keyword =
    searchInput.value.trim();

    if(keyword==="") return;

    window.location.href =
    `search.html?q=${encodeURIComponent(keyword)}`;

});

//==============================
// PLATFORM STATS
//==============================

async function loadStats(){

    const {

        count:businesses

    } = await supabase

    .from("businesses")

    .select("*",{

        count:"exact",

        head:true

    })

    .eq("status","active");

    const {

        count:jobs

    } = await supabase

    .from("jobs")

    .select("*",{

        count:"exact",

        head:true

    })

    .eq("status","active");

    businessCount.textContent =
    businesses ?? 0;

    jobCount.textContent =
    jobs ?? 0;

}

//==============================
// FEATURED BUSINESSES
//==============================

async function loadFeaturedBusinesses(){

    featuredBusinesses.innerHTML = `
    <p class="loading">
    Loading businesses...
    </p>`;

    const {

        data,

        error

    } = await supabase

    .from("businesses")

    .select("*")

    .eq("status","active")

    .gt(
        "featured_until",
        new Date().toISOString()
    )

    .order("featured_until",{

        ascending:false

    })

    .limit(6);

    if(error){

        featuredBusinesses.innerHTML=
        "<p>Unable to load businesses.</p>";

        return;

    }

    if(!data.length){

        featuredBusinesses.innerHTML=
        "<p>No featured businesses available.</p>";

        return;

    }

    featuredBusinesses.innerHTML="";

    data.forEach(business=>{

        featuredBusinesses.innerHTML +=

`
<article class="business-card">

<img
src="${
business.logo_url ||
'assets/default-business.jpg'
}"

alt="${
business.business_name
}">

<div class="business-content">

<span class="business-category">

${
business.categories?.[0] ||
"Business"
}

</span>

<h3>

${
business.business_name
}

</h3>

<p>

${
business.description
?.substring(0,120) ||
"No description available."
}

...

</p>

<div class="business-meta">

<span>

<i class="fa-solid fa-location-dot"></i>

${
business.state
},

${
business.country
}

</span>

<span>

<i class="fa-solid fa-eye"></i>

${
business.views || 0
}

</span>

</div>

<a

class="business-btn"

href="business.html?slug=${
business.slug
}">

View Business

</a>

</div>

</article>

`;

    });

}

//==============================
// INITIALIZE
//==============================

loadStats();

loadFeaturedBusinesses();
//======================================================
// index.js (Part 2)
// WorkBridge Africa
//======================================================

//==============================
// LATEST JOBS
//==============================

async function loadLatestJobs(){

    latestJobs.innerHTML =
    `<p class="loading">Loading latest jobs...</p>`;

    const {

        data,

        error

    } = await supabase

    .from("jobs")

    .select("*")

    .eq("status","active")

    .order("created_at",{

        ascending:false

    })

    .limit(8);

    if(error){

        latestJobs.innerHTML =
        "<p>Unable to load jobs.</p>";

        return;

    }

    if(!data.length){

        latestJobs.innerHTML =
        "<p>No jobs available.</p>";

        return;

    }

    latestJobs.innerHTML = "";

    data.forEach(job=>{

        latestJobs.innerHTML +=

`
<article class="job-card">

<span class="job-type">

${job.category || "General"}

</span>

<h3>

${job.title}

</h3>

<p>

<i class="fa-solid fa-location-dot"></i>

${job.state || "Unknown"},
${job.country}

</p>

<p>

<i class="fa-solid fa-money-bill-wave"></i>

${job.salary || "Negotiable"}

</p>

<div class="job-footer">

<span>

${new Date(job.created_at)
.toLocaleDateString()}

</span>

<a href="job.html?id=${job.id}">

View Job

</a>

</div>

</article>

`;

    });

}

//==============================
// RECENT BUSINESSES
//==============================

async function loadRecentBusinesses(){

    if(!recentBusinesses) return;

    recentBusinesses.innerHTML =
    `<p class="loading">Loading businesses...</p>`;

    const {

        data,

        error

    } = await supabase

    .from("businesses")

    .select("*")

    .eq("status","active")

    .order("created_at",{

        ascending:false

    })

    .limit(6);

    if(error){

        recentBusinesses.innerHTML =
        "<p>Unable to load businesses.</p>";

        return;

    }

    recentBusinesses.innerHTML = "";

    data.forEach(business=>{

        recentBusinesses.innerHTML +=

`
<article class="business-card">

<img
src="${business.logo_url || "assets/default-business.jpg"}"
alt="${business.business_name}">

<div class="business-content">

<span class="business-category">

${business.categories?.[0] || "Business"}

</span>

<h3>

${business.business_name}

</h3>

<p>

${business.description?.substring(0,120) || ""}

...

</p>

<div class="business-meta">

<span>

<i class="fa-solid fa-location-dot"></i>

${business.state},
${business.country}

</span>

<span>

<i class="fa-solid fa-eye"></i>

${business.views || 0}

</span>

</div>

<a
href="business.html?slug=${business.slug}"
class="business-btn">

View Business

</a>

</div>

</article>

`;

    });

}

//==============================
// LOAD CATEGORIES
//==============================

async function loadCategories(){

    if(!categoriesGrid) return;

    const {

        data,

        error

    } = await supabase

    .from("businesses")

    .select("categories")

    .eq("status","active");

    if(error) return;

    const categories = new Set();

    data.forEach(item=>{

        if(Array.isArray(item.categories)){

            item.categories.forEach(category=>{

                if(category){

                    categories.add(category);

                }

            });

        }

    });

    categoriesGrid.innerHTML = "";

    [...categories]
    .sort()
    .forEach(category=>{

        categoriesGrid.innerHTML +=

`
<a
href="businesses.html?category=${encodeURIComponent(category)}"
class="category-card">

<i class="fa-solid fa-layer-group"></i>

<h3>

${category}

</h3>

<p>

Browse businesses

</p>

</a>

`;

    });

}

//==============================
// LOAD COUNTRIES
//==============================

async function loadCountries(){

    if(!countriesGrid) return;

    const {

        data,

        error

    } = await supabase

    .from("businesses")

    .select("country")

    .eq("status","active");

    if(error) return;

    const countries = new Set();

    data.forEach(item=>{

        if(item.country){

            countries.add(item.country);

        }

    });

    countriesGrid.innerHTML = "";

    [...countries]
    .sort()
    .forEach(country=>{

        countriesGrid.innerHTML +=

`
<a
href="businesses.html?country=${encodeURIComponent(country)}"
class="country-card">

<h4>

${country}

</h4>

<p>

Explore Listings

</p>

</a>

`;

    });

}

//==============================
// INITIALIZE
//==============================

loadLatestJobs();

loadRecentBusinesses();

loadCategories();

loadCountries();
//======================================================
// index.js (Part 3)
// WorkBridge Africa
//======================================================

//==============================
// SMART SEARCH
//==============================

async function smartSearch(keyword){

    keyword = keyword.trim();

    if(keyword === "") return;

    // Check Businesses First

    const {

        data: businesses,

        error: businessError

    } = await supabase

    .from("businesses")

    .select("id")

    .eq("status","active")

    .or(`business_name.ilike.%${keyword}%,description.ilike.%${keyword}%`)

    .limit(1);

    if(!businessError && businesses.length){

        window.location.href =

        `businesses.html?search=${encodeURIComponent(keyword)}`;

        return;

    }

    // Check Jobs

    const {

        data: jobs,

        error: jobError

    } = await supabase

    .from("jobs")

    .select("id")

    .eq("status","active")

    .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)

    .limit(1);

    if(!jobError && jobs.length){

        window.location.href =

        `jobs.html?search=${encodeURIComponent(keyword)}`;

        return;

    }

    alert(

        "No businesses or jobs found."

    );

}

//==============================
// SEARCH FORM
//==============================

searchForm?.addEventListener(

"submit",

async(e)=>{

    e.preventDefault();

    await smartSearch(

        searchInput.value

    );

});

//==============================
// NEWSLETTER
//==============================

const newsletterForm =

document.getElementById(

"newsletterForm"

);

newsletterForm?.addEventListener(

"submit",

function(e){

    e.preventDefault();

    const email =

    this.querySelector(

    "input"

    ).value.trim();

    if(email===""){

        return;

    }

    alert(

`Thank you for subscribing!

You'll receive updates from WorkBridge Africa.`

);

    this.reset();

});

//==============================
// SCROLL TO TOP
//==============================

window.addEventListener(

"scroll",

()=>{

    if(window.scrollY > 120){

        document.body.classList.add(

            "scrolled"

        );

    }else{

        document.body.classList.remove(

            "scrolled"

        );

    }

});

//==============================
// IMAGE FALLBACK
//==============================

document.addEventListener(

"error",

(event)=>{

    const element = event.target;

    if(

        element.tagName === "IMG"

    ){

        element.src =

        "assets/default-business.jpg";

    }

},

true);

//==============================
// PAGE INITIALIZATION
//==============================

document.addEventListener(

"DOMContentLoaded",

()=>{

    loadStats();

    loadFeaturedBusinesses();

    loadLatestJobs();

    loadRecentBusinesses();

    loadCategories();

    loadCountries();

});

//======================================================
// END OF index.js
//======================================================
