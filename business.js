//======================================================
// WorkBridge Africa
// business.js (Part 1)
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
// GET SLUG
//==============================

const params = new URLSearchParams(window.location.search);

const slug = params.get("slug");

if (!slug) {

    window.location.href = "businesses.html";

}

//==============================
// DOM
//==============================

const coverImage = document.getElementById("coverImage");

const businessLogo = document.getElementById("businessLogo");

const businessName = document.getElementById("businessName");

const businessCategory = document.getElementById("businessCategory");

const businessDescription = document.getElementById("businessDescription");

const businessLocation = document.getElementById("businessLocation");

const businessViews = document.getElementById("businessViews");

const featuredBadge = document.getElementById("featuredBadge");

const verifiedBadge = document.getElementById("verifiedBadge");

const galleryGrid = document.getElementById("galleryGrid");

const businessJobs = document.getElementById("businessJobs");

const relatedBusinesses = document.getElementById("relatedBusinesses");

const breadcrumbBusinessName =
document.getElementById("breadcrumbBusinessName");

// Contact

const phoneContainer =
document.getElementById("phoneContainer");

const whatsappContainer =
document.getElementById("whatsappContainer");

const telegramContainer =
document.getElementById("telegramContainer");

const emailContainer =
document.getElementById("emailContainer");

const websiteContainer =
document.getElementById("websiteContainer");

const facebookContainer =
document.getElementById("facebookContainer");

const instagramContainer =
document.getElementById("instagramContainer");

const xContainer =
document.getElementById("xContainer");

const addressContainer =
document.getElementById("addressContainer");

//==============================
// GLOBAL BUSINESS
//==============================

let business = null;

//==============================
// LOAD BUSINESS
//==============================

async function loadBusiness(){

    const {

        data,

        error

    }

    = await supabase

    .from("businesses")

    .select(`
        id,
        owner_id,
        business_name,
        description,
        categories,
        country,
        state,
        lga,
        address,
        phone,
        whatsapp,
        telegram,
        email,
        website,
        facebook,
        instagram,
        x,
        logo_url,
        images,
        verified,
        views,
        featured_until,
        slug,
        created_at
    `)

    .eq("slug",slug)

    .eq("status","active")

    .single();

    if(error || !data){

        window.location.href = "404.html";

        return;

    }

    business = data;

    renderBusiness();

    await Promise.all([

        incrementViews(),

        loadBusinessJobs(),

        loadRelatedBusinesses()

    ]);

}

//==============================
// RENDER BUSINESS
//==============================

function renderBusiness(){

    document.title =
    `${business.business_name} | 🌍 WorkBridge Africa`;

    coverImage.src =
    business.images?.length
    ? business.images[0]
    : "assets/default-cover.webp";

    businessLogo.src =
    business.logo_url ||
    "assets/default-business.webp";

    businessName.textContent =
    business.business_name;

    breadcrumbBusinessName.textContent =
    business.business_name;

    businessDescription.textContent =
    business.description || "";

    // Categories

    businessCategory.innerHTML = "";

    if(Array.isArray(business.categories)){

        business.categories.forEach(category=>{

            businessCategory.innerHTML +=

            `<span class="category-badge">

            ${category}

            </span>`;

        });

    }

    // Location

    businessLocation.innerHTML =

    `<i class="fa-solid fa-location-dot"></i>

    ${[
        business.lga,
        business.state,
        business.country
    ]

    .filter(Boolean)

    .join(", ")}`;

    businessViews.innerHTML =

    `<i class="fa-solid fa-eye"></i>

    ${business.views || 0} views`;

    // Verified

    if(business.verified){

        verifiedBadge.classList.remove("hidden");

    }

    // Featured

    if(

        business.featured_until &&

        new Date(

            business.featured_until

        ) > new Date()

    ){

        featuredBadge.classList.remove("hidden");

    }

    renderGallery();

    renderContacts();

    updateSEO();

}
//======================================================
// business.js (Part 2)
//======================================================

//==============================
// GALLERY
//==============================

function renderGallery(){

    galleryGrid.innerHTML = "";

    if(

        !business.images ||

        business.images.length === 0

    ){

        galleryGrid.innerHTML =

        `<p>No gallery images available.</p>`;

        return;

    }

    business.images.forEach(image=>{

        const img = document.createElement("img");

        img.src = image;

        img.loading = "lazy";

        img.alt = business.business_name;

        img.addEventListener(

            "click",

            ()=>openImage(image)

        );

        galleryGrid.appendChild(img);

    });

}

