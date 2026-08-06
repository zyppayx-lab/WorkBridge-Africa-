//======================================================
// WorkBridge Africa
// index.js
//======================================================


//==============================
// SUPABASE CONFIG
//==============================

const SUPABASE_URL =
"https://razemjveqtmnutvluxab.supabase.co";


const SUPABASE_ANON_KEY =
"YOUR_SUPABASE_ANON_KEY";


const supabase =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);



//==============================
// DOM
//==============================

const businessCount =
document.getElementById(
    "businessCount"
);


const jobCount =
document.getElementById(
    "jobCount"
);


const searchForm =
document.getElementById(
    "searchForm"
);


const searchInput =
document.getElementById(
    "searchInput"
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
// LOAD PLATFORM STATS
//==============================

async function loadStats(){

    try{


        const {
            count: businesses
        } = await supabase

        .from("businesses")

        .select("id", {
            count:"exact",
            head:true
        })

        .eq(
            "status",
            "active"
        );



        const {
            count: jobs
        } = await supabase

        .from("jobs")

        .select("id", {
            count:"exact",
            head:true
        })

        .eq(
            "status",
            "active"
        );



        if(businessCount){

            businessCount.textContent =
            businesses || 0;

        }



        if(jobCount){

            jobCount.textContent =
            jobs || 0;

        }



    }

    catch(error){

        console.error(
            "Stats error:",
            error
        );


        if(businessCount){

            businessCount.textContent =
            "0";

        }


        if(jobCount){

            jobCount.textContent =
            "0";

        }

    }

}





//==============================
// SEARCH REDIRECT
//==============================

searchForm?.addEventListener(
"submit",
(e)=>{


    e.preventDefault();



    const keyword =
    searchInput.value.trim();



    if(!keyword){

        return;

    }



    window.location.href =
    `search.html?q=${encodeURIComponent(keyword)}`;



});





//==============================
// START
//==============================

document.addEventListener(
"DOMContentLoaded",
()=>{


    loadStats();


});
