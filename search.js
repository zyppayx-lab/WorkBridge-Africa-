//======================================================
// WorkBridge Africa
// search.js
// Part 1
//======================================================


//==============================
// SUPABASE CONFIG
//==============================

const SUPABASE_URL =
"https://razemjveqtmnutvluxab.supabase.co";


const SUPABASE_ANON_KEY =
"sb_publishable_2utxbSM-OS6QTitKo6MobA_spBvL_2r";


const supabaseClient =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);




//==============================
// DOM ELEMENTS
//==============================

const searchForm =
document.getElementById(
    "searchForm"
);


const searchInput =
document.getElementById(
    "searchInput"
);


const searchTitle =
document.getElementById(
    "searchTitle"
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


const noResults =
document.getElementById(
    "noResults"
);


const menuButton =
document.getElementById(
    "menuButton"
);


const mobileMenu =
document.getElementById(
    "mobileMenu"
);




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
// DISPLAY TITLE
//==============================

if(searchTitle){

    searchTitle.textContent =
    keyword
    ? `Results for "${keyword}"`
    : "Search WorkBridge Africa";

}


if(searchInput){

    searchInput.value =
    keyword;

}
//======================================================
// WorkBridge Africa
// search.js
// Part 2
//======================================================



//==============================
// SEARCH BUSINESSES
//==============================

async function searchBusinesses(){


    if(!keyword){

        return;

    }



    try{


        const {

            data,
            error

        } = await supabaseClient


        .from("businesses")


        .select("*")


        .eq(
            "status",
            "active"
        )


        .or(
`business_name.ilike.%${keyword}%,description.ilike.%${keyword}%,state.ilike.%${keyword}%,country.ilike.%${keyword}%`
)


        .limit(20);




        if(error){

            console.error(error);

            return;

        }




        if(!data || data.length === 0){

            businessSection.style.display =
            "none";

            return;

        }




        businessResults.innerHTML = "";




        data.forEach(
        business=>{


            businessResults.innerHTML += `


<article class="result-card">


<h3>

${business.business_name}

</h3>



<p>

${business.description || "No description available."}

</p>



<span>

<i class="fa-solid fa-location-dot"></i>

${business.state || ""}

${business.country || ""}

</span>



<a href="business.html?slug=${business.slug}">

View Business

</a>


</article>


`;

        });


    }


    catch(error){

        console.error(error);

    }


}






//==============================
// SEARCH JOBS
//==============================

async function searchJobs(){


    if(!keyword){

        return;

    }




    try{


        const {

            data,
            error

        } = await supabaseClient



        .from("jobs")



        .select("*")



        .eq(

            "status",

            "active"

        )



        .or(
`title.ilike.%${keyword}%,description.ilike.%${keyword}%,category.ilike.%${keyword}%,state.ilike.%${keyword}%,country.ilike.%${keyword}%`
)



        .limit(20);




        if(error){

            console.error(error);

            return;

        }



        if(!data || data.length === 0){

            jobSection.style.display =
            "none";

            return;

        }



        jobResults.innerHTML = "";



        data.forEach(
        job=>{


            jobResults.innerHTML += `


<article class="result-card">


<h3>

${job.title}

</h3>



<p>

${job.description || "No description available."}

</p>



<span>

<i class="fa-solid fa-location-dot"></i>

${job.state || ""}

${job.country || ""}

</span>



<a href="job.html?id=${job.id}">

View Job

</a>


</article>


`;


        });



    }


    catch(error){

        console.error(error);

    }


}
//======================================================
// WorkBridge Africa
// search.js
// Part 3
//======================================================


//==============================
// SEARCH FORM REDIRECT
//==============================

searchForm?.addEventListener(

"submit",

(event)=>{


    event.preventDefault();



    const value =
    searchInput.value.trim();



    if(value === ""){

        return;

    }



    window.location.href =
    "search.html?q=" +
    encodeURIComponent(value);



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



    if(
        element.tagName === "IMG"
    ){

        element.src =
        "assets/default-business.jpg";

    }


},

true

);





//==============================
// LOAD SEARCH RESULTS
//==============================

document.addEventListener(

"DOMContentLoaded",

async()=>{


    if(!keyword){

        if(noResults){

            noResults.style.display =
            "block";

        }


        if(
            document.getElementById("loadingMessage")
        ){

            document.getElementById(
                "loadingMessage"
            ).style.display =
            "none";

        }


        return;

    }



    await searchBusinesses();



    await searchJobs();




    const businessesFound =
    businessResults &&
    businessResults.children.length > 0;



    const jobsFound =
    jobResults &&
    jobResults.children.length > 0;



    if(!businessesFound && !jobsFound){


        if(noResults){

            noResults.style.display =
            "block";

        }


    }




    const loading =
    document.getElementById(
        "loadingMessage"
    );



    if(loading){

        loading.style.display =
        "none";

    }



});




//======================================================
// END OF search.js
//======================================================
