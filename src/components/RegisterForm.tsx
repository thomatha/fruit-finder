"use client"
import type { NextPage } from "next"
import { FormEvent, useState } from "react"


const RegisterForm: NextPage = () => {
  const [ error, setError ] = useState<string | null>(null)

  async function onSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null) // cited from documentation: clear errors on each new req

    try {
      const formData = new FormData(event.currentTarget)
      const res = await fetch('/api/submit', { // !!!WARNING: WILL NEED TO UPDATE API ROUTES!!!
        method: 'POST',
        body: formData,
      })

    if(!res.ok) {
      throw new Error('Failure to submit data...')
    }

    // response handler, can update if neccessary 
    const data = await res.json()
    // .....
    } catch (error: unknown) {
      if (typeof error === "string") {
        setError(error)
        console.error(error)
      }
  }
    
  }

  return (
    <div>
      
      <form onSubmit={onSubmit}>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" name="firstName" autoComplete="First Name" placeholder="First Name:" className="grow" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" name="lastName" autoComplete="Last Name" placeholder="Last Name:" className="grow" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" name="email" autoComplete="Email" placeholder="Email:" className="grow" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" name="password" placeholder="Password" className="grow" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
        </label>
        <button className="btn btn-active btn-primary" type="submit">Register</button>
      </form>
    </div>
  )
  
}

export default RegisterForm
