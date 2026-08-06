//======================================================
// WorkBridge Africa
// search.js
//======================================================

//==============================
// SUPABASE CONFIG
//==============================

const SUPABASE_URL =
"https://razemjveqtmnutvluxab.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJyYXplbWp2ZXF0bW51dHZsdXhhYiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzg1NzUxODEzLCJleHAiOjIxMDEzMjc4MTN9.e7JhaJ6DEZsH3WNUYGjdk8TvdsITNDKgLIzkbcLk-Yw";

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

//==============================
// DOM
//==============================

const searchForm =
document.getElementById(
"searchForm"
);

const searchInput =
document.getElementById(
"searchInput"
);

const searchText =
document.getElementById(
"searchText"
);

const businessResults =
document.getElementById(
"businessResults"
);

const jobResults =
document.getElementById(
"jobResults"
);

const businessSection =
document.getElementById(
"businessSection"
);

const jobSection =
document.getElementById(
"jobSection"
);

//==============================
// GET SEARCH QUERY
//==============================

const params =
new URLSearchParams(
window.location.search
);

let keyword =
params.get("q") || "";

keyword =
keyword.trim();

//==============================
// LOAD BUSINESS RESULTS
//==============================

async function searchBusinesses() {

    if (!keyword) return;

    const { data, error } = await supabase.rpc(
        "search_businesses",
        {
            search_term: keyword
        }
    );

    if (error) {
        console.error(error);
        businessResults.innerHTML =
            "<p>Unable to load businesses.</p>";
        return;
    }

    if (!data || data.length === 0) {
        businessSection.style.display = "none";
        return;
    }

    businessSection.style.display = "block";
    businessResults.innerHTML = "";

    data.forEach(business => {

        businessResults.innerHTML += `

<article class="business-card">

<img
src="${business.logo_url || "assets/default-business.jpg"}"
alt="${business.business_name}">

<div class="business-content">

<span class="business-category">
${business.categories?.[0] || "Business"}
</span>

<h3>${business.business_name}</h3>

<p>
${business.description
? business.description.substring(0,120) + "..."
: "No description available."}
</p>

<div class="business-meta">

<span>
<i class="fa-solid fa-location-dot"></i>
${business.state}, ${business.country}
</span>

<span>
<i class="fa-solid fa-eye"></i>
${business.views}
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
// SEARCH JOBS
//==============================

async function searchJobs() {

    if (!keyword) return;

    const { data, error } = await supabase.rpc(
        "search_jobs",
        {
            search_term: keyword
        }
    );

    if (error) {
        console.error(error);
        jobResults.innerHTML =
            "<p>Unable to load jobs.</p>";
        return;
    }

    if (!data || data.length === 0) {
        jobSection.style.display = "none";
        return;
    }

    jobSection.style.display = "block";
    jobResults.innerHTML = "";

    data.forEach(job => {

        jobResults.innerHTML += `

<article class="job-card">

<span class="job-type">
${job.category || "General"}
</span>

<h3>${job.title}</h3>

<p>
<i class="fa-solid fa-location-dot"></i>
${job.state}, ${job.country}
</p>

<p>
<i class="fa-solid fa-money-bill-wave"></i>
${job.salary || "Negotiable"}
</p>

<div class="job-footer">

<span>
${new Date(job.created_at).toLocaleDateString()}
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
// SEARCH FORM
//==============================

searchForm?.addEventListener(

"submit",

(e)=>{

e.preventDefault();  


const value =  
searchInput.value.trim();  


if(value){  

    window.location.href =  
    `search.html?q=${encodeURIComponent(value)}`;  

}

}

);

//==============================
// DISPLAY SEARCH TERM
//==============================

if(searchText){

searchText.textContent =  
keyword  
? `Search results for "${keyword}"`  
: "Search WorkBridge Africa";

}

//==============================
// MOBILE MENU
//==============================

const menuButton =
document.getElementById(
"menuButton"
);

const mobileMenu =
document.getElementById(
"mobileMenu"
);

menuButton?.addEventListener(

"click",

()=>{

mobileMenu?.classList.toggle(  
    "active"  
);

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


if(element.tagName==="IMG"){  

    element.src =  
    "assets/default-business.jpg";  

}

},

true

);

//==============================
// PAGE START
//==============================

document.addEventListener(

"DOMContentLoaded",

async()=>{

if(searchInput){  

    searchInput.value =  
    keyword;  

}  



await searchBusinesses();  


await searchJobs();

}

);

//======================================================
// END OF search.js
//======================================================
