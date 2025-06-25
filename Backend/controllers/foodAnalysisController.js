const { GoogleGenerativeAI } = require('@google/generative-ai');
const { parseGeminiResponse } = require('../utils/helpers');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');


// Analyze food image using Gemini AI
const analyzeFoodImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image file provided' 
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert buffer to base64
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');

    // Prepare the image data for Gemini
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: req.file.mimetype,
      },
    };

    // Create a detailed prompt for food and cuisine identification
    const prompt = `
    Analyze this food image and provide detailed information in the following format:

    1. Identify the main cuisine type (e.g., Italian, Chinese, Indian, Mexican, etc.)

    Please be specific and accurate. If you're not sure about something, mention it.
    Focus on identifying the cuisine style.
    `;

    // Generate content
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the response to extract structured information
    const analysis = parseGeminiResponse(text);

    res.status(200).json({
      success: true,
      data: analysis,
      metadata: {
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to analyze image',
      error: error.message 
    });
  }
};

module.exports = {
  analyzeFoodImage
};