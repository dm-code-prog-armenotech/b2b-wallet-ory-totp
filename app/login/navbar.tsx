'use client'
import { Disclosure } from '@headlessui/react';

export const Navbar = () => {
  return (
    <Disclosure as='nav' className='bg-white shadow-sm'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex h-16 justify-between'>
              <div className='flex'>
                <div className='flex flex-shrink-0 items-center'>
                  <svg
                    width='32'
                    height='32'
                    viewBox='0 0 32 32'
                    fill='none'
                    className='text-gray-100'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <rect
                      width='100%'
                      height='100%'
                      rx='16'
                      fill='currentColor'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z'
                      fill='black'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};