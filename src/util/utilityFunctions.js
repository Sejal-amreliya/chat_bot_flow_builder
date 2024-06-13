export const getUniqueId = () => {
  // Get the current timestamp
  const timestamp = Date.now();

  // Convert the timestamp to a string to use it as an ID
  const uniqueId = timestamp.toString();

  return uniqueId;
};
