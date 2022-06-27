import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { useAlert } from "../helpers/alertContext"
import { AlertType, AlertCategory } from "types"

const alertClasses: {[key in AlertCategory]: { bgColor: string, svgColor: string, textColor: string }} = {
    danger: {
        bgColor: "bg-red-200",
        svgColor: "text-red-600",
        textColor: "text-red-800"
    },
    warning: {
        bgColor: "bg-orange-200",
        svgColor: "text-yellow-600",
        textColor: "text-yellow-800"
    },
    info: {
        bgColor: "bg-blue-200",
        svgColor: "text-blue-600",
        textColor: "text-blue-800"
    },
    success: {
        bgColor: "bg-green-200",
        svgColor: "text-green-600",
        textColor: "text-green-800"
    }
}

export const Alert = () => {
    const [alert, setAlert] = useAlert()
    const [displayAlert, setDisplayAlert] = useState<AlertType>()

    // only called on mount; thus ignoring lint warning of including alert in dependency
    useEffect(() => {
        if (alert) {
            setDisplayAlert(alert)
            setAlert(undefined);        // resets the global context immediately
        }
    }, [setAlert])

    // called on updates of alert after mount
    useEffect(() => {
        if (alert && alert.displayNow) {
            setDisplayAlert(alert)
            setAlert(undefined);        // resets the global context immediately
        }

    }, [alert, setDisplayAlert, setAlert])

    useEffect(() => {
        if (displayAlert) {
            setTimeout(() => setDisplayAlert(undefined), 5000)
        }
    }, [displayAlert])
    if (displayAlert) {
        return (
            <div className="w-full flex justify-center z-20">
                <div
                    className={`${alertClasses[displayAlert.type].bgColor} px-6 py-3 my-4 rounded-md flex items-center fixed w-1/2`}
                    >
                    <svg
                        viewBox="0 0 24 24"
                        className={`${alertClasses[displayAlert.type].svgColor} w-5 h-5 sm:w-5 sm:h-5 mr-3`}
                        >
                        <path
                            fill="currentColor"
                            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                            ></path>
                    </svg>
                    <span className={alertClasses[displayAlert.type].textColor}>{ displayAlert.message }</span>
                </div>
            </div>
        )
    } else {
        return null
    }
    
}