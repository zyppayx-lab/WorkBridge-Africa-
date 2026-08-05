// business-verify.js

const SUPABASE_URL = "https://razemjveqtmnutvluxab.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhemVtanZlcXRtbnV0dmx1eGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTE4MTMsImV4cCI6MjEwMTMyNzgxM30.e7JhaJ6DEZsH3WNUYGjdk8TvdsITNDKgLIzkbcLk-Yw";


const verifyFunctionUrl =
`${SUPABASE_URL}/functions/v1/signup-verify`;


const resendFunctionUrl =
`${SUPABASE_URL}/functions/v1/resend-signup-otp`;



const form =
document.getElementById("verifyForm");


const otpInput =
document.getElementById("otp");


const message =
document.getElementById("verifyMessage");


const button =
document.getElementById("verifyButton");


const resendButton =
document.getElementById("resendButton");



const email =
sessionStorage.getItem("signup_email");



if(!email){

    window.location.href =
    "business-signup.html";

}



form.addEventListener("submit", async(e)=>{


    e.preventDefault();


    button.disabled = true;

    button.textContent =
    "Verifying...";


    message.textContent = "";



    try{


        const password =
        sessionStorage.getItem("signup_password") || "";


        const otp =
        otpInput.value.trim();



        if(!email || !password || !otp){

            throw new Error(
                "Email, OTP and password are required."
            );

        }



        const response =
        await fetch(

            verifyFunctionUrl,

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json",

                    "apikey":
                    SUPABASE_ANON_KEY

                },


                body:JSON.stringify({

                    email,

                    otp,

                    password

                })

            }

        );



        const result =
        await response.json();



        if(!response.ok){

            throw new Error(
                result.error ||
                "Verification failed."
            );

        }



        message.textContent =
        "Account verified successfully.";



        sessionStorage.removeItem(
            "signup_email"
        );


        sessionStorage.removeItem(
            "signup_password"
        );



        setTimeout(()=>{

            window.location.href =
            "business-login.html";

        },1000);



    } catch(error){


        console.error(
            "VERIFY ERROR:",
            error
        );


        message.textContent =
        error.message;



    } finally {


        button.disabled = false;

        button.textContent =
        "Verify Account";


    }


});



resendButton.addEventListener("click", async()=>{


    resendButton.disabled = true;


    message.textContent = "";



    try{


        if(!email){

            throw new Error(
                "Signup email not found."
            );

        }



        const response =
        await fetch(

            resendFunctionUrl,

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json",

                    "apikey":
                    SUPABASE_ANON_KEY

                },


                body:JSON.stringify({

                    email

                })

            }

        );



        const result =
        await response.json();



        if(!response.ok){

            throw new Error(
                result.error ||
                "Could not resend code."
            );

        }



        message.textContent =
        "New verification code sent.";



    } catch(error){


        console.error(
            "RESEND ERROR:",
            error
        );


        message.textContent =
        error.message;



    } finally {


        resendButton.disabled = false;


    }


});
