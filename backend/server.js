const express = require ('express');
const cors = require ('cors');
const multer = require ('multer');
const helmet = require ('helmet');
const rateLimit = require ('express-rate-limit');
const pdf = require ('pdf-parse');
const {AzureOpenAI} = require ('openai');
const path = require ('path');
require ('dotenv').config ({path: '../.env'});

const app = express ();
const PORT = process.env.PORT || 5000;

const _dirname = path.resolve ();

// Security middleware
app.use (helmet ());
app.use (
  cors ({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ].filter (Boolean),
    credentials: true,
  })
);

app.use (express.static (path.join (_dirname, '/frontend/build')));
app.get ('*', (req, res) => {
  res.sendFile (path.join (_dirname, 'frontend', 'build', 'index.html'));
});

// Rate limiting
const limiter = rateLimit ({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use ('/api/', limiter);

// Body parsing middleware
app.use (express.json ({limit: '10mb'}));
app.use (express.urlencoded ({extended: true, limit: '10mb'}));

// Configure multer for file uploads
const upload = multer ({
  storage: multer.memoryStorage (),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb (null, true);
    } else {
      cb (new Error ('Only PDF files are allowed!'), false);
    }
  },
});

// Configure Azure OpenAI
const client = new AzureOpenAI ({
  apiKey: process.env.OPENAI_API_KEY,
  endpoint: process.env.AZURE_ENDPOINT,
  apiVersion: process.env.API_VERSION,
  deployment: process.env.AZURE_DEPLOYMENT,
});

class HealthAdvisor {
  constructor () {
    this.systemPrompt = `You are a knowledgeable and empathetic health advisor who specializes in 
    interpreting blood test results and providing health recommendations in extremely simple language 
    that anyone without medical knowledge can understand.`;
  }

  async analyze (pdfBuffer) {
    const analysisPrompt = `As a compassionate and knowledgeable health advisor, please analyze the blood marker report 
    and provide insights in extremely simple, everyday language. Imagine you're explaining to someone with 
    no medical background. Avoid technical jargon, and when you must use a medical term, explain it immediately.
    
    Focus on:
    1. Identifying any concerning or out-of-range markers
    2. Explaining what these markers mean using simple analogies and everyday examples
    3. Suggesting specific lifestyle changes, including:
       - Recommended physical activities that are easy to understand and implement
       - Common, everyday foods to include or avoid (use familiar food names, not nutrients)
    
    Please structure your response in a friendly, conversational manner as if talking to a friend.
    
    Please format your response with clear sections using markdown:
    -  Overall Health Summary
    -  Key Findings
    -  Recommendations
    -  Lifestyle Changes
    -  Important Notes`;

    try {
      // Extract text from PDF
      const data = await pdf (pdfBuffer);
      const text = data.text;

      if (!text.trim ()) {
        throw new Error (
          'No text could be extracted from the PDF. Please ensure the PDF contains readable text.'
        );
      }

      const response = await client.chat.completions.create ({
        model: 'gpt-4o',
        messages: [
          {role: 'system', content: this.systemPrompt},
          {
            role: 'user',
            content: `${analysisPrompt}\n\nBlood Marker Report:\n${text}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error (`Error analyzing blood markers: ${error.message}`);
    }
  }
}

// Routes
app.get ('/api/health', (req, res) => {
  res.json ({message: 'Health Advisor API is running!', status: 'OK'});
});

app.post ('/api/analyze', upload.single ('bloodReport'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status (400).json ({error: 'No file uploaded'});
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status (500).json ({
        error: 'OpenAI API key is not configured. Please check your environment variables.',
      });
    }

    const advisor = new HealthAdvisor ();
    const analysis = await advisor.analyze (req.file.buffer);

    res.json ({
      success: true,
      filename: req.file.originalname,
      fileSize: req.file.size,
      analysis: analysis,
      timestamp: new Date ().toISOString (),
    });
  } catch (error) {
    console.error ('Analysis error:', error);
    res.status (500).json ({
      error: error.message ||
        'An error occurred while analyzing the blood report',
    });
  }
});

// Error handling middleware
app.use ((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res
        .status (400)
        .json ({error: 'File too large. Maximum size is 10MB.'});
    }
  }

  console.error ('Unhandled error:', error);
  res.status (500).json ({error: 'Internal server error'});
});

// 404 handler
app.use ('*', (req, res) => {
  res.status (404).json ({error: 'Endpoint not found'});
});

app.listen (PORT, () => {
  console.log (`🚀 Health Advisor Backend running on port ${PORT}`);
  console.log (`📊 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;
