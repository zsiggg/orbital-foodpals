import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition, Switch } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Slideover = ({ delivererToggle, userName }: { delivererToggle: boolean, userName: string }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [isDeliverer, setIsDeliverer] = useState<boolean>(delivererToggle)
    const router = useRouter()

    useEffect(() => {
        if (isDeliverer != delivererToggle) {
            setTimeout(
                () => {
                    isDeliverer
                        ? router.push('/deliverer/home')
                        : router.push('/buyer/home')
                }, 500
            )
        } 
    }, [isDeliverer, delivererToggle, router])

    return (
        <>
        <button onClick={() => setOpen(true)} className="p-5 text-gray-500 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        <Transition.Root show={open} as={Fragment}>
            <Dialog as='div' className='relative z-10' onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-hidden'>
                <div className='absolute inset-0 overflow-hidden'>
                    <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
                        <Transition.Child
                            as={Fragment}
                            enter='transform transition ease-out duration-300'
                            enterFrom='-translate-x-full'
                            enterTo='translate-x-0'
                            leave='transform transition ease-out duration-300'
                            leaveFrom='translate-x-0'
                            leaveTo='-translate-x-full'
                        >
                            <Dialog.Panel className='pointer-events-auto relative w-screen max-w-xs'>
                                <div className='flex h-full flex-col overflow-y-auto bg-white py-14'>
                                    <button
                                        type='button'
                                        className='absolute top-0 right-0 mt-4 mr-4 rounded-md text-gray-500 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white'
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className='sr-only'>Close panel</span>
                                        <XIcon className='h-6 w-6' aria-hidden='true' />
                                    </button>
                                    <div className='relative flex-1 px-4 sm:px-6'>
                                        <div className='flex flex-col items-center'>
                                            <div className='block h-14 w-14 rounded-full overflow-hidden bg-gray-100'>
                                                <svg
                                                    className='h-full w-full text-gray-300'
                                                    fill='currentColor'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                                                </svg>
                                            </div>
                                            <p className='mt-3 text-lg font-medium'>{ userName }</p>
                                        </div>
                                        <Switch.Group>
                                            <div className='mt-12'>
                                                <Switch.Label className='mr-3'>
                                                    Deliverer Mode
                                                </Switch.Label>
                                                <Switch
                                                    checked={isDeliverer}
                                                    onChange={setIsDeliverer}
                                                    className={`${isDeliverer ? 'bg-indigo-700' : 'bg-gray-300'}
                                                    relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
                                                >
                                                    <span className='sr-only'>Use setting</span>
                                                    <span
                                                    aria-hidden='true'
                                                    className={`${isDeliverer ? 'translate-x-4' : 'translate-x-0'}
                                                        pointer-events-none inline-block h-3 w-3 rounded-full bg-white transform transition duration-200 ease-in-out`}
                                                    />
                                                </Switch>
                                            </div>
                                        </Switch.Group>
                                        <Link href='/settings'>
                                            <button className='flex items-center group mt-12'>
                                                <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 inline-block text-gray-500 group-hover:text-black' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                                </svg>
                                                <span className='ml-2'>Settings</span>
                                            </button>
                                        </Link>
                                        <Link href='/api/auth/logout'>
                                            <button className='flex items-center group mt-3'>
                                                <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 inline-block text-gray-500 group-hover:text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                                                </svg>
                                                <span className='ml-2 group-hover:text-red-600'>Log out</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
                </div>
            </Dialog>
        </Transition.Root>
        </>
    )
}
