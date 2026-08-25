const http = require("http");

const originalCreateServer = http.createServer;

http.createServer = function (handler) {
  const wrappedHandler = function (req, res) {

    if (req.method === "GET" && req.url === "/") {

      const originalEnd = res.end.bind(res);
      let chunks = [];

      res.write = function (chunk, encoding) {
        if (chunk) {
          chunks.push(
            Buffer.isBuffer(chunk)
              ? chunk
              : Buffer.from(chunk, encoding)
          );
        }
        return true;
      };

      res.end = function (chunk, encoding, callback) {

        if (chunk) {
          chunks.push(
            Buffer.isBuffer(chunk)
              ? chunk
              : Buffer.from(chunk, encoding)
          );
        }

        let html = Buffer.concat(chunks).toString("utf8");

        const fix = `
<script>
(function () {

  window.enterNurseStudy = function () {

    try {

      const name =
        document.getElementById("studentName").value.trim();

      const phone =
        document.getElementById("studentPhone").value.trim();

      const gender =
        document.getElementById("studentGender").value;

      const semester =
        document.getElementById("studentSemester").value;

      const university =
        document.getElementById("studentUniversity").value;

      const college =
        document.getElementById("studentCollege").value;

      const course =
        document.getElementById("studentCourse").value ||
        "B.Sc. Nursing";

      if (!name) {
        alert("Please enter your full name.");
        return;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10 digit mobile number.");
        return;
      }

      if (!gender || !semester || !university || !college) {
        alert("Please fill all required details.");
        return;
      }

      if (!document.getElementById("agree").checked) {
        alert("Please tick the agreement box.");
        return;
      }

      const profile = {
        name,
        phone,
        gender,
        semester,
        university,
        college,
        course
      };

      localStorage.setItem(
        "nurseStudyProfile",
        JSON.stringify(profile)
      );

      document
        .getElementById("loginPage")
        .classList.add("hidden");

      document
        .getElementById("mainSite")
        .classList.remove("hidden");

      document.getElementById("welcomeName").textContent = name;

      document.getElementById("welcomeDetails").textContent =
        semester + " • " + university + " • " + college;

      if (typeof buildTabs === "function") {
        buildTabs();
      }

      if (typeof showSemester === "function") {
        showSemester(semester);
      }

      fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      }).catch(function () {});

      window.scrollTo(0, 0);

    } catch (error) {

      console.error(error);

      alert(
        "Website me error aa gaya. Page refresh karke dobara try karein."
      );

    }

  };

})();
</script>
`;

        if (html.includes("</body>")) {
          html = html.replace("</body>", fix + "</body>");
        } else {
          html += fix;
        }

        return originalEnd(
          Buffer.from(html, "utf8"),
          callback
        );
      };
    }

    return handler(req, res);
  };

  return originalCreateServer.call(http, wrappedHandler);
};

require("./server.js");