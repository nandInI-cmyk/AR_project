// pages/api/tracking.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);

type TrackingResponse = {
  success: boolean;
  data?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrackingResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get parameters from request body
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ success: false, error: 'Image data is required' });
    }
    
    // Create a temporary file to store the image data if needed
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const tempImagePath = path.join(tempDir, `image-${Date.now()}.png`);
    
    // For base64 encoded images
    if (imageData.startsWith('data:image')) {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(tempImagePath, Buffer.from(base64Data, 'base64'));
    }
    
    // Path to the Python script
    const pythonScriptPath = path.join(process.cwd(), 'python', 'ar_fingerboard_tracking.py');
    
    // Execute the Python script with the image path as an argument
    const { stdout, stderr } = await execPromise(`python "${pythonScriptPath}" --image "${tempImagePath}"`);
    
    // Clean up the temporary file
    if (fs.existsSync(tempImagePath)) {
      fs.unlinkSync(tempImagePath);
    }
    
    if (stderr) {
      console.error(`Python script error: ${stderr}`);
      return res.status(500).json({ success: false, error: stderr });
    }
    
    // Parse the output from the Python script
    const trackingData = JSON.parse(stdout);
    
    return res.status(200).json({
      success: true,
      data: trackingData
    });
    
  } catch (error) {
    console.error('Error executing tracking script:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}