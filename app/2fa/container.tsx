import { ReactNode } from 'react';

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={
        'flex flex-col w-full bg-gray-50 p-12 items-center justify-center'
      }
    >
      {children}
    </div>
  );
};
