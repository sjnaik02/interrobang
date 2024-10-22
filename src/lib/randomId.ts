const randomId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 15);
};

export default randomId;
