export const summaryDonations = (donations) => {
  const validDonations = donations.filter(amount => typeof amount === 'number' && !isNaN(amount));
  return validDonations.reduce((accumulator, value) => accumulator + value, 0);
};
