// pre-fill form
let damageReportDetails = JSON.parse(window.localStorage.getItem('damageReportDetails'));
document.getElementById('emp_username').value = damageReportDetails.emp_username;
document.getElementById('bin_num').value = damageReportDetails.bin_num.toString();

// set the reported date time when the submit button is clicked
//reported_at = self.kwargs['reported_at']
$("#damageReportForm").submit( function(eventObj) {
    // get the current datetime
    let today = new Date();
    let DD = String(today.getDate()).padStart(2, '0');
    let MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let YYYY = today.getFullYear();
    let hh = String(today.getHours()).padStart(2, '0');
    let mm = String(today.getMinutes()).padStart(2, '0');
    let ss = String(today.getSeconds()).padStart(2, '0');
    let datetimeString = YYYY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss //e.g. 2007-01-01 10:00:00
    // add new attribute
    var input = $("<input>")
                   .attr("type", "hidden")
                   .attr("name", "reported_at").val(datetimeString);
    $('#damageReportForm').append(input);
    input = $("<input>")
                   .attr("type", "hidden")
                   .attr("name", "emp_username").val(damageReportDetails.emp_username);
    $('#damageReportForm').append(input);
    input = $("<input>")
                   .attr("type", "hidden")
                   .attr("name", "bin_num").val(damageReportDetails.bin_num);
    $('#damageReportForm').append(input);

    return true;
});

// callback funtcion to receive reposonse after submitting form
$(function(){
    $('form[name=damageReportForm]').submit(function(){
        $.post($(this).attr('action'), $(this).serialize(), function(data) {
            let response = data.data;
            if (response == 'OK'){
                alert("Report submitted ! Thank you");
                window.close();   // close the window
            }
            else{
                alert("Error submitting report")
            }
        }, 'json');
    return false;
    });
});