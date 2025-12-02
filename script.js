var nameInput = document.getElementById('student-name');
var ageInput = document.getElementById('student-age');
var classInput = document.getElementById('student-class');
var regInput = document.getElementById('student-reg');
var genderSelect = document.getElementById('student-gender');
var saveBtn = document.getElementById('save-btn');
var studentsTable = document.querySelector('#students-table tbody');
var studentIdInput = document.getElementById('student-id');
var formTitle = document.getElementById('form-title');

var students = JSON.parse(localStorage.getItem('students') || '[]');

renderTable();

saveBtn.onclick = function () {
  var name = nameInput.value.trim();
  var age = ageInput.value;
  var className = classInput.value.trim();
  var regNo = regInput.value.trim();
  var gender = genderSelect.value;

  if (!name || !age || !className || !regNo || !gender) {
    alert('Please fill all fields!');
    return;
  }

  if (studentIdInput.value) {
    var id = parseInt(studentIdInput.value, 10);

    for (var i = 0; i < students.length; i++) {
      if (students[i].id === id) {
        students[i].name = name;
        students[i].age = age;
        students[i].class = className;
        students[i].regNo = regNo;
        students[i].gender = gender;
        break;
      }
    }
  } else {
    var newStudent = {
      id: Date.now(),
      name: name,
      age: age,
      class: className,
      regNo: regNo,
      gender: gender,
      attendance: []
    };
    students.push(newStudent);
  }


  localStorage.setItem('students', JSON.stringify(students));
  renderTable();
  clearForm();
};


function renderTable() {
  studentsTable.innerHTML = '';

  students.sort(function (a, b) {
    var na = (a.name || '').toLowerCase();
    var nb = (b.name || '').toLowerCase();
    if (na < nb) return -1;
    if (na > nb) return 1;
    return 0;
  });

  var todayStr = new Date().toDateString();

  for (var i = 0; i < students.length; i++) {
    var s = students[i];

    var row = '<tr>' +
      '<td>' + s.name + '</td>' +
      '<td>' + s.age + '</td>' +
      '<td>' + s.class + '</td>' +
      '<td>' + s.regNo + '</td>' +
      '<td>' + s.gender + '</td>' +
      '<td>' +

        '<input type="checkbox" ' + (s.attendance.indexOf(todayStr) !== -1 ? 'checked' : '') +
        ' onclick="toggleAttendance(' + s.id + ', this)">' +
      '</td>' +
      '<td>' +

        '<button class="action-btn edit-btn" onclick="editStudent(' + s.id + ')">Edit</button>' +
        '<button class="action-btn delete-btn" onclick="deleteStudent(' + s.id + ')">Delete</button>' +
      '</td>' +
      '</tr>';


    studentsTable.innerHTML += row;
  }
}


function editStudent(id) {

  for (var i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      var s = students[i];
      studentIdInput.value = s.id;
      nameInput.value = s.name;
      ageInput.value = s.age;
      classInput.value = s.class;
      regInput.value = s.regNo;
      genderSelect.value = s.gender;
      formTitle.textContent = 'Edit Student';
      return;
    }
  }
}

function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  var newArr = [];
  for (var i = 0; i < students.length; i++) {
    if (students[i].id !== id) {
      newArr.push(students[i]);
    }
  }
  students = newArr;
  localStorage.setItem('students', JSON.stringify(students));
  renderTable();
}

function clearForm() {
  studentIdInput.value = '';
  nameInput.value = '';
  ageInput.value = '';
  classInput.value = '';
  regInput.value = '';
  genderSelect.value = '';
  formTitle.textContent = 'Add Student';
}

function toggleAttendance(id, checkbox) {
  var today = new Date().toDateString();

  for (var i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      var s = students[i];
      if (checkbox.checked) {
        if (s.attendance.indexOf(today) === -1) {
          s.attendance.push(today);
        }
      } else {
        var idx = s.attendance.indexOf(today);
        if (idx !== -1) {
          s.attendance.splice(idx, 1);
        }
      }
      break;
    }
  }

  localStorage.setItem('students', JSON.stringify(students));
}