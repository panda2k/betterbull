import React, { useEffect, useState } from "react"
import Webull from "webull/dist"
import { AccountOverview } from "webull/dist/types"

interface Params {
    webull: Webull
}

function AccountSummary({webull} : Params) {
    const [accountOverview, setAccountOverview] = useState<AccountOverview>()

    useEffect(() => {
        const getOverview = async() => {
            const overview = await webull.getAccountOverview()

            setAccountOverview(overview)
            console.log(accountOverview)

            console.log(overview.accountSummaryVO.totalMarketValue)
        }

        getOverview()
    }, [])

    return (
        <div className="flex flex-col account-details">
            {accountOverview && 
            <div>
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between">
                            <h3>Total Account Value</h3>
                            <h3>Day's P&L</h3>
                        </div>

                        <div className="flex flex-row">
                            <h2>
                                ${ parseFloat(accountOverview.accountSummaryVO.totalMarketValue) + parseFloat(accountOverview.accountSummaryVO.totalCashValue) }
                            </h2>
                            <div className="flex flex-col">
                                <h4>
                                    { accountOverview.accountSummaryVO.unrealizedProfitLoss }
                                </h4>
                                <h4>
                                    { parseFloat(accountOverview.accountSummaryVO.unrealizedProfitLossRate).toFixed(2) + "%" }
                                </h4>
                            </div>
                        </div>
                    </div>

                </div>
                <div>

                </div>
            </div>
            }

        </div>
    )
}

export default AccountSummary