//==============================
// CONTACT INFORMATION
//==============================

function renderContacts(){

    // Phone

    if(business.phone){

        phoneContainer.innerHTML =

        `
        <a href="tel:${business.phone}">
            <i class="fa-solid fa-phone"></i>
            ${business.phone}
        </a>
        `;

    }

    // WhatsApp

    if(business.whatsapp){

        const whatsapp =

        business.whatsapp.replace(/\D/g,"");

        whatsappContainer.innerHTML =

        `
        <a
        target="_blank"
        href="https://wa.me/${whatsapp}">

            <i class="fa-brands fa-whatsapp"></i>

            Chat on WhatsApp

        </a>
        `;

    }

    // Telegram

    if(business.telegram){

        telegramContainer.innerHTML =

        `
        <a
        target="_blank"
        href="https://t.me/${business.telegram.replace("@","")}">

            <i class="fa-brands fa-telegram"></i>

            @${business.telegram.replace("@","")}

        </a>
        `;

    }

    // Email

    if(business.email){

        emailContainer.innerHTML =

        `
        <a href="mailto:${business.email}">

            <i class="fa-solid fa-envelope"></i>

            ${business.email}

        </a>
        `;

    }

    // Website

    if(business.website){

        websiteContainer.innerHTML =

        `
        <a
        target="_blank"
        href="${business.website}">

            <i class="fa-solid fa-globe"></i>

            Visit Website

        </a>
        `;

    }

    // Facebook

    if(business.facebook){

        facebookContainer.innerHTML =

        `
        <a
        target="_blank"
        href="${business.facebook}">

            <i class="fa-brands fa-facebook"></i>

            Facebook

        </a>
        `;

    }

    // Instagram

    if(business.instagram){

        instagramContainer.innerHTML =

        `
        <a
        target="_blank"
        href="${business.instagram}">

            <i class="fa-brands fa-instagram"></i>

            Instagram

        </a>
        `;

    }

    // X

    if(business.x){

        xContainer.innerHTML =

        `
        <a
        target="_blank"
        href="${business.x}">

            <i class="fa-brands fa-x-twitter"></i>

            X

        </a>
        `;

    }

    // Address

    if(

        business.address ||

        business.lga ||

        business.state

    ){

        addressContainer.innerHTML =

        `
        <div class="address">

            <i class="fa-solid fa-location-dot"></i>

            <span>

            ${[
                business.address,
                business.lga,
                business.state,
                business.country
            ]

            .filter(Boolean)

            .join(", ")}

            </span>

        </div>
        `;

    }

}

//==============================
// VIEW COUNTER
//==============================

async function incrementViews(){

    try{

        await supabase

        .from("businesses")

        .update({

            views:

            (business.views || 0) + 1

        })

        .eq("id",business.id);

    }

    catch(error){

        console.error(error);

    }

}

//==============================
// SEO
//==============================

function updateSEO(){

    const description =

    business.description ||

    "";

    document

    .querySelector(

        'meta[name="description"]'

    )

    ?.setAttribute(

        "content",

        description.substring(0,160)

    );

    document

    .querySelector(

        'meta[property="og:title"]'

    )

    ?.setAttribute(

        "content",

        business.business_name

    );

    document

    .querySelector(

        'meta[property="og:description"]'

    )

    ?.setAttribute(

        "content",

        description.substring(0,160)

    );

    document

    .querySelector(

        'meta[property="og:image"]'

    )

    ?.setAttribute(

        "content",

        business.logo_url ||

        "assets/default-business.webp"

    );

    // JSON-LD

    const schema = {

        "@context":"https://schema.org",

        "@type":"LocalBusiness",

        name:business.business_name,

        image:business.logo_url,

        description,

        telephone:business.phone,

        email:business.email,

        url:business.website,

        address:{

            "@type":"PostalAddress",

            streetAddress:business.address,

            addressLocality:business.lga,

            addressRegion:business.state,

            addressCountry:business.country

        }

    };

    document

    .getElementById(

        "structuredData"

    )

    .textContent =

    JSON.stringify(schema);

}
//======================================================
// business.js (Part 3)
//======================================================

