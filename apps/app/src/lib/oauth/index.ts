export const validProviders = {
	github: null
};

export type ValidProvider = keyof typeof validProviders;
export const ValidProviderList = Object.keys(validProviders);
