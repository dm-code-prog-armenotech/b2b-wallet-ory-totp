'use client';
import { BallTriangle } from 'react-loader-spinner';

export const Loader = ({ size }: { size?: number }) => {
  if (size) {
    return <BallTriangle color="#4338ca" height={size} width={size} />;
  }
  return <BallTriangle color="#4338ca" height={80} width={80} />;
};
