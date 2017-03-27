# adapt-extension-savetoSheet

**Save to Sheet** is an *extension* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework) that demonstrates how to send data to a google spreadsheet. in the setting's dropdown, choose from one of four methods used: Ajax/Backbone, Ajax/JQuery, w3school's form, model/CORS.



## Notes

default behavior has been configured to submit course information for "_isComplete", which will be sent to the spreadsheet* once the course has been completed by visiting all of its required articles, blocks, and components. if a course assessment has been added, you may choose to submit assessment information for "isPass", which will be sent to the spreadsheet once the assessment has been passed. the user is alerted to either submission with a push notification.

also note that this plugin is more for reference than production. it is suggested to make a fork to support your own scenario.

*[example spreadsheet](https://docs.google.com/spreadsheets/d/1XDPyohslGe3bFrLo4U_Rr-muIzRVojnShYmmEKqOqnQ/edit#gid=1227102100) courtesy of Helen Maffin



## Reference Links

[submit data to google spreadsheet](http://mikeheavers.com/tutorials/submitting_custom_form_data_to_a_google_spreadsheet_with_javascript/)

[using cross-origin resource sharing (CORS)](https://www.html5rocks.com/en/tutorials/cors/)



## Limitations

not known at this time



----------------------------
**Version number:** 0.0.1.1<br>
**Framework versions:** ^2.0.0
