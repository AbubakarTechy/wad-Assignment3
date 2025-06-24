export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

export const isSeller = (req, res, next) => {
  if (req.user.role !== 'Seller' && req.user.role !== 'Admin') return res.status(403).json({ message: 'Seller or Admin access required' });
  next();
};

export const isCustomer = (req, res, next) => {
  if (req.user.role !== 'Customer') return res.status(403).json({ message: 'Customer access required' });
  next();
}; 