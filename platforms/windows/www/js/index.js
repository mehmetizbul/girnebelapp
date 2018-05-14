/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



var app = {

    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        /*Belediyeden Haberler START*/
        var haberAjaxLoaded = 0;
        var jsonResponse;
        $("#belediyedenHaberler").on("pageshow", function(event, ui) {
            if(haberAjaxLoaded == 0) {
                $.ajax({
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "http://www.girnebelediyesi.com/?json=get_recent_posts",
                    data: {},
                    beforeSend: function () {
                        var $this = $(this),
                            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
                            msgText = "Sayfanız yükleniyor...",
                            textVisible = true,
                            textonly = !!$this.jqmData("textonly");

                        html = $this.jqmData("html") || "";

                        $.mobile.loading("show", {
                            text: msgText,
                            textVisible: textVisible,
                            theme: theme,
                            textonly: textonly,
                            html: html
                        });
                    },

                    success: function (data) {
                        haberAjaxLoaded = 1;
                        $.mobile.loading("hide");
                        jsonResponse = data;

                        //console.log(data);

                        var collapsibleSet = $("#accordion");

                        $.each(data.posts, function (key, val) {

                            var collapsible = $('<h5 class="accordion-toggle" id="' + val.id + '"><img src="../img/plusSign.png" width="22px" height="22px"/> ' + val.title + '</h5>');

                            var collapsibleDiv = $('<div class="accordion-content"></div>');


                            collapsibleSet.append(collapsible);
                            collapsibleSet.append(collapsibleDiv);
                            collapsibleSet.trigger('create');

                        });
                        $('.fotorama').fotorama();
                    },
                    error: function (xhr, status, error) {
                        //var err = eval("(" + xhr.responseText + ")");
                        console.log(xhr.responseText);
                        //alert();
                    }
                });
            }
        });
        $('#accordion').on('click', '.accordion-toggle', function () {

            if ($(this).next(".accordion-content").is(':empty')) {

                $(this).find('img').attr("src","../img/minusSign.png");

                $('.accordion-toggle').not(this).each(function(){
                    $(this).find('img').attr("src","../img/plusSign.png");
                });

                var post = getObjects(jsonResponse, 'id', $(this).attr('id'));

                var collapsibleDiv = $(this).next(".accordion-content");

                var imageContent = $('<div class="fotorama"></div>');

                $.each(post[0].attachments, function (key, val) {
                    imageContent.append('<img id="' + val.url + '" src="' + val.images.medium.url + '" />');
                });

                collapsibleDiv.append(imageContent);

                var content = post[0].content.substr(post[0].content.indexOf("</div>") + 6).substr(0, post[0].content.substr(post[0].content.indexOf("</div>") + 6).indexOf("<div"))
                collapsibleDiv.append('<div id="' + post[0].id + '">' + content + '<div>');
                collapsibleDiv.trigger('refresh');

                $(this).next().slideToggle('fast');

                $(".accordion-content").not($(this).next()).html("");
                $(".accordion-content").not($(this).next()).slideUp('fast');
                $(".accordion-toggle").not($(this).prev().find('img').attr("src","../img/plusSign.png"));

                $('.fotorama').fotorama();
            }
            else {
                $(this).find('img').attr("src","../img/plusSign.png");
                $(this).next().slideToggle('fast');
                $(".accordion-content").not($(this).next()).slideUp('fast');
                $(this).next(".accordion-content").html("");
            }


        });
        /*Belediyeden Haberler END*/



        /*DuyurularnIhaleler START*/
        var jsonResponseID;
        var IDAjaxLoaded = 0;
        $("#duyurular").on("pageshow", function(event, ui) {
            if(IDAjaxLoaded == 0) {
                $.ajax({
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "http://www.girnebelediyesi.com/api/get_posts/?post_type=lsvrnotice&count=50",
                    data: {},
                    beforeSend: function () {
                        var $this = $(this),
                            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
                            msgText = "Sayfanız yükleniyor...",
                            textVisible = true,
                            textonly = !!$this.jqmData("textonly");

                        html = $this.jqmData("html") || "";


                        $.mobile.loading("show", {
                            text: msgText,
                            textVisible: textVisible,
                            theme: theme,
                            textonly: textonly,
                            html: html
                        });
                    },

                    success: function (data) {
                        IDAjaxLoaded = 1;
                        $.mobile.loading("hide");
                        jsonResponseID = data;

                        //console.log(data);

                        var collapsibleSet = $("#accordionDuyurular");
                        var collapsibleSetI = $("#accordionIhaleler");

                        var countDuyuru = 0;
                        var countIhale = 0;

                        $.each(data.posts, function (key, val) {
                            if (val.taxonomy_lsvrnoticecat[0].slug == "duyurular" && countDuyuru < 10) {
                                var collapsible = $('<h5 class="accordion-toggle" id="' + val.id + '"><img src="../img/plusSign.png" width="22px" height="22px"/> ' + val.title + '</h5>');

                                var collapsibleDiv = $('<div class="accordion-content"></div>');

                                countDuyuru++;

                                collapsibleSet.append(collapsible);
                                collapsibleSet.append(collapsibleDiv);
                                collapsibleSet.trigger('create');

                            }
                            else if (val.taxonomy_lsvrnoticecat[0].slug == "ihale-ilanlari" && countIhale < 10) {
                                var collapsibleI = $('<h5 class="accordion-toggle" id="' + val.id + '"><img src="../img/plusSign.png" width="22px" height="22px"/> ' + val.title + '</h5>');

                                var collapsibleDivI = $('<div class="accordion-content"></div>');

                                countIhale++;

                                collapsibleSetI.append(collapsibleI);
                                collapsibleSetI.append(collapsibleDivI);
                                collapsibleSetI.trigger('create');

                            }

                        });

                    },
                    error: function (xhr, status, error) {
                        //var err = eval("(" + xhr.responseText + ")");
                        console.log(xhr.responseText);
                        //alert();
                    }
                });
            }

        });
        $('#accordionDuyurular').on('click', '.accordion-toggle', function () {

            if ($(this).next(".accordion-content").is(':empty')) {

                $(this).find('img').attr("src","../img/minusSign.png");

                $('.accordion-toggle').not(this).each(function(){
                    $(this).find('img').attr("src","../img/plusSign.png");
                });

                var post = getObjects(jsonResponseID, 'id', $(this).attr('id'));

                var collapsibleDiv = $(this).next(".accordion-content");

                var content;

                if(post[0].attachments.length > 0)
                {
                    var imageContent = $('<div class="fotorama"></div>');
                    $.each(post[0].attachments, function (key, val) {
                        imageContent.append('<img id="' + val.url + '" src="' + val.images.medium.url + '" />');
                    });

                    collapsibleDiv.append(imageContent);

                    content = post[0].content.substr(post[0].content.indexOf("</div>") + 6).substr(0, post[0].content.substr(post[0].content.indexOf("</div>") + 6).indexOf("<div"))

                    $('.fotorama').fotorama();
                }
                else
                {
                    content = post[0].content.substr(0, post[0].content.indexOf('<div style') + 10);
                }

                collapsibleDiv.append('<div id="' + post[0].id + '">' + content + '<div>');
                collapsibleDiv.trigger('refresh');

                $(this).next().slideToggle('fast');

                $(".accordion-content").not($(this).next()).html("");
                $(".accordion-content").not($(this).next()).slideUp('fast');
                $(".accordion-toggle").not($(this).prev().find('img').attr("src","../img/plusSign.png"));


            }
            else {
                $(this).find('img').attr("src","../img/plusSign.png");
                $(this).next().slideToggle('fast');
                $(".accordion-content").not($(this).next()).slideUp('fast');
                $(this).next(".accordion-content").html("");
            }


        });

        $("#ihaleler").on("pageshow", function(event, ui) {
            if(IDAjaxLoaded == 0) {
                $.ajax({
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "http://www.girnebelediyesi.com/api/get_posts/?post_type=lsvrnotice&count=50",
                    data: {},
                    beforeSend: function () {
                        var $this = $(this),
                            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
                            msgText = "Sayfanız yükleniyor...",
                            textVisible = true,
                            textonly = !!$this.jqmData("textonly");

                        html = $this.jqmData("html") || "";


                        $.mobile.loading("show", {
                            text: msgText,
                            textVisible: textVisible,
                            theme: theme,
                            textonly: textonly,
                            html: html
                        });
                    },

                    success: function (data) {
                        IDAjaxLoaded = 1;
                        $.mobile.loading("hide");
                        jsonResponseID = data;

                        //console.log(data);

                        var collapsibleSet = $("#accordionDuyurular");
                        var collapsibleSetI = $("#accordionIhaleler");

                        var countDuyuru = 0;
                        var countIhale = 0;

                        $.each(data.posts, function (key, val) {
                            if (val.taxonomy_lsvrnoticecat[0].slug == "duyurular" && countDuyuru < 10) {
                                var collapsible = $('<h5 class="accordion-toggle" id="' + val.id + '"><img src="../img/plusSign.png" width="22px" height="22px"/> ' + val.title + '</h5>');

                                var collapsibleDiv = $('<div class="accordion-content"></div>');

                                countDuyuru++;

                                collapsibleSet.append(collapsible);
                                collapsibleSet.append(collapsibleDiv);
                                collapsibleSet.trigger('create');

                            }
                            else if (val.taxonomy_lsvrnoticecat[0].slug == "ihale-ilanlari" && countIhale < 10) {
                                var collapsibleI = $('<h5 class="accordion-toggle" id="' + val.id + '"><img src="../img/plusSign.png" width="22px" height="22px"/> ' + val.title + '</h5>');

                                var collapsibleDivI = $('<div class="accordion-content"></div>');

                                countIhale++;

                                collapsibleSetI.append(collapsibleI);
                                collapsibleSetI.append(collapsibleDivI);
                                collapsibleSetI.trigger('create');

                            }

                        });

                    },
                    error: function (xhr, status, error) {
                        //var err = eval("(" + xhr.responseText + ")");
                        console.log(xhr.responseText);
                        //alert();
                    }
                });
            }
        });
        $('#accordionIhaleler').on('click', '.accordion-toggle', function () {

            if ($(this).next(".accordion-content").is(':empty')) {

                $(this).find('img').attr("src","../img/minusSign.png");

                $('.accordion-toggle').not(this).each(function(){
                    $(this).find('img').attr("src","../img/plusSign.png");
                });

                var post = getObjects(jsonResponseID, 'id', $(this).attr('id'));

                var collapsibleDiv = $(this).next(".accordion-content");

                var content;

                /*if(post[0].attachments.length > 0)
                {
                    var imageContent = $('<div class="fotorama"></div>');
                    $.each(post[0].attachments, function (key, val) {
                        console.log(val);
                        imageContent.append('<img id="' + val.url + '" src="' + val.images.medium.url + '" />');
                    });

                    collapsibleDiv.append(imageContent);

                    content = post[0].content.substr(post[0].content.indexOf("</div>") + 6).substr(0, post[0].content.substr(post[0].content.indexOf("</div>") + 6).indexOf("<div"))

                    $('.fotorama').fotorama();
                }*/
                //else
                // {
                content = post[0].content.substr(0, post[0].content.indexOf('<div style') + 10);
                content = content.substr(content.indexOf('</a></p>'))
                // }

                collapsibleDiv.append('<div id="' + post[0].id + '">' + content + '<div>');
                collapsibleDiv.trigger('refresh');

                $(this).next().slideToggle('fast');

                $(".accordion-content").not($(this).next()).html("");
                $(".accordion-content").not($(this).next()).slideUp('fast');
                $(".accordion-toggle").not($(this).prev().find('img').attr("src","../img/plusSign.png"));


            }
            else {
                $(this).find('img').attr("src","../img/plusSign.png");
                $(this).next().slideToggle('fast');
                $(".accordion-content").not($(this).next()).slideUp('fast');
                $(this).next(".accordion-content").html("");
            }


        });
        /*DuyurularnIhaleler END*/


        function getObjects(obj, key, val) {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(getObjects(obj[i], key, val));
                } else if (i == key && obj[key] == val) {
                    objects.push(obj);
                }
            }
            return objects;
        }

        /*Borç Sorgulama START*/
        $("#emlakBT").click(function () {
            $("#suContent").hide();
            var emlakContent = $("#emlakContent");

            if ($("#emlakTB").val().length != 9)
                alert("Girilen TGE numarası 9 haneli olmalıdır.")
            else {

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "http://91.151.82.135:85/BWS/Service.asmx/BWS_Getter_Func",
                    data: "{procedureName:'TAH_Emlakborc_Get', parameters:[['TGEno', '"+ $("#emlakTB").val() +"']]}",
                    success: function (msg) {
                        var json_obj = $.parseJSON(msg.d);

                        if (jQuery.isEmptyObject(json_obj)) {
                            alert($("#emlakTB").val() + ' numarasına ait abone bulunamadı');
                            $("#emlakTB").val("");
                        }
                        else {
                            var date = new Date(json_obj[0].sonOdeme.match(/\d+/)[0] * 1);
                            date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

                            emlakContent.html("");
                            emlakContent.show();
                            emlakContent.append('<table>');
                            emlakContent.append('<tr><td><span style="font-weight: bold">Ad-Soyad:</span></td><td>' + json_obj[0].adSoyad + '</td></tr>');
                            emlakContent.append('<tr><td><span style="font-weight: bold">TGENo:</span></td><td>' + json_obj[0].TGEno + '</td></tr>');
                            emlakContent.append('<tr><td><span style="font-weight: bold">Borç:</span></td><td>' + json_obj[0].borc + '</td></tr>');
                            emlakContent.append('<tr><td><span style="font-weight: bold">Son Ödeme:</span></td><td>' + date + '</td></tr>');
                            emlakContent.append('</table>');
                            emlakContent.trigger('refresh');
                        }
                    },
                    error: function () {

                    }
                });
            }
        });
        $("#suBT").click(function () {
            $("#emlakContent").hide();
            var suContent = $("#suContent");

            if ($("#suTB").val().length != 11)
                alert("Girilen abone numarası 11 haneli olmalıdır.")
            else {

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "http://91.151.82.135:85/BWS/Service.asmx/BWS_Getter_Func",
                    data: "{procedureName:'TAH_Suborc_Get', parameters:[['aboneNo', '"+ $("#suTB").val() +"']]}",
                    success: function (msg) {
                        var json_obj = $.parseJSON(msg.d);
                        if (jQuery.isEmptyObject(json_obj)) {
                            alert($("#suTB").val() + ' numarasına ait abone bulunamadı');
                            $("#suTB").val("");
                        }
                        else {
                            var date = new Date(json_obj[0].sonOdeme.match(/\d+/)[0] * 1);
                            date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

                            suContent.html("");
                            suContent.show();
                            suContent.append('<table>');
                            suContent.append('<tr><td><span style="font-weight: bold">Ad-Soyad:</span></td><td>' + json_obj[0].adSoyad + '</td></tr>');
                            suContent.append('<tr><td><span style="font-weight: bold">Abone No:</span></td><td>' + json_obj[0].aboneNo + '</td></tr>');
                            suContent.append('<tr><td><span style="font-weight: bold">Borç:</span></td><td>' + json_obj[0].borc + '</td></tr>');
                            suContent.append('<tr><td><span style="font-weight: bold">Son Ödeme:</span></td><td>' + date + '</td></tr>');
                            suContent.append('</table>');
                            suContent.trigger('refresh');
                        }
                    },
                    error: function () {

                    }
                });
            }
        });
        /*Borç Sorgulama End*/

        /*Şikayet Gönderme START*/
        var location = 0;
        var longitude;
        var latitude;
        var kontakTipi;
        var images = [];
        var imageNames = [];
        $('#lokasyonFC').on('change', function() {

            if($("#lokasyonFC").prop("checked") == true)
            {
                alert("Bilgi: Bu servisi kullanabilmek için GPS'iniz açık olmalıdır. Lütfen kontrol ediniz.");
                location = 1;
            }
            else
            {
                latitude = "";
                longitude = "";
                location = 0;
            }
        });
        $('#bildirimTipi').on('change', function() {
            if($('input[name=radio-choice-v-2]:checked', '#bildirimTipi').val() == "email")
            {
                kontakTipi = "email";
                $("#contactDiv").html('<fieldset data-role="fieldcontain"><label for="email">Email: <div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ui-input-has-clear"><input type="text" name="kontakText" id="kontakText"/></div></label></fieldset>');
            }

            else if($('input[name=radio-choice-v-2]:checked', '#bildirimTipi').val() == "telefon")
            {
                kontakTipi = "telefon";
                $("#contactDiv").html('<fieldset data-role="fieldcontain"><label for="telefon">Telefon: <div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ui-input-has-clear"><input type="text" name="kontakText" id="kontakText"/></div></label></fieldset>');
            }
        });
        $("#sikayetGonderBT").click(function () {
            if(location == 1)
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            else
            {
                var requestCallback = new MyRequestsCompleted({
                    numRequest: 2,
                    singleCallback: function(){
                    }
                });

                //usage in request
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "http://91.151.82.135:85/BWS/Service.asmx/APP_Sikayet_Set",
                    data: "{kontakTipi:'"+kontakTipi+"', kontakText:'"+$("#kontakText").val()+"', not:'"+$("#sikayetTA").val()+"', latitude:'"+latitude+"', longitude:'"+longitude+"'}",
                    success: function () {
                        requestCallback.requestComplete(true);
                    },
                    error: function () {
                        alert("Error on sikayet set");
                    }
                });
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    url: "http://91.151.82.135:85/BWS/Service.asmx/APP_SikayetFoto_Set",
                    data: "{'fotoByteArray':"+JSON.stringify(imageNames)+"}",
                    success: function () {
                        requestCallback.requestComplete(true);
                    },
                    error: function () {
                        alert("Error on foto set");
                    }
                });
            }


        });
        $('#sikayetBildirim').on('click','#cameraBT', function () {
            navigator.camera.getPicture(onSuccessCamera, onErrorCamera, {
                quality: 50,
                destinationType: Camera.DestinationType.NATIVE_URI,
                encodingType: navigator.camera.EncodingType.JPEG
            });
        });
        $('#images').on('click', 'a.remove_block', function(events){
            $(this).closest("div").remove();
            images.splice(parseInt($(this).closest("div").attr('id')),1);
            e.preventDefault();
        });
        function onSuccess(position) {
            // initialize here
            var requestCallback = new MyRequestsCompleted({
                numRequest: 3,
                singleCallback: function(){
                }
            });

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            requestCallback.requestComplete(true);

            //usage in request
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "http://91.151.82.135:85/BWS/Service.asmx/APP_Sikayet_Set",
                data: "{kontakTipi:'"+kontakTipi+"', kontakText:'"+$("#kontakText").val()+"', not:'"+$("#sikayetTA").val()+"', latitude:'"+latitude+"', longitude:'"+longitude+"'}",
                success: function () {
                    requestCallback.requestComplete(true);
                },
                error: function () {
                    alert("Error on sikayet set");
                }
            });
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                url: "http://91.151.82.135:85/BWS/Service.asmx/APP_SikayetFoto_Set",
                data: "{'fotoByteArray':"+JSON.stringify(imageNames)+"}",
                success: function () {
                    requestCallback.requestComplete(true);
                },
                error: function () {
                    alert("Error on foto set");
                }
            });
        }
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');


        }
        function onSuccessCamera(imageData) {
            //console.log(imageData);

            imageNames.push(imageData.substr(imageData.lastIndexOf('/')+1));
            images.push(imageData);

            var imageDiv = $("#images");
            imageDiv.html("");
            $.each(images, function (key, val) {
                imageDiv.append('<div  id="' + key + '" style="padding-left: 10px; float: left; position: relative;"><a style="position: absolute; text-decoration: none;" class="remove_block" href="#">X</a><img src="' + val + '" width="60px" height="60px;" /> </div>');
            });

            var urlimg = "http://91.151.82.135:85/BWS/Service.asmx/SaveImage";

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = imageData.substr(imageData.lastIndexOf('/')+1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;

            var ft = new FileTransfer();

            var statusDom = $("#status");

            statusDom.html('<img width="20px" height="20px" src="img/spinner.gif" /> Foto yükleniyor...');

            setTimeout(function() {

                ft.upload(imageData, urlimg, function(){
                    statusDom.html("Foto yüklendi!");
                }, function(err){
                    alert("Error: " + JSON.stringify(err));
                }, options );
            }, 600);

        }
        function onErrorCamera(message) {
            alert('Failed because: ' + message);
        }
        var MyRequestsCompleted = (function() {
            var numRequestToComplete, requestsCompleted, callBacks, singleCallBack;

            return function(options) {
                if (!options) options = {};

                numRequestToComplete = options.numRequest || 0;
                requestsCompleted = options.requestsCompleted || 0;
                callBacks = [];
                var fireCallbacks = function() {
                    alert("Şikayetiniz başarı ile kaydedilmiştir.");
                    for (var i = 0; i < callBacks.length; i++) callBacks[i]();
                };
                if (options.singleCallback) callBacks.push(options.singleCallback);

                this.addCallbackToQueue = function(isComplete, callback) {
                    if (isComplete) requestsCompleted++;
                    if (callback) callBacks.push(callback);
                    if (requestsCompleted == numRequestToComplete) fireCallbacks();
                };
                this.requestComplete = function(isComplete) {
                    if (isComplete) requestsCompleted++;
                    if (requestsCompleted == numRequestToComplete) fireCallbacks();
                };
                this.setCallback = function(callback) {
                    callBacks.push(callBack);
                };
            };
        })();

        /*Şikayet Gönderme END*/


        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
}






