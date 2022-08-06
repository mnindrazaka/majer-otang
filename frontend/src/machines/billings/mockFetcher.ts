export const getBillings = async () => {
  const result = await fetch("http://localhost:4000/billings");
  const data = await result.json();
  return data;
};

export const getMembers = async () => {
  const result = await fetch("http://localhost:4000/members");
  const data = await result.json();
  return data;
};
