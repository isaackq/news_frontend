exports.authenticate = (req, res, next) => {
  if ("isAuthenticated" in req.session ) {
    if (req.session.isAuthenticated) {
      //لما نعمل اي غملية لازم يتحقق ازا انت مسجل دخول او لا غير هيك بوديك على  واجهة اللوق ان
      return next(); //لازم ريتيرن عشان النكست بتعملش لوكنق
    }
  }
  return res.redirect(`/${req.session.guard}/login`);
};
