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
                (parseFloat(elem.price) * (100.0 - elem.discountPercent)) /
                  100.0
              ).toFixed(2)
            : elem.discountPrice,
        })
      : elem
  );
  return result;
};

module.exports = {
  filterByType,
  filterByGender,
  filterByBrand,
  applyDiscount,
};
