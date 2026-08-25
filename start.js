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

  function openNurseStudy() {

    try {

      var name =
        document.getElementById("studentName").value.trim();

      var phone =
        document.getElementById("studentPhone").value.trim();

      var gender =
        document.getElementById("studentGender").value;

      var semester =
        document.getElementById("studentSemester").value;

      var university =
        document.getElementById("studentUniversity").value;

      var college =
        document.getElementById("studentCollege").value;

      var course =
        document.getElementById("studentCourse").value ||
        "B.Sc. Nursing";

      var agree =
        document.getElementById("agree").checked;

      if (!name) {
        alert("Please enter your full name.");
        return;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10 digit mobile number.");
        return;
      }

      if (!gender) {
        alert("Please select Gender.");
        return;
      }

      if (!semester) {
        alert("Please select Semester.");
        return;
      }

      if (!university) {
        alert("Please select University.");
        return;
      }

      if (!college) {
        alert("Please select College.");
        return;
      }

      if (!agree) {
        alert("Please tick the agreement box.");
        return;
      }

      var profile = {
        name: name,
        phone: phone,
        gender: gender,
        semester: semester,
        university: university,
        college: college,
        course: course
      };

      localStorage.setItem(
        "nurseStudyProfile",
        JSON.stringify(profile)
      );

      var loginPage =
        document.getElementById("loginPage");

      var mainSite =
        document.getElementById("mainSite");

      if (loginPage) {
        loginPage.classList.add("hidden");
      }

      if (mainSite) {
        mainSite.classList.remove("hidden");
      }

      var welcomeName =
        document.getElementById("welcomeName");

      if (welcomeName) {
        welcomeName.textContent = name;
      }

      var welcomeDetails =
        document.getElementById("welcomeDetails");

      if (welcomeDetails) {
        welcomeDetails.textContent =
          semester + " • " +
          university + " • " +
          college;
      }

      if (typeof window.buildTabs === "function") {
        window.buildTabs();
      }

      if (typeof window.showSemester === "function") {
        window.showSemester(semester);
      }

      fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      }).catch(function (error) {
        console.log("Student save error:", error);
      });

      window.scrollTo(0, 0);

    } catch (error) {

      console.error("NurseStudy error:", error);

      alert(
        "Entry error. Please refresh the website and try again."
      );
    }
  }


  /*
     FORCE BUTTON CLICK
     This works even if the old
     onclick function is broken.
  */

  document.addEventListener(
    "click",
    function (event) {

      var button = event.target.closest(
        "button.fullBtn"
      );

      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      openNurseStudy();

    },
    true
  );

  window.enterNurseStudy = openNurseStudy;

})();
</script>
`;

        if (html.includes("</body>")) {
          html = html.replace(
            "</body>",
            fix + "</body>"
          );
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

  return originalCreateServer.call(
    http,
    wrappedHandler
  );
};

require("./server.js");