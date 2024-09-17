const axios = require('axios');

const payload = {
  "data": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFRUWGBgYGBcYGBgYGBsaGRgYFxcYFxgdHSggGBolHRgVITEhJSkrLi8uFx8zODMtNygtLysBCgoKDg0OGxAQGy0mICYrLS8vLS0vLS0vLy8rMC0vKystKy0tLTUvLS8vLS4tLTUtMC0tMC0tLS8vLS0vLS0tLf/AABEIARQAtgMBIgACEQEDEQH..."
};

axios.post(
  'https://lokeshpanjiar.us-east-2.aws.modelbit.com/v1/predict_image/latest',
  payload,
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
)
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error);
});
