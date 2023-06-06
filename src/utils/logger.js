import { errorLogger, debugLogger, infoLogger } from '../config/winston.js';
import envVariables from './env.js';
import constants from './constants.js';

const logger = {
  debug: (tag, data) => {
    if (envVariables.ENV === constants.DEV || ENV === constants.STAG)
      debugLogger.debug(tag, { tag, data });
  },

  info: (tag, data) => {
    infoLogger.info(tag, { tag, data });
  },

  error: (tag, error) => {
    if (error instanceof Error)
      errorLogger.error(error.message, { tag, data: { ...error } });
    else errorLogger.error(tag, { tag, data: error });
  },
};

export default logger;
