const _ = require("lodash");

const filterByType = (data, req, res) => {
  const rf = res.locals.filters.selectedResultFilter;
  const result = _.filter(
    data,
    (elem) =>
      rf === "all" ||
      (rf === "newly-launched" && elem.newlyLaunched) ||
      (rf === "on-sale" && elem.onDiscount)
  );
  return result;
};

const filterByGender = (data, req, res) => {
  const ugen = res.locals.filters.unSelectedGender;
  const result = _.filter(
    data,
    (elem) =>
      ugen === "" ||
      (ugen === "no-male" && elem.forFemale) ||
      (ugen === "no-female" && elem.forMale)
  );
  return result;
};

const filterByBrand = (data, brand) => {
  const result = _.filter(data, (elem) => elem.brand.toLowerCase() === brand);
  return result;
};

const applyDiscount = (data) => {
  const result = _.map(data, (elem) =>
    elem.onDiscount
      ? _.extend({}, elem, {
          finalDiscountPrice: elem.discountPercent
            ? parseFloat(
                parseFloat(
                  (parseFloat(elem.price) * (100.0 - elem.discountPercent)) /
                    100.0
                ).toFixed(2)
              )
            : elem.discountPrice,
        })
      : elem
  );
  return result;
};

const getShoeNamePrice = (shoes, code, pairCount) => {
  const info = _.find(shoes, (elem) => elem.code === code);
  return {
    name: info.name,
    price: parseFloat(
      (info.onDiscount ? info.finalDiscountPrice : info.price) * pairCount
    ).toFixed(2),
  };
};

const getCartData = (data, req, res) => {
  const withDiscount = applyDiscount(data);
  const cart = req.session.cart;
  const result = _.map(req.session.cart, (elem) =>
    _.extend(
      {},
      elem,
      getShoeNamePrice(withDiscount, elem.code, elem.pairCount)
    )
  );
  return result;
};

const getCartTotal = (cartData) => {
  const total = _.reduce(
    _.map(cartData, (i) => parseFloat(i.price)),
    (sum, cur) => sum + cur
  );
  // console.log(JSON.stringify(total, null, 1));
  return total.toFixed(2);
};

module.exports = {
  filterByType,
  filterByGender,
  filterByBrand,
  applyDiscount,
  getCartData,
  getCartTotal,
};
