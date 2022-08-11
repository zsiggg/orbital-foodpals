import { accomodationArr } from "components/AccomDropdown"
import Head from "next/head"
import { Slideover } from "components/Slideover"
import { useEffect, useState } from "react"
import { UserDto } from "types"
import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs"
import { useUser } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { useAlert } from "contexts/AlertContext"
import { Alert } from 'components/Alert'

const settings = () => {
    const [userId, setUserId] = useState<string>('')
    const [userName, setUserName] = useState<string>('')
    const { user, error } = useUser()
    const router = useRouter()
    const [alert, setAlert] = useAlert()

    const [showRadius, setShowRadius] = useState<boolean>(undefined)

    useEffect(() => {
        const loadUserInfo = async (user) => {
          const { data, error } = await supabaseClient
            .from<Partial<UserDto>>('users')
            .select('name')
            .eq('id', user.id)
            .limit(1)
            .single()
          if (error) {
            console.log(error)
          } else {
            setUserName(data.name)
          }
        }
        if (user) {
            setUserId(user.id)
            loadUserInfo(user)
        }
    }, [user])

    // should probably update supabase with all locations and coordinates
    // retrieve locations from supabase (order by id) and set to selectedAccom (with an extra 'selected' property in each row)
    // retrieve user's preferences and set selectedAccom as needed

    // submitting
    // if radius, call mapbox api
    // if manual, then make into a json (key: deliveryLocation, value: destination ids)

    const temp = {}
    accomodationArr.forEach(type => {
        type.forEach(accom => {
            temp[accom] = false
        })
    })
    const [selectedAccom, setSelectedAccom] = useState(temp)
    const [selectedRadius, setSelectedRadius] = useState<string>("0.5")

    async function handleSubmit(e) {
        e.preventDefault()
        if (showRadius == undefined) {
            setAlert({ type: 'info', message: 'No delivery location preference selected', displayNow: true })
            return
        } else if (showRadius) {   // automatically select location within a radius
            // should make a call to supabase to update preferences in user table
        } else if (!showRadius && showRadius != undefined) {    // manually select location
            // should make a call to supabase to update preferences in user table
            if (Object.keys(selectedAccom).filter(accom => selectedAccom[accom]).length == 0) {
                setAlert({ type: 'info', message: 'Select at least one delivery location', displayNow: true })
                return
            }
        }
        setAlert({ type: 'success', message: 'Settings saved', displayNow: false })
        router.back()
    }

    return (
        <>
            <Head>
                <title>Settings</title>
            </Head>
            <Alert />
            <div className="container mx-auto p-4">
                <div className='flex justify-between items-center'>
                    <div>
                        <div className="text-3xl font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 my-auto mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                            Settings
                        </div>
                    </div>
                    <Slideover userName={userName} userId={userId} />
                </div>

                <div className="my-8 shadow-sm rounded-lg p-4 bg-white">
                    <div className="text-lg font-semibold">Delivery Location Preference</div>
                    <form className="mt-6" onSubmit={handleSubmit}>
                        <label className="block">
                            <input type="radio" name="deliveryLocation" onChange={() => setShowRadius(true)}/>
                            <span className="ml-4">Automatically select locations within a radius</span>
                        </label>
                        {showRadius && 
                            <div className="ml-8 mt-2">
                                <select className="border py-1 pl-1 pr-2 rounded-md" value={selectedRadius} onChange={e => setSelectedRadius(e.target.value)}>
                                    <option value="0.5">500m</option>
                                    <option value="1">1km</option>
                                    <option value="2">2km</option>
                                    <option value="3">3km</option>
                                </select>
                            </div>
                        }

                        <label className="block mt-4">
                            <input type="radio" name="deliveryLocation" onChange={() => setShowRadius(false)}/>
                            <span className="ml-4">Manually select locations</span>
                        </label>
                        {showRadius != undefined && !showRadius && 
                            <div className="mx-8 mt-2">
                                {accomodationArr.map((type, index) => (
                                    <fieldset key={index} className="py-6 grid grid-cols-2 gap-2">
                                        {type.map((accom, index) => (
                                            <label className="flex items-center" key={index}>
                                                <input name="locations" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" 
                                                    value={accom} checked={selectedAccom[accom]} onChange={() => setSelectedAccom({...selectedAccom, [accom]: !selectedAccom[accom]})} />
                                                <span className="ml-4">{accom}</span>
                                            </label>
                                        ))}
                                    </fieldset>
                                ))}
                            </div>
                        }
                        {showRadius != undefined &&
                            <button
                            type="submit"
                            className="relative flex justify-center py-2 px-4 mt-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSubmit}>
                                Save
                            </button>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}

export default settings
export const getServerSideProps = withPageAuth({ redirectTo: '/login' })