<h1>🍽️ Food Finder</h1>

<p>
  <strong>Food Finder</strong> is a full-stack web application that helps users discover restaurants by location, cuisine, or even by uploading a food photo! Built with React (Vite) for the frontend and Node.js/Express/MongoDB for the backend, it offers a seamless, modern, and interactive restaurant search experience.
</p>
<h4>🔗 Live Demo: https://findingfood.netlify.app/ </h4>

<p>
  <strong>⚠️ Note:</strong> The backend is hosted on a free Render server. The first load may take <b>30-45 seconds</b> to wake up. Please be patient!
</p>

<hr />

<h2>🌟 Features</h2>
<ul>
  <li><strong>Search Nearby:</strong> Find restaurants near your location with adjustable search radius and filters.</li>
  <li><strong>Find by Cuisine:</strong> Browse restaurants by cuisine type, with pagination and detailed info.</li>
  <li><strong>Photo Cuisine Detection:</strong> Upload a food photo and let AI detect the cuisine, then find matching restaurants instantly.</li>
  <li><strong>Find by Restaurant ID:</strong> Quickly look up a restaurant by its unique ID.</li>
  <li><strong>Restaurant Details:</strong> View rich details for each restaurant, including ratings, address, services, pricing, and quick action links (menu, booking, photos).</li>
  <li><strong>Responsive Design:</strong> Fully mobile-friendly and visually appealing UI using custom CSS and gradients.</li>
  <li><strong>Pagination:</strong> Easily navigate through large lists of restaurants.</li>
  <li><strong>Error Handling:</strong> User-friendly error and loading states throughout the app.</li>
</ul>

<hr />

<h2>🚀 Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React (Vite), React Router, Custom CSS</li>
  <li><strong>Backend:</strong> Node.js, Express, MongoDB, Mongoose</li>
  <li><strong>AI Integration:</strong> Google Gemini API for cuisine detection from images</li>
</ul>

<hr />

<h2>🖥️ How to Run Locally</h2>
<ol>
  <li><strong>Clone the repository:</strong><br>
    <code>git clone https://github.com/UjjawalShakya/FoodFinder.git</code>
  </li>
  <li><strong>Frontend Setup:</strong>
    <ul>
      <li>Navigate to <code>Frontend</code> folder</li>
      <li>Install dependencies: <code>npm install</code></li>
      <li>Start dev server: <code>npm run dev</code></li>
    </ul>
  </li>
  <li><strong>Backend Setup:</strong>
    <ul>
      <li>Navigate to <code>Backend</code> folder</li>
      <li>Install dependencies: <code>npm install</code></li>
      <li>Set up your <code>.env</code> for MongoDB and Gemini API keys</li>
      <li>Start backend: <code>node server.js</code></li>
    </ul>
  </li>
  <li>Visit <code>http://localhost:5173</code> (or as shown in your terminal) to use the app.</li>
</ol>

<hr />

<h2>📂 Project Structure</h2>
<pre>
Food_Finder/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── ... (feature files)
│   ├── package.json
│   └── ... 
</pre>

<hr />
