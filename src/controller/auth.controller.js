const request = (req, res) => {
  const body  = req.body;

  res.json(body);
};

export { request };
