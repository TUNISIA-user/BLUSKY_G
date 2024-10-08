import React, { useEffect, useState } from 'react';
import './Admin.css';
import axios from './axios';
import Card from './Card';
import { useGlobalContext } from '../Store/GlobalContext';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
const Admin = () => {
    const [messages, setMessages] = useState([]);
    const { dispatch, BasketMassages, userTage, TokenUser } = useGlobalContext();
    const [document, setDocument] = useState('');

    const FetchDataFromArray = async () => {
        try {
            const response = await axios.get('/getChatPostForAdmin');
            setMessages(response.data);
        } catch (error) {
            console.log(`Issue fetching data: ${error}`);
        }
    };

    useEffect(() => {
        FetchDataFromArray();
    }, []);

    const HandleSendMessageForTheUserReact = async () => {
        if (!document.trim()) {
            alert('Message cannot be empty!');
            return;
        }

        const newMessage = {
            textQuestion: "", // Assuming no question from admin
            id: "",
            name: "admin",
            answerUser: document,
            rept: "AdminUser",
        };

        try {
            // Update the database
            const response = await axios.put(`/ChatSession/${TokenUser._id}`, {
                PrivateSession: [newMessage],
            });

            if (response) {
                // Add the new message to the front-end state immediately
                const updatedMessages = [...BasketMassages.flat(), newMessage];

                // Dispatch updated messages to the global context
                dispatch({
                    type: 'MESSAGES',
                    payload: updatedMessages,
                });

                setDocument(''); // Clear the input field
                alert('Message sent successfully!');
            }
        } catch (error) {
            console.log(`Error sending message: ${error}`);
        }
    };

    return (
        <div className='Admin'>
            <div className='Container__admin'>
                <div className='right'>
                    {messages.map((item) => (
                        <Card key={item._id} cardItem={item} allMessage={messages} />
                    ))}
                </div>

                <div className='left'>
                    <div className='ContainerChat'>
                        <div className='ContainerName'>N</div>
                        <div className='ContainerNamec' style={{ color: 'white' }}>N</div>
                    </div>
                    <hr />
                    <div className='MessageaAdminRouetes'>
                        {BasketMassages[0]?.map((item) => (
                            <div className={item.rept === 'AdminUser' ? 'righINdex' : 'message'}>
                                <span>Status: {item.rept}</span>
                                <span>Reference: {item._id}</span>
                                <span style={{ display: item.textQuestion === '' && 'none' }}>
                                    Question: {item.textQuestion}
                                </span>
                    <span >
                        Answer:  
                        <div
    style={{
        
        height: "100px",       // Adjust height as needed
        overflowY: "auto",     // Enable vertical scrolling
        width: "100%",         // Full width of its parent container
        padding: "10px",      // Padding around the content
        boxSizing: "border-box", // Ensure padding is included in width/height
    }}
>
    <BlockMath
        math={String.raw`${item.answerUser}`}
        // Additional styling for BlockMath if needed
        // style={{ maxWidth: "100%" }}
    />
</div> 
                        </span>  
                        
                                        
                                <span>{item.createdAt}</span>
                            </div>
                        ))}
                    </div>

                 

                    <div className='sendiy'>
                        <input
                            type='text'
                            value={document}
                            onChange={(e) => setDocument(e.target.value)}
                            placeholder='Type your message...'
                        />
                        <button
                            onClick={HandleSendMessageForTheUserReact}
                            style={{ cursor: 'pointer' }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
