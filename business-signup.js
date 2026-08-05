// business-signup.js
// Part 1

const SUPABASE_URL = "https://razemjveqtmnutvluxab.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_2utxbSM-OS6QTitKo6MobA_spBvL_2r";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);



const form = document.getElementById(
  "businessSignupForm"
);

const button = document.getElementById(
  "signupButton"
);

const message = document.getElementById(
  "signupMessage"
);



form.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();


    button.disabled = true;

    button.textContent =
      "Creating account...";


    try {


      const logoFile =
        document.getElementById(
          "logo"
        ).files[0];



      let logoUrl = null;



      if (logoFile) {


        const fileExt =
          logoFile.name
          .split(".")
          .pop();



        const fileName =
          `${crypto.randomUUID()}.${fileExt}`;



        const {
          error:uploadError
        } =
        await supabaseClient
        .storage
        .from("uploads")
        .upload(
          fileName,
          logoFile,
          {
            cacheControl:"3600",
            upsert:false
          }
        );



        if(uploadError){

          throw uploadError;

        }



        const {
          data:publicUrl
        } =
        supabaseClient
        .storage
        .from("uploads")
        .getPublicUrl(
          fileName
        );



        logoUrl =
          publicUrl.publicUrl;

      }



      const payload = {

        business_name:
        document.getElementById(
          "businessName"
        ).value.trim(),


        email:
        document.getElementById(
          "email"
        ).value.trim(),


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
// Part 2


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


        logo_url:
        logoUrl

      };



      const {
        error:functionError
      } =
      await supabaseClient.functions.invoke(
        "signup-init",
        {
          body: payload
        }
      );



      if(functionError){

        throw functionError;

      }



      localStorage.setItem(
        "signup_email",
        payload.email
      );



      window.location.href =
        "business-verify.html";



    } catch(error){


      console.error(error);


      message.textContent =
        error.message ||
        "Signup failed. Try again.";


      message.style.color =
        "red";



    } finally {


      button.disabled = false;


      button.textContent =
        "Create Business Account";


    }


  }

);
