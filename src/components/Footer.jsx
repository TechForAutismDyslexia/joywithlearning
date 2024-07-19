import { useState } from 'react';

export default function Footer() {
  const [year] = useState(new Date().getFullYear());

  return (
    <div className="d-flex flex-column gap-3 flex-sm-row justify-content-center align-items-center footer text-center p-3">
    <p className='my-2 mx-2 fw-bold'>JoyWithLearning</p>
    <p className='my-2 mx-2 fw-bold'>{`© ${year} KMIT. All Rights Reserved`}</p>
    <a href='mailto:info@joywithlearning.com' target='_blank' className='my-2 mx-2 fw-bold'>info@joywithlearning.com</a>
  </div>
  );
}