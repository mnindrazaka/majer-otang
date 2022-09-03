export const getBillingDetailById = async (billingId: string) => {
  const res = await fetch(`http://localhost:4000/billing/${billingId}`);
  const data = await res.json();
  return data;
};
