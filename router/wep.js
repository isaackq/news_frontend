const express = require("express");
const router = express.Router();
const { guest } = require("../middlewares/guest");
const { authenticate } = require("../middlewares/authenticate");
const { adminAcces } = require("../middlewares/adminAcces");

// router.get("/set-session", async (req, res) => {
//   const response = await fetch(`http://localhost:5000/cms/set-session`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//   });
//   const data = await response.json();
//   console.log("cxsssssssssssss", data);
//   res.send(data);
// });

// router.get("/get-session", async (req, res) => {
//   const response = await fetch(`http://localhost:5000/cms/get-session`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//   });
//   const data = await response.json();
//   console.log("cxsssssssssssss", data);
//   res.send(data);
// });

router.get("/admin/home",authenticate, adminAcces, (req, res) => {
  res.render("layouts/parent");
});

router.get("/admin/create", adminAcces, (req, res) => {
  res.render("layouts/admin/create", {
    title: "Create User",
  });
});

router.post("/admin", adminAcces, async (req, res, next) => {
  try {
    const response = await fetch("https://news-backend-hbbs.onrender.com/cms/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("asdasdasd", data);
    console.log(req.session.guard);

    if (data.status === true) {
      return res
        .with("message", "Created Successfully")
        .redirect("/admin/create");
    } else {
      return res
        .with("old", data.req.body)
        .with("errors", data.error.array())
        .redirect(`/admin/create`); //لما نعمل ريداركت بنكون مسحنا كل اشي من الريسبونس
    }
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Request failed:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
});

router.get("/admin", adminAcces, async (req, res) => {
  try {
    const response = await fetch("https://news-backend-hbbs.onrender.com/cms/admin");

    const result = await response.json(); // This is likely an object
    const data = Array.isArray(result.data) ? result.data : []; // Fallback to empty array if data is not an array
    console.log(req.session.guard);
    res.render("layouts/user/read", {
      title: "ALL Admins",
      data: data,
    });
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Request failed:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
});

router.get("/:guard/login", guest, async (req, res) => {
  req.session.guard = req.params.guard;
  try {
    const response = await fetch(
      `https://news-backend-hbbs.onrender.com/cms/${req.params.guard}/login`
    );
    const data = await response.json();
    res.render("layouts/auth/login", { data }); // Pass the data to the EJS template
  } catch (error) {
    res.status(500).send("Error fetching data from backend");
  }
});

router.get("/:guard/SignUP", guest, async (req, res) => {
  // req.session.guard = req.params.guard;
  // console.log(req.session.guard);
  // const response = await fetch(`https://news-backend-hbbs.onrender.com/cms/${req.params.guard}/SignUP`);
  // const data = await response.json();
  // console.log(data);
  // res.render("layouts/auth/SignUp", { data }); // Pass the data to the EJS template

  req.session.guard = req.params.guard;
  try {
    const response = await fetch(
      `https://news-backend-hbbs.onrender.com/cms/${req.params.guard}/SignUP`
    );
    const data = await response.json();
    res.render("layouts/auth/SignUP", { data }); // Pass the data to the EJS template
  } catch (error) {
    res.status(500).send("Error fetching data from backend");
  }
});

router.post("/:guard/login", guest, async (req, res) => {
  req.session.guard = req.params.guard;
  const response = await fetch(
    `https://news-backend-hbbs.onrender.com/cms/${req.params.guard}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(req.body),
    }
  );
  const data = await response.json();
  if (data.data === true) {
    req.session.isAuthenticated = true;
    return res.redirect("/news");
    // res.send("isaac kamel");
  } else {
    res
      .with("errors", data.errors)
      .with("old", data.old)
      .redirect(`/${req.params.guard}/login`);
  }
});

router.get("/news", authenticate, async (req, res) => {
  try {
    const response = await fetch(`https://news-backend-hbbs.onrender.com/cms/news`);
    const data = await response.json();
    res.render("layouts/index", {
      localNews: data.localNews,
      sportsNews: data.sportsNews,
      internationalNews: data.internationalNews,
      guard: req.session.guard,
    }); // Pass the data to the EJS template
  } catch (error) {
    res.status(500).send("Error fetching data from backend");
  }
});

router.get("/news/create", adminAcces, (req, res) => {
  res.render("layouts/news/create",{title : "create news"});
});

router.get("/news/:id", authenticate, async (req, res) => {
  try {
    const response = await fetch(
      `https://news-backend-hbbs.onrender.com/cms/news/${req.params.id}`
    );
    const result = await response.json();
    const data = result.data;
    res.render("layouts/newsdetailes", { data: data });
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Request failed:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
});

router.post("/news", adminAcces, async (req, res, next) => {
  try {
    const response = await fetch("https://news-backend-hbbs.onrender.com/cms/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    if (data.status === true) {
      // Success case
      // console.log("Success:", data.message);
      res.with("message", "Created Successfully").redirect("/news/create");
    } else {
      // Error case: Display validation errors or other messages
      // console.log("Error:", data.message);
      res
        .with("old", req.body)
        .with("errors", "error")
        .redirect("/news/create");
    }
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Request failed:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
});

router.get("/user/create", adminAcces, (req, res) => {
  res.render("layouts/user/create", {
    title: "Create User",
  });
});

router.post("/user", async (req, res, next) => {
  try {
    const response = await fetch("https://news-backend-hbbs.onrender.com/cms/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("asdasdasd", data);
    console.log(req.session.guard);

    if (data.status === true) {
      if (req.session.guard === "admin") {
        return res
          .with("message", "Created Successfully")
          .redirect("/user/create");
      } else if (req.session.guard === "user") {
        console.log("sddddddddddddddddddddddddddddddddddddddddddddddddd");
        req.session.user = "user";
        req.session.isAuthenticated = true;
        return res.with("message", "Welcome to our page").redirect("/news");
      }
    } else {
      if (req.session.guard === "admin") {
        return res
          .with("old", data.req.body)
          .with("errors", data.error.array())
          .redirect(`/user/create`); //لما نعمل ريداركت بنكون مسحنا كل اشي من الريسبونس
      } else if (req.session.guard === "user") {
        return res
          .with("old", data.req.body)
          .with("errors", data.error.array())
          .redirect(`/user/SignUP`);
      }
    }
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Request failed:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
});

router.get("/user", adminAcces, async (req, res) => {
  try {
    const response = await fetch("https://news-backend-hbbs.onrender.com/cms/user");

    const result = await response.json(); // This is likely an object
    const data = Array.isArray(result.data) ? result.data : []; // Fallback to empty array if data is not an array
    console.log(req.session.guard);
    res.render("layouts/user/read", {
      title: "ALL Students",
      data: data,
    });
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Request failed:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
});

// .delete destroy  handele with the moddleware in the backend
router.post("/user/:id", adminAcces, async (req, res) => {
  try {
    const response = await fetch(
      `https://news-backend-hbbs.onrender.com/cms/user/${req.params.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(req.body),
      }
    );
    const data = await response.json();
    if (data.status === true) {
      res.redirect("/user");
    }
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Request failed:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
});

router.get("/logout", authenticate, (req, res) => {
  req.session.user = undefined;
  req.session.isAuthenticated = undefined;
  res.redirect(`/${req.session.guard}/login`);
});

router.get("/category/:id", authenticate, async (req, res) => {
  try {
    const response = await fetch(
      `https://news-backend-hbbs.onrender.com/cms/category/${req.params.id}`
    );

    const result = await response.json();
    const data = Array.isArray(result.data.news) ? result.data.news : [];
    res.render("layouts/all-news", { data: data });
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Request failed:", error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
});

router.get("/contact", authenticate, (req, res) => {
  res.render("layouts/contact");
});

module.exports = router;
