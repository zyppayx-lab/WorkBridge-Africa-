//======================================================
// WorkBridge Africa
// job.js
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
// EDGE FUNCTION
//==============================

const REPORT_ENDPOINT =

"https://YOUR_PROJECT.supabase.co/functions/v1/report";

//==============================
// URL PARAMETER
//==============================

const params =

new URLSearchParams(

    window.location.search

);

const jobId =

params.get("id");

//==============================
// DOM
//==============================

const companyLogo =

document.getElementById("companyLogo");

const companyName =

document.getElementById("companyName");

const jobTitle =

document.getElementById("jobTitle");

const jobMeta =

document.getElementById("jobMeta");

const jobDescription =

document.getElementById("jobDescription");

const jobRequirements =

document.getElementById("jobRequirements");

const businessDescription =

document.getElementById("businessDescription");

const verifiedBadge =

document.getElementById("verifiedBadge");

const featuredBadge =

document.getElementById("featuredBadge");

const summaryCategory =

document.getElementById("summaryCategory");

const summarySalary =

document.getElementById("summarySalary");

const summaryLocation =

document.getElementById("summaryLocation");

const summaryDate =

document.getElementById("summaryDate");

const breadcrumbJob =

document.getElementById("breadcrumbJob");

const callButton =

document.getElementById("callButton");

const whatsappButton =

document.getElementById("whatsappButton");

const emailButton =

document.getElementById("emailButton");

const sideCallButton =

document.getElementById("sideCallButton");

const sideWhatsappButton =

document.getElementById("sideWhatsappButton");

const sideEmailButton =

document.getElementById("sideEmailButton");

const viewBusiness =

document.getElementById("viewBusiness");

const relatedJobs =

document.getElementById("relatedJobs");

document.getElementById("currentYear").textContent =

new Date().getFullYear();

//==============================
// DATA
//==============================

let currentJob = null;

let currentBusiness = null;

//==============================
// START
//==============================

if(!jobId){

    document.body.innerHTML =

    "<h1 style='padding:60px;text-align:center;'>Job not found.</h1>";

}else{

    loadJob();

}

//==============================
// LOAD JOB
//==============================

async function loadJob(){

    const {

        data,

        error

    }

    = await supabase

    .from("jobs")

    .select("*")

    .eq("id",jobId)

    .eq("status","active")

    .single();

    if(error || !data){

        document.body.innerHTML=

        "<h1 style='padding:60px;text-align:center;'>Job not found.</h1>";

        return;

    }

    currentJob = data;

    await loadBusiness();

}
//======================================================
// job.js
// Part 2
//======================================================

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

    .select("*")

    .eq(

        "owner_id",

        currentJob.owner_id

    )

    .single();

    if(error){

        console.error(error);

        return;

    }

    currentBusiness = data;

    renderJob();

    await loadRelatedJobs();

}

//==============================
// RENDER JOB
//==============================

function renderJob(){

    document.title =

    `${currentJob.title} | 🌍 WorkBridge Africa`;

    breadcrumbJob.textContent =

    currentJob.title;

    companyLogo.src =

    currentBusiness.logo_url ||

    "assets/default-business.webp";

    companyLogo.alt =

    currentBusiness.business_name;

    companyName.textContent =

    currentBusiness.business_name;

    jobTitle.textContent =

    currentJob.title;

    jobDescription.innerHTML =

    formatText(

        currentJob.description ||

        "No description provided."

    );

    if(

        currentJob.requirements

    ){

        jobRequirements.innerHTML =

        formatText(

            currentJob.requirements

        );

    }

    businessDescription.innerHTML =

    formatText(

        currentBusiness.description ||

        "No business description available."

    );

    summaryCategory.textContent =

    currentJob.category ||

    "General";

    summarySalary.textContent =

    currentJob.salary ||

    "Negotiable";

    summaryLocation.textContent =

    [

        currentJob.lga,

        currentJob.state,

        currentJob.country

    ]

    .filter(Boolean)

    .join(", ");

    summaryDate.textContent =

    new Date(

        currentJob.created_at

    ).toLocaleDateString();

    jobMeta.innerHTML =

    `
    <span>

    <i class="fa-solid fa-location-dot"></i>

    ${summaryLocation.textContent}

    </span>

    <span>

    <i class="fa-solid fa-money-bill-wave"></i>

    ${summarySalary.textContent}

    </span>

    <span>

    <i class="fa-solid fa-layer-group"></i>

    ${summaryCategory.textContent}

    </span>

    <span>

    <i class="fa-solid fa-calendar-days"></i>

    ${timeAgo(

        currentJob.created_at

    )}

    </span>
    `;

    if(

        currentBusiness.verified

    ){

        verifiedBadge.classList.remove(

            "hidden"

        );

    }

    if(

        currentBusiness.featured_until &&

        new Date(

            currentBusiness.featured_until

        ) > new Date()

    ){

        featuredBadge.classList.remove(

            "hidden"

        );

    }

    connectButtons();

    updateSeo();

}
 //======================================================
