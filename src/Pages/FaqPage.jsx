import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Faq.css'
import NavbarC from '../Components/NavbarC'
import Social from '../Components/Social'
import { getAllFaqs } from '../Store/faqSlice'
import DashBoardFaqRow from '../Components/DashBoardFaqRow'

export default function Faq() {


    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const faq = useSelector((state) => state.faq.allFaqs);
    console.log(faq)
    const dispatch = useDispatch();

    const handleFaqClick = (event, index) => {
        // Prevent default behavior of <details> element
        event.preventDefault();

        // Toggle the clicked FAQ; close it if already open, open it otherwise
        setOpenFaqIndex(index === openFaqIndex ? null : index);
    };

    useEffect(() => {
        dispatch(getAllFaqs());
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close the FAQ if clicked outside
            if (!event.target.closest("details")) {
                setOpenFaqIndex(null);
            }
        };

        // Add the event listener to the document
        document.addEventListener("click", handleClickOutside);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className='bg-[white] min-h-screen h-auto'>
            <NavbarC />
            <Social />
            <h2>Frequently Asked Questions</h2>

            <div style={{ visibility: "hidden", position: "absolute", width: "0px", height: "0px" }}>
                <svg xmlns="http://www.w3.org/2000/svg">
                    <symbol viewBox="0 0 24 24" id="expand-more">
                        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /><path d="M0 0h24v24H0z" fill="none" />
                    </symbol>
                    <symbol viewBox="0 0 24 24" id="close">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /><path d="M0 0h24v24H0z" fill="none" />
                    </symbol>
                </svg>
            </div>
            {faq &&
                faq?.map((item) => {
                    return (
                        <details open={openFaqIndex === item._id}>
                            <summary onClick={(e) => handleFaqClick(e, item._id)}>
                                {item?.question}
                                <svg class="control-icon control-icon-expand" width="24" height="24" role="presentation"><use xlink="http://www.w3.org/1999/xlink" href="#expand-more" /></svg>
                                <svg class="control-icon control-icon-close" width="24" height="24" role="presentation"><use xlink="http://www.w3.org/1999/xlink" href="#close" /></svg>
                            </summary>
                            <p>{item?.answer}</p>
                        </details>
                    )
                })
            }

        </div>
    )
}