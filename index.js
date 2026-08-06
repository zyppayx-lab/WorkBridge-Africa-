//======================================================
// WorkBridge Africa
// index.js
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

const businessCount =
document.getElementById(
    "businessCount"
);


const jobCount =
document.getElementById(
    "jobCount"
);


const countryCount =
document.getElementById(
    "countryCount"
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
// HARD CODED COUNTRIES
//==============================

function loadCountryCount(){

    if(countryCount){

        countryCount.textContent =
        "54";

    }

}



//==============================
// LOAD BUSINESS COUNT
//==============================

async function loadBusinessCount(){


    if(!businessCount){

        return;

    }


    try{


        const {

            count,
            error

        } = await supabaseClient

        .from("businesses")

        .select(
            "id",
            {
                count:"exact",
                head:true
            }
        )

        .eq(
            "status",
            "active"
        );



        if(error){

            console.error(
                "Business count error:",
                error
            );

            businessCount.textContent =
            "0";

            return;

        }



        businessCount.textContent =
        count ?? 0;



    }

    catch(error){

        console.error(error);

        businessCount.textContent =
        "0";

    }


}
//======================================================
// WorkBridge Africa
// index.js
// Part 2
//======================================================


//==============================
// LOAD JOB COUNT
//==============================

async function loadJobCount(){


    if(!jobCount){

        return;

    }


    try{


        const {

            count,
            error

        } = await supabaseClient

        .from("jobs")

        .select(
            "id",
            {
                count:"exact",
                head:true
            }
        )

        .eq(
            "status",
            "active"
        );



        if(error){

            console.error(
                "Job count error:",
                error
            );

            jobCount.textContent =
            "0";

            return;

        }



        jobCount.textContent =
        count ?? 0;



    }

    catch(error){

        console.error(error);

        jobCount.textContent =
        "0";

    }


}




//==============================
// SEARCH REDIRECT
//==============================

searchForm?.addEventListener(

"submit",

(event)=>{


    event.preventDefault();



    const keyword =
    searchInput.value.trim();



    if(keyword === ""){

        return;

    }



    window.location.href =
    "search.html?q=" +
    encodeURIComponent(keyword);



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
// START PAGE
//==============================

document.addEventListener(

"DOMContentLoaded",

()=>{


    loadBusinessCount();


    loadJobCount();


    loadCountryCount();



}

);


//======================================================
// END PART 2
//======================================================
//======================================================
// WorkBridge Africa
// index.js
// Part 3
//======================================================


//==============================
// SMOOTH SCROLL LINKS
//==============================

document.querySelectorAll(
    'a[href^="#"]'
)
.forEach(link=>{


    link.addEventListener(
    "click",
    function(event){


        const target =
        document.querySelector(
            this.getAttribute("href")
        );


        if(target){

            event.preventDefault();


            target.scrollIntoView({

                behavior:"smooth"

            });

        }


    });

});




//==============================
// ACTIVE NAV LINK
//==============================

const currentPage =
window.location.pathname;


document.querySelectorAll(
    ".nav-links a"
)
.forEach(link=>{


    if(
        link.getAttribute("href") === currentPage.split("/").pop()
    ){

        link.classList.add(
            "active"
        );

    }


});




//==============================
// PAGE ERROR HANDLING
//==============================

window.addEventListener(

"unhandledrejection",

(event)=>{

    console.error(
        "Unhandled error:",
        event.reason
    );

}

);




//==============================
// FINAL START
//==============================

console.log(
"WorkBridge Africa frontend loaded successfully 🌍"
);


//======================================================
// END OF index.js
//======================================================
