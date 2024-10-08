import React from 'react'
// import {SocialStyle} from './SocialStyle.css';

export default function Social() {
  const contact = () => {
    window.open('https://api.whatsapp.com/send?phone=919136886650&text=Hello I want to enquire', '_blank', 'noreferrer');
  }
  // window.open('https://api.whatsapp.com/send?phone=919136886650&text='+msg, '_blank', 'noreferrer');
  return (
    <div class="icon-bar max-md:hidden" >
      <a href="#" className="facebook"><i class="fa fa-facebook"></i></a>
      <a href="#" className="instagram"><i class="fa fa-instagram"></i></a>
      <a onClick={() => { contact() }} className="whatsapp"><i class="fa fa-whatsapp"></i></a>
    </div>
  )
}
