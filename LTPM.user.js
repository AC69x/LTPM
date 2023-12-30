// ==UserScript==
// @name         LTPM
// @namespace    https://github.com/NoirBird/LTPM
// @version      0.4
// @description  Repair all trucks, Repair all trailers, Sleep all and more coming soon.
// @author       NoirBird
// @match        https://www.logitycoon.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        document.querySelector("body > div > div.page-container > div.page-content-wrapper > div > div:nth-child(9) > div:nth-child(1) > div > div.portlet-title.tabbable-line > div.actions > div").innerHTML = '\n                                                <button onclick="repairallmod()" id="repairall" class="btn btn-outline blue btn-sm"><i class="fa fa-cogs"></i> Repair All</button> <a class="btn blue btn-circle btn-outline " href="javascript:;" data-toggle="dropdown" aria-expanded="false">\n                                                    <i class="fa fa-bars"></i> Options                                                    <i class="fa fa-angle-down"></i>\n                                                </a>\n                                                <ul class="dropdown-menu pull-right">\n                                                    <li>\n                                                        <a onclick="repairtrucks()">\n                                                            <i class="fa fa-cogs"></i> Repair all trucks </a>\n                                                    </li>\n                                                    <li class="divider"> </li>\n                                                    <li>\n                                                        <a onclick="tireswitchallsummer()">\n                                                            <i class="fa fa-sun font-red-sunglo"></i> Summer Tires </a>\n                                                    </li>\n                                                    <li>\n                                                        <a onclick="tireswitchallwinter()">\n                                                            <i class="far fa-snowflake font-blue"></i> Winter Tires </a>\n                                                    </li>\n                                                </ul>\n                                            ';
        document.querySelector("#truckers-buttons > button").innerHTML = document.querySelector("#truckers-buttons > button").innerHTML.replace('(<i class="icon-diamond"></i>)', '');
    });

    function repairtruck(truck){
        $('#repairbtnxs-truck' + truck).removeClass('blue').addClass('grey').attr('disabled', 'disabled');
        $('#repairbtn-truck' + truck).removeClass('blue').addClass('grey').attr('disabled', 'disabled');

        jQuery.ajax({
            url: "ajax/garage_repair.php",
            data: {repairtruck: truck},
            type: "POST",
            dataType: "JSON",
            success:function(data){
                if(data.error === "SUCCESS"){
                    $('#condition-truck' + truck).html('100 %');
                    $('#action-truck' + truck)
                        .html('<b>In maintenance</b> (<span class="caption-helper" id="ready-truck' + truck + '"></span>)');
                    new Timer(
                        data.time,
                        "ready-truck" + truck,
                        function(){
                            $('#action-truck' + truck)
                                .html('<b>Nothing</b>');
                        }
                    );
                }else{
                    localStorage.setItem("Error",data.fullerror);
                    toastrnow();
                    $('#repairbtnxs-truck' + truck).removeClass('grey').addClass('blue').removeAttr('disabled');
                    $('#repairbtn-truck' + truck).removeClass('grey').addClass('blue').removeAttr('disabled');
                }
            },
            error:function (){}
        });
    }
    
    function repairtrucks() {
        const lol = document.getElementsByClassName('btn btn-outline red btn-sm');
        let shmit=[]
        for (let item of lol) {
            var onclickRegex = /onclick\(event\) {\nlocation\.href='index\.php\?a=garage_truck&t=(\d+)';\n}/;
            var match = item.onclick.toString().match(onclickRegex);

            if (match && match[1]) {
                var onclickValue = match[1];
                shmit.push(onclickValue);
            }
        }
        shmit = [...new Set(shmit)];
        shmit.forEach((element) => repairtruck(element));
    }

    function repairtrailer(trailer){
        $('#repairbtnxs-trailer' + trailer).removeClass('blue').addClass('grey').attr('disabled', 'disabled');
        $('#repairbtn-trailer' + trailer).removeClass('blue').addClass('grey').attr('disabled', 'disabled');

        jQuery.ajax({
            url: "ajax/garage_repair.php",
            data: {repairtrailer: trailer},
            type: "POST",
            dataType: "JSON",
            success:function(data){
                if(data.error === "SUCCESS"){
                    $('#condition-trailer' + trailer).html('100 %');
                    $('#action-trailer' + trailer)
                        .html('<b>In maintenance</b> (<span class="caption-helper" id="ready-trailer' + trailer + '"></span>)');

                    new Timer(
                        data.time,
                        "ready-trailer" + trailer,
                        function(){
                            $('#action-trailer' + trailer)
                                .html('<b>Nothing</b>');
                        }
                    );

                }else{
                    localStorage.setItem("Error",data.fullerror);
                    toastrnow();
                    $('#repairbtnxs-trailer' + trailer).removeClass('grey').addClass('blue').removeAttr('disabled');
                    $('#repairbtn-trailer' + trailer).removeClass('grey').addClass('blue').removeAttr('disabled');
                }
            },
            error:function (){}
        });
    }

    function repairtrailers() {
        const lol = document.getElementsByClassName('btn btn-outline red btn-sm');
        let shmit=[]
        for (let item of lol) {
            var onclickRegex = /onclick\(event\) {\nlocation\.href='index\.php\?a=garage_trailer&t=(\d+)';\n}/;
            var match = item.onclick.toString().match(onclickRegex);

            if (match && match[1]) {
                var onclickValue = match[1];
                shmit.push(onclickValue);
            }
        }
        shmit = [...new Set(shmit)];
        shmit.forEach((element) => repairtrailer(element));
    }

    function employeesleeep(employee) {
        jQuery.ajax({
            url: "ajax/employee_sleep.php",
            data: {e: employee},
            type: "GET",
            success:function(data){
                $("#status").html(data);
            },
            error:function (){}
        });
    }

    function sleepall() {
        const lol = document.getElementsByTagName("a")
        let shmit=[]
        for (let item of lol) {
            if (item.href.includes("employees_select")) {
                var regex = /[?&]e=(\d+)(?:(?=&)|$)/;

                var match = item.href.toString().match(regex);

                if (match) {
                    var employeeNumber = match[1];
                    shmit.push(employeeNumber);
                } else {
                    console.log("No match found");
                }
            }
        }
        shmit = [...new Set(shmit)];
        shmit.forEach((element) => employeesleeep(element));
        location.reload()
    }

    function repairallmod() {
        repairtrucks();
        repairtrailers();
    }

    window.repairtrucks = repairtrucks;
    window.repairtrailers = repairtrailers;
    window.sleepall = sleepall;
    window.repairallmod = repairallmod;
})();
