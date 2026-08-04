//======================================================
// WorkBridge Africa
// jobs.js
// Part 1
//======================================================

//==============================
// SUPABASE
//==============================

const SUPABASE_URL = "YOUR_SUPABASE_URL";

const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(

    SUPABASE_URL,

    SUPABASE_ANON_KEY

);

//==============================
// DOM
//==============================

const jobsGrid = document.getElementById("jobsGrid");

const emptyState = document.getElementById("emptyState");

const resultCount = document.getElementById("resultCount");

const searchForm = document.getElementById("searchForm");

const searchInput = document.getElementById("searchInput");

const countryFilter = document.getElementById("countryFilter");

const stateFilter = document.getElementById("stateFilter");

const categoryFilter = document.getElementById("categoryFilter");

const sortFilter = document.getElementById("sortFilter");

const previousPage = document.getElementById("previousPage");

const nextPage = document.getElementById("nextPage");

const pageNumber = document.getElementById("pageNumber");

//==============================
// STATE
//==============================

const PAGE_SIZE = 12;

let currentPage = 1;

let totalJobs = 0;

let jobs = [];

//==============================
// INITIALIZE
//==============================

document.getElementById("currentYear").textContent =
new Date().getFullYear();

loadJobs();

loadFilters();

//==============================
// LOAD JOBS
//==============================

async function loadJobs(){

    jobsGrid.innerHTML = `
        <div class="loading">
            Loading jobs...
        </div>
    `;

    const from = (currentPage - 1) * PAGE_SIZE;

    const to = from + PAGE_SIZE - 1;

    let query = supabase

        .from("jobs")

        .select(`
            id,
            owner_id,
            title,
            description,
            category,
            salary,
            phone,
            whatsapp,
            email,
            state,
            lga,
            country,
            created_at,
            featured_until
        `, { count: "exact" })

        .eq("status", "active");

    if(searchInput.value.trim()){

        const keyword = searchInput.value.trim();

        query = query.or(

            `title.ilike.%${keyword}%,

            description.ilike.%${keyword}%,

            category.ilike.%${keyword}%`

        );

    }

    if(countryFilter.value){

        query = query.eq(

            "country",

            countryFilter.value

        );

    }

    if(stateFilter.value){

        query = query.eq(

            "state",

            stateFilter.value

        );

    }

    if(categoryFilter.value){

        query = query.eq(

            "category",

            categoryFilter.value

        );

    }

    switch(sortFilter.value){

        case "salary":

            query = query.order(

                "salary",

                { ascending:false }

            );

            break;

        case "title":

            query = query.order(

                "title",

                { ascending:true }

            );

            break;

        default:

            query = query.order(

                "featured_until",

                { ascending:false, nullsFirst:false }

            );

            query = query.order(

                "created_at",

                { ascending:false }

            );

    }

    const {

        data,

        count,

        error

    } = await query.range(from,to);

    if(error){

        console.error(error);

        jobsGrid.innerHTML = `
            <div class="loading">
                Failed to load jobs.
            </div>
        `;

        return;

    }

    jobs = data || [];

    totalJobs = count || 0;

    await loadBusinesses();

}
//======================================================
// jobs.js
// Part 2
//======================================================

//==============================
// LOAD BUSINESSES
//==============================

async function loadBusinesses(){

    if(jobs.length === 0){

        renderJobs(new Map());

        return;

    }

    const ownerIds = [

        ...new Set(

            jobs

            .map(job => job.owner_id)

            .filter(Boolean)

        )

    ];

    const {

        data,

        error

    } = await supabase

        .from("businesses")

        .select(`
            owner_id,
            business_name,
            logo_url,
            verified,
            featured_until,
            slug,
            state,
            country
        `)

        .in("owner_id", ownerIds);

    if(error){

        console.error(error);

        renderJobs(new Map());

        return;

    }

    const businessMap = new Map();

    (data || []).forEach(business => {

        businessMap.set(

            business.owner_id,

            business

        );

    });

    renderJobs(businessMap);

}

//==============================
// RENDER JOBS
//==============================

