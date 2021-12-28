import React, { ReactHTML, useState } from "react"
import Webull from "webull/dist";
import { LoginError, InvalidTradingPinError } from "webull/dist/errors"

interface Params {
    setWebull: React.Dispatch<React.SetStateAction<Webull | null>>
}

function Login({setWebull} : Params) {
    const [formValues, setFormValues] = useState({email: '', password: '', tradingPin: ''})
    const [error, setError] = useState('')

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [event.target.name]: event.target.value})
    }

    const login = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const webull = new Webull(formValues.email, formValues.password, formValues.tradingPin)
        try {
            await webull.login()
        } catch (error) {
            if (error instanceof LoginError || error instanceof InvalidTradingPinError) {
                setError(error.message)
            }
            return
        }

        setWebull(webull)
    }

    return (
        <div className = "flex flex-col justify-center items-center h-full">
            { error.length > 0 && 
                <div className="mb-5">
                    { error }
                </div>
            }
            <form className="flex flex-col items-start" onSubmit={login}>
                <label>
                    Email: 
                    <input type="email" name="email" onChange={onChange}/>
                </label>
                <label>
                    Password: 
                    <input type="password" name="password" onChange={onChange}/>
                </label>
                <label>
                    Trading pin: 
                    <input type="password" name="tradingPin" onChange={onChange}/>
                </label>
                <input className="w-full flex justify-center" type="submit" value="Submit"/>
            </form>
        </div>
    )
}

export default Login
