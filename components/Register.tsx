import { Logo } from './Logo'
import { useState, Dispatch, SetStateAction } from 'react'
import { accomodationArr, AccomDropdown } from './AccomDropdown'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'
import { useAlert } from '../helpers/alertContext'
import { Alert } from './Alert'
import { DestinationDto, UserDto } from 'types'

type RegisterFormFields = {
  name: string
  email: string
  accom: string
  phone: string
  password: string
}

export const Register = () => {
  const router = useRouter()
  const [alert, setAlert] = useAlert()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formFields.name) {
      setAlert({ type: 'info', message: 'Enter your name', displayNow: true })
    } else if (!emailRegex.test(formFields.email)) {
      setAlert({ type: 'info', message: 'Please use your NUS email', displayNow: true })
    } else if (
      formFields.accom == '' ||
      !accomodationArr.reduce(
        (bool, accomTypeArr) => bool || accomTypeArr.includes(formFields.accom),
        false,
      )
    ) {
      setAlert({ type: 'info', message: 'Enter an accomodation', displayNow: true })
    } else if (!phoneRegex.test(formFields.phone)) {
      setAlert({
        type: 'info',
        message:
          'Enter a Singapore phone number (starting with 8 or 9) and without +65',
        displayNow: true 
      })
    } else if (!confirmPassword || !formFields.password) {
      setAlert({ type: 'info', message: 'Enter password', displayNow: true })
    } else if (formFields.password.length < 6) {
      setAlert({
        type: 'info',
        message: 'Passwords should be at least 6 characters long',
        displayNow: true })
    } else if (confirmPassword != formFields.password) {
      setAlert({ type: 'warning', message: 'Passwords do not match', displayNow: true })
    } else {
      const { user, session, error } = await supabaseClient.auth.signUp({
        email: formFields.email,
        password: formFields.password,
      })
      if (error) {
        setAlert({
          type: 'danger',
          message: error.status + ': ' + error.message,
          displayNow: true
        })
      } else {
        const { data: destination } = await supabaseClient
          .from<DestinationDto>('destinations')
          .select('*')
          .eq('name', formFields.accom)
          .single()

        const newUser: UserDto = {
          id: user.id,
          name: formFields.name,
          email: formFields.email,
          default_destination: destination.id,
          phone: formFields.phone,
          created_at: new Date(),

          pending_orders: [],
          is_deliverer: false,
        }
        const { data, error } = await supabaseClient
          .from('users')
          .insert(newUser, { returning: 'minimal' })

        console.log(data)
        console.log(error)

        router.push('/login')

        setAlert({
          type: 'success',
          message:
            'A confirmation message has been sent to your email if it is not associated with an existing account',
          displayNow: false
        })
      }
    }
  }

  // not sure if need to include picture

  const emailRegex = /.+(@u.nus.edu)$/
  const phoneRegex = /^([8-9][0-9]{7})$/
  const [formFields, setFormFields]: [
    RegisterFormFields,
    Dispatch<SetStateAction<RegisterFormFields>>,
  ] = useState({
    name: undefined,
    email: undefined,
    accom: undefined,
    phone: undefined,
    password: undefined,
  })
  const [confirmPassword, setConfirmPassword]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('')

  return (
    <>
      <Alert />
      <div className="min-h-full flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-10">
          <Logo />

          <form className="mt-8">
            <div>
              <label className="text-gray-800 font-semibold block my-3 text-md">
                Photo
              </label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <button
                  type="button"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change
                </button>
              </div>
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="username"
              >
                Name
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="text"
                name="username"
                id="username"
                required
                onChange={(e) =>
                  setFormFields({ ...formFields, name: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="email"
              >
                NUS Email
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="email"
                name="email"
                id="email"
                required
                onChange={(e) =>
                  setFormFields({ ...formFields, email: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="accom"
              >
                Residential Location on Campus
              </label>
              <AccomDropdown
                id="accom"
                selectedAccomodation={formFields.accom}
                setSelectedAccomodation={(s: string) =>
                  setFormFields({ ...formFields, accom: s })
                }
              />
            </div>

            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="number"
              >
                Phone Number
              </label>
              <div className="flex flex-row">
                <span className="inline-flex items-center px-3 py-2 rounded-l-md bg-gray-50 text-gray-500 text-sm">
                  +65
                </span>
                <input
                  className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                  type="tel"
                  name="tel"
                  id="tel"
                  required
                  onChange={(e) =>
                    setFormFields({ ...formFields, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="password"
                name="password"
                id="password"
                required
                onChange={(e) =>
                  setFormFields({ ...formFields, password: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="confirm"
              >
                Confirm password
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="password"
                name="confirm"
                id="confirm"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
