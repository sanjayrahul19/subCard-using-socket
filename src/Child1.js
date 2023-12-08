import React from 'react'

const Child1 = ({ profileTitle, subCardDetails,sections  }) => {
    // console.log(sectionData, "sectionData")
    return (
        <div>
            <p>profileTitle: {profileTitle}</p>
            <h1>Static Data</h1>
            <p>Title: {subCardDetails.title}</p>
            <p>selectedOption: {subCardDetails.option}</p>
            <p>Description :{subCardDetails.description}</p>
            <h1>Sections</h1>
            {sections.length > 0 ? (<div>
                {
                    sections.map((section) => <div key={section.key}>
                        <p>Section title: {section.title}</p>
                        <p>Section option:{section.option}</p>
                        <p>Section description:{section.description}</p>
                    </div>)
                }
            </div>) :
                <h3>No sections</h3>}
        </div>
    )
}

export default Child1