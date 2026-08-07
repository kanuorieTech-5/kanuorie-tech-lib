import { useState } from "react";

import {
  Button,
  SectionTitle,
} from "../common";

import {
  subscribeNewsletter,
} from "../../services";


export default function Newsletter() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");



  const submit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await subscribeNewsletter({
        email,
      });


      setEmail("");

      setMessage(
        "Thanks for subscribing!"
      );


    } catch (error) {

      setMessage(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };



  return (

    <section className="
      bg-gradient-to-r
      from-blue-700
      to-cyan-600
      py-24
    ">


      <div className="
        mx-auto
        max-w-4xl
        px-6
        text-center
      ">


        <SectionTitle

          badge="Stay Connected"

          title="Get Technology Updates Delivered"

          subtitle="Receive new courses, digital resources, articles and company updates from KanuorieTech."

        />



        <form

          onSubmit={submit}

          className="
            mx-auto
            mt-10
            flex
            max-w-xl
            flex-col
            gap-4
            sm:flex-row
          "

        >


          <input

            type="email"

            required

            value={email}

            onChange={(e)=>
              setEmail(e.target.value)
            }

            placeholder="Enter your email"

            className="
              flex-1
              rounded-2xl
              border
              border-white/20
              bg-white
              px-5
              py-4
              text-slate-900
              outline-none
            "

          />



          <Button

            type="submit"

            disabled={loading}

          >

            {
              loading
              ? "Subscribing..."
              : "Subscribe"
            }


          </Button>


        </form>



        {message && (

          <p className="
            mt-5
            text-sm
            text-white
          ">

            {message}

          </p>

        )}


      </div>


    </section>

  );

}