import app from '../backend/src/index';
import serverless from 'serverless-http';

export default serverless(app);
