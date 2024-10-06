import React from 'react'
import logo from '../Resources/logodark.png'
import { Footer } from 'flowbite-react';
import { BsFacebook, BsLinkedin, BsInstagram, BsTwitter } from 'react-icons/bs';

export default function FooterC() {
  return (
    <footer class=" bg-[#B4E2EF]">
      <div class="container m-auto space-y-8 px-6 py-10 text-gray-600 md:px-12 lg:px-20">
        <div class="flex flex-wrap items-center justify-between gap-4  border-b border-[#6ADBFA] pb-8">
          <img
            width="100"
            height="100"
            src={logo}
            alt="logo tailus"
            class="w-52"
          />

        </div>
        <div class="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <div>
            <h6 class="text-lg font-medium text-cyan-900">Company</h6>
            <ul class="mt-2 list-inside space-y-4">
              <li>
                <i class="fa fa-home" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> House Rules</a>
              </li>
              <li>
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> Cancellation Policy</a>
              </li>
              <li>
                <i class="fa fa-question-circle" aria-hidden="true"></i>
                <a href="/faq" class="transition hover:text-cyan-600"> FAQ</a>
              </li>
            </ul>
          </div>
          <div>
            <h6 class="text-lg font-medium text-cyan-900">Support</h6>
            <ul class="mt-2 list-inside space-y-4">
              <li>
                <i class="fa fa-file-text" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> Terms and Conditions</a>
              </li>
              <li>
                <i class="fa fa-users" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> Customers</a>
              </li>
              <li>
                <i class="fa fa-check-circle" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> Privacy Statement</a>
              </li>
              <li>
                <i class="fa fa-money" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> Payment Terms</a>
              </li>
            </ul>
          </div>
          <div>
            <h6 class="text-lg font-medium text-cyan-900">Contact</h6>
            <ul class="mt-2 list-inside space-y-4">
              <li>
                <i class="fa fa-phone-square" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> +91 7999913023</a>
              </li>
              <li>
                <i class="fa fa-envelope" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> info@aaryastays.com</a>
              </li>
            </ul>
          </div>
          <div>
            <h6 class="text-lg font-medium text-cyan-900">Social</h6>
            <ul class="mt-2 list-inside space-y-4">
              <li>
                <i class="fa fa-twitter-square" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> Twitter / X</a>
              </li>
              <li>
                <i class="fa fa-instagram" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> Instagram</a>
              </li>
              <li>
                <i class="fa fa-facebook-official" aria-hidden="true"></i>
                <a href="#" class="transition hover:text-cyan-600"> Facebook</a>
              </li>
            </ul>
          </div>
        </div>
        <div class=" text-gray-600">
          <span>&copy; <span id="year">2023 AARYA STAYS. ALL RIGHTS RESERVED. </span></span>
        </div>
      </div>
    </footer>
  )
}