function renderJobs(businesses){

    jobsGrid.innerHTML = "";

    if(jobs.length === 0){

        emptyState.classList.remove("hidden");

        resultCount.textContent = "0 Jobs Found";

        pageNumber.textContent = "Page 1";

        previousPage.disabled = true;

        nextPage.disabled = true;

        return;

    }

    emptyState.classList.add("hidden");

    resultCount.textContent =

        `${totalJobs.toLocaleString()} Jobs Found`;

    pageNumber.textContent =

        `Page ${currentPage}`;

    previousPage.disabled =

        currentPage === 1;

    nextPage.disabled =

        currentPage * PAGE_SIZE >= totalJobs;

    jobs.forEach(job => {

        const business =

            businesses.get(job.owner_id);

        const verified =

            business?.verified === true;

        const featured =

            business?.featured_until &&

            new Date(business.featured_until) > new Date();

        const card =

            document.createElement("article");

        card.className = "job-card";

        card.innerHTML = `

<div class="job-header">

    <img

        class="job-logo"

        src="${business?.logo_url || "assets/default-business.webp"}"

        alt="${business?.business_name || "Business"}"

        loading="lazy">

    <div class="job-company">

        <h3>

            ${business?.business_name || "Business"}

        </h3>

        <p>

            ${[job.state, job.country]

                .filter(Boolean)

                .join(", ")}

        </p>

        <div class="badge-group">

            ${verified ? `

            <span class="badge verified">

                ✔ Verified

            </span>

            ` : ""}

            ${featured ? `

            <span class="badge featured">

                ⭐ Featured

            </span>

            ` : ""}

        </div>

    </div>

</div>

<div class="job-body">

    <h2 class="job-title">

        ${job.title}

    </h2>

    <p class="job-description">

        ${(job.description || "")

            .substring(0,180)}...

    </p>

    <div class="job-meta">

        <div class="meta-item">

            <i class="fa-solid fa-layer-group"></i>

            ${job.category || "General"}

        </div>

        <div class="meta-item">

            <i class="fa-solid fa-money-bill-wave"></i>

            ${job.salary || "Negotiable"}

        </div>

        <div class="meta-item">

            <i class="fa-solid fa-location-dot"></i>

            ${[job.lga, job.state]

                .filter(Boolean)

                .join(", ")}

        </div>

        <div class="meta-item">

            <i class="fa-solid fa-calendar"></i>

            ${new Date(job.created_at).toLocaleDateString()}

        </div>

    </div>

    <div class="job-contact">

        ${job.phone ? `

        <a

            href="tel:${job.phone}"

            class="phone-btn">

            <i class="fa-solid fa-phone"></i>

            Call

        </a>

        ` : ""}

        ${job.whatsapp ? `

        <a

            href="https://wa.me/${job.whatsapp.replace(/\D/g,"")}"

            target="_blank"

            class="whatsapp-btn">

            <i class="fa-brands fa-whatsapp"></i>

            WhatsApp

        </a>

        ` : ""}

        ${job.email ? `

        <a

            href="mailto:${job.email}"

            class="email-btn">

            <i class="fa-solid fa-envelope"></i>

            Email

        </a>

        ` : ""}

    </div>

    <div class="job-footer">

        <span class="posted-date">

            ${timeAgo(job.created_at)}

        </span>

        <a

            href="job.html?id=${job.id}"

            class="view-job">

            View Job

        </a>

    </div>

</div>

`;

        jobsGrid.appendChild(card);

    });

}
//======================================================
// jobs.js
// Part 3
//======================================================

//==============================
// LOAD FILTERS
//==============================

async function loadFilters(){

    const { data, error } = await supabase

        .from("jobs")

        .select("country,state,category")

        .eq("status","active");

    if(error){

        console.error(error);

        return;

    }

    const countries = [

        ...new Set(

            (data || [])

            .map(item => item.country)

            .filter(Boolean)

        )

    ].sort();

    const states = [

        ...new Set(

            (data || [])

            .map(item => item.state)

            .filter(Boolean)

        )

    ].sort();

    const categories = [

        ...new Set(

            (data || [])

            .map(item => item.category)

            .filter(Boolean)

        )

    ].sort();

    countries.forEach(country => {

        countryFilter.insertAdjacentHTML(

            "beforeend",

            `<option value="${country}">${country}</option>`

        );

    });

    states.forEach(state => {

        stateFilter.insertAdjacentHTML(

            "beforeend",

            `<option value="${state}">${state}</option>`

        );

    });

    categories.forEach(category => {

        categoryFilter.insertAdjacentHTML(

            "beforeend",

            `<option value="${category}">${category}</option>`

        );

    });

}

//==============================
// TIME AGO
//==============================

function timeAgo(date){

    const seconds = Math.floor(

        (Date.now() - new Date(date).getTime()) / 1000

    );

    const units = [

        ["year",31536000],

        ["month",2592000],

        ["week",604800],

        ["day",86400],

        ["hour",3600],

        ["minute",60]

    ];

    for(const [name,value] of units){

        const amount = Math.floor(seconds / value);

        if(amount >= 1){

            return `${amount} ${name}${amount > 1 ? "s" : ""} ago`;

        }

    }

    return "Just now";

}

//==============================
// EVENTS
//==============================

searchForm.addEventListener("submit", async(event)=>{

    event.preventDefault();

    currentPage = 1;

    await loadJobs();

});

countryFilter.addEventListener("change", async()=>{

    currentPage = 1;

    await loadJobs();

});

stateFilter.addEventListener("change", async()=>{

    currentPage = 1;

    await loadJobs();

});

categoryFilter.addEventListener("change", async()=>{

    currentPage = 1;

    await loadJobs();

});

sortFilter.addEventListener("change", async()=>{

    currentPage = 1;

    await loadJobs();

});

previousPage.addEventListener("click", async()=>{

    if(currentPage <= 1){

        return;

    }

    currentPage--;

    await loadJobs();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

nextPage.addEventListener("click", async()=>{

    if(currentPage * PAGE_SIZE >= totalJobs){

        return;

    }

    currentPage++;

    await loadJobs();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

//==============================
// MOBILE MENU
//==============================

const menuButton = document.getElementById("menuButton");

const mobileMenu = document.getElementById("mobileMenu");

menuButton?.addEventListener("click",()=>{

    mobileMenu.classList.toggle("active");

});
