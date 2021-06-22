exports.alerts = (req, res, next) => {
  const { alert } = req.query

  switch (alert) {
    case 'booking':
      res.local.alert = 'Your booking was successful!. Please check your email for confirmations.'
      break;
  
    default:
      break;
  }
  
  next()
}