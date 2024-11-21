export const countryDialCodes: any = {
  NG: '234', // Nigeria
  US: '1', // United States
  GH: '233', // Ghana
  UK: '44', // United Kingdom
  // Add more countries as needed
};

// Function to normalize phone numbers
export const normalizePhoneNumber = (countryCode: any, phone: string) => {
  const dialCode = countryDialCodes[countryCode];

  if (!dialCode) {
    throw new Error('Invalid country code');
  }

  // Remove all non-numeric characters
  let normalizedPhone = phone!?.replace(/\D/g, '');

  // If the phone number starts with '0', replace it with the dial code
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = dialCode + normalizedPhone.slice(1);
  }

  // If the phone number doesn't start with the dial code, prepend it
  if (!normalizedPhone.startsWith(dialCode)) {
    normalizedPhone = dialCode + normalizedPhone;
  }

  return normalizedPhone;
};
