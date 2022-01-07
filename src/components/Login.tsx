import React, { useEffect, useState } from "react"
import { CookieSetOptions } from "universal-cookie";
import Webull from "webull/dist";
import { LoginError, InvalidTradingPinError } from "webull/dist/errors"

interface Cookies {
    email?: string;
    deviceId?: string;
    accessToken?: string;
    refreshToken?: string;
    accountId?: string;
    lzone?: string;
}

interface Params {
    setWebull: React.Dispatch<React.SetStateAction<Webull | null>>,
    setCookies: (name: "email" | "deviceId" | "accessToken" | "refreshToken" | "accountId" | "lzone", value: any, options?: CookieSetOptions | undefined) => void
    cookies: {
        email?: any;
        deviceId?: any;
        accessToken?: any;
        refreshToken?: any;
        accountId?: any;
        lzone?: any;
    }
}

function Login({setWebull, setCookies, cookies} : Params) {
    const [formValues, setFormValues] = useState({email: '', password: '', tradingPin: ''})
    const [error, setError] = useState('')
    const [incompleteCookies, setIncompleteCookies] = useState(true)

    useEffect(() => {
        const castedCookies = cookies as Cookies
        const cookieKeys = Object.keys(castedCookies) as (keyof typeof castedCookies)[]
        if (cookieKeys.length > 0) {
            for (let i = 0; i < cookieKeys.length; i++) {
                if (castedCookies[cookieKeys[i]] === "" || castedCookies[cookieKeys[i]] === "undefined") {
                    setIncompleteCookies(true)
                    return
                }
            }
            setIncompleteCookies(false)
        }
    }, [cookies])

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [event.target.name]: event.target.value})
    }

    const login = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let webull: Webull

        if (incompleteCookies) {
            webull = new Webull(formValues.email, formValues.password, formValues.tradingPin)
        } else {
            webull = new Webull('', '', '', {
                'accessToken': String(cookies.accessToken),
                'accountId': String(cookies.accountId),
                'deviceId': String(cookies.deviceId),
                'email': String(cookies.email),
                'lzone': String(cookies.lzone),
                'refreshToken': String(cookies.refreshToken),
                'tradingPin': formValues.tradingPin
            })
        }

        try {
            await webull.login()
        } catch (error) {
            if (error instanceof LoginError || error instanceof InvalidTradingPinError) {
                setError(error.message)
            }
            return
        }

        setWebull(webull)
        const cookieExpireDate = new Date(+new Date() + 1000 * 60 * 60 * 24 * 30)
        setCookies('deviceId', webull.deviceId, { expires: cookieExpireDate })
        setCookies('accessToken', webull.accessToken, { expires: cookieExpireDate })
        setCookies('refreshToken', webull.refreshToken, { expires: cookieExpireDate })
        setCookies('accountId', webull.accountId, { expires: cookieExpireDate })
        setCookies('lzone', webull.client.defaults.headers.common['lzone'], { expires: cookieExpireDate })
        setCookies('email', webull.email, { expires: cookieExpireDate })
    }

    return (
        <div>
            { incompleteCookies ? 
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
                : 
                <div>
                    <form className="flex flex-col items-start" onSubmit={login}>
                        <label>
                            Trading pin: 
                            <input type="password" name="tradingPin" onChange={onChange}/>
                        </label>
                        <input className="w-full flex justify-center" type="submit" value="Submit"/>
                    </form>
                </div>
            }
        </div>
    )
}

export default Login
