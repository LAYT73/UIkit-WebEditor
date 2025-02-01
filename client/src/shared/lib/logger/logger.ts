import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

log.setLevel(process.env.NODE_ENV === 'production' ? 'error' : 'debug');

prefix.reg(log);

prefix.apply(log, {
    format(level, name, timestamp) {
        return `${timestamp} | ${name} | [${level.toUpperCase()}] | `;
    },
});

export default log;
