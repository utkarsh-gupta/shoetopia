const shoetopia = (() => {
  const CONSTANTS = {
    FILTER_SRC: {
      RESULT_FILTER: "resultFilter",
      GENDER_FILTER: "genderFilter",
    },
  };
  const doRequest = (srcElem, id) => {
    const curLoc = window.location.pathname;
    // console.log(`curLoc: ${curLoc}`);
    const nomale = !$("#id-male").checked();
    const nofemale = !$("#id-female").checked();
    let queryStarted = false;
    let query = "";
    if (nomale) {
      query = `?${CONSTANTS.FILTER_SRC.GENDER_FILTER}=no-male`;
      queryStarted = true;
    }
    if (nofemale) {
      query =
        (queryStarted ? `${query}&` : "?") +
        `${CONSTANTS.FILTER_SRC.GENDER_FILTER}=no-female`;
      queryStarted = true;
    }
    if (srcElem === CONSTANTS.FILTER_SRC.RESULT_FILTER && id) {
      query =
        (queryStarted ? `${query}&` : "?") +
        `${CONSTANTS.FILTER_SRC.RESULT_FILTER}=${id}`;
      queryStarted = true;
    } else if (srcElem === CONSTANTS.FILTER_SRC.GENDER_FILTER) {
      const params = new URL(document.location).searchParams;
      const rf = params.get(CONSTANTS.FILTER_SRC.RESULT_FILTER);
      if (rf) {
        query =
          (queryStarted ? `${query}&` : "?") +
          `${CONSTANTS.FILTER_SRC.RESULT_FILTER}=${rf}`;
        queryStarted = true;
      }
    }
    // console.log("finalQuery: " + query);
    window.location.href = curLoc === "/" ? query : curLoc + query;
  };

  return {
    setFilterQuery: (event, clickedAnchorId) => {
      event.preventDefault();
      doRequest(CONSTANTS.FILTER_SRC.RESULT_FILTER, clickedAnchorId);
    },
    genderFilterClicked: (id) => {
      const maleVal = $("#id-male").checked();
      const femaleVal = $("#id-female").checked();
      if (!femaleVal && id === "id-male" && !maleVal) {
        $("#id-male").checked(true);
        return;
      }
      if (!maleVal && id === "id-female" && !femaleVal) {
        $("#id-female").checked(true);
        return;
      }
      doRequest(CONSTANTS.FILTER_SRC.GENDER_FILTER, id);
    },
    prepareAddToCart: (code, name) => {
      $("#modalCartTitle").html(`${name} - (${code})`);
      $("#idCode").val(code);
    },
    prepareToShowDetail: (code, name, desc) => {
      $("#modalDetailTitle").html(`${name} - (${code})`);
      $("#idDesc").html(desc);
    },
  };
})();
