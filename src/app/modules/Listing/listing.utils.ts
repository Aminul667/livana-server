export const extractMonthInfo = (dateString: string) => {
  const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");
  const dateObj = new Date(cleanDateString);
  
  const availableMonth = dateObj.toLocaleString("default", { month: "long" });
  const availableMonthNumber = dateObj.getMonth() + 1;

  return { availableMonth, availableMonthNumber };
};
