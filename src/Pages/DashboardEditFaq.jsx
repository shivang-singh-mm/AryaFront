import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { BiTrash } from "react-icons/bi";
import { onAuthStateChanged } from "firebase/auth";
import { logout, login } from '../Store/userSlice';
import { authentication } from '../firebase/config';
import { deleteFaq, editFaq, getFaqById } from "../Store/faqSlice";
import DashBoardNavbar from "../Components/DashBoardNavbar";

const DashBoardEditFaq = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const faq = useSelector((state) => state.faq.faqById);

    const [answer, setAnswer] = useState();
    const [question, setQuestion] = useState();


    const user = useSelector(state => state.user);

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const unlisten = onAuthStateChanged(authentication,
            user => {
                if (user) {
                    const userData = {
                        token: user.accessToken,
                        uid: user.uid,
                        provider: user.providerData[0].providerId
                    }

                    const fetchData = async () => {
                        try {
                            console.log(user.uid);
                            const response = await api.get(`/api/v1/user/${user.uid}`);
                            console.log(response.data.role);
                            setVisible(true)

                            if (response.data.role != 'admin') {
                                navigate('/')
                            }
                        } catch (error) {
                            navigate('/')

                            // console.log(error)
                        }
                    }
                    // console.log(user)
                    fetchData()
                    dispatch(login(userData));

                    // setOpenModal(false);
                } else {
                    dispatch(logout());
                    navigate('/')
                }
            });
        return () => {
            unlisten();
        }
    }, []);


    const handleQuestion = (e) => {
        setQuestion(e.target.value);
    };

    const handleAnswer = (e) => {
        setAnswer(e.target.value);
    };


    const handleFaqDelete = (e) => {
        e.preventDefault();

        dispatch(deleteFaq(faq._id));

        navigate("/dashboard/faq");
    };

    const handleEditFaq = async (e) => {
        e.preventDefault();

        const newFaq = {};

        newFaq.question = question;
        newFaq.answer = answer;


        const updatedFaq = { id, newFaq };

        dispatch(editFaq(updatedFaq));
    };

    useEffect(() => {
        dispatch(getFaqById(id));
    }, [dispatch]);

    useEffect(() => {
        if (faq) {
            setQuestion(faq.question);
            setAnswer(faq.answer);
        }
    }, [faq]);

    if (!visible) {
        return <div></div>
    }

    return (
        <>
            <div>
                <DashBoardNavbar />
                <div className="bg-white px-8 py-5 rounded mx-auto box-border w-3/4">
                    <div className="flex justify-between mb-10">
                        <h2 className="text-3xl text-center font-poppins">Edit Property</h2>
                        <button onClick={handleFaqDelete}>
                            <BiTrash className="block bg-red-500 text-white p-3 text-5xl rounded-xl hover:bg-red-600 hover:cursor-pointer" />
                        </button>
                    </div>
                    <form action="" className="font-montserrat text-sm">
                        <div className="mb-3">
                            <input
                                type="text"
                                className={`border-2 rounded-xl py-1 px-3  w-full "text-black"}`}
                                placeholder="Question"
                                value={question}
                                onChange={handleQuestion}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                className={`border-2 rounded-xl py-1 px-3  w-full "text-black"}`}
                                placeholder="Answer"
                                value={answer}
                                onChange={handleAnswer}
                            />
                        </div>

                        <button
                            className="block w-full bg-[#F79489] text-white py-1 px-5 rounded-full hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border text-xl text-semibold mb-3 font-poppins"
                            onClick={handleEditFaq}
                        >
                            Save
                        </button>
                    </form>

                </div>
            </div>
        </>
    );
};

export default DashBoardEditFaq;
