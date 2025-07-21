import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converts deployment JSON to environment variables
 *
 * This script looks for deployment files in the same directory as this script.
 * Place your deployment-info*.json file in the scripts/ folder.
 */
function convertDeploymentToEnv() {
  try {
    console.log('🔍 Looking for deployment files in scripts/ directory...');

    // Look for deployment files in the same directory as this script
    const files = fs.readdirSync(__dirname);
    const deploymentFiles = files.filter(
      (file) => file.startsWith('deployment-info') && file.endsWith('.json')
    );

    if (deploymentFiles.length === 0) {
      throw new Error(
        'No deployment info files found in scripts/ directory. Please place your deployment-info*.json file in the scripts/ folder.'
      );
    }

    // Use the first deployment file found
    const deploymentFile = deploymentFiles[0];
    const deploymentPath = path.join(__dirname, deploymentFile);

    console.log(`✅ Using deployment file: ${deploymentFile}`);

    // Read and parse the deployment info JSON file
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));

    // Create a single JSON string for the environment variable
    const deploymentString = JSON.stringify(deploymentInfo);

    // Create .env.local file content
    const envContent = `# Contract deployment information
# This file is auto-generated from ${deploymentFile}
# To update, run: yarn convert-deployment
# 
# Place your deployment-info*.json file in the scripts/ directory

NEXT_PUBLIC_DEPLOYMENT_INFO='${deploymentString}'
`;

    // Write to .env.local
    const envPath = path.join(__dirname, '../.env.local');
    fs.writeFileSync(envPath, envContent);

    console.log('✅ Successfully converted deployment info to .env.local');
    console.log('📁 File created at:', envPath);
    console.log('\n📋 Next steps:');
    console.log('1. Add .env.local to your .gitignore (if not already there)');
    console.log('2. Restart your development server');
    console.log(
      '3. The app will now use environment variables instead of JSON files'
    );
  } catch (error) {
    console.error('❌ Error converting deployment info:', error.message);
    process.exit(1);
  }
}

// Run the conversion
convertDeploymentToEnv();
