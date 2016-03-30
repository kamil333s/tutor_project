'use strict';
var service = 'http://localhost:3000';

$(document).ready(function(){

    $.ajax(
    {
        type: "GET",
        url: service + '/admin/subjects',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            var trHTML = '';
            
            for (var i=0; i < data[0].subjects.length;i++) {
            console.log(data[0].subjects[i]);
                // delButton = '<button type="button" class="removeSession" id="' + data[i]._id + '">Remove</button>'
                trHTML += '<option value="' + data[0].subjects[i] + '">' + data[0].subjects[i] + '</option>"' ;
            }// for

            $('#subject').append(trHTML);  

            $.ajax(
                {
                    type: "GET",
                    url: service + '/admin/tables',
                    data: "{}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    cache: false,
                    success: function (data) {
                        var trHTML = '';                        
                        for (var i=0; i < data[0].tables.length;i++) {
                            trHTML += '<option value="' + data[0].tables[i] + '">' + data[0].tables[i] + '</option>"' ;
                        }// for
                        $('#table').append(trHTML);  
                    },// success                    
                    error: function (msg) {            
                        alert(msg.responseText);
                    }// error
                });// ajax
        },// success        
        error: function (msg) {            
            alert(msg.responseText);
        }// error
    });// ajax

})// ready