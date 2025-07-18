const Joi = require('joi');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createAlert: Joi.object({
    discogsReleaseId: Joi.string().required(),
    releaseTitle: Joi.string().max(500).required(),
    artist: Joi.string().max(255).required(),
    targetPrice: Joi.number().positive().required(),
    currency: Joi.string().length(3).default('USD'),
    condition: Joi.string().valid(
      'Mint (M)', 'Near Mint (NM or M-)', 'Very Good Plus (VG+)',
      'Very Good (VG)', 'Good Plus (G+)', 'Good (G)', 'Fair (F)', 'Poor (P)'
    ).required(),
    locationFilter: Joi.string().max(255).optional(),
    locationRadius: Joi.number().min(0).max(500).default(0),
    excludeReprints: Joi.boolean().default(false),
    onlyOriginalPressing: Joi.boolean().default(false)
  }),

  connectDiscogs: Joi.object({
    token: Joi.string().required()
  })
};

module.exports = { validateBody, schemas };