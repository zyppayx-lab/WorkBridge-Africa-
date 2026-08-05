// business-login.js

const SUPABASE_URL =
"https://razemjveqtmnutvluxab.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhemVtanZlcXRtbnV0dmx1eGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTE4MTMsImV4cCI6MjEwMTMyNzgxM30.e7JhaJ6DEZsH3WNUYGjdk8TvdsITNDKgLIzkbcLk-Yw";


const loginFunctionUrl =
`${SUPABASE_URL}/functions/v1/business-login`;


const form =
document.getElementById("businessLoginForm");

const button =
document.getElementById("loginButton");

const message =
document.getElementById("loginMessage");


document.getElementById("year").textContent =
new Date().getFullYear();


form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    button.disabled = true;

    button.textContent =
    "Signing in...";

    message.textContent = "";


    try{

        const email =
        document.getElementById("email")
        .value
        .trim()
        .toLowerCase();

        const password =
        document.getElementById("password")
        .value;


        if(!email || !password){

            throw new Error(
                "Email and password are required."
            );

        }


        const response =
        await fetch(

            loginFunctionUrl,

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

                    password

                })

            }

        );


        const result =
        await response.json();


        if(!response.ok){

            throw new Error(

                result.error ||

                "Login failed."

            );

        }


        localStorage.setItem(

            "business_access_token",

            result.session.access_token

        );


        localStorage.setItem(

            "business_refresh_token",

            result.session.refresh_token

        );


        localStorage.setItem(

            "business_user",

            JSON.stringify(result.user)

        );


        message.textContent =
        "Login successful.";


        setTimeout(()=>{

            window.location.href =
            "business-dashboard.html";

        },800);


    }catch(error){

        console.error(error);

        message.textContent =
        error.message;

    }finally{

        button.disabled = false;

        button.textContent =
        "Login";

    }

});
