
const User = require('../models/userModels');


exports.getInviteCode = async (req, res) => {
  const user = await User.findById(req.user.id).select("inviteCode");
  res.json({ inviteCode: user.inviteCode });
};