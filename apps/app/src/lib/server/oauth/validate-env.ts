import { env } from '$env/dynamic/private';

interface ValidateEnvFunction {
    (...variable_names: string[]): boolean;
}

interface ValidateEnv extends ValidateEnvFunction {
    github: ValidateEnvFunction;
    atlassian: ValidateEnvFunction;
    google: ValidateEnvFunction;
}

/**
 * Agressively caches because accessing env causes a read of the system environment
 *
 * Checks if all of the provided variables are present
 *
 * @param variable_names the environment variables required for a provider to initialise correctly
 * @returns if all environment variables are present
 */
const validate: ValidateEnv = (...variable_names) =>
    variable_names.filter((_var) => _var in env).length === variable_names.length;

validate.github = () => validate('GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET');
// note: disabled because atlassian are a bunch of pussies.
validate.atlassian = () => validate('ATLASSIAN_CLIENT_ID', 'ATLASSIAN_CLIENT_SECRET') && false;
validate.google = () => validate('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET');

export default validate;
