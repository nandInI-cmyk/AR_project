
import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // You may want to pass parameters from the request to your Python script
    const { stdout, stderr } = await execPromise('python /path/to/your/script.py');
    
    if (stderr) {
      console.error(`Python script error: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }
    
    // Assuming your Python script outputs JSON
    const result = JSON.parse(stdout);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error executing Python script:', error);
    return res.status(500).json({ error: 'Failed to execute Python script' });
  }
}