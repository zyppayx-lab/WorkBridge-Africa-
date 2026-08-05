//======================================================
// WorkBridge Africa 🌍
// business-signup.js
// Supabase Auth v2
// Part 1
//=======================================================


//==============================
// SUPABASE CONFIG
//==============================

const SUPABASE_URL = "https://razemjveqtmnutvluxab.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhemVtanZlcXRtbnV0dmx1eGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTE4MTMsImV4cCI6MjEwMTMyNzgxM30.e7JhaJ6DEZsH3WNUYGjdk8TvdsITNDKgLIzkbcLk-Yw";


const client = supabase.createClient(

    SUPABASE_URL,

    SUPABASE_ANON_KEY

);



//==============================
// ELEMENTS
//==============================


const form = document.getElementById(

    "businessSignupForm"

);


const button = document.getElementById(

    "signupButton"

);


const message = document.getElementById(

    "signupMessage"

);



const year = document.getElementById(

    "year"

);


if(year){

    year.textContent =

    new Date().getFullYear();

}



//==============================
// SUBMIT
//==============================


form.addEventListener(

"submit",

async(e)=>{


    e.preventDefault();



    button.disabled = true;


    button.textContent =

    "Creating account...";


    clearMessage();



    try{


        const data = getBusinessData();



        await registerBusiness(data);



    }catch(error){


        console.error(

            "Signup error:",

            error

        );


        showMessage(

            error.message,

            "error"

        );


        button.disabled = false;


        button.textContent =

        "Create Business Account";


    }


});



//==============================
// COLLECT FORM DATA
//==============================


function getBusinessData(){


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
// Supabase Auth v2
// Part 2
//======================================================


//==============================
// REGISTER BUSINESS
//==============================

async function registerBusiness(data){


    // 1. Create Supabase Auth user

    const {

        data:authData,

        error:authError

    } = await client.auth.signUp({

        email:data.email,

        password:data.password

    });



    if(authError){

        throw authError;

    }



    const user = authData.user;



    if(!user){

        throw new Error(

            "Unable to create account."

        );

    }



    // 2. Upload logo if provided

    let logoUrl = null;



    if(data.logo){


        logoUrl = await uploadLogo(

            user.id,

            data.logo

        );


    }



    // 3. Create business profile


    const {

        error:profileError

    } = await client

    .from("businesses")

    .insert({


        owner_id:user.id,


        business_name:

        data.business_name,


        description:

        data.description,


        categories:

        data.categories,


        state:

        data.state,


        lga:

        data.lga,


        address:

        data.address,


//======================================================
// WorkBridge Africa 🌍
// business-signup.js
// Supabase Auth v2
// Part 2 (Updated)
//======================================================


//==============================
// REGISTER BUSINESS
//==============================

async function registerBusiness(data){

    // Create Auth account
    const {

        data: authData,

        error: authError

    } = await client.auth.signUp({

        email: data.email,

        password: data.password

    });


    if(authError){

        throw authError;

    }


    let user = authData.user;


    if(!user){

        throw new Error(
            "Unable to create account."
        );

    }


    // Ensure we have an authenticated session
    if(!authData.session){

        const {

            data: loginData,

            error: loginError

        } = await client.auth.signInWithPassword({

            email: data.email,

            password: data.password

        });


        if(loginError){

            throw loginError;

        }


        user = loginData.user;

    }


    // Upload logo
    let logoUrl = null;

    if(data.logo){

        logoUrl = await uploadLogo(

            user.id,

            data.logo

        );

    }


    // Create business profile
    const {

        error: profileError

    } = await client

    .from("businesses")

    .insert({

        owner_id: user.id,

        business_name: data.business_name,

        description: data.description,

        categories: data.categories,

        state: data.state,

        lga: data.lga,

        address: data.address,

        phone: data.phone,

        whatsapp: data.whatsapp,

        telegram: data.telegram,

        email: data.email,

        website: data.website,

        facebook: data.facebook,

        instagram: data.instagram,

        x: data.x,

        logo_url: logoUrl,

        country: data.country,

        verified: false,

        status: "active"

    });


    if(profileError){

        throw profileError;

    }


    showMessage(

        "Business account created successfully.",

        "success"

    );


    setTimeout(()=>{

        window.location.href =

        "businessdashboard.html";

    },1200);

        }
        
//======================================================
// WorkBridge Africa 🌍
// business-signup.js
// Supabase Auth v2
// Part 3
//======================================================


//==============================
// UPLOAD BUSINESS LOGO
// uploads bucket ONLY
//==============================

async function uploadLogo(

    userId,

    file

){


    const allowedTypes = [

        "image/jpeg",

        "image/png",

        "image/webp"

    ];



    if(!allowedTypes.includes(file.type)){


        throw new Error(

            "Logo must be JPG, PNG, or WEBP."

        );


    }



    // Limit logo size to 3MB

    if(file.size > 3 * 1024 * 1024){


        throw new Error(

            "Logo size must be less than 3MB."

        );


    }



    const extension =

    file.name

    .split(".")

    .pop();



    const path =

    `business-logos/${userId}.${extension}`;





    const {

        error

    } = await client

    .storage

    .from("uploads")

    .upload(

        path,

        file,

        {

            cacheControl:"3600",

            upsert:true

        }

    );



    if(error){

        throw error;

    }



    const {

        data

    } = client

    .storage

    .from("uploads")

    .getPublicUrl(

        path

    );



    return data.publicUrl;


}



//==============================
// MESSAGE HELPERS
//==============================


function showMessage(

    text,

    type

){


    message.textContent = text;


    message.className = type;


}



function clearMessage(){


    message.textContent = "";


    message.className = "";


}



//==============================
// CHECK EXISTING SESSION
//==============================


async function checkSession(){


    const {

        data

    } = await client

    .auth

    .getSession();



    if(data.session){


        console.log(

            "Active session:",

            data.session.user.id

        );


    }


}



checkSession();
