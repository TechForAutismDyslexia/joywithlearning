import { useState } from 'react';

export default function Footer() {
  const [year] = useState(new Date().getFullYear());

  return (
    <div className="d-flex flex-column gap-3 flex-sm-row justify-content-center align-items-center footer text-center p-3">
    <p className='my-2 mx-2 fw-bold'>JoyWithLearning</p>
    <p className='my-2 mx-2 fw-bold'>{`© ${year} KMIT. All Rights Reserved`}</p>
    <a href='mailto:tadkmit@gmail.com' className='my-2 mx-2 fw-bold'>tadkmit@gmail.com</a>
  </div>
  );
}