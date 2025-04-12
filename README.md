# Cactus

Cactus is a comprehensive platform for tracking, managing, and verifying datasets and models on IPFS/Filecoin using Lighthouse. It provides a robust solution for data lineage tracking, verification, and licensing management in AI/ML workflows.

## Features

- **Dataset Management**: Upload, track, and manage datasets with detailed metadata
- **Model Registry**: Register and track AI/ML models with their architectures and descriptions
- **Data Lineage**: Track relationships between datasets and models
- **IPFS Integration**: Seamless integration with Lighthouse for decentralized storage
- **Verification**: Verify dataset and model integrity and provenance
- **Licensing**: Manage and enforce licensing for datasets and models
- **User-friendly Interface**: Modern React-based UI with comprehensive dashboard

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI components
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: IPFS/Filecoin via Lighthouse SDK
- **Authentication**: Firebase

## Prerequisites

- Node.js (v16+)
- PostgreSQL database
- Lighthouse API key (optional, mock implementation available for development)

## Environment Setup

Create a `.env` file in the root directory based on the provided `.env.example` file:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your specific values
nano .env  # or use your preferred editor
```

Required environment variables:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cactus

# Lighthouse
LIGHTHOUSE_API_KEY=your_lighthouse_api_key

# Firebase (optional)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Ccd Cactus
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Set up the database:
   ```
   yarn db:push
   ```

## Development

Start the development server:

```
yarn dev
```

This will start both the backend server and the frontend development server.

## Building for Production

Build the application:

```
yarn build
```

Start the production server:

```
yarn start
```

## Deployment to Render

Cactus can be easily deployed to [Render](https://render.com) using the following configuration:

### Web Service Configuration

1. **Service Type**: Web Service
2. **Name**: cactus (or your preferred name)
3. **Environment**: Node
4. **Region**: Choose the region closest to your users
5. **Branch**: main (or your default branch)
6. **Build Command**: `yarn render-build`
7. **Start Command**: `yarn render-start`
8. **Plan**: Choose appropriate plan (Free tier works for testing)

Alternatively, you can use the provided `render-deploy.sh` script:

```bash
# Make the script executable
chmod +x render-deploy.sh

# Use as build command in Render
./render-deploy.sh
```

### Environment Variables

Add the following environment variables in the Render dashboard:

```
NODE_ENV=production
LIGHTHOUSE_API_KEY=your_lighthouse_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

Note: Make sure to properly format the `FIREBASE_PRIVATE_KEY` by replacing newlines with `\n` characters.

### Database Setup

The application uses Firebase Firestore for data storage. You need to:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Set up Firestore database in your project
3. Add the Firebase configuration variables to your environment variables:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`

Note: The `DATABASE_URL` environment variable is not required for production deployment as the application uses Firebase Firestore instead of PostgreSQL.

### Deploy Commands

```bash
# Initial deployment
git push origin main

# Database migration (if needed)
yarn db:push
```

### Health Check Path

Set the health check path to `/api/health` to ensure your service is properly monitored.

### Auto-Deploy

Enable auto-deploy to automatically deploy changes when you push to your repository.

## Deployment to Other Cloud Platforms

### Heroku Deployment

1. Install the Heroku CLI and log in:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. Create a new Heroku app:
   ```bash
   heroku create cactus
   ```

3. Add a PostgreSQL database:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set LIGHTHOUSE_API_KEY=your_lighthouse_api_key
   heroku config:set FIREBASE_PROJECT_ID=your_firebase_project_id
   heroku config:set FIREBASE_PRIVATE_KEY=your_firebase_private_key
   heroku config:set FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

5. Add a Procfile in the root directory:
   ```
   web: yarn start
   ```

6. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

### AWS Elastic Beanstalk Deployment

1. Install the AWS EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize EB application:
   ```bash
   eb init chainlenstracker --platform node.js --region us-east-1
   ```

3. Create an environment:
   ```bash
   eb create chainlenstracker-env
   ```

4. Set environment variables:
   ```bash
   eb setenv NODE_ENV=production LIGHTHOUSE_API_KEY=your_key DATABASE_URL=your_db_url
   ```

5. Deploy the application:
   ```bash
   eb deploy
   ```

### Google Cloud Run Deployment

1. Install the Google Cloud SDK and initialize:
   ```bash
   gcloud init
   ```

2. Build and deploy to Cloud Run:
   ```bash
   gcloud run deploy chainlenstracker \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="NODE_ENV=production,LIGHTHOUSE_API_KEY=your_key,DATABASE_URL=your_db_url"
   ```

## Project Structure

- `/client`: Frontend React application
  - `/src`: Source code
    - `/components`: Reusable UI components
    - `/hooks`: Custom React hooks
    - `/pages`: Application pages
    - `/lib`: Utility functions and libraries
- `/server`: Backend Express application
  - `index.ts`: Main server entry point
  - `routes.ts`: API route definitions
  - `storage.ts`: Data storage and retrieval logic
  - `db.ts`: Database connection and configuration
  - `lighthouse-mock.ts`: Mock implementation of Lighthouse SDK
- `/shared`: Shared code between frontend and backend
  - `schema.ts`: Database schema definitions using Drizzle ORM

## API Endpoints

### Datasets

- `GET /api/datasets`: Get all datasets
- `GET /api/datasets/:id`: Get a specific dataset
- `POST /api/datasets`: Create a new dataset
- `PATCH /api/datasets/:id/status`: Update dataset status

### Models

- `GET /api/models`: Get all models
- `GET /api/models/:id`: Get a specific model
- `POST /api/models`: Create a new model

### Relationships

- `GET /api/relationships`: Get all relationships
- `GET /api/relationships/dataset/:datasetId`: Get relationships by dataset
- `GET /api/relationships/model/:modelId`: Get relationships by model
- `POST /api/relationships`: Create a new relationship
- `PATCH /api/relationships/:id/status`: Update relationship status

### IPFS/Lighthouse

- `POST /api/ipfs/upload`: Upload files to IPFS via Lighthouse
- `GET /api/ipfs/uploads`: Get uploads from Lighthouse
- `GET /api/ipfs/check/:cid`: Check if a CID exists in Lighthouse

## Lighthouse Integration

Cactus integrates with Lighthouse for decentralized storage on IPFS/Filecoin. To use this feature:

1. Create an API key at [Lighthouse Files](https://files.lighthouse.storage/)
2. Add the API key to your `.env` file
3. Use the upload functionality in the application

For development without a Lighthouse API key, a mock implementation is provided.

## License

MIT