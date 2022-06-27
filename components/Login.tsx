import { LockClosedIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { Logo } from './Logo'
import { useState, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'
import { useAlert } from '../helpers/alertContext'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'

export const Login = () => {
  const [alert, setAlert] = useAlert()
  const router = useRouter()
  const { user, error } = useUser()
  if (user) {
    router.push('/deliverer/home')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formFields.email) {
      setAlert({ type: 'info', message: 'Enter email' })
    } else if (!formFields.password) {
      setAlert({ type: 'info', message: 'Enter password' })
    } else {
      const { user, session, error } = await supabaseClient.auth.signIn(
        formFields,
      )

      if (error) {
        setAlert({ type: 'warning', message: error.message })
      }
    }
  }

  type FormFields = {
    email: string
    password: string
  }

  const [formFields, setFormFields]: [
    FormFields,
    Dispatch<SetStateAction<FormFields>>,
  ] = useState({
    email: undefined,
    password: undefined,
  })

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white max-w-md w-full space-y-8 rounded-lg shadow-lg p-10">
        <div>
          <Logo />
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account yet?{' '}
            <Link href="/register">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register here.
              </a>
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full appearance-none rounded-none relative px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm flex-grow"
                placeholder="Email"
                onChange={(e) =>
                  setFormFields({ ...formFields, email: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={(e) =>
                  setFormFields({ ...formFields, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/resetpassword">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
