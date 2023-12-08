import React, { useState, useEffect } from 'react'
import Child1 from "./Child1"
import axios from "./axios/axios"
import { useSocketContext } from "./socket/Socket"

const Parent = () => {
    const [profile, setProfile] = useState({
        title: '',
        bio: ''
    });

    const [subCardDetails, setSubCardDetails] = useState({
        title: '',
        option: 'text',
        description: '',
    });

    const cardId = localStorage.getItem("cardId");

    const [sections, setSections] = useState([]);

    const socket = useSocketContext();



    //listen Sub Card event

    const subCardId = localStorage.getItem("subcardId")


    useEffect(() => {
        getCardDetails();
        listSubCardDetails()
    }, [cardId]);

    //get card title
    const getCardDetails = async () => {
        try {
            if (!cardId) return;
            const { data } = await axios.get(`user/get-card/${cardId}`);
            if (data) {
                setProfile({
                    title: data?.data?.card.title || '',
                    bio: data?.data?.card.bio || '',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    //list first subCard detail
    const listSubCardDetails = async () => {
        try {
            if (!cardId) return;
            const { data } = await axios.get(`user/get-sub-card/${cardId}`)
            if (data) {
                console.log(data.data, "subcard details");
                if (data && data.data.length > 0) {
                    const remainingSections = data.data.slice(1);
                    const updatedSubCard = {
                        title: data.data[0].title,
                        description: data.data[0].description,
                        option: data.data[0].option,
                    }
                    console.log(updatedSubCard, "subcard first data")
                    setSubCardDetails(updatedSubCard);
                    setSections(remainingSections.map(section => ({
                        key: section._id,
                        title: section.title || '',
                        option: section.option || 'text',
                        description: section.description || '',
                    })));
                    // console.log(sections,"sections")
                    // console.log(subCardDetails,"subcard details")
                    // console.log(remainingSections,"remaining sections")
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    const addSection = () => {

        socket.emit("ADD_SUB_CARD", {
            title: '',
            option: 'text',
            description: '',
            cardId: cardId,
        });

        // Listen for the "ADD_SUB_CARD" event to get the subcardId
        socket.once("ADD_SUB_CARD", (data) => {
            // localStorage.setItem("sectionId", data._id);

            // Create a new section object with a unique key
            const newSection = {
                key: data._id,
                title: '',
                option: '',
                description: '',
            };

            // Update the state with the new section
            setSections([...sections, newSection]);
        });
    };

    //handle profileTitle
    const handleProfile = (field,value) => {
        setProfile((preProfile)=>{
            const updatedProfile ={...preProfile,[field]:value}
            if(cardId) socket.emit("UPDATE_CARD",{_id:cardId,...updatedProfile}) 
            return updatedProfile;
        })
    };

    console.log(profile,"profile")

    //handle static section
    const handleSubCardChange = (field, value) => {
        setSubCardDetails((prevDetails) => {
            const updatedDetails = { ...prevDetails, [field]: value };

            // Emit the "UPDATE_SUB_CARD" event to update values in the subcard
            if (subCardId) {
                // console.log(subCardId,...updatedDetails)
                socket.emit("UPDATE_SUB_CARD", { _id: subCardId, ...updatedDetails });
            }
            return updatedDetails;
        });
    };


    //handleSectionChange
    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...sections];
        updatedSections[index][field] = value;
        setSections(updatedSections);
        // console.log(updatedSections,"updatedSections");
        socket.emit("UPDATE_SECTION_CARD", updatedSections)
    };




    return (
        <div>
            <button onClick={addSection}>
                Add section
            </button>

            {/* Static Section */}
            <div>
                <input type='text' placeholder='profile title' value={profile.title} onChange={(e) => handleProfile('title', e.target.value)}/>
                <input type='text' placeholder='profile Bio' value={profile.bio} onChange={(e) => handleProfile('bio', e.target.value)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", width: "20%", margin: "10px" }}>
                <input type="text" placeholder='title' onChange={(e) => handleSubCardChange('title', e.target.value)} value={subCardDetails.title} />
                <select onChange={(e) => handleSubCardChange('option', e.target.value)} value={subCardDetails.option}>
                    <option value="text">text</option>
                    <option value="description">Description</option>
                </select>
                <textarea type="text" placeholder='description' onChange={(e) => handleSubCardChange('description', e.target.value)} value={subCardDetails.description} />
            </div>

            {/* section */}
            <div>

                {sections && sections.map((section, index) => (
                    <div key={section.key} style={{ display: 'flex', flexDirection: 'column', width: '20%', margin: '10px' }}>
                        <input
                            type="text"
                            placeholder="title"
                            value={section.title}
                            onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                        />
                        <select
                            value={section.option}
                            onChange={(e) => handleSectionChange(index, 'option', e.target.value)}
                        >
                            <option value="text">text</option>
                            <option value="description">Description</option>
                        </select>
                        <textarea
                            type="text"
                            placeholder="description"
                            value={section.description}
                            onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                        />
                    </div>
                ))}

                <Child1 profile={profile} subCardDetails={subCardDetails} sections={sections} />
            </div>
        </div>
    )
}

export default Parent