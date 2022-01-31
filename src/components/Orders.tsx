import React, { useEffect, useState } from "react"
import Webull from "webull/dist"
import { Trade, Status } from "webull/dist/types"
import { BiExport } from 'react-icons/bi'

interface Params {
    webull: Webull
}

const tabs = ["Working", "Filled", "Cancelled", "Pending", "Partially Filled", "Failed", "All"]
const orderDataColumns = ["symbol", "side", "total qtd", "filled qty", "limit price", "stop price", "trail amt", "order type", "TIF", "ext-hours", 'order status', 'average price', 'filled time', 'placed time']

const abbreviations = {
    'MKT': 'Market',
    'LMT': 'Limit'
}

function Orders({webull} : Params) {
    const [trades, setTrades] = useState<Trade[]>([])
    const [currentTab, setCurrentTab] = useState<Status>('Working')
    const [loading, setLoading] = useState<boolean>(true)

    const changeTab = async(e: React.BaseSyntheticEvent) => {
        setLoading(true)
        setCurrentTab(e.target.name)
        const trades = await webull.getTrades('1970-01-01', "", 0, 30, e.target.name)
        setTrades(trades)
        setLoading(false)
    }

    const exportOrdersTab = () => {
        const header = [orderDataColumns.map(name => capitalizeFirstLetter(name)).join(',')]

        const data = trades.map(trade => {
            return ([generateSymbol(trade),
            capitalizeFirstLetter(trade.items[0].action.toLowerCase()),
            trade.quantity,
            trade.filledQuantity,
            trade.items[0].lmtPrice,
            '',
            '',
            abbreviations[trade.items[0].orderType as keyof typeof abbreviations],
            capitalizeFirstLetter(trade.items[0].timeInForce.toLowerCase()),
            capitalizeFirstLetter(String(trade.outsideRegularTradingHour)),
            trade.statusName,
            (Number(trade.items[0].filledAmount) / Number(trade.filledQuantity) / 100).toFixed(2),
            trade.items[0].filledTime,
            trade.items[0].createTime].join(','))
        })

        const download = URL.createObjectURL(new Blob([header.concat(data).join('\n')]))

        let element = document.createElement('a')
        element.setAttribute('href', download)
        element.setAttribute('download', 'trades.csv')
        element.style.display='none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    useEffect(() => {
        const getTrades = async() => {
            const trades = await webull.getTrades("1970-01-01", "", 0, 30, currentTab)

            setTrades(trades)
            console.log(trades)
            setLoading(false)
        }

        getTrades()
    }, [])

    const capitalizeFirstLetter = (input: string) => input.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())

    const generateSymbol = (trade: Trade) => {
        let symbol = trade.items[0].ticker.symbol
        if (trade.comboTickerType == "OPTION") {
            symbol += ` ${trade.items[0].optionExercisePrice} ${capitalizeFirstLetter(trade.items[0].optionType)} ${trade.items[0].optionExpireDate}`
        }

        return symbol
    }

    return (
        <div className="flex flex-col orders overflow-scroll">
            <div className="tab-color text-white">
                <h3 className="text-left">Orders</h3>
            </div>
            <div className="flex justify-between primary-background">
                <div className="flex flex-row">
                    {tabs.map((name) => <button className={"mr-3 " + (name == currentTab ? "active-text" : "grey-text")} name={name} onClick={changeTab}> { name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) } </button>) }
                </div>
                <div>
                    <button className="grey-text flex flex-row" onClick={(exportOrdersTab)}>Export <div className="ml-0.5 mt-0.5 pt-0.5"><BiExport/></div></button>
                </div>
            </div>
            <table className="primary-background text-white overflow-scroll">
                <thead className="grey-text secondary-background">
                    { orderDataColumns.map(name => <th>{capitalizeFirstLetter(name)}</th>) }
                </thead>
                {
                    loading ? <div>Loading</div> : trades.length > 0 ? trades.map(trade => {
                        return (<tbody>
                            <tr>
                            <td>{generateSymbol(trade)}</td>
                            <td className={trade.action == "SELL" ? "sell-text" : "buy-text"}>{capitalizeFirstLetter(trade.items[0].action.toLowerCase())}</td>
                            <td>{trade.quantity}</td>
                            <td>{trade.filledQuantity}</td>
                            <td>{trade.items[0].lmtPrice}</td>
                            <td></td>
                            <td></td>
                            <td>{abbreviations[trade.items[0].orderType as keyof typeof abbreviations]}</td>
                            <td>{capitalizeFirstLetter(trade.items[0].timeInForce.toLowerCase())}</td>
                            <td>{capitalizeFirstLetter(String(trade.outsideRegularTradingHour))}</td>
                            <td>{trade.statusName}</td>
                            <td>{(Number(trade.items[0].filledAmount) / Number(trade.filledQuantity) / 100).toFixed(2)}</td>
                            <td>{trade.items[0].filledTime}</td>
                            <td>{trade.items[0].createTime}</td>
                        </tr></tbody>)
                    }) : <div className="w-full">No Trades</div>
                }

            </table>
        </div>
    )
}

export default Orders
