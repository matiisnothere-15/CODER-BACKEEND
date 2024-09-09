
import { Router } from 'express';
import logger from '../config/logger.js';
import colors from "colors"

const router = Router();

colors.setTheme({
    debug: 'blue',
    http: 'magenta',
    info: 'green',
    warn: 'yellow',
    error: 'red',
});

router.get('/', (req, res) => {
    logger.debug('This is a debug log'.blue);
    logger.http('This is an http log'.magenta);
    logger.info('This is an info log'.green);
    logger.warn('This is a warning log'.yellow);
    logger.error('This is an error log'.red);

    res.send('Logger test completed, check your logs!');
});

export default router;
