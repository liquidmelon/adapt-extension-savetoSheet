define([
    'coreJS/adapt'
], function(Adapt) {

    var t; //reference to this
    var useMethod; //String: "ajaxBB", "ajaxJQ", "W3Sform", "modelCORS"
    var SD1; //Submit Data 1
    var SD2; //Submit Data 2
    var FE1 = 'entry.119597203'; //form entry 1
    var FE2 = 'entry.126901470'; //form entry 2
    var submitRef = '&submit=-360594335577950894';
    var FormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdGyTBv-jMf9b7z7sfFqXH3uchT0QXwaQ3rBwQ2uITXAVR5sg/formResponse?';

    var SAVETOSHEET = _.extend({

        PLUGIN_NAME: "_savetoSheet",

        initialize: function() {
            t = this;
            t.listenToOnce(Adapt, {
                "app:dataLoaded": t.setupListeners
            });
        },

        setupListeners: function() {
            t.listenToOnce(Adapt, "app:dataReady", t.setupModel);
        },

        setupModel: function() {
            t.model = Adapt.course.get(t.PLUGIN_NAME);
            useMethod = t.model._useMethod;
            t.listenTo(Adapt.course, 'change:_isComplete', t.onCompletion);
        },

        submitMyAjaxBB: function() {
            var tempData = {
                'entry.119597203': SD1,
                'entry.126901470': SD2
            }
            Backbone.ajax(_.extend({
                url: FormURL,
                method: "POST",
                contentType: "application/x-www-form-urlencoded", //sending type
                data: tempData,
                dataType: "html", //receiving type
                statusCode: {
                    0: function () {
                        //console.log('statusCode: error');
                    },
                    200: function () {
                        //console.log('statusCode: OK');
                    }
                },
                complete: function() {
                    //console.log('complete: data has been posted');
                    t.pushMe();
                }
            }));
        },

        submitMyAjaxJQ: function() {
            var tempData = {
                'entry.119597203': SD1,
                'entry.126901470': SD2
            }
            $.ajax({
                url: FormURL,
                contentType: "application/x-www-form-urlencoded;", //sending type
                data: tempData,
                type: "POST",
                dataType: "html", //receiving type
                statusCode: {
                    0: function () {
                        //console.log('statusCode: error');
                    },
                    200: function () {
                        //console.log('statusCode: OK');
                    }
                },
                complete: function() {
                    //console.log('complete: data has been posted');
                    t.pushMe();
                }
            });
        },

        submitMyW3Sform: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    //console.log("readyState4: request finished and response is ready");
                    t.pushMe();
                    if (this.status == 200) {
                        //console.log("status200: OK")
                    }
                }
            };
            xhttp.open("POST", FormURL, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(FE1 + '=' + SD1 + '&' + FE2 + '=' + SD2 + submitRef);
        },

        submitMyModelCORS: function() {
            var session = new Session();
            session.set({
                SavedData1: SD1,
                SavedData2: SD2
            });
            session.submitData({
                myCallback: t.onDataSuccess
            });
        },

        onDataSuccess: function() {
            t.pushMe();
        },

        onCompletion: function(){

            SD1 = encodeURI('_isComplete');
            SD2 = encodeURI(String(Adapt.course.get('_isComplete')));

            switch(t.model._useMethod){

                case 'ajaxBB': t.submitMyAjaxBB();
                break;
                case 'ajaxJQ': t.submitMyAjaxJQ();
                break;
                case 'W3Sform': t.submitMyW3Sform();
                break;
                case 'modelCORS': t.submitMyModelCORS();
                break;
                default: ;

            }

        },

        pushMe: function(){
            var pushObject = {
                title: "Success!",
                body: "You're data has been submitted.",
                _timeout: 5000,
                _callbackEvent: /*"pushNotify:clicked"*/ "" /*The _callbackEvent is triggered only if the push notification is clicked*/
            };
            MyAdapt.on('pushNotify:clicked', function() {
                //console.log('A push notification was clicked');
            });
            MyAdapt.trigger('notify:push', pushObject);
        }

    }, Backbone.Events);

    //

    var Session = Backbone.Model.extend({

        urlRoot: 'https://docs.google.com/forms/d/e/1FAIpQLSdGyTBv-jMf9b7z7sfFqXH3uchT0QXwaQ3rBwQ2uITXAVR5sg/formResponse?',

        defaults: {
            FormEntry1: 'entry.119597203',
            FormEntry2: 'entry.126901470',
            SubmitReference: '&submit=-360594335577950894',
            CallbackOption: null,
            SavedData1: null,
            SavedData2: null
        },

        submitData: function(option) {

            this.set('CallbackOption', option);

            this.makeCorsRequest();

        },

        // Create the XHR object.
        createCORSRequest: function(method, url) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                // XHR for Chrome/Firefox/Opera/Safari.
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest != "undefined") {
                // XDomainRequest for IE.
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else {
                // CORS not supported.
                xhr = null;
            }
            return xhr;
        },

        // Make the actual CORS request.
        makeCorsRequest: function() {

            var xhr = this.createCORSRequest('POST', this.urlRoot); //this.url() works, too

            if (!xhr) {
                alert('CORS not supported');
                return;
            }

            // Response handlers.

            var tSession = this;

            //When the request has successfully completed.
            xhr.onload = function() {
                //console.log('Response from CORS request');
            };
            //When the request has ended in success or failure. NO IE!
            xhr.onloadend = function() {
                //console.log('Request ended, with either success or failure.');
            };
            //When the request has failed.
            xhr.onerror = function() {
                //console.log('Woops, there was an error making the request.');
            };

            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    //console.log("readyState4: request finished and response is ready")
                    tSession.get('CallbackOption').myCallback();
                    if (this.status == 200) {
                        //console.log("status200: OK")
                    }
                }
            };

            xhr.send(this.get('FormEntry1') + "=" + this.get('SavedData1') + "&" + this.get('FormEntry2') + "=" + this.get('SavedData2') + this.get('SubmitReference'));

        }

    });

    SAVETOSHEET.initialize();

    return SAVETOSHEET;

});
