exports.adminAcces = (req, res, next) => {
    if (req.session.guard === "admin") {
      //لما نعمل اي غملية لازم يتحقق ازا انت مسجل دخول او لا غير هيك بوديك على  واجهة اللوق ان
      return next(); //لازم ريتيرن عشان النكست بتعملش لوكنق
    }
  
  return res.redirect(`/news`);
};
