const express = require("express");
const app = express();
const port = process.env.PORT || 3007;
const path = require("path");
const fs = require("fs");
var myPath = "";

app.use((req, res, next) => {
  //console.log(req._parsedUrl);
  console.log(req.url);

  //  console.log(req.rawHeaders);
  console.log(req.originalUrl);
  next();
});

/*app.get("/", function (request, response) {
  console.log("Home page visited!");
  const filePath = path.resolve(__dirname, "./build", "index.html");

  // read in the index.html file
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    // replace the special strings with server generated strings
    data = data.replace(
      /\$OG_TITLE/g,
      "Poster Maker | Ultimate Design Tool For Creating Posters, Flyers, Facebook Post, Instagram Story, Instagram Post and Much More"
    );
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Poster Maker is an ultimate design tool to create you own design in your own way. Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more."
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/img/login-img.png"
    );
    response.send(result);
  });
});*/

app.get("/", function (request, response) {
  console.log("Login page visited!");
  const filePath = path.resolve(__dirname, "./build", "index.html");

  // read in the index.html file
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    // replace the special strings with server generated strings
    data = data.replace(
      /\$OG_TITLE/g,
      "Poster Maker | Ultimate Design Tool For Creating Posters, Flyers, Facebook Post, Instagram Story, Instagram Post and Much More"
    );
    data = data.replace(/\$OG_URL/g, "https://posterapplab.com/");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Poster Maker is an ultimate design tool to create you own design in your own way. Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more."
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/img/login-img.png"
    );
    response.send(result);
  });
});

app.get("/login", function (request, response) {
  console.log("Login page visited!");
  const filePath = path.resolve(__dirname, "./build", "index.html");

  // read in the index.html file
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    // replace the special strings with server generated strings
    data = data.replace(
      /\$OG_TITLE/g,
      "Poster Maker | Ultimate Design Tool For Creating Posters, Flyers, Facebook Post, Instagram Story, Instagram Post and Much More"
    );
    data = data.replace(/\$OG_URL/g, "https://posterapplab.com/login");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Poster Maker is an ultimate design tool to create you own design in your own way. Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more."
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/img/login-img.png"
    );
    response.send(result);
  });
});

app.get("/refer-friends/:uid/:id", function (request, response) {
  console.log("Login page visited!");
  const filePath = path.resolve(__dirname, "./build", "index.html");

  // read in the index.html file
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    // replace the special strings with server generated strings
    data = data.replace(
      /\$OG_TITLE/g,
      "Poster Maker | Ultimate Design Tool For Creating Posters, Flyers, Facebook Post, Instagram Story, Instagram Post and Much More"
    );
    data = data.replace(/\$OG_URL/g, "https://posterapplab.com/login");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Poster Maker is an ultimate design tool to create you own design in your own way. Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more."
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/img/login-img.png"
    );
    response.send(result);
  });
});

app.get("/home", function (request, response) {
  console.log("home internal visited!");
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(
      /\$OG_TITLE/g,
      "Home | Poster Maker| Create Awesome Designs of your choice"
    );
    data = data.replace(/\$OG_URL/g, "https://posterapplab.com/");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Ten thousand plus free designs, Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more."
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/home-img/bg_template.png"
    );
    //console.log("Here Guys", result);
    response.send(result);
  });
});

app.get("/refer", function (request, response) {
  console.log("home internal visited!");
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(
      /\$OG_TITLE/g,
      "Refer friends and earn | Poster Maker| Refer friends and get a chance to win Iphone"
    );
    data = data.replace(/\$OG_URL/g, "https://posterapplab.com/");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Ten thousand plus free designs, Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more."
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/home-img/bg_template.png"
    );
    //console.log("Here Guys", result);
    response.send(result);
  });
});

app.get("/leaders", function (request, response) {
  console.log("home internal visited!");
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(
      /\$OG_TITLE/g,
      "Leaders of refer friends and earn | Poster Maker| Refer friends and get a chance to win Iphone"
    );
    data = data.replace(/\$OG_URL/g, "https://posterapplab.com/");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Ten thousand plus free designs, Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more."
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/home-img/bg_template.png"
    );
    //console.log("Here Guys", result);
    response.send(result);
  });
});

app.get("/design/:id/edit/:cg&cat=:cd", function (request, response) {
  console.log("design internal visited! ************************************");
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(
      /\$OG_TITLE/g,
      "Design | Poster Maker | Create Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more. "
    );
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Amazing Designs Templates | Create Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more. "
    );
    data = data.replace(/\$OG_URL/g, "https://posterapplab.com/");
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/home-img/bg_template.png"
    );
    response.send(result);
  });
});

app.get("/refer-earn", function (request, response) {
  console.log("Login page visited!");
  const filePath = path.resolve(__dirname, "./build", "index.html");

  // read in the index.html file
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    // replace the special strings with server generated strings
    data = data.replace(
      /\$OG_TITLE/g,
      "Refer To Your Friends & Win Iphone | Poster Maker | An ultimate design tool to create you own design in your own way. "
    );
    data = data.replace(/\$OG_URL/g, "https://posterapplab.com/login");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Poster Maker is an ultimate design tool to create you own design in your own way. Poster, Flyers, Facebook Posts, Instagram Story, Custom Design and much more."
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/img/login-img.png"
    );
    response.send(result);
  });
});

app.get("/term-conditions", function (request, response) {
  console.log("Terms internal visited! ************************************");
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, "Terms and Conditions | Poster Maker");
    data = data.replace(
      /\$OG_URL/g,
      "https://posterapplab.com/term-conditions"
    );
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "Terms and conditions of Poster Maker"
    );
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/img/login-img.png"
    );
    response.send(result);
  });
});

app.get("/privacy-policy", function (request, response) {
  console.log("privacy internal visited! ************************************");
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, "Privacy Policy | Poster Maker");
    data = data.replace(/\$OG_DESCRIPTION/g, "Privacy Policy of Poster Maker");
    data = data.replace(/\$OG_URL/g, "https://posterapplab.com/privacy-policy");
    result = data.replace(
      /\$OG_IMAGE/g,
      "https://posterapplab.com/img/login-img.png"
    );
    response.send(result);
  });
});

app.use(express.static(path.resolve(__dirname, "./build")));

app.get("*", function (request, response) {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  response.sendFile(filePath);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