// WorkBridge Africa
// job.js
// Part 3
//======================================================


//==============================
// CONTACT BUTTONS
//==============================

function connectButtons(){

    const phone = currentJob.phone;

    const whatsapp = currentJob.whatsapp;

    const email = currentJob.email;


    if(phone){

        callButton.href = `tel:${phone}`;

        sideCallButton.href = `tel:${phone}`;

    }else{

        callButton.style.display="none";

        sideCallButton.style.display="none";

    }


    if(whatsapp){

        const cleanWhatsapp =

        whatsapp.replace(/\D/g,'');


        whatsappButton.href =

        `https://wa.me/${cleanWhatsapp}`;


        sideWhatsappButton.href =

        `https://wa.me/${cleanWhatsapp}`;

    }else{

        whatsappButton.style.display="none";

        sideWhatsappButton.style.display="none";

    }


    if(email){

        emailButton.href =

        `mailto:${email}`;


        sideEmailButton.href =

        `mailto:${email}`;

    }else{

        emailButton.style.display="none";

        sideEmailButton.style.display="none";

    }


    if(currentBusiness.slug){

        viewBusiness.href =

        `business.html?slug=${currentBusiness.slug}`;

    }else{

        viewBusiness.style.display="none";

    }

}



//==============================
// SEO STRUCTURED DATA
//==============================

function updateSeo(){

    const schema = {

        "@context":"https://schema.org",

        "@type":"JobPosting",

        "title":currentJob.title,

        "description":

        currentJob.description,

        "datePosted":

        currentJob.created_at,

        "employmentType":

        "FULL_TIME",

        "hiringOrganization":{

            "@type":"Organization",

            "name":

            currentBusiness.business_name,

            "logo":

            currentBusiness.logo_url || ""

        },

        "jobLocation":{

            "@type":"Place",

            "address":{

                "@type":"PostalAddress",

                "addressLocality":

                currentJob.lga || "",

                "addressRegion":

                currentJob.state || "",

                "addressCountry":

                currentJob.country || ""

            }

        }

    };


    document

    .getElementById("structuredData")

    .textContent =

    JSON.stringify(

        schema,

        null,

        2

    );


    document

    .querySelector(

        'meta[name="description"]'

    )

    .setAttribute(

        "content",

        `${currentJob.title} at ${currentBusiness.business_name}. Apply directly through WorkBridge Africa.`

    );

}



//==============================
// TEXT FORMATTER
//==============================

function formatText(text){

    return text

    .replace(

        /\n/g,

        "<br>"

    );

}



//==============================
// TIME AGO
//==============================

function timeAgo(date){

    const seconds =

    Math.floor(

        (

        Date.now()

        -

        new Date(date).getTime()

        )

        /1000

    );


    const intervals = [

        {

            label:"year",

            seconds:31536000

        },

        {

            label:"month",

            seconds:2592000

        },

        {

            label:"day",

            seconds:86400

        },

        {

            label:"hour",

            seconds:3600

        },

        {

            label:"minute",

            seconds:60

        }

    ];


    for(const interval of intervals){

        const count =

        Math.floor(

            seconds /

            interval.seconds

        );


        if(count >= 1){

            return `${count} ${interval.label}${count>1?"s":""} ago`;

        }

    }


    return "Just now";

}
//======================================================
// WorkBridge Africa
// job.js
// Part 4
//======================================================


//==============================
// LOAD RELATED JOBS
//==============================

