const notFound = (req, res, next) => {
  res.status(404).end()
}

export default notFound