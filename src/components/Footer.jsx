export default function Footer() {
  return (
    <div className="d-flex flex-column flex-sm-row justify-content-evenly align-items-center footer text-center p-2">
      <p className='m-1'>Joy With Learning</p>
      <p className='m-1'>{`© 2024 KMIT. All Rights Reserved`}</p>
      <a href='mailto:info@joywithlearning.com' target='_blank' className='m-1'>info@joywithlearning.com</a>
    </div>
  );
}