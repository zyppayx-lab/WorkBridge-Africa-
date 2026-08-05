//======================================================
// WorkBridge Africa
// index.js (Part 1)
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

const businessCount =
document.getElementById("businessCount");

const jobCount =
document.getElementById("jobCount");

const categoriesGrid =
document.getElementById("categoriesGrid");

const countriesGrid =
document.getElementById("countriesGrid");

const searchForm =
document.getElementById("searchForm");

const searchInput =
document.getElementById("searchInput");

const newsletterForm =
document.getElementById("newsletterForm");

const menuButton =
document.getElementById("menuButton");

const mobileMenu =
document.getElementById("mobileMenu");

//==============================
// MOBILE MENU
//==============================

menuButton?.addEventListener("click", () => {

    mobileMenu?.classList.toggle("active");

});

//==============================
// PLATFORM STATS
//==============================

async function loadStats(){

    try{

        if(businessCount){

            businessCount.textContent = "...";

        }

        if(jobCount){

            jobCount.textContent = "...";

        }

        const {

            count: businesses,
            error: businessError

        } = await supabase

        .from("businesses")

        .select("id",{

            count:"exact",
            head:true

        })

        .eq("status","active");

        if(businessError){

            console.error(businessError);

        }

        const {

            count: jobs,
            error: jobError

        } = await supabase

        .from("jobs")

        .select("id",{

            count:"exact",
            head:true

        })

        .eq("status","active");

        if(jobError){

            console.error(jobError);

        }

        if(businessCount){

            businessCount.textContent =
            businesses ?? 0;

        }

        if(jobCount){

            jobCount.textContent =
            jobs ?? 0;

        }

    }

    catch(error){

        console.error(error);

        if(businessCount){

            businessCount.textContent = "0";

        }

        if(jobCount){

            jobCount.textContent = "0";

        }

    }

}
//======================================================
// index.js (Part 2)
// WorkBridge Africa
//======================================================

//==============================
// LOAD CATEGORIES
//==============================

async function loadCategories(){

    if(!categoriesGrid) return;

    try{

        const {

            data,
            error

        } = await supabase

        .from("businesses")

        .select("categories")

        .eq("status","active");

        if(error){

            console.error(error);
            return;

        }

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

            categoriesGrid.innerHTML += `

<a
href="businesses.html?category=${encodeURIComponent(category)}"
class="category-card">

<i class="fa-solid fa-layer-group"></i>

<h3>${category}</h3>

<p>Browse Businesses</p>

</a>

`;

        });

    }

    catch(error){

        console.error(error);

    }

}

//==============================
// LOAD COUNTRIES
//==============================

async function loadCountries(){

    if(!countriesGrid) return;

    try{

        const {

            data,
            error

        } = await supabase

        .from("businesses")

        .select("country")

        .eq("status","active");

        if(error){

            console.error(error);
            return;

        }

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

            countriesGrid.innerHTML += `

<a
href="businesses.html?country=${encodeURIComponent(country)}"
class="country-card">

<h4>${country}</h4>

<p>Explore Listings</p>

</a>

`;

        });

    }

    catch(error){

        console.error(error);

    }

}

//==============================
// SMART SEARCH
//==============================

function smartSearch(keyword){

    keyword = keyword.trim();

    if(keyword === "") return;

    window.location.href =
`search.html?q=${encodeURIComponent(keyword)}`;

}
//======================================================
// index.js (Part 3)
// WorkBridge Africa
//======================================================

//==============================
// SEARCH FORM
//==============================

searchForm?.addEventListener(

"submit",

function(e){

    e.preventDefault();

    smartSearch(

        searchInput.value

    );

}

);

//==============================
// SCROLL EFFECT
//==============================

window.addEventListener(

"scroll",

()=>{

    if(window.scrollY > 120){

        document.body.classList.add(
            "scrolled"
        );

    }

    else{

        document.body.classList.remove(
            "scrolled"
        );

    }

}

);

//==============================
// IMAGE FALLBACK
//==============================

document.addEventListener(

"error",

(event)=>{

    const element = event.target;

    if(element.tagName === "IMG"){

        element.src =
        "assets/default-business.jpg";

    }

},

true

);

//==============================
// PAGE INITIALIZATION
//==============================

document.addEventListener(

"DOMContentLoaded",

async()=>{

    await loadStats();

    await loadCategories();

    await loadCountries();

}

);

//======================================================
// END OF index.js
//======================================================