async function loadRelatedJobs(){

    const {

        data,

        error

    }

    = await supabase

    .from("jobs")

    .select(`

        id,

        title,

        description,

        category,

        state,

        lga,

        salary,

        created_at,

        owner_id

    `)

    .eq(

        "status",

        "active"

    )

    .eq(

        "category",

        currentJob.category

    )

    .neq(

        "id",

        currentJob.id

    )

    .limit(6);


    if(error){

        console.error(error);

        relatedJobs.innerHTML =

        `<p>No related jobs available.</p>`;

        return;

    }


    if(!data || data.length===0){

        relatedJobs.innerHTML =

        `<p>No similar jobs available.</p>`;

        return;

    }


    const owners =

    [

        ...new Set(

            data.map(

                job=>job.owner_id

            )

        )

    ];


    const {

        data:businesses

    }

    = await supabase

    .from("businesses")

    .select(`

        owner_id,

        business_name,

        logo_url,

        verified

    `)

    .in(

        "owner_id",

        owners

    );


    const businessMap = new Map();


    businesses?.forEach(

        business=>{

            businessMap.set(

                business.owner_id,

                business

            );

        }

    );


    relatedJobs.innerHTML="";


    data.forEach(

        job=>{

            const business =

            businessMap.get(

                job.owner_id

            );


            const card =

            document.createElement(

                "article"

            );


            card.className=

            "related-card";


            card.innerHTML=

            `

            <div class="related-header">

                <img

                class="related-logo"

                src="${

                    business?.logo_url ||

                    "assets/default-business.webp"

                }"

                alt="${

                    business?.business_name ||

                    "Business"

                }">


                <div class="related-company">

                    <h3>

                    ${

                        business?.business_name ||

                        "Business"

                    }

                    </h3>


                    <p>

                    ${

                        job.state ||

                        ""

                    }

                    </p>

                </div>

            </div>


            <div class="related-body">


                <h4>

                ${job.title}

                </h4>


                <p>

                ${(job.description || "")

                .substring(0,120)}

                ...

                </p>


                <div class="related-footer">


                    <span class="related-date">

                    ${

                        timeAgo(

                            job.created_at

                        )

                    }

                    </span>


                    <a

                    class="related-link"

                    href="job.html?id=${job.id}">

                    View

                    </a>


                </div>


            </div>

            `;


            relatedJobs.appendChild(card);

        }

    );

}



//==============================
// REPORT MODAL
//==============================

const reportButton =

document.getElementById(

    "reportJobButton"

);


const reportModal =

document.getElementById(

    "reportModal"

);


const closeReportModal =

document.getElementById(

    "closeReportModal"

);


const submitReport =

document.getElementById(

    "submitReport"

);


const reportReason =

document.getElementById(

    "reportReason"

);



reportButton?.addEventListener(

"click",

()=>{

    reportModal.classList.remove(

        "hidden"

    );

});



closeReportModal?.addEventListener(

"click",

()=>{

    reportModal.classList.add(

        "hidden"

    );

});



reportModal?.addEventListener(

"click",

(event)=>{

    if(

        event.target === reportModal

    ){

        reportModal.classList.add(

            "hidden"

        );

    }

});
//======================================================
// WorkBridge Africa
// job.js
// Part 5
//======================================================


//==============================
// SUBMIT JOB REPORT
//==============================

submitReport?.addEventListener(

"click",

async()=>{


    const reason =

    reportReason.value.trim();



    if(!reason){

        alert(

            "Please provide a reason for reporting this job."

        );

        return;

    }



    submitReport.disabled = true;

    submitReport.textContent =

    "Submitting...";



    try{


        const response =

        await fetch(

            REPORT_ENDPOINT,

            {

                method:"POST",

                headers:{

                    "Content-Type":

                    "application/json"

                },

                body:

                JSON.stringify({

                    type:"job",

                    id:currentJob.id,

                    reason:reason

                })

            }

        );



        const result =

        await response.json();



        if(!response.ok){

            throw new Error(

                result.message ||

                "Report failed"

            );

        }



        alert(

            "Report submitted successfully. Thank you for helping keep WorkBridge Africa safe."

        );



        reportReason.value="";

        reportModal.classList.add(

            "hidden"

        );



    }catch(error){


        console.error(error);


        alert(

            "Unable to submit report. Please try again."

        );


    }finally{


        submitReport.disabled=false;


        submitReport.textContent=

        "Submit Report";


    }


});



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

    mobileMenu.classList.toggle(

        "active"

    );

});



//==============================
// CLOSE MOBILE MENU
//==============================

document

.querySelectorAll(

    "#mobileMenu a"

)

.forEach(

link=>{

    link.addEventListener(

        "click",

        ()=>{

            mobileMenu.classList.remove(

                "active"

            );

        }

    );

});



//==============================
// IMAGE ERROR FALLBACK
//==============================

companyLogo?.addEventListener(

"error",

()=>{

    companyLogo.src=

    "assets/default-business.webp";

}

);



//==============================
// PAGE READY
//==============================

window.addEventListener(

"load",

()=>{

    if(currentBusiness){

        updateSeo();

    }

});
