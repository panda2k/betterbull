import React, { useEffect, useState } from "react"
import Webull from "webull/dist"
import { AccountOverview } from "webull/dist/types"
import { PieChart } from 'react-minimal-pie-chart'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

interface Params {
    webull: Webull
}

function AccountSummary({webull} : Params) {
    const [accountOverview, setAccountOverview] = useState<AccountOverview>()
    const [censor, setCensor] = useState<boolean>(false)

    useEffect(() => {
        const getOverview = async() => {
            const overview = await webull.getAccountOverview()

            setAccountOverview(overview)
            console.log(accountOverview)

            console.log(overview.accountSummaryVO.totalMarketValue)
        }

        getOverview()
    }, [])

    const switchCensor = () => {
        setCensor(!censor)
    }

    const processNumber = (number: string): string => censor ? "*****" : parseFloat(number).toFixed(2)

    const getProfitColor = (profit: number) => {
        if (profit > 0) {
            return "positive-text"
        } else if (profit < 0) {
            return "negative-text"
        } else {
            return "neutral-text"
        }
    } 

    return (
        <div className="flex flex-col account-details primary-background">
            {accountOverview && 
            <div className="pt-3">
                <div className="flex flex-col mb-3 pl-3 pr-2">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row">
                                <h3>Total Account Value</h3>
                                <button className="ml-1" onClick={switchCensor}>{ censor ? <AiOutlineEyeInvisible/> : <AiOutlineEye/> }</button>
                            </div>
                            <h3>Day's P&L</h3>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row">
                                <h2 className="text-3xl mr-1">
                                    { censor ? "******" : `$${parseFloat(accountOverview.accountSummaryVO.totalMarketValue) + parseFloat(accountOverview.accountSummaryVO.totalCashValue)}` }
                                </h2>
                                <div className={"flex flex-col " + censor ? "neutral-text" : getProfitColor(parseFloat(accountOverview.accountSummaryVO.unrealizedProfitLoss))}>
                                    <div className={censor ? "text-xs mt-1 -mb-1" : "text-xs -mb-1 mt-1 -ml-2.5"}>
                                        { censor ? "****" : accountOverview.accountSummaryVO.unrealizedProfitLoss }
                                    </div>
                                    <div className="text-xs">
                                        { censor ? "****" : parseFloat(accountOverview.accountSummaryVO.unrealizedProfitLossRate).toFixed(2) + "%" }
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col " + getProfitColor(parseFloat(accountOverview.accountSummaryVO.profitLoss))}>
                                <div className="text-xs -mr-1/2 ">{censor ? "***" : accountOverview.accountSummaryVO.profitLoss}</div>
                                <div className="text-xs">{(censor ? "***" : (parseFloat(accountOverview.accountSummaryVO.profitLossRate) * 100).toFixed(2) + "%")}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="top-divider pl-3 pr-2">
                    <div className="flex flex-row justify-between mt-3">
                        <h3>Account Details</h3>
                        <h3 className="neutral-text">Cash Balance</h3>
                    </div>
                    <div className="flex flex-row mt-3">
                        <div className="w-1/3">
                            <PieChart data={[ 
                                { title: 'Settled Cash', value: censor ? 1 : parseFloat(accountOverview.assetSummaryVO.capital.settledFunds), color: '#0a83fc' }, 
                                { title: 'Unsettled Cash', value: censor ? 0 : parseFloat(accountOverview.assetSummaryVO.capital.unsettleFunds), color: '#4f28a9' }
                            ]} lineWidth={10} startAngle={270}/>
                        </div>
                        <div className="flex flex-col justify-center ml-5 w-2/3">
                            <div className="flex flex-row justify-between text-s"><div>Settled Cash</div><div>{censor ? '*****' : `$${parseFloat(accountOverview.assetSummaryVO.capital.settledFunds).toFixed(2)}`}</div></div>
                            <div className="flex flex-row justify-between text-s"><div>Unsettled Cash</div><div>{censor ? '*****' : `$${parseFloat(accountOverview.assetSummaryVO.capital.unsettleFunds).toFixed(2)}`}</div></div>
                        </div>
                    </div>
                </div>
            </div>
            }

        </div>
    )
}

export default AccountSummary
