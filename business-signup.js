// business-signup.js

const SUPABASE_URL = "https://razemjveqtmnutvluxab.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhemVtanZlcXRtbnV0dmx1eGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTE4MTMsImV4cCI6MjEwMTMyNzgxM30.e7JhaJ6DEZsH3WNUYGjdk8TvdsITNDKgLIzkbcLk-Yw";


const signupFunctionUrl =
`${SUPABASE_URL}/functions/v1/signup-init`;


const form =
document.getElementById("businessSignupForm");

const message =
document.getElementById("signupMessage");

const button =
document.getElementById("signupButton");



form.addEventListener("submit", async (e)=>{

    e.preventDefault();


    button.disabled = true;

    button.textContent =
    "Creating account...";


    message.textContent = "";



    try {


        const logoFile =
        document.getElementById("logo").files[0];



        let logo_url = null;



        if(logoFile){

            const fileName =
            `logos/${Date.now()}-${logoFile.name}`;


            const uploadResponse =
            await fetch(
                `${SUPABASE_URL}/storage/v1/object/uploads/${fileName}`,
                {
                    method:"POST",

                    headers:{

                        "Authorization":
                        `Bearer ${SUPABASE_ANON_KEY}`,

                        "apikey":
                        SUPABASE_ANON_KEY,

                        "Content-Type":
                        logoFile.type

                    },

                    body:logoFile
                }
            );



            if(!uploadResponse.ok){

                throw new Error(
                    "Logo upload failed."
                );

            }



            logo_url =
            `${SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;

        }



        const payload = {


            business_name:
            document.getElementById("businessName")
            .value.trim(),



            email:
            document.getElementById("email")
            .value.trim(),



            password:
            document.getElementById("password")
            .value,



            phone:
            document.getElementById("phone")
            .value.trim(),



            whatsapp:
            document.getElementById("whatsapp")
            .value.trim(),



            country:
            document.getElementById("country")
            .value.trim(),



            state:
            document.getElementById("state")
            .value.trim(),



            lga:
            document.getElementById("lga")
            .value.trim(),



            address:
            document.getElementById("address")
            .value.trim(),



            categories:
            document.getElementById("categories")
            .value.trim(),



            description:
            document.getElementById("description")
            .value.trim(),



            website:
            document.getElementById("website")
            .value.trim(),



            facebook:
            document.getElementById("facebook")
            .value.trim(),



            instagram:
            document.getElementById("instagram")
            .value.trim(),



            x:
            document.getElementById("x")
            .value.trim(),



            telegram:
            document.getElementById("telegram")
            .value.trim(),



            logo_url

        };



        // Save temporarily for OTP verification

        sessionStorage.setItem(
            "signup_email",
            payload.email
        );


        sessionStorage.setItem(
            "signup_password",
            payload.password
        );



        const response =
        await fetch(

            signupFunctionUrl,

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json",

                    "apikey":
                    SUPABASE_ANON_KEY

                },


                body:
                JSON.stringify(payload)

            }

        );



        const result =
        await response.json();



        if(!response.ok){

            throw new Error(

                result.error ||
                "Signup failed."

            );

        }



        message.textContent =
        "Verification code sent. Check your email.";



        setTimeout(()=>{

            window.location.href =
            "business-verify.html";

        },1000);



    } catch(error){


        console.error(error);



        sessionStorage.removeItem(
            "signup_email"
        );


        sessionStorage.removeItem(
            "signup_password"
        );



        message.textContent =
        error.message;



    } finally {


        button.disabled = false;


        button.textContent =
        "Create Business Account";


    }


});
