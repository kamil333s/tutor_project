// Kevin Smith
// 3-29-16
// Code Fellows 401JS Project 1
// Tutor Queue display 



var service = 'http://localhost:3000';

$(document).ready(function(){

    jQuery.support.cors = true;

    $.ajax(
    {
        type: "GET",
        url: service + '/sessions',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            console.log(data);

        var trHTML = '';
        
        for (var i=0; i < data.length;i++) {
            trHTML += '<tr><td>' + data[i].subject + '</td><td>' + data[i].table + '</td></tr>';
                }
        // $.each(data.subject, function (i, item) {
            
        //     trHTML += '<tr><td>' + data.subject[i] + '</td><td>' + data.table[i] + '</td></tr>';
        // });
        
            console.log(trHTML);
        $('#sessionList').append(trHTML);
        
        },
        
        error: function (msg) {
            
            alert(msg.responseText);
        }
    });
})





/*
"use strict";
var SessionList = document.getElementById('SessionList');
var taskButton = document.getElementById('btn_task');
var taskField = document.getElementById('input');


function setFocus() {
    taskField.focus();
}

function addNewTask() {
    // Get current to do list and identify the last item
    var lastElement = toDoList.getElementsByTagName("td")[toDoList.length - 1];

    for (var i = 0; i )

    // Get new entry from form field
    var newTemp = document.getElementById('input');
    var newTask = newTemp.value;

    // Create new list item
    var newElement = document.createElement('li');

    // Create text for new task list item
    // ***Could use innerHTML, but chose to be explicit***
    // newElement.innerHTML = newTask
    var taskText = document.createTextNode(newTask);
    newElement.appendChild(taskText);

    // Put new task first in the list
    toDoList.insertBefore(newElement, firstElement);
}

function submitTask() {
    if (taskField.value !== '' && taskField !== 'New task to do') {
        addNewTask();
        taskField.value = '';
    }
}


// I chose to use different types of click event handlers just to illustrate their use.


// New task button click event handler
taskButton.onclick = function () {
    if (taskField.value !== '' && taskField.value !== "New task to do") {
        submitTask();
    }
    setFocus();
};

// List item click event handler
document.getElementById('toDoList').addEventListener('click', function (e) {
    if (e.target && e.target.nodeName === 'LI') {
        toDoList.removeChild(e.target);
    }
});

// When enter is pressed, add the task
document.getElementById('taskForm').onsubmit = function () {
    submitTask();
    // Prevents form from submitting and reloading page
    return false;
};

// Toggle default placeholder text in the form field
taskField.onfocus = function () {
    if (taskField.value === "New task to do") {
        taskField.value = "";
    }
};

// Toggle default placeholder text in the form field
taskField.onblur = function () {
    if (taskField.value === "") {
        taskField.value = "New task to do";
    }
};*/