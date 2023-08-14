const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const _ = require("lodash");

const twoHours = 1000 * 60 * 60 * 2;

const CONSTANTS = require("./config");
const MOCK_DATA = require("./mockdata");
const {
  filterByType,
  filterByGender,
  applyDiscount,
  filterByBrand,
} = require("./util");

const handlebars = require("express-handlebars").create({
  defaultLayout: "main",
});

// const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5050;

const environment = process.env.ENVIRONMENT
  ? process.env.ENVIRONMENT.trim()
  : "PROD";

console.log(`server starting for environment: ${environment}`);

const publicDir = path.join(__dirname, "/public");
const viewsDir = path.join(__dirname, "views");

app.use(cors());
app.use(
  session({
    secret: "askdfjs897roishoetopia8349734589oiefjfmxptoir",
    saveUninitialized: true,
    cookie: { maxAge: twoHours },
    resave: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));
app.use(cookieParser());

app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine);

app.use((req, res, next) => {
  console.log(`RequestQuery: ${JSON.stringify(req.query)}`);
  console.log("-------------------");
  next();
});

app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  res.locals.session = req.session;
  next();
});

app.use((req, res, next) => {
  if (!res.locals.partials) res.locals.partials = {};
  const path = req.path;
  const brandList = _.map(CONSTANTS.BRANDS, (elem) =>
    elem.url === path ? _.extend({}, elem, { active: true }) : elem
  );
  res.locals.partials.brands = brandList;
  next();
});

app.use((req, res, next) => {
  if (!res.locals.partials) res.locals.partials = {};
  if (!res.locals.filters) res.locals.filters = {};
  const resultFilter = _.get(req, "query.resultFilter", "all");
  const genderFilter = _.get(req, "query.genderFilter", "");

  const tabList = _.map(CONSTANTS.RESULT_FILTER_TABS, (elem) =>
    elem.id === resultFilter ? _.extend({}, elem, { active: true }) : elem
  );
  const genderList = _.map(CONSTANTS.GENDER_FILTER, (elem) =>
    genderFilter === `no-${elem.name.toLowerCase()}`
      ? elem
      : _.extend({}, elem, { checked: true })
  );
  res.locals.partials.resultFilter = tabList;
  res.locals.partials.genderFilter = genderList;
  res.locals.filters.selectedResultFilter = resultFilter;
  res.locals.filters.unSelectedGender = genderFilter;
  next();
});

app.get("/:brand", function (req, res) {
  const brand = req.params.brand;
  const forBrand = filterByBrand(MOCK_DATA, brand);
  const filtered = filterByGender(filterByType(forBrand, req, res), req, res);
  const finalData = applyDiscount(filtered);

  res.render("home-item", { data: finalData });
});

app.get("/", function (req, res) {
  const filtered = filterByGender(filterByType(MOCK_DATA, req, res), req, res);
  const finalData = applyDiscount(filtered);
  res.render("home-item", { data: finalData });
});

app.post("/addToCart", function (req, res) {
  const { code, shoeSize, pairCount } = req.body;
  req.session.cart.push({ code, shoeSize, pairCount });
  res.redirect("/");
});

app.get("/logout", function (req, res) {
  req.session.destroy();
  res.locals.session = null;
  res.redirect("/");
});

// routes(app);

app.use((req, res) => {
  res.status(404);
  res.render("404", { layout: null });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render("500", { layout: null });
});

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`express - web server started..`);
});
