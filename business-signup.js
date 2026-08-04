//======================================================
// WorkBridge Africa 🌍
// business-signup.js
// Part 1
//======================================================


//==============================
// SUPABASE CONFIG
//==============================

const SUPABASE_URL = "https://razemjveqtmnutvluxab.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_2utxbSM-OS6QTitKo6MobA_spBvL_2r";


const supabase =

window.supabase.createClient(

    SUPABASE_URL,

    SUPABASE_ANON_KEY

);



//==============================
// DOM ELEMENTS
//==============================


const form =

document.getElementById(

    "businessSignupForm"

);


const signupButton =

document.getElementById(

    "signupButton"

);


const message =

document.getElementById(

    "signupMessage"

);


const currentYear =

document.getElementById(

    "currentYear"

);


if(currentYear){

    currentYear.textContent =

    new Date().getFullYear();

}



//==============================
// FORM SUBMIT
//==============================


form.addEventListener(

"submit",

async(event)=>{


    event.preventDefault();



    signupButton.disabled = true;


    signupButton.textContent =

    "Creating Account...";


    message.textContent="";



    try{


        const businessData =

        getFormData();



        await createBusinessAccount(

            businessData

        );



    }catch(error){


        console.error(error);



        showMessage(

            error.message ||

            "Something went wrong. Please try again.",

            "error"

        );



        signupButton.disabled=false;


        signupButton.textContent=

        "Create Business Account";


    }



});



//==============================
// GET FORM DATA
//==============================


function getFormData(){


    return {


        business_name:

        document.getElementById(

            "businessName"

        ).value.trim(),



        email:

        document.getElementById(

            "email"

        ).value.trim(),



        password:

        document.getElementById(

            "password"

        ).value,



        phone:

        document.getElementById(

            "phone"

        ).value.trim(),



        whatsapp:

        document.getElementById(

            "whatsapp"

        ).value.trim(),



        country:

        document.getElementById(

            "country"

        ).value.trim(),



        state:

        document.getElementById(

            "state"

        ).value.trim(),



        lga:

        document.getElementById(

            "lga"

        ).value.trim(),



        address:

        document.getElementById(

            "address"

        ).value.trim(),



        categories:

        document.getElementById(

            "categories"

        ).value.trim(),



        description:

        document.getElementById(

            "description"

        ).value.trim(),



        website:

        document.getElementById(

            "website"

        ).value.trim(),



        facebook:

        document.getElementById(

            "facebook"

        ).value.trim(),



        instagram:

        document.getElementById(

            "instagram"

        ).value.trim(),



        x:

        document.getElementById(

            "x"

        ).value.trim(),



        telegram:

        document.getElementById(

            "telegram"

        ).value.trim(),



        logo:

        document.getElementById(

            "logo"

        ).files[0] || null


    };


}
//======================================================
// WorkBridge Africa 🌍
// business-signup.js
// Part 2
//======================================================


//==============================
// CREATE BUSINESS ACCOUNT
//==============================

async function createBusinessAccount(data){


    // Create Supabase Auth account
    // Email confirmation is disabled in Supabase settings

    const {

        data:userData,

        error:authError

    } = await supabase.auth.signUp({

        email:data.email,

        password:data.password

    });



    if(authError){

        throw authError;

    }



    const user =

    userData.user;



    if(!user){

        throw new Error(

            "Account creation failed."

        );

    }



    let logoUrl = null;



    // Upload logo if provided

    if(data.logo){


        logoUrl =

        await uploadLogo(

            user.id,

            data.logo

        );


    }



    // Insert business profile

    const {

        error:businessError

    } = await supabase

    .from("businesses")

    .insert({

        owner_id:user.id,

        business_name:data.business_name,

        description:data.description,

        categories:data.categories,

        state:data.state,

        lga:data.lga,

        address:data.address,

        phone:data.phone,

        whatsapp:data.whatsapp,

        telegram:data.telegram,

        email:data.email,

        website:data.website,

        facebook:data.facebook,

        instagram:data.instagram,

        x:data.x,

        logo_url:logoUrl,

        country:data.country,

        verified:false,

        status:"active"

    });



    if(businessError){

        throw businessError;

    }



    showMessage(

        "Business account created successfully. Redirecting...",

        "success"

    );



    setTimeout(()=>{


        window.location.href =

        "businessdashboard.html";


    },1500);


}
//======================================================
// WorkBridge Africa 🌍
// business-signup.js
// Part 3
//======================================================


//==============================
// UPLOAD BUSINESS LOGO
//==============================

async function uploadLogo(

    userId,

    file

){


    const fileExtension =

    file.name

    .split(".")

    .pop();



    const filePath =

    `business-logos/${userId}.${fileExtension}`;



    const {

        error:uploadError

    } = await supabase

    .storage

    .from("uploads")

    .upload(

        filePath,

        file,

        {

            cacheControl:"3600",

            upsert:true

        }

    );



    if(uploadError){

        throw uploadError;

    }



    const {

        data

    } = supabase

    .storage

    .from("uploads")

    .getPublicUrl(

        filePath

    );



    return data.publicUrl;


}



//==============================
// MESSAGE HELPER
//==============================

function showMessage(

    text,

    type

){


    message.textContent = text;


    message.className =

    `message ${type}`;


}



//==============================
// PASSWORD VISIBILITY
// OPTIONAL
//==============================


const passwordInput =

document.getElementById(

    "password"

);



if(passwordInput){


    passwordInput.addEventListener(

        "input",

        ()=>{


            if(passwordInput.value.length < 6){


                passwordInput.setCustomValidity(

                    "Password must be at least 6 characters."

                );


            }else{


                passwordInput.setCustomValidity(

                    ""

                );


            }


        }

    );


}



//==============================
// SESSION CHECK
//==============================


supabase.auth

.getSession()

.then(({data})=>{


    if(data.session){


        console.log(

            "Existing session detected",

            data.session.user.id

        );


    }


});
