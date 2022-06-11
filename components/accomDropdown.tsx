import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

export const accomodationArr: string[][] = [
  ["I don't live on campus"],
  [
    'Eusoff Hall',
    'Kent Ridge Hall',
    'King Edward VII Hall',
    'Raffles Hall',
    'Sheares Hall',
    'Temasek Hall',
  ],
  [
    'Ridge View Residential College',
    'College of Alice & Peter Tan',
    'Residential College 4',
    'Tembusu College',
    'NUS College',
  ],
  ['LightHouse', 'Pioneer House'],
  ['PGP Residence', 'UTown Residence'],
]

export const AccomDropdown = ({
  selectedAccomodation,
  setSelectedAccomodation,
  id,
}) => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <Menu as="div" className="relative text-left" id={id}>
      <div>
        <Menu.Button className="flex justify-end align-text-top w-full rounded-md border border-gray-300 shadow-sm pl-4 pr-2 py-2 bg-white text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          <div className="grow text-left">{selectedAccomodation}</div>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Menu.Items className="origin-top absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-300 focus:outline-none">
        {accomodationArr.map((type, index) => (
          <div key={index} className="py-1">
            {type.map((name, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={() => setSelectedAccomodation(type[index])}
                    className={
                      classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm',
                      ) + ' text-left w-full'
                    }
                  >
                    {name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        ))}
      </Menu.Items>
    </Menu>
  )
}