//==============================
// LOAD BUSINESS JOBS
//==============================

async function loadBusinessJobs(){

    const {

        data,

        error

    } = await supabase

    .from("jobs")

    .select(`
        id,
        title,
        description,
        category,
        state,
        lga,
        salary,
        phone,
        whatsapp,
        email,
        created_at
    `)

    .eq("owner_id", business.owner_id)

    .eq("status","active")

    .order("created_at",{

        ascending:false

    });

    if(error){

        console.error(error);

        return;

    }

    businessJobs.innerHTML = "";

    if(!data.length){

        businessJobs.innerHTML =

        `<p>No jobs have been posted yet.</p>`;

        return;

    }

    data.forEach(job=>{

        const card = document.createElement("article");

        card.className = "job-card";

        card.innerHTML =

        `
        <h3>

            ${job.title}

        </h3>

        <p>

            ${(job.description || "")
            .substring(0,150)}...

        </p>

        <p>

            <strong>Category:</strong>

            ${job.category || "General"}

        </p>

        <p>

            <strong>Location:</strong>

            ${[
                job.lga,
                job.state
            ]

            .filter(Boolean)

            .join(", ")}

        </p>

        ${job.salary ?

        `<p>

        <strong>Salary:</strong>

        ${job.salary}

        </p>`

        :

        ""}

        <a

        href="job.html?id=${job.id}">

        View Job →

        </a>

        `;

        businessJobs.appendChild(card);

    });

}

//==============================
// RELATED BUSINESSES
//==============================

async function loadRelatedBusinesses(){

    if(

        !business.categories ||

        business.categories.length===0

    ){

        return;

    }

    const {

        data,

        error

    }

    = await supabase

    .from("businesses")

    .select(`
        business_name,
        slug,
        logo_url,
        state,
        country,
        verified,
        featured_until
    `)

    .contains(

        "categories",

        [business.categories[0]]

    )

    .neq("id",business.id)

    .eq("status","active")

    .limit(6);

    if(error){

        console.error(error);

        return;

    }

    relatedBusinesses.innerHTML = "";

    data.forEach(item=>{

        const featured =

        item.featured_until &&

        new Date(item.featured_until)

        > new Date();

        relatedBusinesses.innerHTML +=

        `
        <article class="related-business">

            <img

            src="${item.logo_url ||

            'assets/default-business.webp'}"

            loading="lazy"

            alt="${item.business_name}">

            <div class="related-content">

                <h3>

                ${item.business_name}

                </h3>

                <p>

                ${item.state},

                ${item.country}

                </p>

                ${item.verified ?

                `<span class="verified">

                ✔ Verified

                </span>`

                :

                ""}

                ${featured ?

                `<span class="featured">

                ⭐ Featured

                </span>`

                :

                ""}

                <br><br>

                <a

                href="business.html?slug=${item.slug}">

                View Business →

                </a>

            </div>

        </article>

        `;

    });

}

//==============================
// REPORT BUSINESS
//==============================

document

.getElementById("reportButton")

.addEventListener(

"click",

async(event)=>{

    event.preventDefault();

    const reason =

    prompt(

"Why are you reporting this business?"

    );

    if(

        !reason ||

        !reason.trim()

    ){

        return;

    }

    const {

        error

    }

    = await supabase

    .from("reports")

    .insert({

        business_id:

        business.id,

        reason:

        reason.trim()

    });

    if(error){

        alert(

        "Unable to submit report."

        );

        console.error(error);

        return;

    }

    alert(

    "Thank you. Your report has been submitted."

    );

});

//==============================
// IMAGE LIGHTBOX
//==============================

function openImage(src){

    let modal =

    document.querySelector(

    ".image-modal"

    );

    if(!modal){

        modal =

        document.createElement("div");

        modal.className =

        "image-modal";

        modal.innerHTML =

        `
        <button>

        <i class="fa-solid fa-xmark"></i>

        </button>

        <img>

        `;

        document.body.appendChild(modal);

        modal.querySelector("button")

        .onclick=()=>{

            modal.classList.remove(

            "active"

            );

        };

        modal.onclick=(event)=>{

            if(event.target===modal){

                modal.classList.remove(

                "active"

                );

            }

        };

    }

    modal.querySelector("img").src = src;

    modal.classList.add("active");

}

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
// INITIALIZE
//==============================

loadBusiness();
