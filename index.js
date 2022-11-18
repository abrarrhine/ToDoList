(function(){


  let hideCompletedTaskFlag = false;
  let overdueOnlyFlag = false;
  let numOfCompleted = 0;
  const TRUNC_LIMIT = 30;
  const TRUNC_TO = 25;

  function truncate(input, number, numberTo) {
    if (input.length > number)
        return input.substring(0,numberTo) + '...';
    else
        return input;
  };

  function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1+date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  function QS(selector){
    return document.querySelector(selector);
  }

  function QSA(selector){
    return document.querySelectorAll(selector);
  }

  function ID(id){
    return document.getElementById(id);
  }

  function CLASS(className){
    return document.getElementsByClassName(className);
  }

  function TAGNAME(tagName){
    return document.getElementsByTagName(tagName);
  }

  function CREATE(tagName){
    return document.createElement(tagName);
  }

  let tasks = [
    {
      id: 0,
      title: "Doing Laundary",
      dueDate: new Date (2022,9,28),
      completed : false,
      completeDate : null,
      createdDate: new Date (2022,9,10),
      deleted:false,
      note:"I need to get quarters first at Kroger."
    },
    {
      id: 1,
      title: "5774 Assignment 3",
      dueDate: new Date (2022,9,28),
      completed : false,
      completeDate : null,
      createdDate: new Date (2022,9,10),
      deleted:false,
      note:"I better start early cuz it looks pretty complicated.\r\nLooks like I have to read w3schools.com a lot."
    },
    {
      id: 2,
      title: "Getting AAA batteries",
      dueDate: null,
      completed : true,
      completeDate : new Date (2022,9,12),
      createdDate: new Date (2022,9,10),
      deleted:false,
      note:"for my remote control."
    },
    {
      id: 3,
      title: "Booking a flight ticket ACM UIST conference",
      dueDate: new Date (2022,9,15),
      completed : false,
      completeDate : null,
      createdDate: new Date (2022,9,12),
      deleted:false,
      note:"I would have to book a flight ticket to ACM UIST conference.\r\nKeep an eye on the cancellation policy. the conference may be cancelled due to the COVID19 outbreak. :( Although flight tickets are getting cheaper."
    }
  ];

  let renderHTML = function(task){

    let title = truncate(task.title,TRUNC_LIMIT, TRUNC_TO);
    let checked = false;
    let tr_class = "";
    if(task.completed){
      title = "<del>"+title+"</del>";
      checked = true;
      tr_class += "table-success completed not-overdue";
      if(overdueOnlyFlag || hideCompletedTaskFlag){
        tr_class += " d-none";
      }
    }else{
      if(task.dueDate < new Date() && task.dueDate != null ){
        tr_class += "table-danger overdue";
      }else{
        tr_class += "not-overdue";
        if(overdueOnlyFlag){
          tr_class += " d-none";
        }
      }
    }

    const tr1 = CREATE("tr");
    tr1.id = task.id;
    tr1.className = tr_class;
    // first td
    const td1_checkbox = CREATE("td");
    const checkbox = CREATE("input");
    checkbox.type = "checkbox"
    checkbox.className = "form-check-input";
    checkbox.value = task.id;
    checkbox.checked = checked;
    checkbox.addEventListener("change", function() {
      tasks[this.value].completed = this.checked;
      if(tasks[this.value].completed){
        tasks[this.value].completeDate =  new Date();
      }else{
        tasks[this.value].completeDate = null;
      }
      renderTasks();
    });

    td1_checkbox.appendChild(checkbox);
    td1_checkbox.className = "text-center";
    tr1.appendChild(td1_checkbox);
    
    // second td
    const td2_title = CREATE("td");
    td2_title.innerHTML = title;
    td2_title.className = "text-center";
    tr1.appendChild(td2_title);

    // third td
    const td3_note = CREATE("td");
    td3_note.innerHTML =`<span class ="text-right"><button class = "btn btn-xs btn-warning" data-bs-toggle="collapse" data-bs-target="#note-${task.id}"><i class="bi bi-caret-down"> </span> Note</button></span`
    td3_note.className = "text-center";
    tr1.appendChild(td3_note);

    // fourth td
    const td4_duedate = CREATE("td");
    td4_duedate.innerHTML =`<td class = "text-center">${(task.dueDate? getFormattedDate(task.dueDate) : "")}</td>`
    td4_duedate.className = "text-center";
    tr1.appendChild(td4_duedate);

    // fifth td
    const td5_completedate = CREATE("td");
    td5_completedate.innerHTML =`<td class = "text-center">${(task.completeDate? getFormattedDate(task.completeDate) : "")}</td>`
    td5_completedate.className = "text-center";
    tr1.appendChild(td5_completedate);

    // sixth td
    const td6_buttons = CREATE("td");
    const deletebutton = CREATE("button");
    deletebutton.type = "button"
    deletebutton.className = "btn btn-danger btn-xs deletetask";
    deletebutton.alt = "Delete the task";
    deletebutton.value = task.id;
    deletebutton.innerHTML = `<i class="bi bi-trash"></i>`;
    deletebutton.addEventListener("click", function(){
      if(!confirm("Are you sure?"))
        return;
      tasks[this.value].deleted =  true;
      renderTasks();
    });
    td6_buttons.appendChild(deletebutton);
    td6_buttons.appendChild(document.createTextNode (" "));
    const a_email = CREATE("a");
    const emailbutton = CREATE("button");

    a_email.target = "_blank";
    a_email.href = `mailto:?body=${task.note}&subject=${task.title}`;
    emailbutton.type = "button"
    emailbutton.className = "btn btn-danger btn-xs emailtask";
    emailbutton.alt = "Send an email";
    emailbutton.value = task.id;
    emailbutton.innerHTML = `<i class="bi bi-envelope"></i>`;
    a_email.appendChild(emailbutton);
    td6_buttons.appendChild(a_email);
    tr1.appendChild(td6_buttons);

    const tr2 = CREATE("tr");
    tr2.id = `note-${task.id}`;
    tr2.className = "collapse";
    tr2.appendChild(CREATE("td"));
    const td_note = CREATE("td");
    td_note.colspan = 5;
    td_note.innerHTML = `<div class = "well"><h3>${task.title}</h3><div>${task.note.replace(/\r\n|\r|\n/g,"<br/>")}</div></div>`;
    tr2.appendChild(td_note);

    return [tr1, tr2];
  }

  let notOverdueTasks;
  let deleteCompletedTasksButton;
  let tbody;
  let renderTasks =function(){
    console.log("rendering");
    tbody.innerHTML= "";
    for ( let i=0; i<tasks.length; i++){

      if (tasks[i].deleted)
        continue;

      const trs = renderHTML(tasks[i])
      tbody.appendChild(trs[0]);
      tbody.appendChild(trs[1]);
    }
    
    notOverdueTasks = CLASS("not-overdue");
    completedTasks = CLASS("completed");
    deleteCompletedTasksButton.disabled = (completedTasks.length==0);
  };

  let overdueHandler = function(){
    this.firstChild.classList.toggle("active");
    for (let i=0; i< notOverdueTasks.length; i++){
      notOverdueTasks[i].classList.toggle("d-none");
    }
    deleteCompletedTasksButton.disabled = !deleteCompletedTasksButton.disabled;
    overdueOnlyFlag = !overdueOnlyFlag;
  }

  document.addEventListener("DOMContentLoaded", function(){
    deleteCompletedTasksButton = ID("deleteCompletedTasks");
    tbody  = TAGNAME("tbody")[0];
    renderTasks();
    deleteCompletedTasksButton.addEventListener("click", function(){
        if(!confirm("Do you want to delete "+ completedTasks.length + " task" + (completedTasks.length>1?"s?":"?")))
          return;
        QSA('.form-check-input').forEach(function(elem){
          if(elem.checked)
            tasks[elem.value].deleted =  true;
        })
        renderTasks();
    });

    ID("overdue").addEventListener("click", overdueHandler);

    QS(".addtask").addEventListener("click", function(){
      taskTitleEl.value = "";
      dueDateEl.value = "";
      taskNoteEl.value = "";
    });

    const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));

    const taskTitleEl = ID("task-title");
    const taskNoteEl = ID("task-note");
    const dueDateEl = ID("due-date");

    QS( "button[type=submit]" ).addEventListener("click",  function( event ) {
      // check if title is null
      event.preventDefault();

      let title = taskTitleEl.value.trim();
      if(title.length == 0){
        alert("Task title is required");
        return;
      }
      let dueDate = ID("due-date").value.trim();
      if (dueDate.length==0){
        dueDate = null;
      }else{
        if(isNaN(Date.parse(dueDate))){
          alert("Check your date format.")
          return;
        }
        dueDate = new Date(dueDate);
      }
      let note = taskNoteEl.value;

      tasks.push({
        id: tasks.length,
        title: title,
        dueDate: dueDate,
        completed : false,
        completeDate : null,
        createdDate: new Date(),
        deleted:false,
        note:note
      })

      modal.hide();
      renderTasks();
    });

  });


})();
