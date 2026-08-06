//======================================================
// WorkBridge Africa
// businesses.js
// Part 1
//======================================================


//==============================
// SUPABASE CONFIG
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
document.getElementById(
    "businessGrid"
);


const searchForm =
document.getElementById(
    "businessSearchForm"
);


const searchInput =
document.getElementById(
    "businessSearchInput"
);


const businessCount =
document.getElementById(
    "businessCount"
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
// LOAD BUSINESSES
//==============================

async function loadBusinesses(
keyword = ""
){


    if(!businessGrid){

        return;

    }


    businessGrid.innerHTML =

    `
    <p class="loading">
    Loading businesses...
    </p>
    `;



    let query =
    supabase

    .from("businesses")

    .select("*")

    .eq(
        "status",
        "active"
    );




    if(keyword){


        query =
        query.or(

        `
        business_name.ilike.%${keyword}%,
        description.ilike.%${keyword}%,
        state.ilike.%${keyword}%,
        country.ilike.%${keyword}%
        `

        );


    }



    const {

        data,
        error

    } = await query;




    if(error){

        console.error(error);

        businessGrid.innerHTML =

        `
        <p>
        Unable to load businesses.
        </p>
        `;

        return;

    }




    if(!data || data.length === 0){


        businessGrid.innerHTML =

        `
        <p>
        No businesses found.
        </p>
        `;


        return;

    }




    // Ranking:
    // 1. Featured
    // 2. Verified
    // 3. Normal


    data.sort(
    (a,b)=>{


        const featuredA =
        a.featured_until &&
        new Date(a.featured_until) > new Date()
        ? 1 : 0;


        const featuredB =
        b.featured_until &&
        new Date(b.featured_until) > new Date()
        ? 1 : 0;



        if(featuredA !== featuredB){

            return featuredB - featuredA;

        }



        const verifiedA =
        a.verified ? 1 : 0;


        const verifiedB =
        b.verified ? 1 : 0;



        return verifiedB - verifiedA;


    });



    if(businessCount){

        businessCount.textContent =
        data.length;

    }



    renderBusinesses(data);


}
//======================================================
// WorkBridge Africa
// businesses.js
// Part 2
//======================================================


//==============================
// RENDER BUSINESSES
//==============================

function renderBusinesses(
businesses
){


    businessGrid.innerHTML = "";



    businesses.forEach(
    business=>{


        const isFeatured =

        business.featured_until &&

        new Date(
            business.featured_until
        ) > new Date();



        const isVerified =
        business.verified === true;



        businessGrid.innerHTML += `


<article class="business-card">



<div class="business-image">


<img

src="${
business.logo_url ||
"assets/default-business.jpg"
}"

alt="${business.business_name}">


</div>





<div class="business-content">



<div class="business-badges">


${
isFeatured

?

`
<span class="featured-badge">

<i class="fa-solid fa-star"></i>

Featured

</span>
`

:

""

}



${
isVerified

?

`
<span class="verified-badge">

<i class="fa-solid fa-circle-check"></i>

Verified

</span>
`

:

""

}



</div>





<span class="business-category">

${
Array.isArray(
business.categories
)

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

business.description.substring(
0,
140
)

:

"No description available."

}

</p>





<div class="business-location">


<i class="fa-solid fa-location-dot"></i>


${business.state},

${business.country}


</div>





<div class="business-contact">


<a href="tel:${business.phone}">

<i class="fa-solid fa-phone"></i>

Call

</a>




<a href="business.html?slug=${business.slug}">

View Business

</a>


</div>



</div>



</article>


`;



    });



}
//======================================================
// WorkBridge Africa
// businesses.js
// Part 3
//======================================================


//==============================
// SEARCH FORM
//==============================

searchForm?.addEventListener(

"submit",

(e)=>{

    e.preventDefault();


    const keyword =

    searchInput.value.trim();



    loadBusinesses(
        keyword
    );


}

);




//==============================
// URL SEARCH SUPPORT
//==============================

const params =

new URLSearchParams(
    window.location.search
);



const urlKeyword =

params.get("q") || "";




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
// PAGE START
//==============================

document.addEventListener(

"DOMContentLoaded",

async()=>{


    if(searchInput){

        searchInput.value =
        urlKeyword;

    }



    await loadBusinesses(
        urlKeyword
    );


});



//======================================================
// END OF businesses.js
//======================================================
