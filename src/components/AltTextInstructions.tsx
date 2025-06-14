import React from 'react'

const AltTextInstructions: React.FC = () => {
  return (
    <div>
      <p>Crucial for accessibility (screen readers) & SEO.</p>
      <p>Key points:</p>
      <ul>
        <li>Describe the image content/purpose accurately.</li>
        <li>If the image is purely decorative (adds no information), leave this blank.</li>
        <li>
          For other files (e.g., PDFs), describe the file content/purpose (e.g., "PDF of the Annual
          Report 2023").
        </li>
      </ul>
      <p>More examples of the alt text:</p>
      <ul>
        <li>Group photo of the marketing team during the quarterly meeting.</li>
        <li>Dr. Eva Novak receiving an award at the Science Gala.</li>
        <li>Panel discussion with four speakers on stage at the Tech Summit.</li>
        <li>Close-up of attendees participating in a workshop session.</li>
        <li>Wide shot of the main hall during the keynote address at Event X.</li>
        <li>Team members brainstorming around a whiteboard in the office.</li>
      </ul>
    </div>
  )
}

export default AltTextInstructions
